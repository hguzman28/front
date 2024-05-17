import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(private http: HttpClient) { }

  get_id_prize(postid: any, id_sorteo: any) {
    return this.http.post(`https://prd.appsjamar.com/appventas/servicio/v1/JA/sorteo/${id_sorteo}/premio_por_id`, postid)
  }
}
