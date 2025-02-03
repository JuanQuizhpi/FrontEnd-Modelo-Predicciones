import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentacion',
  standalone: true,
  imports: [],
  templateUrl: './presentacion.component.html',
  styleUrl: './presentacion.component.scss'
})
export class PresentacionComponent {

  constructor(private router: Router) {}

  irAFormulario() {
    this.router.navigate(['/predicionNewSample']); // Ruta del formulario
  }

}
