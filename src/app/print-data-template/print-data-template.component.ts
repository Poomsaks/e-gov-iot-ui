import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'print-data-template',
  templateUrl: './print-data-template.component.html',
  styleUrls: ['./print-data-template.component.scss']
})
export class PrintDataTemplateComponent {
  Array(arg0: number) {
    throw new Error('Method not implemented.');
  }

  constructor(
    private _serviceService: ServiceService,
    private route: ActivatedRoute,
  ) { }

  name: any;
  data_position: any;
  hostpital_name: any;
  address_hostpital: any;
  mac_address_id_chart: { mac_address: any, max_humidity_data: any, min_humidity_data: any, max_temperature_data: any, min_temperature_data: any, average_temperature: any, average_humidity: any, position: any }[] = [];
  start_datetime_chart!: Date;
  end_datetime_chart!: Date;
  datePipe = new DatePipe('en-US');

  start_date_ui: any;
  end_date_ui: any;
  data_all: any[] = [];
  data_all2: any[] = [];
  data_all3: any[] = [];

  chunkedDataAll: any[] = [];

  isDate06(date: Date): boolean {
    return date.getDate() === 6; // Check if the day of the month is 6
  }
  getThaiMonth(month: string): string {
    switch (month) {
      case '1':
        return 'มกราคม';
      case '2':
        return 'กุมภาพันธ์';
      case '3':
        return 'มีนาคม';
      case '4':
        return 'เมษายน';
      case '5':
        return 'พฤษภาคม';
      case '6':
        return 'มิถุนายน';
      case '7':
        return 'กรกฎาคม';
      case '8':
        return 'สิงหาคม';
      case '9':
        return 'กันยายน';
      case '10':
        return 'ตุลาคม';
      case '11':
        return 'พฤศจิกายน';
      case '12':
        return 'ธันวาคม';
      default:
        return '';
    }
  }
  saveNewDataSet1(data: any[]) {
    // ทำการบันทึกข้อมูลที่นี่
    // console.log('Saving new dataset:', data);
    this.data_all2.push(data);
  }
  saveNewDataSet2(data: any[]) {
    // ทำการบันทึกข้อมูลที่นี่
    // console.log('Saving new dataset:', data);
    this.data_all3.push(data);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      const data = JSON.parse(params['data']);
      if (localStorage.getItem('mac_address')) {
        this.name = localStorage.getItem('name')
        const data: any = localStorage.getItem('mac_address')
        const dataArray = data.split(',');
        for (let index = 0; index < dataArray.length; index++) {
          const element = dataArray[index];
          this.mac_address_id_chart.push({ mac_address: element, max_humidity_data: 0, min_humidity_data: 0, max_temperature_data: 0, min_temperature_data: 0, average_temperature: 0, average_humidity: 0, position: "" });

        }
      }
      const date_chart_start_str: string = data.start_datetime_chart;
      const date_chart_start: Date = new Date(date_chart_start_str);
      const date_chart_end_str: string = data.end_datetime_chart;
      const date_chart_end: Date = new Date(date_chart_end_str);

      this.start_datetime_chart = date_chart_start
      this.end_datetime_chart = date_chart_end

      const startDate: any = this.datePipe.transform(data.start_datetime_chart, 'yyyy-MM-dd 00:00:00');
      const endDate: any = this.datePipe.transform(data.end_datetime_chart, 'yyyy-MM-dd 23:59:59');

      this.start_date_ui = startDate
      this.end_date_ui = endDate
      const applicationData = {
        mac_address: this.name,
      }
      this._serviceService.get_time_data(applicationData).subscribe((response: any) => {
        this.data_position = response.result.response
        this.hostpital_name = response.result.response[0].name
        this.address_hostpital = response.result.response[0].address
        for (let index = 0; index < this.data_position.length; index++) {
          const element = this.data_position[index].mac_address;
          const position = this.data_position[index].position;
          const indexOfObjectToUpdate = this.mac_address_id_chart.findIndex(item => item.mac_address === element);
          if (indexOfObjectToUpdate !== -1) {
            this.mac_address_id_chart[indexOfObjectToUpdate].position = position;
          }
        }
      });
      if (this.mac_address_id_chart) {
        for (let index = 0; index < this.mac_address_id_chart.length; index++) {
          const element = this.mac_address_id_chart[index].mac_address;
          const paramData = {
            mac_address: element,
            start_datetime: startDate,
            end_datetime: endDate,
          };

          this._serviceService.get_data_print_day(paramData).pipe(
            switchMap((response: any) => {
              const data = response.result;

              // ถ้า this.data_all ยังไม่มีข้อมูลใดๆ ให้เพิ่ม array ว่างก่อน
              if (this.data_all.length === 0) {
                this.data_all.push([]);
              }

              // รวมข้อมูลจาก response.result เข้าไปใน this.data_all[0]
              this.data_all[0] = this.data_all[0].concat(data);

              // ตรวจสอบว่าความยาวของข้อมูลเกิน 24 รายการหรือไม่
              if (this.data_all[0].length >= 24) {
                // แยกข้อมูลเมื่อความยาวของข้อมูลถึง 24
                const newData = this.data_all[0].splice(24);
                // ทำการบันทึกข้อมูลใหม่
                this.saveNewDataSet1(this.data_all[0]);
                // สร้างอาร์เรย์ใหม่เพื่อเก็บข้อมูลใหม่
                this.data_all[0] = newData;

                // ตรวจสอบว่ายังมีข้อมูลที่ต้องแยกเพิ่มอีกหรือไม่
                while (this.data_all[0].length >= 24) {
                  // แยกข้อมูลเพิ่มเติมเมื่อความยาวของข้อมูลถึง 24 อีกครั้ง
                  const moreNewData = this.data_all[0].splice(24);
                  // ทำการบันทึกข้อมูลใหม่
                  this.saveNewDataSet2(this.data_all[0]);
                  // สร้างอาร์เรย์ใหม่เพื่อเก็บข้อมูลใหม่
                  this.data_all[0] = moreNewData;
                }
              }

              return of(response);
            })

          ).subscribe(() => {
            // คุณสามารถทำการดำเนินการอื่นๆ ได้ที่นี่ถ้าต้องการ
          });
        }
        setTimeout(() => {
          window.print(); // ทำการพิมพ์หลังจากที่ข้อมูลแสดงผลครบทั้งหมด
        }, 500);
      }
      // if (this.mac_address_id_chart) {
      //   for (let index = 0; index < this.mac_address_id_chart.length; index++) {
      //     const element = this.mac_address_id_chart[index].mac_address;
      //     const paramData = {
      //       mac_address: element,
      //       start_datetime: startDate,
      //       end_datetime: endDate,
      //     }
      //     this._serviceService.get_data_print_day(paramData).pipe(
      //       switchMap((response: any) => {
      //         const data = response.result;
      //         this.data_all.push(data)
      //         console.log(this.data_all);
      //         return of(response);
      //       })

      //     ).subscribe(() => {
      //     });
      //   }
      //   // for (let index = 0; index < this.mac_address_id_chart.length; index++) {
      //   //   const element = this.mac_address_id_chart[index].mac_address;
      //   //   const paramData = {
      //   //     mac_address: element,
      //   //     start_datetime: startDate,
      //   //     end_datetime: endDate,
      //   //   }
      //   //   this._serviceService.get_data_print_day(paramData).pipe(
      //   //     switchMap((response: any) => {
      //   //       const data = response.result;
      //   //       const dummyDataCount = 62 - data.length; // คำนวณหาจำนวนข้อมูลที่ต้องเติม 0 เข้าไป
      //   //       // เติมข้อมูล 0 เข้าไปแทนที่ข้อมูลที่ไม่มี
      //   //       for (let i = 0; i < dummyDataCount; i++) {
      //   //         data.push({  mac_address: element, temperature: 0, humidity: 0 }); // เพิ่มข้อมูลลงในอาร์เรย์
      //   //       }
      //   //       this.data_all.push(data)
      //   //       return of(response);
      //   //     })
      //   //   ).subscribe(() => {
      //   //   });
      //   // }
      // }
    });
  }
}
