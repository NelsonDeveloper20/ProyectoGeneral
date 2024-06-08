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


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  displayedColumns = ['id', 'Nombre','Correo', 'Estado', 'Rol','Accion'

  ]; 
  message?: string;
  typeMessage = 'danger'; // success
//usuario: Array<UsuariosResponse> = [];

//usuario: Array<Usuario> = [];
usuario: Usuario[] = [];
dataSource:any = new MatTableDataSource<any>([]);
//   dataSource:any = new MatTableDataSource<any>([]); //dataSource: MatTableDataSource<UserData>;
    searchs!:'';
    @ViewChild(MatPaginator) paginator!: MatPaginator; 
    @ViewChild(MatSort) sort!: MatSort;
    
    constructor( private toaster: Toaster,
      private spinner: NgxSpinnerService,
      private requestService: RequestService,private _location: Location,
      private dialog: MatDialog,
    ) { // Create 100 users
     
     
    }
    
    backClicked() {
      this._location.back();
    }
    ngOnInit(): void {  
      
    // this.getuser();
   
    } 
rolesToString(roles: RolUsuarioResponse[]): string {
  return roles.map(rol => rol.rol.nombre).join(', ');
}
unidadToString(roles: RolUsuarioResponse[]): string {
  return roles.map(rol => rol.sede.descripcion).join(', ');
}
    listar(){
      this.getuser();
    } 
    getuser(){ 
     this.spinner.show();
     this.requestService.getusuarios().subscribe(
      (response: IUsersResponse) => {
        this.spinner.hide();
        this.usuario = response;  

        this.dataSource = new MatTableDataSource<any>(this.usuario);
      },
      () => {
        this.spinner.hide();
      }
    );

    } 
     ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    buscar(event: Event){ 
      const filtro= (event.target as HTMLInputElement).value;
      this.dataSource.filter= filtro.trim().toUpperCase();
  
  }
    applyFilter(filterValue: string) {
      
      filterValue = filterValue.trim(); // Remove whitespace
      filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
      this.dataSource.filter = filterValue;
    }
     //USUARIO
     openRegisterUser(): void {
      const dialogConfig = new MatDialogConfig();
  
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
  
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

//init
 
          //end
          this.getuser();
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
    
  openEditUser(element: Usuario// User
    ): void {  
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = element;

    const dialogRef = this.dialog.open(ModificarUsuarioComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
       
        this.toaster.open({
          text: `Usuario modificado correctamente`,
          caption: 'Mensaje',
          type: 'success',
          position:'bottom-right'
        });
       // this.getuser();
      } 
      this.getuser();
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



  }

  
  
  