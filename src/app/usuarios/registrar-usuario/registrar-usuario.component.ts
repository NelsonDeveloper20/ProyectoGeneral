import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileType } from 'src/app/services/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { IAgregarUsuarioRequest } from 'src/app/services/user.model';
import { UserService } from 'src/app/services/user.service';
import { AgregarUsuario, RolUsuario, Roles, Sedes, UnidadNegocioS, User, Usuario } from '../users.model';
//forms
import { Toaster } from 'ngx-toast-notifications';

import { IUsuario } from './usuario.model'
import { FormGroup, FormControl, FormArray } from '@angular/forms'  
import {FormBuilder, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { IApiResponse } from 'src/app/services/service.model';
import { environment } from 'src/environments/environment';

export const UserColumns = [ 
  {
    key: 'RolId',
    type: 'select',
    label: 'Rol',
    required: true,
  },
  {
    key: 'IdUnidadNegocio',
    type: 'select',
    label: 'UnidadNegocio',
  },
  {
    key: 'IdSede',
    type: 'select',
    label: 'Sede',
  }, 
  {
    key: 'isEdit',
    type: 'isEdit',
    label: '',
  },
];

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
  
  @ViewChild(MatSort) sort: MatSort;
  //user: AgregarUsuario = { rol: "" }; 
  users: AgregarUsuario = { rol: "" };
  roles: Roles = [];
  sede: Sedes = [];
  unidadNegocio: UnidadNegocioS = [];
  profile: ProfileType = {};
  subAccion: string = '';
  message: string = '';
  
  isLinear = false;
  firstFormGroup = this._formBuilder.group({
    usuario: ['', Validators.required],
    nombre: ['', Validators.required],
    ruc: ['', Validators.required],
    razonSocial: ['', Validators.required], 
    
  });

  
  dataSource = new MatTableDataSource<RolUsuario>();  
  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns; 
  
  private urlBase: string;
  constructor(private toaster: Toaster,private httpClient: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<RegistrarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) data: Usuario,
//Form user
    private fb:FormBuilder, 
   private _formBuilder: FormBuilder
  ) {
    this.profile = this.authService.getProfile();
    this.urlBase = `${environment.baseUrl}/api/`; 
  }

  ngOnInit(): void { 
     
    this.userService.getRoles().subscribe((response) => {
      this.roles = response;
    });  
    this.userService.getUnidadNegocio().subscribe((response) => {
      this.unidadNegocio = response;
    });  
    
    this.userService.getSede().subscribe((response) => {
      this.sede = response;
    });  
    this.addRow();
  }
 
  save(): void {
    this.spinner.show();
    let roles: Array<number> = [];
    if (!!this.users.rol)
    {
      roles = [parseInt(this.users.rol)];
    }
    const request: IAgregarUsuarioRequest = {
      nombre: this.users.nombre,
      correo: this.users.correo,
      roles,
      usuario: this.profile.userPrincipalName,
      idUnidadNegocio:this.users.idUnidadNegocio
    };
    this.userService.registerUser(request).subscribe((response) => {
      this.spinner.hide();
 
      if (response.status === 200) {
        this.dialogRef.close(request);
      } else {
        this.toaster.open({
          text: 'Ya existe un usuario con el correo ingresado',
          caption: 'Ocurrio un error',
          type: 'danger',
        });
      }
    });
  }
       
  close() {
    this.dialogRef.close();
  }

  
  someMethod(value: any, element: any, elem:any) {
    if(elem=="Rol"){
      element.RolId = value;
    }else if(elem=="UnidadNegocio"){
    element.IdUnidadNegocio = value;
    }else{
      element.IdSede = value;
    }
  } 
  
  eliminar(id:number, _idDelete:string){  
    if(_idDelete!=="0"){
    this.dataSource.data = this.dataSource.data.filter(
      (u: RolUsuario) => u.idDelete !== _idDelete
    );

  }else{
 
  } 
  }
  
