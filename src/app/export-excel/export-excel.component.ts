import { Component, OnInit } from '@angular/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { ServiceService } from '../service/service.service';
import { of, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss']
})
export class ExportExcelComponent {

  constructor(
    private exportAsService: ExportAsService,
    private _serviceService: ServiceService,
    private router: Router,
    ) { }

  data_excel_header: any
  ngOnInit(): void {

    if (localStorage.getItem('mac_address')) {
      const data: any = localStorage.getItem('mac_address')
      const dataArray = data.split(',');
      for (let index = 1; index < dataArray.length; index++) {
        const element = dataArray[index];
        const applicationData = {
          mac_address: element
        }
        this._serviceService.get_time_data_excel(applicationData).pipe(
          switchMap((response: any) => {
            const data_response = response.result.response
            this.data_excel_header = data_response
            return of(response);
          })
        ).subscribe(() => {
          setTimeout(() => {
            const exportConfig: ExportAsConfig = {
              type: 'xlsx',
              elementIdOrContent: 'tableId'
            };
            this.exportAsService.save(exportConfig, 'อุณหภูมิและความชื้น').subscribe((response: any) => {
              this.router.navigate(['/dashboard']);
            });

          }, 500);
        });
      }
    }


    // setTimeout(() => {
    //   const exportConfig: ExportAsConfig = {
    //     type: 'xlsx',
    //     elementIdOrContent: 'tableId'
    //   };
    //   this.exportAsService.save(exportConfig, 'example.xlsx').subscribe((response: any) => {
    //      console.log("print yes",response);
    //   });
    // }, 500);

  }

}
