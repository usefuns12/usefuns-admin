import { Injectable } from '@angular/core';
import { Observable, fromEvent, map, merge, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private online$: Observable<boolean>;

  constructor() {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false))
    ).pipe(shareReplay(1));
  }

  isOnline(): Observable<boolean> {
    return this.online$;
  }
}
