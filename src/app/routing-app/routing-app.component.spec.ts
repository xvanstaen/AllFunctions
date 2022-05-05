import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutingAppComponent } from './routing-app.component';

describe('RoutingAppComponent', () => {
  let component: RoutingAppComponent;
  let fixture: ComponentFixture<RoutingAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutingAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutingAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
