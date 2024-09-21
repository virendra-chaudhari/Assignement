import { Component } from "@angular/core";
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
    this.observableNofityService.updateInTask().subscribe((res) => {
      if (res) {
        this.getTaskList();
      }
    });
  }
  taskList: Task[] = [];

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
  }
}
