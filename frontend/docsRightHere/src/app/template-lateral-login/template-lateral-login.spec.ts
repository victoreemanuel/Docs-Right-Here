import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateLateralLogin } from './template-lateral-login';

describe('TemplateLateralLogin', () => {
  let component: TemplateLateralLogin;
  let fixture: ComponentFixture<TemplateLateralLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateLateralLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateLateralLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
