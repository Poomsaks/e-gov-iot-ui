import { ChangeDetectorRef, Component, ElementRef, HostListener, NgModule, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ServiceService } from '../service/service.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import Chart, { ChartData, ChartItem } from 'chart.js/auto';
import { AlertFunction } from '../alert/Alert_function';
import { concat, of, switchMap } from 'rxjs';
import { SessionStorageService } from '../interface/session-storage.service';
import { DatePipe } from '@angular/common';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  chart_line: any;
  mode: "index" | "dataset" | "point" | "nearest" | "x" | "y" | undefined = "index";
  intersect: boolean | undefined = true;
  date_show: Date = new Date();

  data_position: any;
  hostpital_name: any;
  address_hostpital: any;
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

  chartPie_agriculture_01: any;
  chartPie_agriculture_02: any;
  id_chart: any
  mac_address_id_chart: { mac_address: any, max_humidity_data: any, min_humidity_data: any, max_temperature_data: any, min_temperature_data: any, average_temperature: any, average_humidity: any, position: any }[] = [];

  start_datetime: any
  end_datetime: any

  start_datetime_chart!: Date;
  end_datetime_chart!: Date;

  images: any;
  constructor(private _serviceService: ServiceService,
    private http: HttpClient,
    private router: Router,
    private _alert: AlertFunction,
    private el: ElementRef,
    private renderer: Renderer2,

  ) {

    if (localStorage.getItem('name')) {
      this.name = localStorage.getItem('name')
      this.id_chart = localStorage.getItem('name')
      this.images = localStorage.getItem('images')
    }

    if (localStorage.getItem('start_datetime') && localStorage.getItem('end_datetime')) {
      this.start_datetime = localStorage.getItem('start_datetime');
      this.end_datetime = localStorage.getItem('end_datetime');

      const date_chart_start_str: string = this.start_datetime;
      const date_chart_start: Date = new Date(date_chart_start_str);
      const date_chart_end_str: string = this.end_datetime;
      const date_chart_end: Date = new Date(date_chart_end_str);

      this.start_datetime_chart = date_chart_start
      this.end_datetime_chart = date_chart_end
    }

    if (localStorage.getItem('mac_address')) {
      // console.log(localStorage.getItem('mac_address'))
      const data: any = localStorage.getItem('mac_address')
      const dataArray = data.split(',');
      for (let index = 0; index < dataArray.length; index++) {
        const element = dataArray[index];
        this.mac_address_id_chart.push({ mac_address: element, max_humidity_data: 0, min_humidity_data: 0, max_temperature_data: 0, min_temperature_data: 0, average_temperature: 0, average_humidity: 0, position: "" });

      }
    }
    // const valuesFromSessionStorage = this.storageService.getArrayFromSessionStorage('mac_address') || [];
    // for (let index = 0; index < valuesFromSessionStorage.length; index++) {
    //   const element = valuesFromSessionStorage[index];
    //   this.mac_address_id_chart.push({ mac_address: element, max_humidity_data: 0, min_humidity_data: 0, max_temperature_data: 0, min_temperature_data: 0 });
    // }
    // this.mac_address_id_chart.push(arrayOfObjects);
    // console.log(this.mac_address_id_chart[0].mac_address)
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
          start_datetime: this.start_datetime,
          end_datetime: this.end_datetime,
        }
        // console.log(element)
        // this._serviceService.get_time_data_by_day(paramData).pipe(
        //   switchMap((response: any) => {
        //     // console.log(response.result)
        //     const temperature = response.result.temperature;
        //     const humidity = response.result.humidity;
        //     const date_data = response.result.date_data;

        //     const max_humidity_data = response.result.max_humidity_data;
        //     const min_humidity_data = response.result.min_humidity_data;
        //     const max_temperature_data = response.result.max_temperature_data;
        //     const min_temperature_data = response.result.min_temperature_data;
        //     const indexOfObjectToUpdate = this.mac_address_id_chart.findIndex(item => item.mac_address === element);
        //     if (indexOfObjectToUpdate !== -1) {
        //       this.mac_address_id_chart[indexOfObjectToUpdate].max_humidity_data = max_humidity_data;
        //       this.mac_address_id_chart[indexOfObjectToUpdate].min_humidity_data = min_humidity_data;
        //       this.mac_address_id_chart[indexOfObjectToUpdate].max_temperature_data = max_temperature_data;
        //       this.mac_address_id_chart[indexOfObjectToUpdate].min_temperature_data = min_temperature_data;

        //     }
        //     const chartLine = document.getElementById(element) as HTMLCanvasElement;
        //     this.new_chart(chartLine, this.new_data_service(date_data, temperature, humidity))
        //     return of(response);
        //   })
        // ).subscribe(() => {

        // });
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
    }


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
  temperature: any
  humidity: any

  name: any
  max_temperature = 0;
  min_temperature = 0;

  max_humidity = 0;
  min_humidity = 0;

  date_data: any
  date_temperature_height = ""
  date_temperature_low = ""

  date_humidity_height = ""
  date_humidity_low = ""

  position_count = ""


  ngOnInit(): void {
    setTimeout(() => {
      const preloader = this.el.nativeElement.querySelector('.preloader');

      if (preloader) {
        this.renderer.setStyle(preloader, 'height', '0');
        setTimeout(() => {
          const preloaderChildren = preloader.children;
          for (let i = 0; i < preloaderChildren.length; i++) {
            this.renderer.setStyle(preloaderChildren[i], 'display', 'none');
          }
        }, 500);
      }
    });

    this.position_count = this.mac_address_id_chart.length.toString();
  }

  time_notify: any[] = [
    { id: '1', name: "10 นาที" },
    { id: '2', name: "20 นาที" },
    { id: '3', name: "30 นาที" },
    { id: '4', name: "40 นาที" },
    { id: '5', name: "50 นาที" },
    { id: '6', name: "60 นาที" }];
  originalData: any;
  max_temp: any;
  min_temp: any;
  calibrate: any;
  editingRow: number = -1;

  editRow(index: number): void {
    this.editingRow = index;
    this.originalData = { ...this.data_position[index] };
  }
  saveRow(index: number, position: string, max_temp: string, min_temp: string, calibrate: string): void {
    // Save the edited row logic here
    this.editingRow = -1;
    const applicationData = {
      id: index,
      time_notify: this.time_noti_id,
      position: position,
      max_temp: max_temp,
      min_temp: min_temp,
      calibrate: calibrate
    }

    this._serviceService.update_time_notify(applicationData).subscribe((response: any) => {
      if (response && response.result) {
        if (response.result.response !== "ไม่พบข้อมูล") {
          this._alert.successNotification();
        } else {
          this._alert.cancelledNotification();
          this.data_position[index] = { ...this.originalData };
        }
      } else {
        this.router.navigate(['/login']);
      }

    });
  }
  selectedTimenoti: string = ""
  time_noti_id: string = ""
  onSelectedTime(time_noti: any): void {
    this.selectedTimenoti = time_noti.target.value;
    const selectedValueParts = this.selectedTimenoti.split(':');
    if (selectedValueParts.length > 1) {
      this.time_noti_id = (parseInt(selectedValueParts[0].trim()) + 1).toString();
    }
  }

  logout() {
    this.router.navigate(['/logout']);
  }
  goToDDashboard() {
    this.router.navigate(['/dashboard']);
  }
  isDesktop = window.innerWidth > 767; // Adjust the breakpoint as needed

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.isDesktop = event.target.innerWidth > 767; // Adjust the breakpoint as needed
  }


  selectedStartDate!: Date;
  selectedEndDate!: Date;
  datePipe = new DatePipe('en-US');
  onSelectorDate() {
    const startDate: any = this.datePipe.transform(this.selectedStartDate, 'yyyy-MM-dd 00:00:00');
    const endDate: any = this.datePipe.transform(this.selectedEndDate, 'yyyy-MM-dd 23:59:59');
    if (startDate && endDate) {
      localStorage.setItem('start_datetime', startDate.toString());
      localStorage.setItem('end_datetime', endDate.toString());
      location.reload();
    }
  }

  goToExcel() {
    const applicationData = {
      start_datetime_chart: this.start_datetime_chart,
      end_datetime_chart: this.end_datetime_chart,
    }
    const applicationDataString = JSON.stringify(applicationData);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/meditech-pro/export-excel'], { queryParams: { data: applicationDataString } })
    );
    window.open(url, '_blank');
  }
  printChartData() {
    const applicationData = {
      start_datetime_chart: this.start_datetime_chart,
      end_datetime_chart: this.end_datetime_chart,
    }
    const applicationDataString = JSON.stringify(applicationData);
    const url = this.router.serializeUrl(
      // this.router.createUrlTree(['/meditech-pro/print-chart-date'], { queryParams: { data: applicationDataString } })
      this.router.createUrlTree(['/meditech-pro/print-chart-date'], { queryParams: { data: applicationDataString } })
    );

    window.open(url, '_blank');

  }
  // printChartData_v2() {
  //   const applicationData = {
  //     start_datetime_chart: this.start_datetime_chart,
  //     end_datetime_chart: this.end_datetime_chart,
  //   };

  //   const applicationDataString = JSON.stringify(applicationData);
  //   console.log("Serialized application data:", applicationDataString);

  //   try {
  //     const url = this.router.serializeUrl(
  //       this.router.createUrlTree(['/meditech-pro/print-data-template'], { queryParams: { data: applicationDataString } })
  //     );
  //     console.log("Generated URL:", url); // Add this line

  //     const newWindow = window.open(url, '_blank');
  //     if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
  //       // Pop-up blocked
  //       console.error("Pop-up blocked. Please allow pop-ups for this site.");
  //     }
  //   } catch (error) {
  //     console.error("Error creating URL or opening window:", error);
  //   }
  // }

  printChartData_v2() {
    const applicationData = {
      start_datetime_chart: this.start_datetime_chart,
      end_datetime_chart: this.end_datetime_chart,
    }
    const applicationDataString = JSON.stringify(applicationData);
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/meditech-pro/print-data-template'], { queryParams: { data: applicationDataString } })
    );

    window.open(url, '_blank');

  }
}
