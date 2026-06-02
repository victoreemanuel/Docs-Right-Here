import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPlaceholder } from './auth-placeholder';

describe('AuthPlaceholder', () => {
  let component: AuthPlaceholder;
  let fixture: ComponentFixture<AuthPlaceholder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPlaceholder],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthPlaceholder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
