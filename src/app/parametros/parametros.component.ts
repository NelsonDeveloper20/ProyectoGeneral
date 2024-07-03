

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IApiResponse } from '../services/service.model';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { Toaster } from 'ngx-toast-notifications';
export interface ListasModel {
  isSelected: boolean;
  id: number;
  descripcion: string; 
  valor: string;
  isEdit: boolean;
}
export const UserColumns = [
  { key: 'id', type: 'label', label: 'ID', required: true },
  { key: 'nombre', type: 'text', label: 'Nombre', required: true },
  { key: 'isEdit', type: 'isEdit', label: 'Acción' }
];

export const parametroColumns = [
  { key: 'id', type: 'label', label: 'ID', required: true },
  { key: 'nombre', type: 'text', label: 'Nombre', required: true },
  { key: 'id_marca', type: 'select', label: 'Marca', required: true },
  { key: 'isEdit', type: 'isEdit', label: 'Acción' }
];
@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.component.html',
  styleUrls: ['./parametros.component.css']
})
export class ParametrosComponent implements OnInit {
  displayedColumns: string[] = UserColumns.map((col) => col.key);
  columnsSchema: any = UserColumns;

  
  displayedParametroColumns: string[] = parametroColumns.map((col) => col.key);
  columnsParametroSchema: any = parametroColumns;

  dataSourceVehiculo = new MatTableDataSource<any>();
  dataSourceMarca = new MatTableDataSource<any>();
  dataSourceModelo = new MatTableDataSource<any>(); 
  valid: any = {};

private urlBase: string; 
  constructor(public dialog: MatDialog,private toaster: Toaster,
    private spinner: NgxSpinnerService, private http: HttpClient) {
    
    this.urlBase = `${environment.baseUrl}/api/`;
  }

 
  ngOnInit() {
   this.listar();
  }
  
  getMarcas(): Observable<any> {
    return this.http.get(this.urlBase + 'marcas').pipe(
      map((response: any) => response.data.rows)
    );
  }
  getModelo(): Observable<any> {
    return this.http.get(this.urlBase + 'modelos').pipe(
      map((response: any) => response.data.rows)
    );
  }
  getTipoVehiculo(): Observable<any> {
    return this.http.get(this.urlBase + 'tipos').pipe(
      map((response: any) => response.data.rows)
    );
  }
  listMarcas:any=[];
  obtenerMarca(id: any) {
    const marca = this.listMarcas.find(item => item.id_marca === id);
    return marca ? marca.nombre : '';
  }
  listar(){
    this.spinner.show();
    this.getMarcas().subscribe(
      (res: any) => {
        this.listMarcas=res;
        this.spinner.hide();
        const result = [];
        res.forEach(item => {
          result.push({
            id: item.id_marca,
            nombre: item.nombre, 
            isEdit: false
          });
           

        });
        this.dataSourceMarca.data = result;
      },
      error => {
        this.spinner.hide();
        console.error('Error fetching marcas:', error);
      }
    );
    this.spinner.show();
    this.getModelo().subscribe(
      (res: any) => {
        this.spinner.hide();
        const result = [];
        res.forEach(item => {
          result.push({ 
            id: item.id_modelo,
            id_marca:item.id_marca,
            nombre: item.nombre,
            valor: "",
            isEdit: false
          });
        });
        this.dataSourceModelo.data = result;
      },
      error => {
        this.spinner.hide();
        console.error('Error fetching marcas:', error);
      }
    );
    
    this.spinner.show();
    this.getTipoVehiculo().subscribe(
      (res: any) => {
        this.spinner.hide();
        const result = [];
        res.forEach(item => {
          result.push({ 
            id: item.id_tipo,
            nombre: item.nombre,
            valor: "",
            isEdit: false
          });
        });
        this.dataSourceVehiculo.data = result;
      },
      error => {
        this.spinner.hide();
        console.error('Error fetching marcas:', error);
      }
    ); 
  }

  editRow(row: any, tabla: string) {
    if (row.id === 0) {
      this.addUser(row, tabla);
    } else {
      this.updateUser(row, tabla);
    }
    row.isEdit = false;
  }
  addRowMarca() {
    const newRow: any = {
      id: 0,
      nombre: '',
      isEdit: true,
      isSelected: false,
      valor: ''
    };
    this.dataSourceMarca.data = [newRow, ...this.dataSourceMarca.data];
  }

