import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgeInfoUsuario } from './badge-info-usuario';

describe('BadgeInfoUsuario', () => {
  let component: BadgeInfoUsuario;
  let fixture: ComponentFixture<BadgeInfoUsuario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgeInfoUsuario],
    }).compileComponents();

    fixture = TestBed.createComponent(BadgeInfoUsuario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
