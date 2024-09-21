import { Component, ElementRef, EventEmitter, Output, ViewChild, Input } from "@angular/core";
import { ObservableNotifyService } from "../services/observable-notify.service";
import { Task } from "../interface/task.interface";
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from "../services/task.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ToastrModule, ToastrService } from "ngx-toastr";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [NgbPaginationModule, FormsModule,CommonModule, ToastrModule],
  templateUrl: "./task-list.component.html",
  styleUrl: "./task-list.component.css",
})
export class TaskListComponent {
 
  collectionSize!:number;
  page:number = 1;
  pageSize:number =5;
  task!:Task

  constructor(
    public observableNofityService: ObservableNotifyService,
    public taskService: TaskService,
    public modalServide:NgbModal,
    public toastr: ToastrService,
  ) {
    this.observableNofityService.updateInTask().subscribe((res) => {
      if (res) {
        //this.getTaskList();
      }
    });
  }
  @Input() taskList:Task[] = []
  @Output() taskEmitter =  new EventEmitter<string>()
  @ViewChild("deleteTaskTem") deleteTaskTem!: ElementRef;
  ngOnInit(): void {
  }

 

  taskAction(action:string, task:Task){

    switch(action){
      case 'delete':
        this.task = task;
              this.modalServide.open(this.deleteTaskTem);
              break;
            case 'edit':
              this.taskEmitter.emit(task.id)
              break;
            default:
              // code to do nothing
    }
  };

  deleteTask(){
    this.taskService.deleteTask(this.task.id).subscribe({
      next: (taskRes) => {
              if (taskRes.status_code == 200) {
                this.toastr.success(taskRes.message);
                this.modalServide.dismissAll();
                this.observableNofityService.notifyTaskChange(true);
              }
            },
            error: (error) => {
              console.error("Error:", error);
            },
    })
  }
}
