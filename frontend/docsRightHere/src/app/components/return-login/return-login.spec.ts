import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnLogin } from './return-login';

describe('ReturnLogin', () => {
  let component: ReturnLogin;
  let fixture: ComponentFixture<ReturnLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