  addRowModelo() {
    const newRow: any = {
      id: 0,
      nombre: '',
      isEdit: true,
      isSelected: false,
      valor: ''
    };
    this.dataSourceModelo.data = [newRow, ...this.dataSourceModelo.data];
  }

  addRow() {
    const newRow: any = {
      id: 0,
      nombre: '',
      isEdit: true,
      isSelected: false,
      valor: ''
    };
    this.dataSourceVehiculo.data = [newRow, ...this.dataSourceVehiculo.data];
  }

  inputHandler(e: any, id: number, key: string) {
    if (!this.valid[id]) {
      this.valid[id] = {};
    }
    this.valid[id][key] = e.target.validity.valid;
  }

  disableSubmit(id: number) {
    if (this.valid[id]) {
      return Object.values(this.valid[id]).some((item) => item === false);
    }
    return false;
  }

  cancelar(element: any) {
    element.isEdit = !element.isEdit;
    this.listar();
  }
  updateUser(dato: any, tabla: string) {
    console.log("edicion");
    console.log(dato);
    let api = "";
    let body = {}; // Objeto para enviar en el cuerpo de la solicitud
    switch (tabla) {
      case "Marca":
        body = {
          id_marca: dato.id,
          nombre: dato.nombre
        };
        api = "marcas/update";
        break;
      case "Modelo":
        body = {
          id_modelo: dato.id,
          id_marca: dato.id_marca,
          nombre: dato.nombre
        };
        api = "modelos/update";
        break;
      case "Vehiculo":
        body = {
          id_tipo: dato.id,
          nombre: dato.nombre
        };
        api = "tipos/update";
        break;
    }
    this.spinner.show();
    console.log(body);
    this.http.put<IApiResponse>(`${this.urlBase}${api}`, body).subscribe(
      (response: IApiResponse) => {
        this.spinner.hide();
        this.toaster.open({
          text: "Modificado correctamente",
          caption: 'Mensaje',
          type: 'success',
          position:'top-right'
        }); 
        this.listar();
      },
      (error: any) => {
        console.error(error);
        this.toaster.open({
          text: 'Ocurrio un error: '+error,
          caption: 'Mensaje',
          type: 'danger',
        });
        this.spinner.hide();
        this.listar();
      }
    );
  }
  
  addUser(dato: any, tabla: string) {
    console.log("agregar");
    console.log(dato);
    let api = "";
    let body = {}; // Objeto para enviar en el cuerpo de la solicitud
    switch (tabla) {
      case "Marca":
        body = {
          id_marca: 0,
          nombre: dato.nombre
        };
        api = "marcas/register";
        break;
      case "Modelo":
        body = {
          id_modelo: 0,
          id_marca: dato.id_marca,
          nombre: dato.nombre
        };
        api = "modelos/register";
        break;
      case "Vehiculo":
        body = {
          id_tipo: 0,
          nombre: dato.nombre
        };
        api = "tipos/register";
        break;
    }
    console.log(body);
    this.spinner.show();
    this.http.post<IApiResponse>(`${this.urlBase}${api}`, body).subscribe(
      (response: IApiResponse) => {
        this.spinner.hide();
        this.toaster.open({
          text: "Agregado correctamente",
          caption: 'Mensaje',
          type: 'success',
          position:'top-right'
        }); 
        this.listar();
      },
      (error: any) => {
        this.toaster.open({
          text: 'Ocurrio un error: '+error,
          caption: 'Mensaje',
          type: 'danger',
        });
        console.error(error);
        this.spinner.hide();
        this.listar();
      }
    );
  }

  deleteUser(id: number, tabla: string) {
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
    let api = ""; 
    switch (tabla) {
      case "Marca": 
        api = "marcas";
        break;
      case "Modelo": 
        api = "modelos";
        break;
      case "Vehiculo": 
        api = "tipos";
        break;
    }
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
        this.listar();
      },
      (error: any) => {
        console.error(error);
        this.toaster.open({
          text: 'Ocurrio un error: '+error,
          caption: 'Mensaje',
          type: 'danger',
        });
        this.spinner.hide();
        this.listar();
      }
    );
  }
  });
  }

}