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
    let updateTaskList = [taskObj,...taskList];
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
  };
  getTaskById(taskId: string): Observable<any> {
    let taskList: Task[] = JSON.parse(localStorage.getItem('taskList') as string) || [];
    let task = taskList.find(t => t.id == taskId);
    return of({
      status_code: 200,
      message: 'Task Found',
      body: task
    });
  }

  updateTask(task:Task):Observable<any>{
    let taskList: Task[] = JSON.parse(localStorage.getItem('taskList') as string) || [];
    let updateTaskList = taskList.map(t => t.id == task.id? task : t);
    localStorage.setItem('taskList',JSON.stringify(updateTaskList));
    return of({
      status_code:200,
      message:'Task Updated successfully',
      body: task
    });
  };

  deleteTask(taskId:string):Observable<any> {
    let taskList: Task[] = JSON.parse(localStorage.getItem('taskList') as string) || [];
    let updateTaskList = taskList.filter(t => t.id!= taskId);
    localStorage.setItem('taskList',JSON.stringify(updateTaskList));
    return of({
      status_code:200,
      message:'Task Deleted successfully',
      body: null
    });
  }
}
