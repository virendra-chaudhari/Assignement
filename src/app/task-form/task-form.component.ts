import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TaskService } from "../services/task.service";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { ObservableNotifyService } from "../services/observable-notify.service";
import { Subject } from "rxjs";
import { Task } from "../interface/task.interface";

@Component({
  selector: "app-task-form",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastrModule],
  templateUrl: "./task-form.component.html",
  styleUrl: "./task-form.component.css",
  providers: [TaskService, ToastrService],
})
export class TaskFormComponent {
  addNewTaskForm!: FormGroup;
  task: Task | null = null;
  constructor(
    public fb: FormBuilder,
    public modalService: NgbModal,
    public taskService: TaskService,
    public toastr: ToastrService,
    public observableNofityService: ObservableNotifyService
  ) {}

  @Input() taskDetailsObservable$!: Subject<Task>;
  ngOnInit(): void {
    this.addNewTaskForm = this.fb.group({
      assignedTo: [null, Validators.required],
      status: [null, Validators.required],
      dueDate: [null],
      priority: [null, Validators.required],
      comment: [null],
    });

    this.taskDetailsObservable$?.subscribe((taskDetails) => {
      if (taskDetails) {
        this.task = taskDetails;
        this.addNewTaskForm.patchValue(taskDetails);
      }
    });
  }

  get addNewTaskControls() {
    return this.addNewTaskForm.controls;
  }

  saveNewTask() {
    let _newTaskObj = {
      ...this.addNewTaskForm.value,
      id: this.generateUniqueId(),
    };
    this.taskService.saveTask(_newTaskObj).subscribe({
      next: (taskRes) => {
        if (taskRes.status_code == 200) {
          this.toastr.success(taskRes.message);
          this.modalService.dismissAll();
          this.addNewTaskForm.reset();
          this.observableNofityService.notifyTaskChange(true);
        }
      },
      error: (error) => {
        console.error("Error:", error);
      },
    });
  }

  updateTask() {
    let taskObj = {...this.addNewTaskForm.value, id:this.task?.id};
    this.taskService.updateTask(taskObj).subscribe({
      next: (taskRes) => {
        if (taskRes.status_code == 200) {
          this.toastr.success(taskRes.message);
          this.modalService.dismissAll();
          this.addNewTaskForm.reset();
          this.observableNofityService.notifyTaskChange(true);
        }
      },
      error: (error) => {
        console.error("Error:", error);
      },
    });
  }

  generateUniqueId() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let id = "";
    for (let i = 0; i < 8; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
  }
}
