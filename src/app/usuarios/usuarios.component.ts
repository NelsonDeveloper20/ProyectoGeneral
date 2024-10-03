import { Component, OnInit ,ViewChild} from '@angular/core';
//back 
 
import { Toaster } from 'ngx-toast-notifications';
import { RequestService } from '../services/request.service';
import {Location} from '@angular/common';
//import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table'; 
import { NgxSpinnerService } from 'ngx-spinner';
//POP
import { RolUsuarioResponse, User, Usuario } from './users.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RegistrarUsuarioComponent } from './registrar-usuario/registrar-usuario.component';
import {ModificarUsuarioComponent } from './modificar-usuario/modificar-usuario.component';
import {Dialog_userComponent } from './dialog_user.component';
import { MatSidenav } from '@angular/material/sidenav';
import { IUsersResponse } from '../services/user.model';
import { ComponenteService } from '../services/componente.service';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from '../services/service.model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { AsignacionDialogComponent } from './asignacion-dialog/asignacion-dialog.component';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  displayedColumns = ['id', 'Componente','Modelo',  'Accion'  ]; 
  message?: string;
  typeMessage = 'danger';  
usuario: Usuario[] = [];

dataSourceComponente:any = new MatTableDataSource<any>([]); 
    searchs!:'';
    @ViewChild(MatPaginator) paginator!: MatPaginator; 
    @ViewChild(MatSort) sort!: MatSort;
    
       
 

private urlBase: string; 
    constructor( private toaster: Toaster,
      private spinner: NgxSpinnerService,
      private requestService: RequestService,private _location: Location,
      private dialog: MatDialog,
      private _componenteService:ComponenteService, private http: HttpClient
    ) { // Create 100 users
     
    this.urlBase = `${environment.baseUrl}/api/`;
     
    }
    
    backClicked() {
      this._location.back();
    }
    ngOnInit(): void {  
      
    this.ObtenerModulosPorRol();
   this.ListarComponentes();
   this.ObtenerModulosPorRol();
    } 
rolesToString(roles: RolUsuarioResponse[]): string {
  return roles.map(rol => rol.rol.nombre).join(', ');
}
unidadToString(roles: RolUsuarioResponse[]): string {
  return roles.map(rol => rol.sede.descripcion).join(', ');
}
  
   
    
 
  
    openRegisterComponenteModelo(): void {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
  
      const dialogRef = this.dialog.open(AsignacionDialogComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe({
        next: data => {   
         if (data) { 
          this.toaster.open({
            text: `Se registro al usuario ${data.correo}.`,
            caption: 'Mensaje',
            type: 'success',
            position:'bottom-right'
          });

//init
 
          //end
          this.ObtenerModulosPorRol();
        } 
      },
      error: error => { 
          var errorMessage = error.message;
          console.error('There was an error!', error); 
          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrio un error',
            type: 'danger',
          });
        }
      });
    }


     //USUARIO
     openRegisterUser(): void {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width="450px"; 
    dialogConfig.data = {nombre:"",idcomponente:0};
      const dialogRef = this.dialog.open(RegistrarUsuarioComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe({
        next: data => {   
         if (data) { 
          this.toaster.open({
            text: `Se registro al usuario ${data.correo}.`,
            caption: 'Mensaje',
            type: 'success',
            position:'bottom-right'
          });

          this.ObtenerModulosPorRol();
//init
 
          //end
        } 
      },
      error: error => { 
          var errorMessage = error.message;
          console.error('There was an error!', error); 
          this.toaster.open({
            text: errorMessage,
            caption: 'Ocurrio un error',
            type: 'danger',
          });
        }
      });
    }
    
  openEditUser(element: any// User
    ): void {  
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width="450px"; 
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true; 
    dialogConfig.data = {nombre:element.nombre,idcomponente:element.id_componente};
    const dialogRef = this.dialog.open(RegistrarUsuarioComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
       
        this.toaster.open({
          text: `Usuario modificado correctamente`,
          caption: 'Mensaje',
          type: 'success',
          position:'bottom-right'
        });
       // this.getuser();
      this.ObtenerModulosPorRol();
      } 
    });
  }

  
  @ViewChild('sidenav') sidenav!: MatSidenav; 
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
 //NUEVOS HTMLS
 
  
 checkUncheckAll(event: any) {
  var checkboxes = document.getElementsByTagName('input');
  if (event.target.checked) {
      for (var i = 0; i < checkboxes.length; i++) {
          if (checkboxes[i].type == 'checkbox') {
              checkboxes[i].checked = true;
          }
      }
  } else {
      for (var i = 0; i < checkboxes.length; i++) { 
          if (checkboxes[i].type == 'checkbox') {
              checkboxes[i].checked = false;
          }
      }
  }
}


 

