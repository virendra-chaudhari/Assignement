import { Component, ElementRef, EventEmitter, Output, ViewChild } from "@angular/core";
import { ObservableNotifyService } from "../services/observable-notify.service";
import { Task } from "../interface/task.interface";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from "../services/task.service";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [],
  templateUrl: "./task-list.component.html",
  styleUrl: "./task-list.component.css",
})
export class TaskListComponent {
  @ViewChild("addTaskTemp") deleteTaskTemp!: ElementRef;
  
  constructor(
    public observableNofityService: ObservableNotifyService,
    public taskService: TaskService,
    public modalServide:NgbModal
  ) {
    this.observableNofityService.updateInTask().subscribe((res) => {
      if (res) {
        this.getTaskList();
      }
    });
  }
  taskList: Task[] = [];
  @Output() taskEmitter =  new EventEmitter<string>()
  ngOnInit(): void {
    this.getTaskList()
  }

  getTaskList() {
    this.taskService.getAllTask().subscribe({
      next: (taskListRes) => {
        if (taskListRes.status_code == 200) {
          this.taskList = taskListRes.body;
        }
      },
      error: (error: any) => {
        console.error("Error fetching tasks", error);
      },
    });
  };

  taskAction(action:string, taskId:string){
    switch(action){
      case 'delete':
              this.modalServide.open(this.deleteTaskTemp);
              break;
            case 'edit':
              this.taskEmitter.emit(taskId)
              break;
            default:
              // code to do nothing
    }
  }
}
