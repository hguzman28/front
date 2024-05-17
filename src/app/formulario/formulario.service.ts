import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  constructor(private http: HttpClient) { }

  getEventName(sorteo: string, tienda: string) {
    return this.http.get(`https://prd.appsjamar.com/appventas/servicio/v1/JA/sorteo/${sorteo}/${tienda}/info_sorteo`)
  }
  getCse() {
    return this.http.get(`https://prd.appsjamar.com/appventas/servicio/v1/JA/causal/como_se_entero`)
  }
  sendForm(sorteo: string, formulario: any) {
    return this.http.post(`https://prd.appsjamar.com/appventas/servicio/v1/JA/sorteo/${sorteo}/premio_por_formulario`, formulario)
  }
  get_id_prize(postid: any, id_sorteo: any) {
    return this.http.post(`https://prd.appsjamar.com/appventas/servicio/v1/JA/sorteo/${id_sorteo}/premio_por_id`, postid)
  }
}
