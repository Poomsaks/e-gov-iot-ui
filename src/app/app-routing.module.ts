import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './environments/AuthGuard';
import { PrintChartDateComponent } from './print-chart-date/print-chart-date.component';
import { ExportExcelComponent } from './export-excel/export-excel.component';

const routes: Routes = [
  { path: '', component: DashboardComponent , canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent , canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent , canActivate: [AuthGuard] },
  { path: 'print-chart-date', component: PrintChartDateComponent},
  { path: 'export-excel', component: ExportExcelComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
