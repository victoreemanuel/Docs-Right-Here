import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // CommonModule - Essa função é um recuso do angular para ele ensinar como o angular deve se comportar ao tentar se comunicar com html como fechar ou abrir um botão.
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
//import { CardService } from './card.service';

@Component({
  selector: 'app-meus-cards',
  standalone: true,
  imports: [],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})

export class Cards {}