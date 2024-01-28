import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintChartDateComponent } from './print-chart-date.component';

describe('PrintChartDateComponent', () => {
  let component: PrintChartDateComponent;
  let fixture: ComponentFixture<PrintChartDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintChartDateComponent]
    });
    fixture = TestBed.createComponent(PrintChartDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
