import { Component, ElementRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'engigma-assignment';
  @ViewChild("addTaskTemp") addTaskTemp!: ElementRef;
  constructor(public modalServide:NgbModal){

  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  addNewTask(){
    this.modalServide.open(this.addTaskTemp)
  }
  
}
