import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { PredictService } from '../../core/services/predict.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { response } from 'express';
import { error } from 'console';
// Módulos de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatError } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

//Interfaz de todas las variables del formulario
export interface PredictionForm {
  Administrative: number;
  Administrative_Duration: number;
  Informational: number;
  Informational_Duration: number;
  ProductRelated: number;
  ProductRelated_Duration: number;
  BounceRates: number;
  ExitRates: number;
  PageValues: number;
  SpecialDay: number;
  Month: string;
  OperatingSystems: number;
  Browser: number;
  Region: number;
  TrafficType: number;
  VisitorType: string;
  Weekend: number;
}

@Component({
  selector: 'app-prediccion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    MatError,
    MatCardModule,
    MatSliderModule,
  ],
  templateUrl: './prediccion.component.html',
  styleUrl: './prediccion.component.scss',
})
export class PrediccionComponent {
  predictForm: FormGroup;
  result: any = null;
  //Variable relacionada a el estado de carga
  loading: boolean = false;
  months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Meses en español
  monthsInSpanish: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  // Relación de meses en español con los nombres de los meses en inglés
  monthInEnglish: { [key: string]: string } = {
    Enero: 'Jan',
    Febrero: 'Feb',
    Marzo: 'Mar',
    Abril: 'Apr',
    Mayo: 'May',
    Junio: 'Jun',
    Julio: 'Jul',
    Agosto: 'Aug',
    Septiembre: 'Sep',
    Octubre: 'Oct',
    Noviembre: 'Nov',
    Diciembre: 'Dec',
  };

  constructor(
    private fb: FormBuilder,
    private predictService: PredictService,
    private router: Router
  ) {
    this.predictForm = this.fb.group({
      Administrative: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      Administrative_Duration: [
        0,
        [Validators.required, Validators.min(0), Validators.max(5000)],
      ],
      Informational: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      Informational_Duration: [
        0,
        [Validators.required, Validators.min(0), Validators.max(5000)],
      ],
      ProductRelated: [
        0,
        [Validators.required, Validators.min(0), Validators.max(200)],
      ],
      ProductRelated_Duration: [
        0,
        [Validators.required, Validators.min(0), Validators.max(5000)],
      ],
      BounceRates: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      ExitRates: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      PageValues: [
        0,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      SpecialDay: [
        0.1,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
      Month: ['', Validators.required],
      OperatingSystems: [
        2,
        [Validators.required, Validators.min(1), Validators.max(8)],
      ],
      Browser: [
        2,
        [Validators.required, Validators.min(1), Validators.max(13)],
      ],
      Region: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
      TrafficType: [
        2,
        [Validators.required, Validators.min(1), Validators.max(20)],
      ],
      VisitorType: ['', Validators.required],
      Weekend: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
    });
  }

  onSubmit() {
    if (this.predictForm.invalid) {
      return;
    }
    //Convertir los valores del formulario a la estructura de la interfaz PredictionForm
    const formData: PredictionForm = this.predictForm.value as PredictionForm;
    this.predictService.makePrediction(formData).subscribe(
      (response) => {
        this.result = response;
      },
      (error) => {
        console.log('Error realizando la prediccion', error);
      }
    );
  }

  logCapturedData() {
    console.log('Captured form data:', this.predictForm.value);
  }

  makePredicionAjustada() {
    if (this.predictForm.invalid) {
      return;
    }

    // Crear una copia de los datos del formulario
    const formData = { ...this.predictForm.value };

    // Transformar el campo BounceRates de 10, 20, 30, etc., a 0.1, 0.2, 0.3, etc.
    formData.BounceRates = formData.BounceRates / 100;
    formData.ExitRates = formData.ExitRates / 100;
    formData.Weekend = Number(formData.Weekend);

    // Ahora puedes ver los datos capturados y transformados
    console.log('Datos capturados y transformados: ', formData);

    //Indicador de Carga
    this.loading = true;

    //Hacemos una prediccion
    this.predictService.makePrediction(formData).subscribe(
      (response) => {
        //this.result = response;
        this.loading = false;
        const predictionText =
          response.prediction === 1
            ? 'El usuario probablemente realizará una compra.'
            : 'El usuario probablemente no realizará una compra.';

        const probabilityText = `📊 <strong>Probabilidades:</strong> 
      <br> ❌ No compra: ${(response.probability[0] * 100).toFixed(2)}%
      <br> ✅ Compra: ${(response.probability[1] * 100).toFixed(2)}%`;

        Swal.fire({
          title: '🔍 Predicción realizada',
          html: `<p><strong>Resultado:</strong> ${predictionText}</p>
             <p>${probabilityText}</p>`,
          icon: 'success',
          showCancelButton: true, // Agregar botón extra
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Ver detalles',
        }).then((result) => {
          if (result.isDismissed) {
            // Si el usuario hace clic en "Ver detalles"
            const predictionId = response.predictionId;
            this.router.navigate(['/detallePrediccion', predictionId]);
          }
        });
      },
      (error) => {
        this.loading = false;
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al realizar la predicción. Inténtalo de nuevo.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
        console.log('Error realizando la prediccion', error);
      }
    );
  }
}
