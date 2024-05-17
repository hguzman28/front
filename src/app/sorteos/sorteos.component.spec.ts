import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorteosComponent } from './servicio.component';

describe('SorteosComponent', () => {
  let component: SorteosComponent;
  let fixture: ComponentFixture<SorteosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SorteosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SorteosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
