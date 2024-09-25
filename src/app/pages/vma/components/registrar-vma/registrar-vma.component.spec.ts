import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarVmaComponent } from './registrar-vma.component';

describe('RegistrarVmaComponent', () => {
  let component: RegistrarVmaComponent;
  let fixture: ComponentFixture<RegistrarVmaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarVmaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarVmaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
