import { Component, ElementRef, EventEmitter, Output, ViewChild, Input } from "@angular/core";
import { ObservableNotifyService } from "../services/observable-notify.service";
import { Task } from "../interface/task.interface";
import { NgbModal, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from "../services/task.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-task-list",
  standalone: true,
  imports: [NgbPaginationModule, FormsModule,CommonModule],
  templateUrl: "./task-list.component.html",
  styleUrl: "./task-list.component.css",
})
export class TaskListComponent {
 
  collectionSize!:number;
  page:number = 1;
  pageSize:number =5;

  constructor(
    public observableNofityService: ObservableNotifyService,
    public taskService: TaskService,
    public modalServide:NgbModal
  ) {
    this.observableNofityService.updateInTask().subscribe((res) => {
      if (res) {
        //this.getTaskList();
      }
    });
  }
  @Input() taskList:Task[] = []
  @Output() taskEmitter =  new EventEmitter<string>()
  @ViewChild("deleteTask") deleteTask!: ElementRef;
  ngOnInit(): void {
  }

 

  taskAction(action:string, taskId:string){
    switch(action){
      case 'delete':
              this.modalServide.open(this.deleteTask);
              break;
            case 'edit':
              this.taskEmitter.emit(taskId)
              break;
            default:
              // code to do nothing
    }
  }
}
