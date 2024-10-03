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
  
  nombre: string = '';
  idcomponente: number = 0;
  private urlBase: string;
  constructor(private toaster: Toaster,private httpClient: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private dialogRef: MatDialogRef<RegistrarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) data: any, 
  ) { 
    this.urlBase = `${environment.baseUrl}/api/`; 
    console.log("resultss::::::");
    console.log(data);
     
     // Asignar los datos recibidos del diálogo
     this.nombre = data?.nombre || ''; // Nombre inicial del componente
     this.idcomponente = data?.idcomponente || 0; // ID inicial del componente
  }

  ngOnInit(): void { 
    console.log('ID Componente:', this.idcomponente);
    console.log('Nombre Componente:', this.nombre);
  }
 
  save(): void {
    if(!this.nombre){
      
      this.toaster.open({
        text: 'Ingrese nombre del componente',
        caption: 'Ocurrio un error',
        type: 'danger',
      });
      return;
    }
    this.spinner.show();
  
    const request = {
      id_componente: this.idcomponente,
      nombre: this.nombre,
    };
    if(this.idcomponente==0){

      this.userService.registerComponente(request).subscribe((response) => {
        this.spinner.hide();
        console.log("mensaje addd");
   console.log(response);
        if (response.code === 200) {
          if(response.messages=="Registro realizado correctamente."){
            this.dialogRef.close(request);            
            this.toaster.open({
              text: "Registrado correctamente",
              caption: 'Mensaje',
              type: 'success',
              position:'top-right'
            }); 
          }else {
            this.toaster.open({
              text: 'Ya existe un usuario con el correo ingresado',
              caption: 'Ocurrio un error',
              type: 'danger',
            });
          }
        } else{
          
          this.toaster.open({
            text: 'Ocurrio un error',
            caption: 'Ocurrio un error',
            type: 'danger',
          });
        }
      });
    }else{
      
    this.userService.UpdateComponente(request).subscribe((response) => {
      this.spinner.hide();
 
      console.log("mensaje upppdate");
      console.log(response);
      if (response.code === 200) { 
        if(response.messages=="Registro actualizado correctamente."){
          this.dialogRef.close(request);            
          this.toaster.open({
            text: "Actualizado correctamente",
            caption: 'Mensaje',
            type: 'success',
            position:'top-right'
          }); 
        }else {
          this.toaster.open({
            text: 'Ocurrio un error',
            caption: 'Ocurrio un error',
            type: 'danger',
          });
        }
      } else {
        this.toaster.open({
          text: 'Ocurrio un error',
          caption: 'Ocurrio un error',
          type: 'danger',
        });
      }
    });
    }
  }
       
  close() {
    this.dialogRef.close();
  }

   

} 
