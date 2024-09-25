import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaEditEmpresaComponent } from './alta-edit-empresa.component';

describe('AltaEditEmpresaComponent', () => {
  let component: AltaEditEmpresaComponent;
  let fixture: ComponentFixture<AltaEditEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltaEditEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltaEditEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
