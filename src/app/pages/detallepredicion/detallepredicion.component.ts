import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PredictService } from '../../core/services/predict.service';
import { JsonPipe } from '@angular/common';
import { NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { MatButtonModule } from '@angular/material/button';

Chart.register(...registerables);

@Component({
  selector: 'app-detallepredicion',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    MatGridListModule,
    MatCardModule,
    MatListModule,
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './detallepredicion.component.html',
  styleUrl: './detallepredicion.component.scss',
})
export class DetallepredicionComponent implements OnInit {
  prediccionId: string | null = null;
  prediccionData: any;
  //Implementacion de una grafica
  public loading: boolean = true;
  public predictionText: string = '';
  public probabilityText: string = '';
  //public chart: any;
  chart!: Chart;
  //Constante de Grafica
  probaRes: any;

  monthMap: { [key: string]: string } = {
    Jan: 'Enero',
    Feb: 'Febrero',
    Mar: 'Marzo',
    Apr: 'Abril',
    May: 'Mayo',
    Jun: 'Junio',
    Jul: 'Julio',
    Aug: 'Agosto',
    Sep: 'Septiembre',
    Oct: 'Octubre',
    Nov: 'Noviembre',
    Dec: 'Diciembre',
  };

  public osMap: { [key: number]: string } = {
    1: 'Android',
    2: 'Windows',
    3: 'iOS',
    4: 'macOS',
    5: 'Otros sistemas',
    6: 'Chrome OS',
    7: 'HarmonyOS',
    8: 'Linux',
  };

  public browserMap: { [key: number]: string } = {
    1: 'Safari',
    2: 'Google Chrome',
    3: 'UC Browser',
    4: 'Microsoft Edge',
    5: 'Samsung Internet',
    6: 'Firefox',
    7: 'Vivaldi',
    8: 'Opera',
    9: 'Midori',
    10: 'Brave',
    11: 'SRWare Iron',
    12: 'Tor Browser',
    13: 'Maxthon',
  };

  public regionMap: { [key: number]: string } = {
    1: 'Asia-Pacífico',
    2: 'América Latina',
    3: 'América del Norte',
    4: 'Europa',
    5: 'Europa del Este',
    6: 'Oriente Medio',
    7: 'África',
    8: 'Sudeste Asiático',
    9: 'Oceanía',
  };

  public trafficTypeMap: { [key: number]: string } = {
    1: 'Tráfico Directo',
    2: 'Tráfico Orgánico',
    3: 'Tráfico de Pago (PPC)',
    4: 'Tráfico de Referencia',
    6: 'Tráfico de Afiliados',
    10: 'Tráfico de Email',
    13: 'Tráfico Social',
  };

  public visitorTypeMap: { [key: string]: string } = {
    Returning_Visitor: 'Visitante Frecuente',
    New_Visitor: 'Nuevo Visitante',
    Other: 'Otro',
  };

  constructor(
    private route: ActivatedRoute,
    private predictService: PredictService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la predicción de la URL
    this.route.paramMap.subscribe((params) => {
      this.prediccionId = params.get('id');
      if (this.prediccionId) {
        // Solicitar los detalles de la predicción al backend
        this.predictService.getPrediccion(this.prediccionId).subscribe(
          (data) => {
            this.prediccionData = data;
            this.loading = false;
            //Extraemos la probabilidad y la prediccion
            const probabilities = data.probability;
            const prediction = data.prediction;
            this.probaRes = data.probability;

            //Establecemos el texto en la prediccion
            this.predictionText =
              prediction === 1
                ? 'Según los datos proporcionados, la predicción indica que el usuario probablemente completará una compra.'
                : 'En función de la información proporcionada, se estima que el usuario no realizará una compra.';
            //Establecemos el texto de las probabilidades
            this.probabilityText = `📊 <strong>Probabilidades:</strong> 
              <br> ❌ No compra: ${(probabilities[0] * 100).toFixed(2)}%
              <br> ✅ Compra: ${(probabilities[1] * 100).toFixed(2)}%`;
            //Creacion de la grafica
            //this.createChart(data.probability);
            //this.createChart(probabilities);
          },
          (error) => {
            console.error('Error al obtener la predicción:', error);
          }
        );
      }
    });
  }

  // Crear la gráfica de pastel
  createChart() {
    if (!this.prediccionData?.probability) {
      console.error('No hay datos de probabilidad para crear la gráfica');
      return;
    }

    // Extraer probabilidades desde la variable de la clase
    const probabilities = this.prediccionData.probability;

    if (this.chart) {
      this.chart.destroy(); // 🔥 Importante: Destruir la gráfica anterior antes de crear una nueva
    }

    // Obtener el contexto del canvas
    const canvas = document.getElementById(
      'probabilityChart'
    ) as HTMLCanvasElement;
    if (!canvas) {
      console.error('No se encontró el elemento canvas');
      return;
    }

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['No compra', 'Compra'],
        datasets: [
          {
            data: [probabilities[0] * 100, probabilities[1] * 100],
            backgroundColor: ['#FF4E50', '#56CCF2'],
            borderColor: ['#FF4E50', '#56CCF2'],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const value = context.raw as number; // Convertir 'unknown' a 'number'
                return `${context.label}: ${value.toFixed(2)}%`;
              },
            },
          },
        },
      },
    });
  }

  leerExplicacion() {
    if (!this.prediccionData?.explanation) return;

    window.speechSynthesis.cancel(); // Detener cualquier síntesis en curso

    const speech = new SpeechSynthesisUtterance(
      this.prediccionData.explanation
    );
    speech.lang = 'es-ES'; // Español
    speech.rate = 1; // Velocidad normal
    speech.pitch = 1; // Tono normal

    window.speechSynthesis.speak(speech);
  }
}
