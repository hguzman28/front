import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FormularioService } from './formulario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  clientForm: FormGroup;
  display: any
  postForm: any
  nombre: any
  causales: any
  id_sorteo: any
  id_tienda: any
  emailFocus: boolean = false
  celFocus: boolean = false
  // check1: boolean = false
  // check2: boolean = false
  // check3: boolean = false

  constructor(private router: Router, private fs: FormularioService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.clientForm = this.fb.group({
      name: ['', Validators.required],
      identification: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern('^3[0-9]{9}$')]],
      canal: ['', Validators.required],
      tipo: ['', Validators.required],
      checktc: [false, Validators.requiredTrue],
      checkoat: [false, Validators.requiredTrue],
      // checkcentral: [false, Validators.requiredTrue]
    })
  }

  getBasicsEvent(sorteo: string, tienda: string) {
    this.fs.getEventName(sorteo, tienda).subscribe(
      (res: any) => {
        if (res.success == true) {
          this.display = 'formulario'
          this.nombre = res.data.nombre_sorteo
        }
        else {
          this.display = res.causal
          console.log(this.display)
        }
      },
      (e: any) => {
        console.error(e)
      })
    this.fs.getCse().subscribe((res: any) => {
      this.causales = res.data,
        (e: any) =>
          console.error(e)
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (localStorage.getItem('id_sorteo') != params.evento) {
        if (params.id == null) {
          localStorage.clear()
          this.getBasicsEvent(params.evento, params.tienda)
          // this.id_sorteo = params.evento
          // this.id_tienda = params.tienda
        }
      }
      if (localStorage.getItem('id_cliente') != null && localStorage.getItem('nuevo_intento') == 'S') {
        this.display = 'scanner'
        if (params.id == null) {
          this.prizeid()
        }
      }
      else if (localStorage.getItem('nuevo_intento') == 'N') {
        console.log('aqui')
        this.display = 'servicio'
      }
      else if (localStorage.getItem('id_cliente') == null) {
        this.getBasicsEvent(params.evento, params.tienda)
      }
      this.id_sorteo = params.evento
      this.id_tienda = params.tienda

    })
    console.log(this.display)
    //this.getBasicsEvent()
    console.log(this.display)
    console.log(localStorage.getItem('id_cliente'))

    console.log(this.display)
  }

  prizeid() {
    const postid = {
      'id_cliente': localStorage.getItem('id_cliente'),
      'tienda': localStorage.getItem('tienda')
    }
    this.fs.get_id_prize(postid, localStorage.getItem('id_sorteo')).subscribe((res: any) => {
      if (res.causal == 'NO_GANO' && res.nuevo_intento == 'S') {
        Swal.fire({
          imageUrl: '/assets/sigue_intentando.png',
          imageWidth: 350,
          text: 'Sigue buscando los códigos en la tienda, aún tienes oportunidad de ganar',
          showCancelButton: false,
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#D8232A'
        })
      }
      else if (res.causal == 'NO_GANO' && res.nuevo_intento == 'N') {
        Swal.fire({
          // imageUrl: '/assets/sigue_intentando.png',
          // imageWidth: 350,
          title: 'GAME OVER',
          text: 'Te deseamos mejor suerte para el próximo evento JAMAR',
          showCancelButton: false,
          confirmButtonText: 'Finalizar',
          confirmButtonColor: '#D8232A',
          allowOutsideClick: false
        }).then((result) => {
          localStorage.setItem('nuevo_intento', res.nuevo_intento)
          this.display = 'servicio'

        })
      }
      else if (res.causal == 'OBSEQUIO_CONSOLACION' && res.nuevo_intento == 'N') {
        Swal.fire({
          imageUrl: '/assets/ganaste_premio.png',
          imageWidth: 350,
          text: 'Acércate a tu asesor para conocer tu premio',
          showCancelButton: false,
          confirmButtonText: 'Continuar',
          confirmButtonColor: '#D8232A'
        })
          .then((result) => {
            localStorage.setItem('nuevo_intento', res.nuevo_intento)
            this.display = 'servicio'

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
            this.display = 'servicio'

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
          this.display = res.causal

        })
      }

    })
    this.router.navigate([], {
      queryParams: {
        'evento': null,
        'tienda': null,
        'id': '36c267ac6e0449118fe77fc7319546d3b218459a2070ef079b200ffb4360e027'
      },
      queryParamsHandling: 'merge'
    })

  }
  // this.results.unshift(event);



  save_id() {
    localStorage.setItem('id_sorteo', this.id_sorteo)
    localStorage.setItem('tienda', this.id_tienda)


    this.postForm = {
      "tienda": this.id_tienda,
      "nombre": this.clientForm.value.name,
      "correo": this.clientForm.value.email,
      "celular": this.clientForm.value.cellphone,
      "cedula": this.clientForm.value.identification,
      "como_se_entero": this.clientForm.value.canal
    }
    this.fs.sendForm(this.id_sorteo, this.postForm).subscribe(
      (res: any) => {
        if (res.causal == 'INTENTOS_AGOTADOS') {
          this.display = 'servicio'
          localStorage.setItem('nuevo_intento', 'N')
        }
        else if (res.causal == 'SORTEO_NO_ENCONTRADO' || res.causal == 'SORTEO_NO_INICIADO' || res.causal == 'SORTEO_FINALIZADO') {
          this.display = res.causal
          localStorage.setItem('nuevo_intento', 'N')
        }
        else if (res.causal == 'GANO_PREMIO_MAYOR' && res.nuevo_intento == 'N') {
          Swal.fire({
            imageUrl: '/assets/premio_mayor.png',
            imageWidth: 350,
            title: '¡Felicidades!',
            text: 'Has encontrado un premio mayor, acércate a tu asesor para conocer tu premio',
            showCancelButton: false,
            confirmButtonText: 'Continuar',
            confirmButtonColor: '#D8232A'
          })
            .then((result) => {
              localStorage.setItem('nuevo_intento', res.nuevo_intento)
              this.display = 'servicio'

            })
        }
        else {
          localStorage.setItem('id_cliente', res.id_cliente)
          localStorage.setItem('primer_sorteo', res.causal)
          localStorage.setItem('nuevo_intento', res.nuevo_intento)
          this.router.navigate([], {
            queryParams: {
              'evento': null,
              'tienda': null,
              'id': '36c267ac6e0449118fe77fc7319546d3b218459a2070ef079b200ffb4360e027'
            },
            queryParamsHandling: 'merge'
          })
          this.display = 'scanner'
        }
        (e: any) => {
          console.error(e)
        }

      })


    //localStorage.setItem('formulario', 'ok')

  }

  get f() {
    return this.clientForm.controls
  }
  cambio_ubi(event: any) {
    console.log('   ', event)
    this.display = event
  }

}
