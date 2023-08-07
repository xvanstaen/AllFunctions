import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestHttpOAComponent } from './test-http-oa.component';

describe('TestHttpOAComponent', () => {
  let component: TestHttpOAComponent;
  let fixture: ComponentFixture<TestHttpOAComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestHttpOAComponent]
    });
    fixture = TestBed.createComponent(TestHttpOAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
