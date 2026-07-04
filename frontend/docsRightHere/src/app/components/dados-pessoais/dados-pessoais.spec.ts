import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DadosPessoais } from './dados-pessoais';

describe('DadosPessoais', () => {
  let component: DadosPessoais;
  let fixture: ComponentFixture<DadosPessoais>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DadosPessoais],
    }).compileComponents();

    fixture = TestBed.createComponent(DadosPessoais);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
