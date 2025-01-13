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
  imports: [ReactiveFormsModule, CommonModule,MatFormFieldModule,MatInputModule,MatSelectModule,MatButtonModule,MatGridListModule,MatError],
  templateUrl: './prediccion.component.html',
  styleUrl: './prediccion.component.scss',
})
export class PrediccionComponent {
  predictForm: FormGroup;
  result: any = null;
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


  constructor(private fb: FormBuilder, private predictService: PredictService) {
    this.predictForm = this.fb.group({
      Administrative: [0, [Validators.required, Validators.min(0)]],
      Administrative_Duration: [0, [Validators.required, Validators.min(0)]],
      Informational: [0, [Validators.required, Validators.min(0)]],
      Informational_Duration: [0, [Validators.required, Validators.min(0)]],
      ProductRelated: [0, [Validators.required, Validators.min(0)]],
      ProductRelated_Duration: [0, [Validators.required, Validators.min(0)]],
      BounceRates: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      ExitRates: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      PageValues: [0, [Validators.required, Validators.min(0)]],
      SpecialDay: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      Month: ['', [Validators.required]],
      OperatingSystems: [1, [Validators.required, Validators.min(1)]],
      Browser: [1, [Validators.required, Validators.min(1)]],
      Region: [1, [Validators.required, Validators.min(1)]],
      TrafficType: [1, [Validators.required, Validators.min(1)]],
      VisitorType: ['', [Validators.required]],
      Weekend: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
    });
  }

  onSubmit(){
    if(this.predictForm.invalid){
      return;
    }
    //Convertir los valores del formulario a la estructura de la interfaz PredictionForm
    const formData: PredictionForm = this.predictForm.value as PredictionForm;
    this.predictService.makePrediction(formData).subscribe(
      (response)=>{
        this.result = response;
      },
      (error)=>{
        console.log('Error realizando la prediccion',error)
      }
    )

  }
}
