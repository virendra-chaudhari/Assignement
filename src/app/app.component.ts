import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskFormComponent } from './task-form/task-form.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent, TaskFormComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'engigma-assignment';
  @ViewChild("addTaskTemp") addTaskTemp!: ElementRef;
  constructor(public modalServide:NgbModal){
   
  }
  ngOnInit(): void {
   // saving dummy user
   localStorage.setItem('taskList', JSON.stringify([{assignedTo: 'User 1', status: 'In progress', dueDate: '2024-09-20', comment: 'This is a dummy Commets',priority:'High',id:'"XxaDdumH"'}]))
    
  }

  addNewTask(){
    this.modalServide.open(this.addTaskTemp);
    this
  }
  
}
