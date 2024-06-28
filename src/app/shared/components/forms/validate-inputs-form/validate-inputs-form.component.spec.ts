import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateInputsFormComponent } from './validate-inputs-form.component';

describe('ValidateInputsFormComponent', () => {
  let component: ValidateInputsFormComponent;
  let fixture: ComponentFixture<ValidateInputsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateInputsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateInputsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
