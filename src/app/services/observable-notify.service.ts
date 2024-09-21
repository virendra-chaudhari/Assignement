import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableNotifyService {

  constructor() { }

  private taskNotification = new Subject<any>();

  updateInTask():Observable<boolean>{
    return this.taskNotification.asObservable()
  }

  notifyTaskChange(taskChange:boolean){
    this.taskNotification.next(taskChange)
  }
}
