import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableNotifyService {

  constructor() { }

  private taskNotification = new Subject<any>();
  private refreshObservable =  new Subject<true>()

  updateInTask():Observable<boolean>{
    return this.taskNotification.asObservable()
  }

  notifyTaskChange(taskChange:boolean){
    this.taskNotification.next(taskChange)
  }

  notifyRefresh(){
    this.refreshObservable.next(true)
  };

  updateRefreshStatus(){
    return this.refreshObservable.asObservable()
  }
}

