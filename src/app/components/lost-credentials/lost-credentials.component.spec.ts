import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostCredentialsComponent } from './lost-credentials.component';

describe('LostCredentialsComponent', () => {
  let component: LostCredentialsComponent;
  let fixture: ComponentFixture<LostCredentialsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostCredentialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
