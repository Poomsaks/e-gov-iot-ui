import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterfaceService {

  private userDataSubject = new BehaviorSubject<any>(null);
  userData$ = this.userDataSubject.asObservable();

  private temperatureSubject = new BehaviorSubject<any[]>([]);
  temperature$ = this.temperatureSubject.asObservable();

  setUserData(...data: any[]): void {
    this.userDataSubject.next(data);
  }
  setTemperature(...data: any[]): void {
    this.temperatureSubject.next(data);
  }
}
