import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { ComponenteService } from 'src/app/services/componente.service'; 
import Swal from 'sweetalert2';
@Component({
  selector: 'app-asignacion-dialog',
  templateUrl: './asignacion-dialog.component.html',
  styleUrls: ['./asignacion-dialog.component.css']
})
export class AsignacionDialogComponent implements OnInit {

  IdComponente=2;
  Nombre="";
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private toaster: Toaster,
    private dialogRef: MatDialogRef<AsignacionDialogComponent>,
    private spinner: NgxSpinnerService,  
    private _componenteService:ComponenteService,  ) {
      this.IdComponente = data.idrol;
      this.Nombre=data.Modulo;
      console.log("DATA RECIBIDO:");
      console.log(data);
      this.ObtenerModulosPorRol();
     }

  ngOnInit(): void {
    this.ObtenerModulosPorRol();
  }
  
       
  close() {
    this.dialogRef.close();
  }

  dataSource: any[] = [];
  displayedColumns: string[] = ['Id', 'Modelo', 'Asignado'];  
  listComponenteModelos:any=[];
  ObtenerModulosPorRol() { 
    this.spinner.show();
    this._componenteService.ListarcomponentesAsignacion(this.IdComponente)
      .subscribe(
        data => {          
          this.spinner.hide();
          if(data.status==200){ 
            this.listComponenteModelos=data.json; 
            this.dataSource = this.listComponenteModelos;
          }
        },
        error => {
          this.spinner.hide();
          console.error('Error al obtener el detalle del grupo:', error);
        }
      );
  }  
  save(): void {
    const jsonData = JSON.stringify(this.dataSource);
    console.log(jsonData);
    this.spinner.show();
    this._componenteService.AgregarModuloRol(this.IdComponente,jsonData)
      .subscribe({
        next: response => {
          this.spinner.hide();
          if (response.status == 200) { 
                const respuesta = response.json.respuesta;
                const id = response.json.id; 
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
                this.dialogRef.close(requests);
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
  listComponente:any=[];
  ListarComponentes(){
    this.spinner.show();
    this._componenteService.getComponentes()
      .subscribe(
        (response) => {
          this.spinner.hide();
          if(response.code==200){
              this.listComponente=response.data.rows; 
              
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  } 
  
}
