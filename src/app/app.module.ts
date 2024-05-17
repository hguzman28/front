import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormularioComponent } from './formulario/formulario.component';
import { SorteosComponent } from './servicio/servicio.component';
import { ScannerComponent } from './scanner/scanner.component';
import { HttpClientModule } from '@angular/common/http';

LOAD_WASM().subscribe((res: any) => console.log('LOAD_WASM', res));


@NgModule({
  declarations: [
    AppComponent,
    FormularioComponent,
    SorteosComponent,
    ScannerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxScannerQrcodeModule,
    ZXingScannerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
