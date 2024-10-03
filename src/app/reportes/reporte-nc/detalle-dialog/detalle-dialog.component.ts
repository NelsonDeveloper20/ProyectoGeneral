import { HttpClient } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { RegistroVehicularService } from 'src/app/services/registrovehicular.service';

@Component({
  selector: 'app-detalle-dialog',
  templateUrl: './detalle-dialog.component.html',
  styleUrls: ['./detalle-dialog.component.css']
})
export class DetalleDialogComponent implements OnInit {

  idSelected:any=0;
  @Input() photos: any[] = [];
  listcomponentes:any;
  constructor(
    public dialogRef: MatDialogRef<DetalleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private http: HttpClient,
    private _service: RegistroVehicularService,
    private spinner: NgxSpinnerService,
  ) {
    console.log(data);
    this.listcomponentes=data.listcomponentes;
    this.photos=data.photos;
    this.idSelected=data.idSelected;
  }
  ngOnInit(): void {
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
   // Método para convertir base64 a URL de imagen
   getBase64Image(base64: string): string {
    return `data:image/jpeg;base64,${base64}`;
  }
  isValidJSON(jsonString: any){
    try {     
      return  JSON.parse(jsonString);
    } catch (e) {
      return ""
    }
  }
  
  getPhotoByComponent(id:any){
    // Llamada al servicio para obtener la foto 
   this._service.GetPhotoByComponentVehicular(this.idSelected, id)
   .subscribe(
     (response) => {
       this.spinner.hide(); 
       if(response.code == 200 && response.data.length > 0){
         // Si se encontró la foto, devolver la URL de la foto
         var foto = response.data[0].archivo; 
        // var fotobase64=   this.getBase64Image(foto);
         this.openImageInNewTab(foto);
       } 
     },
     () => { 
      
     }
   );
   }
   openImageInNewTab(base64Image: string) {
     const byteCharacters = atob(base64Image);
     const byteNumbers = new Array(byteCharacters.length);
     for (let i = 0; i < byteCharacters.length; i++) {
       byteNumbers[i] = byteCharacters.charCodeAt(i);
     }
     const byteArray = new Uint8Array(byteNumbers);
     const blob = new Blob([byteArray], { type: 'image/png' });
     const url = URL.createObjectURL(blob);
     window.open(url);
   }
}
