import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  addNewTaskForm!:FormGroup;
  constructor(public fb:FormBuilder){

  }

  ngOnInit(): void {
      this.addNewTaskForm =  this.fb.group({
        assignedTo: [null, Validators.required],
        status: [null, Validators.required],
        dueDate: [null],
        priority:[null, Validators.required],
        comment:[null]
      })
  };

  get addNewTaskControls() {
    return this.addNewTaskForm.controls;
  }
}
