import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipToSetComponent } from './ship-to-set.component';

describe('ShipToSetComponent', () => {
  let component: ShipToSetComponent;
  let fixture: ComponentFixture<ShipToSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipToSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipToSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
