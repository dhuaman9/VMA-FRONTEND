import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarPasswordUsuarioComponent } from './cambiar-password-usuario.component';

describe('CambiarPasswordUsuarioComponent', () => {
  let component: CambiarPasswordUsuarioComponent;
  let fixture: ComponentFixture<CambiarPasswordUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarPasswordUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarPasswordUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
