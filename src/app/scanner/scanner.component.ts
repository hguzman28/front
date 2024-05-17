import { Component, OnInit, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NgxScannerQrcodeService, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { ActivatedRoute, Router } from '@angular/router';
import { ScannerService } from './scanner.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css']
})
export class ScannerComponent implements OnInit {
  @Output() display = new EventEmitter<string>()
  // @ViewChild('action') scannerElement: any;
  // constructor() { }

  // ngAfterViewInit(): void {
  //   this.scannerElement.start()

  // }

  // readCode() {
  //   console.log(this.scannerElement)
  // }


  title = 'qr-reader';
  public cameras: MediaDeviceInfo[] = [];
  public myDevice!: MediaDeviceInfo;
  public scannerEnabled = false;
  public results: string[] = [];
  option_camera = 1

  constructor(private router: Router, private route: ActivatedRoute, private scs: ScannerService) {
  }
  ngOnInit() {
    console.log(localStorage.getItem('id_cliente'))
    const data = localStorage.getItem('primer_sorteo')
    console.log(data)
    if (localStorage.getItem('primer_sorteo') == 'NO_GANO') {
      Swal.fire({
        imageUrl: '/assets/sigue_intentando.png',
        imageWidth: 350,
        text: ' Sigue buscando los códigos en la tienda, aun tienes oportunidad de ganar',
        showCancelButton: false,
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#D8232A'
      })
      localStorage.setItem('primer_sorteo', 'OK')
    }
    if (localStorage.getItem('nuevo_intento') == 'N') {
      // this.display.emit('servicio')
      this.display.emit('servicio')
    }

  }

  camerasFoundHandler(cameras: MediaDeviceInfo[]) {
    if (this.cameras.length == 0) {
      this.cameras = cameras;
      console.log(this.cameras)
    }
    this.selectCamera(this.cameras[1].label);
  }

  scanSuccessHandler(event: string) {

    //
    if (this.scannerEnabled) {

      let params = new URLSearchParams(event.slice(event.indexOf('?')));
      const id_sorteo = localStorage.getItem('id_sorteo')
      const id_tienda = localStorage.getItem('tienda')
      if (id_sorteo != null && id_tienda != null) {
        this.scannerEnabled = false
        console.log(params.get('evento'))
        // const id_sorteo = localStorage.getItem('id_sorteo')
        const postid = {
          'id_cliente': localStorage.getItem('id_cliente'),
          'tienda': id_tienda
        }
        this.scs.get_id_prize(postid, id_sorteo).subscribe((res: any) => {
          if (res.causal == 'NO_GANO' && res.nuevo_intento == 'S') {
            Swal.fire({
              imageUrl: '/assets/sigue_intentando.png',
              imageWidth: 350,
              text: ' Sigue buscando los códigos en la tienda, aun tienes oportunidad de ganar',
              showCancelButton: false,
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#D8232A'
            }).then((result) => {
              this.scannerEnabled = true

            })
          }
          else if (res.causal == 'NO_GANO' && res.nuevo_intento == 'N') {
            Swal.fire({
              // imageUrl: '/assets/sigue_intentando.png',
              // imageWidth: 350,
              title: 'GAME OVER',
              text: 'Te deseamos mejor suerte para el proximo sorteo JAMAR',
              showCancelButton: false,
              confirmButtonText: 'Finalizar',
              confirmButtonColor: '#D8232A',
              allowOutsideClick: false
            }).then((result) => {
              localStorage.setItem('nuevo_intento', res.nuevo_intento)
              this.display.emit('servicio')

            })
          }
          else if (res.causal == 'OBSEQUIO_CONSOLACION' && res.nuevo_intento == 'N') {
            Swal.fire({
              imageUrl: '/assets/ganaste_premio.png',
              imageWidth: 350,
              text: 'acércate a tu asesor para conocer tu premio',
              showCancelButton: false,
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#D8232A'
            }).then((result) => {
              console.log('aqui')
              localStorage.setItem('nuevo_intento', res.nuevo_intento)
              this.display.emit('servicio')
            })
          }
          else if (res.causal == 'GANO_PREMIO_MAYOR' && res.nuevo_intento == 'N') {
            Swal.fire({
              imageUrl: '/assets/sigue_intentando.png',
              imageWidth: 350,
              title: '¡Felicidades!',
              text: 'Has encontrado un premio mayor, acércate a tu asesor para conocer tu premio',
              showCancelButton: false,
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#D8232A'
            })
              .then((result) => {
                localStorage.setItem('nuevo_intento', res.nuevo_intento)
                this.display.emit('servicio')

              })
          }
          else if (res.causal == 'SORTEO_NO_ENCONTRADO' || res.causal == 'SORTEO_NO_INICIADO') {
            Swal.fire({
              title: 'Sorteo no encontrado',
              text: 'Vuelva a intentarlo. Escanea otro código',
              showCancelButton: false,
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#D8232A'
            })
              .then((result) => {
                this.scannerEnabled = true

              })
          }
          else if (res.causal == 'SORTEO_FINALIZADO') {
            Swal.fire({
              title: 'Sorteo finalizado',
              text: 'Este sorteo ha finalizado, gracias por participar',
              showCancelButton: false,
              confirmButtonText: 'Continuar',
              confirmButtonColor: '#D8232A'
            }).then((result) => {
              localStorage.setItem('nuevo_intento', 'N')
              this.display.emit('servicio')

            })
          }

        })
      }
      // else {
      //   Swal.fire({
      //     // imageUrl: '/assets/sigue_intentando.png',
      //     // imageWidth: 350,
      //     // text: ' Sigue buscando los codigos en la tienda, aun tienes oportunidad de ganar',
      //     title: 'QR INVALIDO',
      //     showCancelButton: false,
      //     confirmButtonText: 'Continuar',
      //     confirmButtonColor: '#D8232A'
      //   }).then((result) => {
      //     if (result.isConfirmed) {
      //       this.scannerEnabled = true
      //     }
      //   })
      // }
    }
    // const link = event;
    // //window.location.href = link;
    // this.router.navigate(['/', 'servicio'])
    // this.results.unshift(event);
  }
  change_camera() {
    // if (this.scannerEnabled) {
    //   this.cameras = []
    // }
    if (this.option_camera == 1) {
      this.option_camera = 0
    }
    else {
      this.option_camera = 1
    }
  }

  selectCamera(cameraLabel: string) {
    this.cameras.forEach(camera => {
      if (camera.label.includes(cameraLabel)) {
        this.myDevice = camera;
        console.log(camera.label);
        this.scannerEnabled = true;
      }
    })
  }
}
