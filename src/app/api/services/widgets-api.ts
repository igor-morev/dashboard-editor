import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Widget } from '../types/widget';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WidgetsApi {
  #http = inject(HttpClient);

  getAll(): Observable<Widget[]> {
    return of([]);
  }
}
