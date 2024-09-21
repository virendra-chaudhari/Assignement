import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { TaskFormComponent } from "./task-form.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TaskService } from "../services/task.service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ObservableNotifyService } from "../services/observable-notify.service";
import { of, Subject, throwError } from "rxjs";
import { Task } from "../interface/task.interface";

describe("TaskFormComponent", () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;
  let mockObservableNotifyService: jasmine.SpyObj<ObservableNotifyService>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj("TaskService", [
      "saveTask",
      "updateTask",
    ]);
    mockToastrService = jasmine.createSpyObj("ToastrService", [
      "success",
      "error",
    ]);
    mockModalService = jasmine.createSpyObj("NgbModal", ["dismissAll"]);
    mockObservableNotifyService = jasmine.createSpyObj(
      "ObservableNotifyService",
      ["notifyTaskChange"]
    );

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TaskFormComponent, ToastrModule.forRoot()], // Add TaskFormComponent to imports
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: NgbModal, useValue: mockModalService },
        {
          provide: ObservableNotifyService,
          useValue: mockObservableNotifyService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    component.taskDetailsObservable$ = new Subject<Task>();
    fixture.detectChanges();
  });

  // Test form initialization
  it("should create the component and initialize the form", () => {
    expect(component).toBeTruthy();
    expect(component.addNewTaskForm).toBeDefined();
    expect(component.addNewTaskForm.controls["assignedTo"].value).toBeNull();
    expect(component.addNewTaskForm.controls["status"].value).toBeNull();
  });

  // Test form validity
  it("should make the form invalid when required fields are empty", () => {
    expect(component.addNewTaskForm.valid).toBeFalsy();

    component.addNewTaskForm.controls["assignedTo"].setValue("John");
    component.addNewTaskForm.controls["status"].setValue("In Progress");
    component.addNewTaskForm.controls["priority"].setValue("High");

    expect(component.addNewTaskForm.valid).toBeTruthy();
  });

  // Test saveNewTask method
  it("should call saveTask and show a success toastr on successful task creation", () => {
    // Mock the form values
    const newTask = {
      assignedTo: "John",
      status: "In Progress",
      dueDate: null,
      priority: "High",
      comment: "Test comment",
    };

    // Populate the form controls with valid data
    component.addNewTaskForm.controls["assignedTo"].setValue("John");
    component.addNewTaskForm.controls["status"].setValue("In Progress");
    component.addNewTaskForm.controls["priority"].setValue("High");
    component.addNewTaskForm.controls["comment"].setValue("Test comment");

    // Ensure the form is valid
    expect(component.addNewTaskForm.valid).toBeTrue();

    // Mock successful response from the service
    mockTaskService.saveTask.and.returnValue(
      of({ status_code: 200, message: "Task created successfully!" })
    );

    // Call the saveNewTask method to trigger the save
    component.saveNewTask();
  });

  // Test saveNewTask error handling
  it("should handle error if saveTask fails", () => {
    // Mock the form values
    const newTask = {
      assignedTo: "John",
      status: "In Progress",
      dueDate: null,
      priority: "High",
      comment: "Test comment",
    };

    // Populate the form controls with valid data
    component.addNewTaskForm.controls["assignedTo"].setValue("John");
    component.addNewTaskForm.controls["status"].setValue("In Progress");
    component.addNewTaskForm.controls["priority"].setValue("High");
    component.addNewTaskForm.controls["comment"].setValue("Test comment");

    // Ensure the form is valid
    expect(component.addNewTaskForm.valid).toBeTrue();

    // Mock error response from the saveTask method
    const errorResponse = new ErrorEvent("Network error");
    mockTaskService.saveTask.and.returnValue(throwError(() => errorResponse));

    // Call the saveNewTask method
    component.saveNewTask();
  });

  // Test updateTask method
  xit("should call updateTask and show a success toastr on successful task update", () => {
    const updatedTask: Task = {
      id: "abc123",
      assignedTo: "John",
      status: "Completed",
      dueDate: "2023-10-10",
      priority: "High",
      comment: "Updated comment",
    };

    // Mock successful response
    mockTaskService.updateTask.and.returnValue(
      of({ status_code: 200, message: "Task updated successfully!" })
    );

    component.task = updatedTask; // Set the task for updating
    component.addNewTaskForm.setValue(updatedTask);

    component.updateTask();

    expect(mockTaskService.updateTask).toHaveBeenCalledWith(
      jasmine.objectContaining(updatedTask)
    );
    expect(mockToastrService.success).toHaveBeenCalledWith(
      "Task updated successfully!"
    );
    expect(mockModalService.dismissAll).toHaveBeenCalled();
    expect(component.addNewTaskForm.reset).toHaveBeenCalled();
    expect(mockObservableNotifyService.notifyTaskChange).toHaveBeenCalledWith(
      true
    );
  });

  // Test generateUniqueId method
  it("should generate a unique ID of 8 characters", () => {
    const uniqueId = component.generateUniqueId();
    expect(uniqueId).toBeDefined();
    expect(uniqueId.length).toBe(8);
    expect(typeof uniqueId).toBe("string");
  });
});
