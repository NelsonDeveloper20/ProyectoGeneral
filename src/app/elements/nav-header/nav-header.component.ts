import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../shared.service';
import { HostListener } from '@angular/core';

import { Toaster } from 'ngx-toast-notifications';
//main
import { environment } from 'src/environments/environment';

import { MatSidenav } from '@angular/material/sidenav';
import { AzureAdDemoService } from 'src/app/azure-ad-demo.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Profile } from 'src/app/profile.model';
import { MsalService } from '@azure/msal-angular';
import { NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from 'src/app/services/auth.service';
import { filter, finalize } from 'rxjs/operators';
import { SharedunidadService } from 'src/app/sharedunidad.service';

interface MenuList {
  id: number;
  nombre: string;
  descripcion: string;
  route: string;
  icon: string;
  tipo: string;
}

const ELEMENT_DATA: MenuList[] = [
  { id: 1, nombre: 'Inicio', descripcion: 'descrip', route: "Home-main", icon: "home", tipo: "" },
  { id: 2, nombre: 'OP. Con Nota de Crédito', descripcion: 'descrip', route: "CN-NotaCredito", icon: "receipt", tipo: "" },
  { id: 3, nombre: 'OP. Sin Nota Crédito', descripcion: 'descrip', route: "SN-NotaCredito", icon: "drive_eta", tipo: "" },
  { id: 3, nombre: 'Solicitudes', descripcion: 'descrip', route: "SolicitudAdv", icon: "markunread_mailbox", tipo: "" },
  { id: 3, nombre: 'Consultas', descripcion: 'descrip', route: "SolicitudPendiente", icon: "markunread_mailbox", tipo: "" },
  { id: 3, nombre: 'Historial Solicitudes', descripcion: 'descrip', route: "Historial-Solicitud", icon: "view_list", tipo: "" },
  { id: 3, nombre: 'Usuarios', descripcion: 'descrip', route: "Usuarios", icon: "supervised_user_circle", tipo: "" },
  { id: 3, nombre: 'Parametros', descripcion: 'descrip', route: "Parametros", icon: "confirmation_number", tipo: "" },
  { id: 3, nombre: 'Reporte', descripcion: 'descrip', route: "Reporte-NC", icon: "donut_small", tipo: "" }
];
@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css'],
})
export class NavHeaderComponent implements OnInit {

  roles: string[] = [];// ['admin']; // Ejemplo de roles del usuario
  //main
  elementosMenu: MenuList[] = [];

  UserLogin = false;
  //@Input() isUserLogged = false;
  @Input()
  set isUserLogged(value: boolean) {
    this.UserLogin = value;
  }
  profile?: Profile;
  profilePic?: SafeResourceUrl;


  isUserLoggedIn:boolean=true;
  @ViewChild('sidenav') sidenav!: MatSidenav;
  hamburgerClass: boolean = true;
  screenHeight: any;
  screenWidth: any;

