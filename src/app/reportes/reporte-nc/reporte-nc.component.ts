import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { Toaster } from 'ngx-toast-notifications';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { groupBy, map, mergeMap, toArray } from 'rxjs/operators';
import { IUsersResponse, Solicitud, Solicitud2, SolicitudReporteResponse, Usuario } from 'src/app/services/request.model';
import { RequestService } from 'src/app/services/request.service';
import * as XLSX from 'xlsx'; 

import { environment } from 'src/environments/environment';
import { ListasModel } from 'src/app/parametros/parametros.component';
import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegistroVehicularService } from 'src/app/services/registrovehicular.service';
import { MatDialog } from '@angular/material/dialog';
import { ExportDialogComponent } from './export-dialog/export-dialog.component';

@Component({
  selector: 'app-reporte-nc',
  templateUrl: './reporte-nc.component.html',
  styleUrls: ['./reporte-nc.component.css']
})
export class ReporteNCComponent implements OnInit {

  searchControl = new FormControl('');
 
  searchControlCliente = new FormControl('');
  get filteredClientes() {
    const searchTerm = this.searchControlCliente.value.toLowerCase();
    return this.clientes.filter((item) =>
      item.clienteRazonSocial.toLowerCase().includes(searchTerm)
    );
  }
  solicitud: Array<SolicitudReporteResponse> = [];
  clientes: Array<Solicitud2> = [];
  private urlBase: string; 
  constructor(
    private router: Router,
    private toaster: Toaster,
    private spinner: NgxSpinnerService,
    private requestService: RequestService, private http: HttpClient,
    private _service: RegistroVehicularService,public dialog: MatDialog
  ) { 
    this.urlBase = `${environment.baseUrl}/api/listas`; 
  }

  getList(tabla:string): Observable<ListasModel[]> {
    return this.http
      .get(this.urlBase+'?table='+tabla)
      .pipe<ListasModel[]>(map((data: any) => data));
  } 
 // Define las listas y FormControl para cada una
 
 searchControlUnidad = new FormControl('');
 UnidadList: ListasModel[]; 
 get filterUnidadList() { 
  if (!this.UnidadList) {
  return []; // o algún valor predeterminado
}
  const searchTerm = this.searchControlUnidad.value.toLowerCase();
  return this.UnidadList.filter(item => item.descripcion.toLowerCase().includes(searchTerm));
}

 TiendaList: ListasModel[]; 
 searchControlTienda = new FormControl('');
 get filterTiendaList() {
  if (!this.TiendaList) {
  return []; // o algún valor predeterminado
}
  const searchTerm = this.searchControlTienda.value.toLowerCase();
  return this.TiendaList.filter(item => item.descripcion.toLowerCase().includes(searchTerm));
}

searchControlCentroCosto = new FormControl('');
 CentroCostoList: ListasModel[]; 
 get filterCentroCostoList() {
  if (!this.CentroCostoList) {
  return []; // o algún valor predeterminado
}
  const searchTerm = this.searchControlCentroCosto.value.toLowerCase();
  return this.CentroCostoList.filter(item => item.descripcion.toLowerCase().includes(searchTerm));
}

 ClienteRazonSocialList: ListasModel[]; 
 searchControlClienteRazonSocial = new FormControl('');
 get filterClienteRazonSocialList() {
  if (!this.ClienteRazonSocialList) {
  return []; // o algún valor predeterminado
}
  const searchTerm = this.searchControlClienteRazonSocial.value.toLowerCase();
  return this.ClienteRazonSocialList.filter(item => item.descripcion.toLowerCase().includes(searchTerm));
}
 
 // FormControl para búsqueda
 

 
 DniClienteRucList: ListasModel[];
 searchControlDniClienteRuc = new FormControl(''); 
 get filterDniClienteRucList() {
  if (!this.DniClienteRucList) {
  return []; // o algún valor predeterminado
}
   const searchTerm = this.searchControlDniClienteRuc.value.toLowerCase();
   return this.DniClienteRucList.filter(item => item.descripcion.toLowerCase().includes(searchTerm));
 }
  ngOnInit(): void { 
    this.listarRegistroScan(); 
  }
  //Filtros
  Serie_NC_SAP: string = "";
  UN: string = "";
  Tienda: string = "";
  Ceco: string = "";
  ClienteRazonSocial: string = "";
  RucCliente: string = "";
  NroNotaCredito: string = "";
  Asesor: string = "";
  FechaInicioCierre: any;// = new Date();
  FechaFinCierre: any;// = new Date();


  FechaInicio = new Date();
  FechaFin = new Date();
  AprobadoPor: string = "";
  ClienteSelect: string = '';
  EstadoSolicitud: string = '';

