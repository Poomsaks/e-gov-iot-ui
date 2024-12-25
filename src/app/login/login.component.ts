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
  type_board_data: any[] = [];
  images: any;
  name_user!: String;
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
      if (response.session) {
        console.log('response.session', response.session);

        if (response.session.mac_address) {
          const name = response.session.mac_address;
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('name', name);
          this.name_user = name
          const applicationData = {
            mac_address: name,
          };
          this._serviceService.get_time_data(applicationData).subscribe((response: any) => {
            const address = response.response
            for (let index = 0; index < address.length; index++) {
              const element_1 = address[index].mac_address;
              const element_2 = address[index].type_board;
              this.mac_address_data.push(element_1);
              this.type_board_data.push(element_2)
              this.images = address[index].image;
            }
            localStorage.setItem('images', this.images.toString());
            localStorage.setItem('mac_address', this.mac_address_data.toString());
            localStorage.setItem('type_board', this.type_board_data.toString());
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
