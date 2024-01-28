import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { Router } from '@angular/router';
import { AlertFunction } from '../alert/Alert_function';
import { SessionStorageService } from '../interface/session-storage.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  mac_address!: string;
  password!: string;
  mac_address_data: any[] = [];
  constructor(
    private _serviceService: ServiceService,
    private router: Router,
    private _alert: AlertFunction,
    private storageService: SessionStorageService,
  ) {

    // if (startDatetime && endDatetime) {
    //   localStorage.setItem('start_datetime', startDatetime.toString());
    //   localStorage.setItem('end_datetime', endDatetime.toString());
    // }
  }
  datePipe = new DatePipe('en-US');
  submit() {

    var str = new Date().setSeconds(0, 0);
    var dt = new Date(str).toISOString();
    const startDate: any = this.datePipe.transform(dt, 'yyyy-MM-dd 00:00:00');
    const endDate: any = this.datePipe.transform(dt, 'yyyy-MM-dd 23:59:59');
    localStorage.setItem('start_datetime', startDate.toString());
    localStorage.setItem('end_datetime', endDate.toString());

    let formattedData = {
      "login": this.mac_address,
      "password": this.password,
    };

    // บันทึกข้อมูลลง database
    this._serviceService.authenticate_iot(formattedData).subscribe(async (response: any) => {
      // console.log('Authentication Response:', response);
      if (response.result) {
        if (response.result.session_id) {
          const name = response.result.name;
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('name', name);

          const applicationData = {
            mac_address: name,
          };

          this._serviceService.get_time_data(applicationData).subscribe((response: any) => {
            const address = response.result.response
            // this.interfaceService.setUserData(address);
            for (let index = 0; index < address.length; index++) {
              const element_1 = address[index].mac_address;
              this.mac_address_data.push(element_1);
              // this.storageService.saveArrayToSessionStorage('mac_address', this.mac_address_data);
            }

            localStorage.setItem('mac_address', this.mac_address_data.toString());
            this.router.navigate(['/dashboard']);
          });

        } else {
          this._alert.invalid_user_pass();
        }
      } else {
        this._alert.invalid_user_pass();
      }


    });
  }
}
// this._serviceService.get_time_data(applicationData).subscribe((response: any) => {
//   const address = response.result.response.mac_address
//   console.log(response.result.response.mac_address)
//   const mac_address = {
//     mac_address: address,
//   };
//   // this._serviceService.get_time_data_by_day(mac_address).subscribe((response: any) => {
//   //   sessionStorage.setItem('temperature', response.result.temperature);
//   //   sessionStorage.setItem('humidity', response.result.humidity);
//   //   sessionStorage.setItem('date_data', response.result.date_data);

//   // });
//   // this.router.navigate(['/dashboard']);
// });



// try {
//   const response = await this._serviceService.get_time_data(applicationData).toPromise();
//   // sessionStorage.setItem('response', JSON.stringify(response));
//   // const userData = { response: response.result.response };
//   this.interfaceService.setUserData(response);
//   // console.log('Error:', response);
//   // ทำงานเมื่อทุกอย่างเสร็จสมบูรณ์
//   this.router.navigate(['/dashboard']);
// } catch (error) {
//   // จัดการข้อผิดพลาด
//   console.error('Error:', error);
// }
