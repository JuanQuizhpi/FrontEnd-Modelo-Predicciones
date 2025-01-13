import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrediccionComponent } from './pages/prediccion/prediccion.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { DetallepredicionComponent } from './pages/detallepredicion/detallepredicion.component';
import { PresentacionComponent } from './pages/presentacion/presentacion.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'predicionNewSample', component: PrediccionComponent},
      { path: 'historialPredicciones', component: HistorialComponent },
      { path :'detallePrediccion',component:DetallepredicionComponent},
      {path:'',component:PresentacionComponent}
    ],
  },
];