maxID:number=0;
addRow() { 
    
  var idNext="";
  if(this.dataSource.data.length<1){
      this.maxID++;
      idNext= "N"+this.maxID;
  }
  else{
    this.maxID=this.dataSource.data.reduce((max, b) => Math.max(max, b.Id), this.dataSource.data[0].Id);
    this.maxID++;
    idNext= "N"+this.maxID;
  }  

  const newRow: RolUsuario = { 
    Id: this.maxID,
    UsuarioId:0,
    RolId:0,
    UsuarioCreacion: '',
    FechaCreacion: '',
    UsuarioModificacion: '',
    FechaModificacion: '',
    IdUnidadNegocio: 0,
    IdSede:0,
    isSelected: false,
    idDelete: idNext
  };
  this.dataSource.data = [newRow, ...this.dataSource.data];
  this.order();
}
order(){
  this.dataSource.sort = this.sort;
  const sortState: Sort = {active: 'Id', direction: 'asc'};
  this.sort.active = sortState.active;
  this.sort.direction = sortState.direction;
  this.sort.sortChange.emit(sortState);
}
 
hasDuplicates(array: any[], properties: string[]): boolean {
  return array.some((item, index) => {
    const hasDuplicate = array.findIndex(i => {
      return properties.every(property => i[property] === item[property]);
    }) !== index;
    
    return hasDuplicate;
  });
}
submitform(){  
  
if(this.users.nombre==undefined || this.users.nombre==""){  
  this.toaster.open({
    text: 'Ingrese nombre',
    caption: 'Ocurrio un error',
    type: 'danger',
  });
  return;
}
if(this.users.correo==undefined || this.users.correo==""){  
  this.toaster.open({
    text: 'Ingrese correo',
    caption: 'Ocurrio un error',
    type: 'danger',
  });
  return;
}
  var jsonData=JSON.parse(JSON.stringify(this.dataSource.data));
  
if(jsonData.length<1){
  this.toaster.open({
    text: "Debe agregar roles y unidades de negocio",
    caption: 'Mensaje',
    type: 'warning',
    position:'top-right'
  }); 
  return;
}
var errores="OK";

jsonData.forEach(element => {
    
    if(element.RolId==0 ||  element.IdUnidadNegocio==0 ||  element.IdSede==0){
      this.toaster.open({
        text: "Debe seleccionar items en la fila agregada",
        caption: 'Mensaje',
        type: 'warning',
        position:'top-right'
      }); 
      errores="NO OK";
      return;
    } 
  });
  if(errores=="OK"){
const propertiesToCheck = ['RolId', 'IdUnidadNegocio', 'IdSede'];
var hasDuplicatesByProperties = this.hasDuplicates(jsonData, propertiesToCheck);
if(hasDuplicatesByProperties==true){
  this.toaster.open({
    text: "Evite filas duplicados",
    caption: 'Mensaje',
    type: 'warning',
    position:'top-right'
  }); 
  return; 
}else{
  
  this.spinner.show();
  let roles: Array<number> = [];
  if (!!this.users.rol)
  {
    roles = [parseInt(this.users.rol)];
  }
  const request: IAgregarUsuarioRequest = {
    nombre: this.users.nombre,
    correo: this.users.correo,
    roles,
    usuario: this.profile.userPrincipalName,
    idUnidadNegocio:this.users.idUnidadNegocio
  };
/*
  
  this.userService.registerUser(request).subscribe((response) => {
    this.spinner.hide();

    if (response.status === 200) {
      this.dialogRef.close(request);
    } else {
      this.toaster.open({
        text: 'Ya existe un usuario con el correo ingresado',
        caption: 'Ocurrio un error',
        type: 'danger',
      });
    }
  });*/

    this.spinner.show();  
    const formData_ = new FormData();  
    formData_.append('nombre',this.users.nombre);
    formData_.append('correo',this.users.correo);
    formData_.append('usuario',this.profile.userPrincipalName); 
    formData_.append('DatosFoms',JSON.stringify(jsonData));     
  this.httpClient.post<IApiResponse>(this.urlBase + 'users', formData_)
  .subscribe({
  next: data => {      
    if(data.status==200){  
      this.dialogRef.close(request); 
      /*this.toaster.open({
        text: "Guardado correctamente",
        caption: 'Mensaje',
        type: 'success',
        position:'top-right'
      }); 
      this.spinner.hide();	 */
    }else{      
      this.spinner.hide();	 
        this.toaster.open({
          text: 'Ya existe un usuario con el correo ingresado',
          caption: 'Ocurrio un error',
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
  });
     
}


  } 

}
}