  displayedColumns: string[] = [
    'Numero_NC_SAP',
    'Serie_NC_SAP',
    'Monto_Total_SAP',
    'Moneda_SAP',
    'Nro_Solicitud',
    'Tipo_Solicitud',
    'UN',
    'Tienda',
    'CECO',
    'Nro_SAP',
    'Comprobante',
    'Cliente_Razon_Social',
    'DNI_RUC',
    'Fecha_Solicitud',
    'Importe',
    'Moneda',
    'Banco',
    'NumCuenta',
    'Cci',
    'Comentario',
    'NroNota_Credito',
    'FechaAplicacion',
    'Registro_Contable',
    'Asesor',
    'ADV',
    'Fecha_Aprob_ADV',
    'Fecha_2daAprob_ADV',
    'Jefatura',
    'Fecha_Aprob_Jefatura',
    'Gerencia',
    'Fecha_Aprob_Gerencia',
    'Cumplimiento',
    'Fecha_Aprob_Cumpl',
    'Contabilidad',
    'Comentario_Contabilidad',
    'Fecha_Aprob_Contabilidad',
    'Tesoreria',
    'Fecha_Aprob_Tesoreria',
    'Estado',
    'Horas_Ultima_Aprobacion',
    'Fecha_Cierre'
  ];
  dataSource = new MatTableDataSource<Solicitud>(); //ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  listScan:any=[];
  listarRegistroScan(){
    this.spinner.show();
    this._service.getRequest()
      .subscribe(
        (response) => {
          this.spinner.hide();
          if(response.code==200){
              this.listScan=response.data.rows; 
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  } 
  selectedRegistro: any; 
  @Input() photos: any[] = [];
  listHotos:any=[];
  listcomponentes:any;
  idSelected:any=0;
  checkboxSeleccionado: boolean = false;
/*
  uncheck(id:any,data: any){ 
    this.listcomponentes=[];
    this.selectedRegistro=[];
    console.log(this.selectedRegistro);
    this.listScan.forEach(registro => {
      if (registro.detalle !== data) {
        registro.checked = false;
      }
    });  
    
    this.idSelected=id,
    this.selectedRegistro = data;
    this.listcomponentes = this.groupByNombre(data); 
    this.spinner.show();
    this._service.GetregistrosVehicular(id)
      .subscribe(
        (response) => {
          this.spinner.hide();
          if(response.code==200){
            console.log(response.data);
              this.photos=response.data; 
          }
        },
        () => {
          this.spinner.hide();
        }
      );
  }    */
      uncheck(id: any, data: any) { 
        
    this.idSelected=id;
        this.selectedRegistro = data;
        this.listcomponentes = this.groupByNombre(data); 
        this.spinner.show();
        this._service.GetregistrosVehicular(id)
          .subscribe(
            (response) => {
              this.spinner.hide();
              if (response.code == 200) {
                console.log(response.data);
                this.photos = response.data; 
              }
            },
            () => {
              this.spinner.hide();
            }
          );      
        // Desmarcar los otros registros
        this.listScan.forEach(registro => {
          registro.checked = registro.detalle === data;
        });
      }
  groupByNombre(componentes: any[]) {
    if(componentes){
      const grouped = {};
      componentes.forEach(componente => {
        if (!grouped[componente.nombre]) {
          grouped[componente.nombre] = {
            nombre: componente.nombre, 
            id:componente.id_componente,
            //archivo:componente.archivo,
            detalle: []
          };
        }
        grouped[componente.nombre].detalle.push(componente);
      });
      return Object.values(grouped);
    }else{
      return [];
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
  // Método para convertir base64 a URL de imagen
  getBase64Image(base64: string): string {
    return `data:image/jpeg;base64,${base64}`;
  }
  exportToExcel(): void {    
this.openPopup();
    /*
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.generateTableData());
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Reporte.xlsx');*/
  }
  openPopup(): void {
    const dialogRef = this.dialog.open(ExportDialogComponent, {
      width: '650px', // Ancho del popup
      data: { name: 'Angular' } // Datos opcionales que puedes pasar al popup
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log(result);
        console.log('El popup se cerró debe exportar');
        
    const componentesFiltro = result.toLowerCase().split(',').map(componente => componente.trim());
    this.listExport = this.generateTableData().filter(item => componentesFiltro.includes(item.componente.toLowerCase()));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.listExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Reporte.xlsx');
      }
    });
  }
  
  listExport:any=[]; 
  generateTableData(): any[] {
    const tableData: any[] = [];

    this.listScan.forEach(registro => {
      if (registro.detalle.length > 0) {
        registro.detalle.forEach(detalle => {
          const row = {
            marca: registro.marca,
            modelo: registro.modelo,
            tipoVehiculo: registro.tipoVehiculo,
            vin: registro.vin,
            fecha: registro.fecha ,//| date:'dd/MM/yyyy',
            componente: detalle.nombre,
            nombre: detalle.atributo,
            valor: detalle.valor
          };
          tableData.push(row);
        });
      } else {
        const emptyRow = {
          marca: registro.marca,
          modelo: registro.modelo,
          tipoVehiculo: registro.tipoVehiculo,
          vin: registro.vin,
          fecha: registro.fecha ,//| date:'dd/MM/yyyy',
          componente: '-',
          nombre: '-',
          valor: '-'
        };
        tableData.push(emptyRow);
      }
    });

    return tableData;
  } 
  
    
  
  
}

