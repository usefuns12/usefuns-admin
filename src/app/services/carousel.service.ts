import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiEndpoints } from '../utils/api-constants';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  carouselSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  carousel$ = this.carouselSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCarousels = (): Observable<any> => {
    return this.http.get(
      `${environment.baseUrl}/${ApiEndpoints.carousel.GET_CAROUSELS}`
    );
  };

  addCarousel = (postData: FormData): Observable<any> => {
    return this.http.post(
      `${environment.baseUrl}/${ApiEndpoints.carousel.ADD_CAROUSEL}`,
      postData
    );
  };

  updateCarousel = (postData: FormData): Observable<any> => {
    return this.http.put(
      `${environment.baseUrl}/${ApiEndpoints.carousel.UPDATE_CAROUSEL}`,
      postData
    );
  };

  removeCarousel = (id: string): Observable<any> => {
    return this.http.delete(
      `${environment.baseUrl}/${ApiEndpoints.carousel.DELETE_CAROUSEL}/${id}`
    );
  };

  updateCarousels() {
    this.carouselSubject.next(true);
  }
}
