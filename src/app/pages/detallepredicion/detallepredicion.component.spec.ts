import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallepredicionComponent } from './detallepredicion.component';

describe('DetallepredicionComponent', () => {
  let component: DetallepredicionComponent;
  let fixture: ComponentFixture<DetallepredicionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallepredicionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetallepredicionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
