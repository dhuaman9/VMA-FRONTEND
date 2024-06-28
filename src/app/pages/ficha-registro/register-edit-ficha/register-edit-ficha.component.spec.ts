import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEditFichaComponent } from './register-edit-ficha.component';

describe('RegisterEditFichaComponent', () => {
  let component: RegisterEditFichaComponent;
  let fixture: ComponentFixture<RegisterEditFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterEditFichaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEditFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
