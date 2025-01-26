import { Component, OnInit } from '@angular/core';
import { PredictService } from '../../core/services/predict.service';
import { Router } from '@angular/router';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule,MatIconModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
})
export class HistorialComponent implements OnInit {
  displayedColumns: string[] = [
    
    'prediccion',
    'probabilidadCompra',
    'probabilidadNoCompra',
    'acciones',
  ];
  predicciones: any[] = [];

  constructor(private predictService: PredictService, private router: Router) {}
  ngOnInit(): void {
    this.obtenerHistorial();
  }

  obtenerHistorial() {
    this.predictService.getHistorial().subscribe(
      (data) => {
        this.predicciones = data.history || [];
        console.log(data)
      },
      (error) => {
        console.error('Error al obtener el historial.', error);
      }
    );
  }

  verDetalle(id: string) {
    this.router.navigate(['/detallePrediccion', id]);
  }
}
