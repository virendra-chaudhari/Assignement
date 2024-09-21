import { Component, ElementRef, EventEmitter, Output, ViewChild, Input } from "@angular/core";
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
  @ViewChild("deleteTask") deleteTask!: ElementRef;
  
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
