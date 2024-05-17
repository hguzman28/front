import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  info_op: data = {
    referencia: "",
    valor: 0,
    estado: "",
    signature: "",
    email: "",
    nombre: "",
    productos: [

    ],
    services: []
  }

  info_checkout = {
    action: "https://checkout.payulatam.com/ppp-web-gateway-payu",
    confirmationUrl: "https://bnu2ql9kje.execute-api.us-east-1.amazonaws.com",
    merchantId: "504583",
    apiKey: "26riijjbek9h625ivbndua713",
    accountId: "505542",
    test: "0"
  }

  loader = true;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    let urlInfoOp = 'https://prd.appsjamar.com/appventas/linkpagos'
    this.route.queryParams.subscribe
      (params => {
        if(params["sign"]) {
          if(params["test"]) {
            urlInfoOp = 'https://dev.appsjamar.com/appventas/linkpagos'
            this.info_checkout['confirmationUrl'] = 'https://zgwbuxr9i6.execute-api.us-east-1.amazonaws.com'
            this.info_checkout["test"] = '1';
            this.info_checkout["accountId"] = '512321'
            this.info_checkout["apiKey"] = '4Vj8eK4rloUd272L48hsrarnUA'
            this.info_checkout["merchantId"] = '508029'
            this.info_checkout["action"] = 'https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu'
          }
          this.loader = true;
          this.http.get<responseInfoOp>(`${urlInfoOp}/payu/v1/JA/info_op/${params['sign']}`).subscribe(
            res => {
              if(res.success) {
                if(res.data && res.data.length > 0) {
                  this.info_op = res.data[0]
                } else {
                  this.loadLinkNotFound();
                }
              } else {
                this.loadLinkNotFound();
              }
              this.loader = false;
            }
          )
        } else {
          this.loader = false;
          this.loadLinkNotFound();
        }
      });
  }

  loadLinkNotFound() {
    this.router.navigate(['/404'])
  }
}

interface responseInfoOp {
  success: boolean;
  data: data[];
}

interface data {
  referencia: string;
  valor: number;
  estado: string;
  signature: string;
  email: string;
  nombre: string;
  productos: Producto[]
  services: Service[]
}

interface Producto {
  sku: string;
  nombre: string;
  precio_lista: number;
  precio_oferta: number;
  img: string;
  cantidad: number;
}

interface Service {
  tipo: string;
  cod: string;
  can: number;
  precio_oferta: number;
}