displayedColumns2 = ['id', 'Componente', 'Accion'  ]; 
listComponente:any=[];
ListarComponentes(){
  this.spinner.show();
  this._componenteService.getComponentes()
    .subscribe(
      (response) => {
        this.spinner.hide();
        if(response.code==200){
            this.listComponente=response.data.rows; 
            this.dataSourceComponente= new MatTableDataSource<any>(this.listComponente);
        }
      },
      () => {
        this.spinner.hide();
      }
    );
} 

AgregarComponenteModelos(){
  this.spinner.show(); 
  var body = {
    id_componente_modelo: 0,
    id_componente: 1,
    id_modelo: 1
  };
  this.http.post<IApiResponse>(`${this.urlBase}componenteModelo/register`, body).subscribe(
    (response: IApiResponse) => {
      this.spinner.hide();
      this.toaster.open({
        text: "Agregado correctamente",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      }); 
      this.ObtenerModulosPorRol();
    },
    (error: any) => {
      this.toaster.open({
        text: 'Ocurrio un error: '+error,
        caption: 'Mensaje',
        type: 'danger',
      });
      console.error(error);
      this.spinner.hide();
      this.ObtenerModulosPorRol();
    }
  );
}
deleteComponenteModelo(id: number) {
  Swal.fire({
    title: '¿Estás seguro de eliminar?',
    text: 'Esta acción no se puede revertir',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
  let api = "componenteModelo";  
  this.spinner.show();
  this.http.delete<IApiResponse>(`${this.urlBase}` + api+"/"+id).subscribe(
    (response: IApiResponse) => {
      this.spinner.hide();
      this.toaster.open({
        text: "Eliminado correctamente",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      }); 
      this.ObtenerModulosPorRol();
    },
    (error: any) => {
      console.error(error);
      this.toaster.open({
        text: 'Ocurrio un error: '+error,
        caption: 'Mensaje',
        type: 'danger',
      });
      this.spinner.hide();
      this.ObtenerModulosPorRol();
    }
  );
}
});
}

createComponent(id:any){

}
//////

IdComponente=2;
Nombre="";

     
close() {
 
}

dataSource2: any[] = []; 
displayedColumns22: string[] = ['Id', 'Modelo', 'Asignado'];  
listComponenteModelos:any=[];
ObtenerModulosPorRol() { 
  this.spinner.show();
  this._componenteService.ListarcomponentesAsignacion(this.IdComponente)
    .subscribe(
      data => {          
        this.spinner.hide();
        console.log("RESULTADO COMPONNTES MODULO");
        console.log(data);
        if(data.code==200){ 
          this.listComponenteModelos=data.data.rows; 
          this.dataSource2   =  this.listComponenteModelos; 
        }
      },
      error => {
        this.spinner.hide();
        console.error('Error al obtener el detalle del grupo:', error);
      }
    );
}  
save(): void {
  if(!this.dataSource2){
    return;
  }
  const jsonData = this.dataSource2; // Sin JSON.stringify
  //const jsonData = JSON.stringify(this.dataSource2);
  console.log(jsonData);
  console.log(this.IdComponente);
  console.log("RESULTADO DEEE:::::::::.");
  
  this.spinner.show();
  this._componenteService.AgregarModuloRol(this.IdComponente,jsonData)
    .subscribe({
      next: response => {
        this.spinner.hide();
        console.log("RESULT");
        console.log(response);
        if (response.code == 200) {  
          this.ObtenerModulosPorRol();
              Swal.fire({
              title: 'Mensaje',
              text: 'Operacion realizada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false
              }); 
              var requests={
              agegados:"OK"
              }; 
          }else{
            this.toaster.open({
              text: 'Ocurrio un error',
              caption: 'Ocurrio un error',
              type: 'danger',
              // duration: 994000
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
    });

  // Aquí puedes hacer lo que necesites con el JSON, como enviarlo a un servicio o mostrarlo en la consola.
}
isAssigned(value: number): boolean {
  return value === 1;
}
toggleAssigned(element: any): void {
  element.asignado = element.asignado === 1 ? 0 : 1;
}
onComponenteChange(event: any) {
  const selectedValue = event.target.value;
  console.log('Componente seleccionado:', selectedValue);
  this.IdComponente=selectedValue;
this.ObtenerModulosPorRol();
  // Puedes agregar lógica adicional aquí.
}

  }

  
  
  