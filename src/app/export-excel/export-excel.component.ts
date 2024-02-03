import { Component, OnInit } from '@angular/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { ServiceService } from '../service/service.service';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Chart, ChartItem } from 'chart.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx'; // ใช้ * as XLSX แทนแบบที่เดิมเพื่อป้องกันข้อความเตือน

@Component({
  selector: 'export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss']
})
export class ExportExcelComponent {

  constructor(

    private _serviceService: ServiceService,
    private route: ActivatedRoute,

  ) { }
  mac_address_id_chart: { mac_address: any, max_humidity_data: any, min_humidity_data: any, max_temperature_data: any, min_temperature_data: any, average_temperature: any, average_humidity: any, position: any, temperature: any, humidity: any, date_data: any }[] = [];
  start_datetime_chart!: Date;
  end_datetime_chart!: Date;
  datePipe = new DatePipe('en-US');

  name: any;
  data_position: any;
  hostpital_name: any;
  address_hostpital: any;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

      const data = JSON.parse(params['data']);

      if (localStorage.getItem('mac_address')) {
        this.name = localStorage.getItem('name')
        const data: any = localStorage.getItem('mac_address')
        const dataArray = data.split(',');
        for (let index = 0; index < dataArray.length; index++) {
          const element = dataArray[index];
          this.mac_address_id_chart.push({ mac_address: element, max_humidity_data: 0, min_humidity_data: 0, max_temperature_data: 0, min_temperature_data: 0, average_temperature: 0, average_humidity: 0, position: "", temperature: 0, humidity: 0, date_data: "" });

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
          }
          this._serviceService.get_time_data_excel(paramData).pipe(
            switchMap((response: any) => {
              const temperature = response.result.temperature;
              const humidity = response.result.humidity;
              const date_data = response.result.date_data;
              const max_humidity_data = response.result.max_humidity_data;
              const min_humidity_data = response.result.min_humidity_data;
              const max_temperature_data = response.result.max_temperature_data;
              const min_temperature_data = response.result.min_temperature_data;
              const average_temperature = response.result.average_temperature;
              const average_humidity = response.result.average_humidity;
              const indexOfObjectToUpdate = this.mac_address_id_chart.findIndex(item => item.mac_address === element);

              if (indexOfObjectToUpdate !== -1) {
                this.mac_address_id_chart[indexOfObjectToUpdate].max_humidity_data = max_humidity_data;
                this.mac_address_id_chart[indexOfObjectToUpdate].min_humidity_data = min_humidity_data;
                this.mac_address_id_chart[indexOfObjectToUpdate].max_temperature_data = max_temperature_data;
                this.mac_address_id_chart[indexOfObjectToUpdate].min_temperature_data = min_temperature_data;
                this.mac_address_id_chart[indexOfObjectToUpdate].average_temperature = average_temperature;
                this.mac_address_id_chart[indexOfObjectToUpdate].average_humidity = average_humidity;
                this.mac_address_id_chart[indexOfObjectToUpdate].temperature = temperature;
                this.mac_address_id_chart[indexOfObjectToUpdate].humidity = humidity;
                this.mac_address_id_chart[indexOfObjectToUpdate].date_data = date_data;
              }
              return of(response);
            })
          ).subscribe(() => {


          });
        }
      }
    });
  }

  downloadExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(document.createElement('table')); // สร้าง worksheet จากตารางใหม่
    XLSX.utils.sheet_add_dom(ws, document.getElementById('table')); // เพิ่มข้อมูลจากตารางให้กับ worksheet

    /* เพิ่ม worksheet ลงใน workbook */
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* สร้างไฟล์ Excel และบันทึก */
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'อุณหภูมิและความชื้น.xlsx');
  }
  // generateExcelData() {
  //   let excelData = [];
  //   excelData.push(['จุดปฏิบัติการ', 'Max Address', 'อุณหภูมิ', 'อุณหภูมิสูงสุด', 'อุณหภูมิต่ำสุด', 'อุณหภูมิเฉลี่ย', 'ความชื้น', 'ความชื้นสูงสุด', 'ความชื้นต่ำสุด', 'ความชื้นเฉลี่ย', 'วันที่']);

  //   this.mac_address_id_chart.forEach(item => {
  //     item.temperature.forEach((temperature: any, i: string | number) => {
  //       excelData.push([item.position, item.mac_address, temperature, item.max_temperature_data, item.min_temperature_data, item.average_temperature, item.humidity[i], item.max_humidity_data, item.min_humidity_data, item.average_humidity, item.date_data[i]]);
  //     });
  //   });

  //   return excelData;
  // }


  // downloadExcel() {
  //   const data = this.generateExcelData(); // สร้างข้อมูล Excel จากข้อมูลในตาราง

  //   const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //   const fileName = 'อุณหภูมิและความชื้น.xlsx';
  //   saveAs(blob, fileName);
  // }
  // generateExcelData() {
  //   let excelData = `<!DOCTYPE html>
  //   <html xmlns:x="urn:schemas-microsoft-com:office:excel">
  //   <head>
  //   <meta charset="UTF-8">
  //   </head>
  //   <body><table>`;
  //   excelData += '<thead><tr><th>จุดปฏิบัติการ</th><th>Max Address</th><th>อุณหภูมิ</th><th>อุณหภูมิสูงสุด</th><th>อุณหภูมิต่ำสุด</th><th>อุณหภูมิเฉลี่ย</th><th>ความชื้น</th><th>ความชื้นสูงสุด</th><th>ความชื้นต่ำสุด</th><th>ความชื้นเฉลี่ย</th><th>วันที่</th></tr></thead>';
  //   excelData += '<tbody>';

  //   this.mac_address_id_chart.forEach(item => {
  //     item.temperature.forEach((temperature: any, i: string | number) => {
  //       excelData += `<tr><td>${item.position}</td><td>${item.mac_address}</td><td>${temperature}</td><td>${item.max_temperature_data}</td><td>${item.min_temperature_data}</td><td>${item.average_temperature}</td><td>${item.humidity[i]}</td><td>${item.max_humidity_data}</td><td>${item.min_humidity_data}</td><td>${item.average_humidity}</td><td>${item.date_data[i]}</td></tr>`;
  //     });
  //   });

  //   excelData += '</tbody></table></body></html>';
  //   return excelData;
  // }

}
