import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  authenticate(): Observable<any> {
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/web/session/authenticate", {
      params: {
        login: environment.config.baseConfig.userServer,
        password: environment.config.baseConfig.passServer,
        db: environment.config.baseConfig.dbServer,
      }
    }, { withCredentials: true });
  }
  authenticate_iot(applicationData: any): Observable<any> {
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/api/authenticate_iot", {
      params: {
        login: applicationData.login,
        password: applicationData.password,
      }
    }, { withCredentials: true });
  }

  get_time_data_by_day(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/api/get_time_data_by_day", payload, { withCredentials: true })
  }
  get_time_data_by_all(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
        start_datetime: applicationData.start_datetime,
        end_datetime: applicationData.end_datetime,
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/api/get_time_data_by_all", payload, { withCredentials: true })
  }
  get_time_data(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/api/get_time_data", payload, { withCredentials: true })
  }
  get_time_data_excel(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
        start_datetime: applicationData.start_datetime,
        end_datetime: applicationData.end_datetime,
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/api/get_time_data_excel", payload, { withCredentials: true })
  }
  update_time_notify(applicationData: any): Observable<any> {
    const payload = {
      params: {
        id: applicationData.id,
        time_notify: applicationData.time_notify,
        position: applicationData.position,
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/api/update_time_notify", payload, { withCredentials: true })
  }
}
