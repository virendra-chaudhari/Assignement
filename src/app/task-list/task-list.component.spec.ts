import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ElementRef } from "@angular/core";
import { TaskListComponent } from "./task-list.component";
import { ObservableNotifyService } from "../services/observable-notify.service";
import { TaskService } from "../services/task.service";

describe("TaskListComponent", () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockModalService: jasmine.SpyObj<NgbModal>;

  beforeEach(() => {
    mockModalService = jasmine.createSpyObj("NgbModal", ["open"]);

    TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: NgbModal, useValue: mockModalService },
        {
          provide: ObservableNotifyService,
          useValue: { updateInTask: () => ({ subscribe: () => {} }) },
        },
        { provide: TaskService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    component.deleteTask = new ElementRef(document.createElement("div"));
  });

  it("should open modal when action is delete", () => {
    component.taskAction("delete", "123");

    expect(mockModalService.open).toHaveBeenCalledWith(component.deleteTask);
  });

  it("should emit taskId when action is edit", () => {
    spyOn(component.taskEmitter, "emit");

    component.taskAction("edit", "123");

    expect(component.taskEmitter.emit).toHaveBeenCalledWith("123");
  });

  it("should do nothing for unknown action", () => {
    spyOn(component.taskEmitter, "emit");

    component.taskAction("unknownAction", "123");

    expect(mockModalService.open).not.toHaveBeenCalled();
    expect(component.taskEmitter.emit).not.toHaveBeenCalled();
  });
});