  UnidadSelected: any = 'Seleccione'; 
  unidadesUser:any;
  disableSelect = false;
  constructor(private sharedService: SharedService,
    private sharedServiceUnidad: SharedunidadService,
    //aazure
    private router: Router,
    private azureAdDemoService: AzureAdDemoService,
    private domSanitizer: DomSanitizer,
    private authService: MsalService,//api
    private spinner: NgxSpinnerService,
    private authServiceApi: AuthService, private toaster: Toaster,
    private azureAdDemoSerice:AzureAdDemoService,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkRoutes(event.url);
    });
    this.getScreenSize();
  }
  checkRoutes(url: string) {
     var urlcomponent=url;
    // Aquí puedes definir las rutas en las que quieres deshabilitar el mat-select 
    var urlcomponent=url;
    let textoBuscado = "/item"; 
    // Utilizando includes()
    if (urlcomponent.includes(textoBuscado)) { this.disableSelect = true;
    } else {
      this.disableSelect = false;
    }
  }
  onUnidadSelected() {
    // Aquí puedes ejecutar cualquier acción que desees cuando cambie la unidad seleccionada
    console.log('Unidad seleccionada:', this.UnidadSelected);
  }
  selected(valor:any){   
    if(valor=="Seleccione"){
      localStorage.removeItem('unselected_');
      this.sharedServiceUnidad.emitirUnidadSeleccionada(valor.descripcion);
    }else{

      var unidad=valor.descripcion;
      localStorage.setItem('unselected_',unidad); 
  this.sharedServiceUnidad.emitirUnidadSeleccionada(valor.descripcion);
    }
  }
  onUnidadSelecteds() {
    
    // Aquí puedes ejecutar cualquier acción que desees cuando cambie la unidad seleccionada
    console.log('Unidad seleccionada:', this.UnidadSelected);
  }
  ngOnInit(): void { 
    /*
    if (this.UserLogin == true) {
      this.spinner.show();
      this.getProfile();
      this.authServiceApi
        .getTokenJlr()
        .pipe(
          finalize(() => {
            this.spinner.hide();
          })
        )
        .subscribe((response) => {
          if (response.status === 200) { 
            const userRol = JSON.parse(JSON.stringify(response.json)).user;
            var roles = userRol.roles;
            localStorage.setItem('RolsUser', `${JSON.stringify(roles)}`);
            this.authServiceApi.setTokenJrl(response?.json);
            //this.roles.push(response?.json.rol.toLowerCase());

            //OBTENER UNIDADES DE NEGOCIO ASIGNADOS AL USUARIO
const jsonString = localStorage.getItem('RolsUser'); 
if (jsonString) { 
  const jsonObject = JSON.parse(jsonString); 
  const unidades = []; 
  jsonObject.forEach(element => { 
    // Verificar si la unidad ya está en el arreglo unidades
    const unidadExiste = unidades.some(item => {
      return item.descripcion.toLowerCase() === element.unidad.descripcion.toLowerCase();
    });

    // Si la unidad no existe en el arreglo unidades, agregarla
    if (!unidadExiste) {
      unidades.push(element.unidad);
    }  
  });     

  this.unidadesUser = unidades;  

  if(this.unidadesUser.length==1){     
    var unidad=unidades[0].descripcion;
    localStorage.setItem('unselected_',unidad); 
    this.UnidadSelected=unidades[0];
  }
  
  const unidadLocal = localStorage.getItem('unselected_'); 
  if(unidadLocal){

    const unidadExiste = unidades.filter(item => {
      return item.descripcion.toLowerCase() === unidadLocal.toLowerCase();
    }); 
    this.UnidadSelected=unidadExiste[0];
  }

}

            this.filtrarElementosMenu();
            this.router.navigate(['/Home-main']);
          } else {

            this.toaster.open({
              text: "Usuario no encontrado en la base de datos",
              caption: 'Mensaje',
              type: 'danger',
              position: 'top-right'
            });
            this.UserLogin = false;// true;

            //this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);

            // this.authService.loginRedirect();
            // this.router.navigate(['/']);
          }
        });
    }*/
    
    this.filtrarElementosMenu();
  }
  filtrarElementosMenu() {
    try {
      const rolesPermitidos = {
       /* admin: ['Inicio', 'OP. Con Nota de Crédito', 'OP. Sin Nota Crédito',
          'Solicitudes', 'Historial Solicitudes', 'Usuarios', 'Parametro',
          'Solic. Pendiente', 'Reporte NC'
        ],
        */
        admins: ['Inicio',   'Usuarios', 'Parametros',
        'Consultas', 'Reporte'
      ],
        asesor: ['Inicio', 'Solicitudes', 'Historial Solicitudes',
          //inician solicitudes
          'OP. Con Nota de Crédito', 'OP. Sin Nota Crédito',
          'Solic. Pendiente'
        ],
        adv: ['Inicio', 'Solicitudes', 'Historial Solicitudes',
          'Solic. Pendiente',
          //inician solicitudes
          //inician solicitudes
          'OP. Con Nota de Crédito', 'OP. Sin Nota Crédito',
        ],
        cumplimiento: ['Inicio', 'Solicitudes', 'Historial Solicitudes',
          'Solic. Pendiente'],
        contabilidad: ['Inicio', 'Solicitudes', 'Historial Solicitudes',
          'Solic. Pendiente','Reporte NC'],
        gerencia: ['Inicio', 'Solicitudes', 'Historial Solicitudes',
          'Solic. Pendiente',],
        jefatura: ['Inicio', 'Solicitudes', 'Historial Solicitudes',
          'Solic. Pendiente',],
        tesorería: ['Inicio', 'Solicitudes', 'Historial Solicitudes','Solic. Pendiente', 'Reporte NC'],

        'contabilidad epdp': ['Inicio', 'Solicitudes', 'Historial Solicitudes', 'Solic. Pendiente']
      };
    
      const role =["admins"]; 
      if (role.includes('admin')) {
        this.elementosMenu = ELEMENT_DATA;
        this.roles = ['Admin'];
      } else {

        this.roles = role;
        this.elementosMenu = ELEMENT_DATA.filter(item => {
          return rolesPermitidos[role[0]].includes(item.nombre);
        });
      }

    } catch (error) {
    }
  }
  getProfile() {
    this.azureAdDemoService.getUserProfile()
      .subscribe(profileInfo => {
        this.profile = profileInfo;         
        localStorage.setItem('UserLog', profileInfo.displayName);
      })
  }
  logout() { 
    
    sessionStorage.removeItem("userlog");
    this.isUserLoggedIn=false;
    this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
    //this.router.navigate(['/Home-main']); 
    this.router.navigate(['/']);
    //this.authService.logout();

   // this.authService.logoutRedirect({ postLogoutRedirectUri: environment.authRedirectUri });
  }
  toggleHamburgerClass() {
    this.hamburgerClass = this.sharedService.toggleHamburgerClass();
  }

  @HostListener('window:resize', ['$event'])
  getScreenSize() {
    this.screenHeight = window.innerHeight;
    this.screenWidth = window.innerWidth;
    const div = document.getElementById('main-wrapper');
    if (this.screenWidth < 768) {
      document.body.setAttribute('data-sidebar-style', 'overlay');
    } else if (this.screenWidth >= 768 && this.screenWidth <= 1023) {
      document.body.setAttribute('data-sidebar-style', 'mini');
    } else {
      document.body.setAttribute('data-sidebar-style', 'full'); // full
    }
  }
  WasiBI() {
  }
  //menu

  isExpanded = true;
  showSubmenu: boolean = false;
  isShowing = false;
  showSubSubMenu: boolean = false;

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
}
