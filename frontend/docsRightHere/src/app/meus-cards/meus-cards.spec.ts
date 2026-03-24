import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusCards } from './meus-cards';

describe('MeusCards', () => {
  let component: MeusCards;
  let fixture: ComponentFixture<MeusCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusCards],
    }).compileComponents();

    fixture = TestBed.createComponent(MeusCards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
