import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class PredictService {

  private apiUrl = 'http://127.0.0.1:5000/predict';

  constructor(private http: HttpClient) {}

  //Metodo para enviar los datos y obtener la prediccion
  makePrediction(data:any):Observable<any>{
    return this.http.post<any>(this.apiUrl,data);
  }
}
