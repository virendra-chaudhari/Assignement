import { Component, ElementRef, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { TaskListComponent } from "./task-list/task-list.component";
import { AngularFontAwesomeModule } from "angular-font-awesome";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TaskFormComponent } from "./task-form/task-form.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from "@angular/common";
import { TaskService } from "./services/task.service";
import { Task } from "./interface/task.interface";
import { debounceTime, distinctUntilChanged, Subject } from "rxjs";
import { ObservableNotifyService } from "./services/observable-notify.service";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
} from "@angular/forms";
@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    TaskListComponent,
    TaskFormComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "engigma-assignment";
  task!: Task;
  taskList: Task[] = [];
  allTaskBackup: Task[] = [];
  page: number = 1;
  pageSize: number = 10;
  public searchTask: UntypedFormControl = new UntypedFormControl();
  taskEmitterObservable: Subject<Task> = new Subject<Task>();
  nofifyRefreshObservable:Subject<boolean> = new Subject<boolean>()
  @ViewChild("addTaskTemp") addTaskTemp!: ElementRef;

  constructor(
    public modalServide: NgbModal,
    public taskService: TaskService,
    public observableNofityService: ObservableNotifyService
  ) {
    this.observableNofityService.updateInTask().subscribe((res) => {
      if (res) {
        this.getAllTaskList();
      }
    });
  }
  ngOnInit(): void {
    this.searchTask.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((searchText:string) => {
        if (searchText.length) {
          const lowercasedTerm = searchText.toLowerCase();
          // Filter the array based on the search term in either 'name' or 'comments' or 'priority' or 'status'
          const filteredData = this.allTaskBackup.filter(
            (item) =>
              item.assignedTo.toLowerCase().includes(lowercasedTerm) ||
              item.comment.toLowerCase().includes(lowercasedTerm) ||
              item.status.toLowerCase().includes(lowercasedTerm) ||
              item.priority.toLowerCase().includes(lowercasedTerm)
          );
          this.taskList = filteredData;
        } else {
          const startIndex = (this.page - 1) * this.pageSize;
          this.taskList = this.allTaskBackup.slice(
            startIndex,
            startIndex + this.pageSize
          );
        }
      });

    // saving dummy user
    let taskList: Task[] =
      JSON.parse(localStorage.getItem("taskList") as string) || [];
    if (!taskList.length) {
      localStorage.setItem(
        "taskList",
        JSON.stringify([
          {
            assignedTo: "User 1",
            status: "In progress",
            dueDate: "2024-09-20",
            comment: "This is a dummy Commets",
            priority: "High",
            id: '"XxaDdumH"',
          },
        ])
      );
    }

    this.getAllTaskList();
  }

  getAllTaskList() {
    this.taskService.getAllTask().subscribe({
      next: (taskListRes) => {
        if (taskListRes.status_code == 200) {
          this.taskList =  taskListRes.body;
          this.allTaskBackup = [...taskListRes.body];
        }
      },
      error: (error: any) => {
        console.error("Error fetching tasks", error);
      },
    });
  }
  addNewTask() {
    this.modalServide.open(this.addTaskTemp);
  }

  getTaskById(taskId: string) {
    this.taskService.getTaskById(taskId).subscribe((task) => {
      if (task.status_code == 200) {
        this.task = task.body;
        this.addNewTask();
        setTimeout(() => {
          this.taskEmitterObservable.next(this.task);
        }, 100);
      }
    });
  }
}
