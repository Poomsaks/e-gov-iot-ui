import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertFunction } from '../alert/Alert_function';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private router: Router,
    private _alert: AlertFunction,
    ) {
    this._alert.warning_out('/login','/dashboard');

    // this.router.navigate(['/login']);
  }
}
