import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = "http://localhost:4200";

  constructor(private http: HttpClient) { }

  public getTypeRequest(url: string) {
    return this.http.get(`${this.baseUrl}${url}`).pipe(map(res => res));
  }

  public postTypeRequest(url: string, payload: any) {
    return this.http.put(`${this.baseUrl}${url}`, payload).pipe(map(res => res));
  }
}
