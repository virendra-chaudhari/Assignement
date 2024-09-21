import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ObservableNotifyService } from "../services/observable-notify.service";
import { Task } from "../interface/task.interface";
import { TaskService } from "../services/task.service";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [],
  templateUrl: "./task-list.component.html",
  styleUrl: "./task-list.component.css",
})
export class TaskListComponent {
  constructor(
    public observableNofityService: ObservableNotifyService,
    public taskService: TaskService
  ) {
   
  }
  @Input() taskList:Task[] = []
  @Output() taskEmitter =  new EventEmitter<string>()

  ngOnInit(): void {
   // this.getTaskList()
  }

 /*  getTaskList() {
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
  }; */

  taskAction(action:string, taskId:string){
    switch(action){
      case 'delete':
              // code to delete task
              break;
            case 'edit':
              this.taskEmitter.emit(taskId)
              break;
            default:
              // code to do nothing
    }
  }
}
