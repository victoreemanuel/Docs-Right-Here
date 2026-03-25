import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TemplateLateralLogin } from './template-lateral-login/template-lateral-login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TemplateLateralLogin],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('docsRightHere');
}
