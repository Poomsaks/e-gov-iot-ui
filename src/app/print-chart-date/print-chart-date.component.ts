import { Component } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { ActivatedRoute } from '@angular/router';
import { Chart, ChartItem } from 'chart.js';
import { of, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'print-chart-date',
  templateUrl: './print-chart-date.component.html',
  styleUrls: ['./print-chart-date.component.scss']
})
export class PrintChartDateComponent {
  constructor(
    private _serviceService: ServiceService,
    private route: ActivatedRoute,
  ) { }
  chartLineOptions: any = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        mode: 'index',
        intersect: true
      },
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true, // ทำการเพิ่ม properties ที่ TypeScript รู้จัก
        suggestedMax: 50,
        grid: {
          display: false,
          lineWidth: 4,
          color: 'rgba(0, 0, 0, .2)',
        }
      }
    }
  };
  mac_address_id_chart: { mac_address: any, max_humidity_data: any, min_humidity_data: any, max_temperature_data: any, min_temperature_data: any, average_temperature: any, average_humidity: any , position: any}[] = [];
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
          this.mac_address_id_chart.push({ mac_address: element, max_humidity_data: 0, min_humidity_data: 0, max_temperature_data: 0, min_temperature_data: 0, average_temperature: 0, average_humidity: 0 , position: ""});

        }
      }
      // this.start_datetime_chart = data.start_datetime_chart
      // this.end_datetime_chart = data.end_datetime_chart

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
          this._serviceService.get_time_data_by_all(paramData).pipe(
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
              }
              const chartLine = document.getElementById(element) as HTMLCanvasElement;
              this.new_chart(chartLine, this.new_data_service(date_data, temperature, humidity))
              return of(response);
            })
          ).subscribe(() => {

          });
        }

        setTimeout(() => {
              window.print(); // ทำการพิมพ์หลังจากที่ข้อมูลแสดงผลครบทั้งหมด
            }, 500);
      }

      // this._serviceService.get_data_print(id).subscribe((response: any) => {
      //   this.invoice_detail = response.result.response.data;
      //   for (let index = 0; index < this.invoice_detail.length; index++) {
      //     const element = this.invoice_detail[index];
      //     if (element['name_select_id'] == '1') {
      //       document.title = 'ใบเสนอราคา_' + element['invoice_code'];
      //     }
      //     else if (element['name_select_id'] == '2') {
      //       document.title = 'ใบแจ้งหนี/วางบิล_' + element['invoice_code'];
      //     }
      //   }
      //   setTimeout(() => {
      //     window.print(); // ทำการพิมพ์หลังจากที่ข้อมูลแสดงผลครบทั้งหมด
      //   }, 500);
      // });

    });
  }

  new_chart(ChartItems: ChartItem, chartPie: any) {
    if (ChartItems) {
      new Chart(ChartItems, {
        type: 'line',
        data: chartPie, // Use the Pie Chart data
        options: this.chartLineOptions
      });
    }
  }

  new_data_service(labels_array: any, temperature: any, humidity: any) {
    return {
      labels: labels_array,
      datasets: [
        {
          label: 'ความชื้น',
          data: humidity,
          backgroundColor: 'transparent',
          borderColor: '#6c757d ',
          pointBorderColor: '#6c757d ',
          pointBackgroundColor: '#6c757d ',
          fill: false
        },
        {
          label: 'อุณหภูมิ',
          data: temperature,
          backgroundColor: 'transparent',
          borderColor: '#007bff',
          pointBorderColor: '#007bff',
          pointBackgroundColor: '#007bff',
          fill: false
        }
      ]
    };
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

}
