import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PredictService {
  //private apiUrl = 'http://127.0.0.1:5000/predict';

  //private apiUrlPredId = 'http://127.0.0.1:5000/history/';

  //private apiHistorial = 'http://127.0.0.1:5000';

  private apiUrl = 'https://backdesplieguerenderia.onrender.com/predict';

  private apiUrlPredId = 'https://backdesplieguerenderia.onrender.com/history/';

  private apiHistorial = 'https://backdesplieguerenderia.onrender.com';


  constructor(private http: HttpClient) {}

  //Metodo para enviar los datos y obtener la prediccion
  makePrediction(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  //Metodo para obtener una preduccion por ID
  getPrediccion(prediccionId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlPredId}/${prediccionId}`);
  }

  // 🔥 Obtener historial de predicciones desde Flask
  getHistorial(): Observable<any> {
    return this.http.get(`${this.apiHistorial}/history`);
  }
}
