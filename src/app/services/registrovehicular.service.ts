import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from './api/api.service';
import {
  IAgregarSubContratistaRequest,
  IModificarProveedorRequest,
  IAgregarUsuarioRequest,
  ILoginIdRequest,
  IUsuarioResponse,
  IRolesResponse,
  IUserResponse,
  IUsersResponse,
  IModificarEstadoUsuarioRequest,
  IModificarUsuarioRequest,
  ILoginRequest,
  IResponse,
  IUnidadNegociosResponse,
  SedeResponse,
} from './user.model';

@Injectable({
  providedIn: 'root',
})
export class RegistroVehicularService {
  private urlBase: string;
  private urlBase2: string;
  constructor(private apiService: ApiService) {
    this.urlBase2 = `${environment.baseUrl}/api/`;
  }
 getRequest(): Observable<any> {   
    return this.apiService.get(this.urlBase2+"registrosVehicular/GetRegistroScan", {});
  }
  getComponentes(): Observable<any> {  
     return this.apiService.get(this.urlBase2+"componentes", {});
   }
    
   GetregistrosVehicular(id:any): Observable<any> {   
  return this.apiService.get(this.urlBase2+"registrosVehicular/listPhotosByRecordId?id_registro_vehicular="+id, {});
}
   
GetPhotoByComponentVehicular(idVehicular:any,id_componente:any): Observable<any> {   
  return this.apiService.get(this.urlBase2+"registrosVehicular/getPhotoComponentByRecordId?id_registro_vehicular="+idVehicular+"&id_componente="+id_componente, {});
}
}
