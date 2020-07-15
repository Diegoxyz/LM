import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveOrderComponent } from './save-order.component';

describe('SaveOrderComponent', () => {
  let component: SaveOrderComponent;
  let fixture: ComponentFixture<SaveOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
