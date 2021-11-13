import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  public getUserDetails(): string | null {
    if (localStorage.getItem('userData') != null) {
      return JSON.parse(localStorage.getItem('userData')!);
    }
    
    return null;
  }
  
  public setDataInLocalStorage(variableName: string, data: string) {
    localStorage.setItem(variableName, data);
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public clearStorage() {
    localStorage.clear();
  }
}
