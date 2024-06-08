import { Component, OnDestroy, OnInit,Inject } from '@angular/core'; 
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus, RedirectRequest } from '@azure/msal-browser'; 
import { Subject, Subscription } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AzureAdDemoService } from './azure-ad-demo.service';
import { UsuarioService } from './services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Consulta de Solicitudes/Pedidos'; 
  isIframe = false; 

  loginDisplay = false;
  private readonly _destroying$ = new Subject<void>(); 
  isUserLoggedIn:boolean=false;
  userName?:string='';
  private readonly _destroy=new Subject<void>();
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGuardConfig:MsalGuardConfiguration,
  private msalBroadCastService:MsalBroadcastService,
  private authService:MsalService,private azureAdDemoSerice:AzureAdDemoService,
  private router: Router,
  private spinner: NgxSpinnerService,
  private toaster: Toaster,  
  private _Service: UsuarioService,

)
  {
 
  }
  
rutaImagen: string = '';
dominio:String="";
subscription: Subscription;
ngOnInit(): void {
  
  var login=JSON.parse(localStorage.getItem("userlog"));
  // Suscripción al método getIsLogin() del servicio
  //this.subscription = this.azureAdDemoSerice.getIsLogin().subscribe(isLoggedIn => {
    // Actualiza el valor de isLoggedIn cuando cambie el estado de inicio de sesión
    //this.isUserLoggedIn = isLoggedIn;
  //});
 
  this.dominio= window.location.hostname;  
//this.rutaImagen='https://tractocamiones.pe/wp-content/uploads/2020/11/Logo-png.png';
this.rutaImagen='../../assets/pngwing2.png'; 

if(login){
        this.isUserLoggedIn=true;
        this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
        this.router.navigate(['/Home-main']);
}
   /*
    this.msalBroadCastService.msalSubject$.pipe
    (filter(
      
      (msg: EventMessage) =>
        msg.eventType === EventType.LOGIN_SUCCESS ||
        msg.eventType === EventType.ACQUIRE_TOKEN_SUCCESS 
    ),
    takeUntil(this._destroy))
    .subscribe(async (result) =>
      {
        this.isUserLoggedIn=this.authService.instance.getAllAccounts().length>0; 
        if (result.payload) {
          localStorage.setItem('tokenMsal', (result.payload as any)['accessToken']);
          localStorage.setItem('idTokenMsal', (result.payload as any)['idToken']);
        }
        if(this.isUserLoggedIn)
        {
          this.userName = this.authService.instance.getAllAccounts()[0].name;
       //   console.log(this.authService.instance.getAllAccounts());
        // this.router.navigate(['/Home-main']);
        }
        this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
      }       ,
     () => {
      console.log('er');
     }
     
      
      ); 

  if(this.authService.instance.getAllAccounts().length<1){
    this.router.navigate(['/']);
  }else{
    this.isUserLoggedIn=true;
    //this.router.navigate(['/Home-main']);

  }*/
 
  } 
  ngOnDestroy(): void {
   this._destroy.next(undefined);
   this._destroy.complete();
   // Importante: desuscribirse cuando el componente se destruya para evitar fugas de memoria
   this.subscription.unsubscribe();
  }
  login()
  {
    this.iniciarSession();
    /*
    this.isUserLoggedIn=true;
    this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
    this.router.navigate(['/Home-main']);*/
    /*
    if(this.msalGuardConfig.authRequest)
    {
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest)
    }
    else
    {
      this.authService.loginRedirect();
    }*/
  }
  username: string = '';
  password: string = '';
  iniciarSession(){
    if (this.username && this.password) {      
      var requ={
        "username": this.username,
        "password": this.password,
        "captchaText": "string",
        "captchaToken": "string"
    };
    this.spinner.show();
    this._Service.Login(requ)
  .subscribe({
  next: response => {      
      this.spinner.hide();
      if (response.code === 200) {
        if(response.data){
          this.isUserLoggedIn=true;
          localStorage.setItem("userlog",JSON.stringify(response.data));
          this.azureAdDemoSerice.isUserLoggedIn.next(this.isUserLoggedIn);
          this.router.navigate(['/Home-main']);
      console.log("OOOOK");
      console.log(response);
        }
        
      } else {
        this.spinner.hide();	
        this.toaster.open({
          text: 'Usuario o contraseña incorrecto',
          caption: 'Mensaje',
          type: 'danger',
        });
      }
    },
    error: error => {
    this.spinner.hide();	
      var errorMessage = error.message;
      console.error('There was an error!', error); 
      this.toaster.open({
        text: errorMessage,
        caption: 'Ocurrio un error',
        type: 'danger',
       // duration: 994000 
      });
    }
  }
  );
      return;
    }else{
      this.toaster.open({
        text: 'Debe ingresar usuario y contraseña',
        caption: 'Mensaje',
        type: 'danger',
      });
    }
   
  }
  logout()
  {
    this.authService.logoutRedirect({postLogoutRedirectUri:environment.authRedirectUri});
  }


//end
panelOpenState = true;  

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
 