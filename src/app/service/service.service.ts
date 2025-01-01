import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environments';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) { }

  authenticate_iot(applicationData: any): Observable<any> {
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/authenticate_iot", {
      params: {
        username: applicationData.login,
        password: applicationData.password,
      }
    }, { withCredentials: true });
  }

  get_data_print_day(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
        start_datetime: applicationData.start_datetime,
        end_datetime: applicationData.end_datetime,
        type_board:applicationData.type_board
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/get_data_print_day", payload, { withCredentials: true })
  }
  get_time_data_by_all(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
        start_datetime: applicationData.start_datetime,
        end_datetime: applicationData.end_datetime,
        type_board:applicationData.type_board
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/get_time_data_by_all", payload, { withCredentials: true })
  }
  get_time_data(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/get_time_data", payload, { withCredentials: true })
  }
  get_time_data_excel(applicationData: any): Observable<any> {
    const payload = {
      params: {
        mac_address: applicationData.mac_address,
        start_datetime: applicationData.start_datetime,
        end_datetime: applicationData.end_datetime,
        type_board: applicationData.type_board,
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/get_time_data_excel", payload, { withCredentials: true })
  }
  update_time_notify(applicationData: any): Observable<any> {
    const payload = {
      params: {
        id: applicationData.id,
        time_notify: applicationData.time_notify,
        position: applicationData.position,
        max_temp_sensor_1: applicationData.max_temp_sensor_1,
        max_temp_sensor_2: applicationData.max_temp_sensor_2,
        max_temp_sensor_3: applicationData.max_temp_sensor_3,
        min_temp_sensor_1: applicationData.min_temp_sensor_1,
        min_temp_sensor_2: applicationData.min_temp_sensor_2,
        min_temp_sensor_3: applicationData.min_temp_sensor_3,
        calibrate_sensor_1: applicationData.calibrate_sensor_1,
        calibrate_sensor_2: applicationData.calibrate_sensor_2,
        calibrate_sensor_3: applicationData.calibrate_sensor_3
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/update_time_notify", payload, { withCredentials: true })
  }
  get_res_users(applicationData: any): Observable<any> {
    const payload = {
      params: {
        name: applicationData.name
      }
    };
    return this.http.post<any>(environment.config.baseConfig.apiUrl + "/get_res_users", payload, { withCredentials: true })
  }
}
