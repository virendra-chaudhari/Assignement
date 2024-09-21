import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../interface/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
 
  constructor() { }

  saveTask(taskObj:Task):Observable<any>{
    let taskList: Task[] = JSON.parse(localStorage.getItem('taskList') as string) || [];
    let updateTaskList = [...taskList,taskObj];
    localStorage.setItem('taskList',JSON.stringify(updateTaskList));
    return of({
      status_code:200,
      message:'Task Added successfully',
      body: taskObj
    });
  };

  getAllTask():Observable<any>{
    let taskList: Task[] = JSON.parse(localStorage.getItem('taskList') as string) || [];
    return of({
      status_code:200,
      message:'Task List',
      body: taskList
    });
  }
}
