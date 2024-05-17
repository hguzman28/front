import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScannerComponent } from './scanner/scanner.component';
import { FormularioComponent } from './formulario/formulario.component';
import { SorteosComponent } from './servicio/servicio.component';


const routes: Routes = [
  { path: '', component: FormularioComponent },
  // { path: 'scan-qr', component: ScannerComponent },
  // { path: 'servicio', component: SorteosComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
