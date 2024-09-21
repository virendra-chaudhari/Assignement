import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { TaskService } from "./services/task.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ObservableNotifyService } from "./services/observable-notify.service";
import { of, Subject, throwError } from "rxjs";
import { Task } from "./interface/task.interface";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockObservableNotifyService: jasmine.SpyObj<ObservableNotifyService>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    mockTaskService = jasmine.createSpyObj("TaskService", [
      "getAllTask",
      "getTaskById",
    ]);

    // Create a mock Subject to simulate observable behavior
    const updateInTaskSubject = new Subject<boolean>();
    mockObservableNotifyService = jasmine.createSpyObj(
      "ObservableNotifyService",
      ["updateInTask"]
    );
    mockObservableNotifyService.updateInTask.and.returnValue(
      updateInTaskSubject.asObservable()
    );

    mockModalService = jasmine.createSpyObj("NgbModal", ["open"]);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: TaskService, useValue: mockTaskService },
        {
          provide: ObservableNotifyService,
          useValue: mockObservableNotifyService,
        },
        { provide: NgbModal, useValue: mockModalService },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'engigma-assignment' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("engigma-assignment");
  });

  xit("should render title", () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain(
      "Engima Assignment"
    );
  });

  it("should fetch tasks on initialization", () => {
    const mockTasks: Task[] = [
      {
        assignedTo: "User 1",
        status: "In Progress",
        dueDate: "2024-09-20",
        comment: "Test comment",
        priority: "High",
        id: "XxaDdumH",
      },
    ];

    mockTaskService.getAllTask.and.returnValue(
      of({ status_code: 200, body: mockTasks })
    );

    component.ngOnInit();

    expect(mockTaskService.getAllTask).toHaveBeenCalled();
    expect(component.taskList).toEqual(mockTasks);
    expect(component.allTaskBackup).toEqual(mockTasks);
  });

  it("should handle error when fetching tasks", () => {
    const consoleErrorSpy = spyOn(console, "error");
    mockTaskService.getAllTask.and.returnValue(
      throwError(() => new Error("Error fetching tasks"))
    );

    component.getTaskList();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching tasks",
      jasmine.any(Error)
    );
  });

  it("should open modal to add a new task", () => {
    component.addNewTask();

    expect(mockModalService.open).toHaveBeenCalledWith(component.addTaskTemp);
  });

  xit("should filter tasks based on search input", () => {
    // Prepare mock tasks
    const mockTasks: Task[] = [
      {
        assignedTo: "User 1",
        status: "In Progress",
        dueDate: "2024-09-20",
        comment: "Test comment",
        priority: "High",
        id: "XxaDdumH",
      },
      {
        assignedTo: "User 2",
        status: "Completed",
        dueDate: "2024-09-21",
        comment: "Another comment",
        priority: "Low",
        id: "YyaDdumH",
      },
    ];

    // Set initial task list and backup
    component.allTaskBackup = mockTasks;
    component.taskList = mockTasks; // Assuming taskList is initialized to mockTasks

    component.searchTask.setValue("User 1");

    component.ngOnInit();

    expect(component.taskList.length).toBe(1);
    expect(component.taskList[0].assignedTo).toBe("User 1");
  });
});
