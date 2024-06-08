import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { RegistroVehicularService } from 'src/app/services/registrovehicular.service';
export interface Componente {
  id_componente: number;
  nombre: string;
  estado: number;
  id_usuario_registro: number;
  fecha_registro: string;
  usuario_modificacion: string | null;
  fecha_modificacion: string | null;
  seleccionado: boolean; // Agregamos una propiedad para rastrear si el componente está seleccionado
}
@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.css']
})
export class ExportDialogComponent implements OnInit { 
  constructor(public dialogRef: MatDialogRef<ExportDialogComponent>,
    private spinner: NgxSpinnerService,
    private toaster: Toaster,
    private _service: RegistroVehicularService) { }

  ngOnInit(): void {
    this.listarRegistroScan();
  }
  closePopup(): void {
    this.dialogRef.close();
  } 
  closePopup2(): void {
    if(this.obtenerNombresSeleccionados()){

      this.dialogRef.close(this.obtenerNombresSeleccionados());
    }else{      
      this.toaster.open({
        text: "Debe seleccionar componentes a exportar",
        caption: 'Mensaje',
        type: 'warning',
        position: 'bottom-right',
        //duration: 4000
      });
    }
  } 
componentes: Componente[] = [];
  listarRegistroScan(){
    this.spinner.show();
    this._service.getComponentes()
      .subscribe(
        (response) => {
          this.spinner.hide();
          if(response.code==200){
              this.componentes=response.data.rows;  
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  }
  seleccionarTodos(event: any): void {
    this.componentes.forEach(componente => componente.seleccionado = event.checked);
  }

  obtenerNombresSeleccionados(): string {
    const nombresSeleccionados = this.componentes
      .filter(componente => componente.seleccionado)
      .map(componente => componente.nombre);

    return nombresSeleccionados.join(', ');
  }
}