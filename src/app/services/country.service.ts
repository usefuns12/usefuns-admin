import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private countriesList = 'assets/data/countries.json';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<any> {
    return this.http.get<any[]>(this.countriesList).pipe(
      map((countries) => {
        return countries;
      })
    );
  }
}
