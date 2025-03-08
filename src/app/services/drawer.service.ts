import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  drawerSubject: Subject<any> = new Subject<any>();
  drawer$ = this.drawerSubject.asObservable();

  constructor() {}

  updateDrawer() {
    this.drawerSubject.next(true);
  }
}
