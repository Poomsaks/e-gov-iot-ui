import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintDataTemplateComponent } from './print-data-template.component';

describe('PrintDataTemplateComponent', () => {
  let component: PrintDataTemplateComponent;
  let fixture: ComponentFixture<PrintDataTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintDataTemplateComponent]
    });
    fixture = TestBed.createComponent(PrintDataTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
