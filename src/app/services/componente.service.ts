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
import { IApiResponse } from './service.model';

@Injectable({
  providedIn: 'root',
})
export class ComponenteService {
  private urlBase: string;
  private urlBase2: string;
  constructor(private apiService: ApiService) {
    this.urlBase2 = `${environment.baseUrl}/api/`;
  }
  getRequest(): Observable<any> {   
    return this.apiService.get(this.urlBase2+"componenteModelo/listCompModelo", {});
  }
  getComponentes(): Observable<any> {  
     return this.apiService.get(this.urlBase2+"componentes", {});
  }
  ListarcomponentesAsignacion(id: any): Observable<any> { 
    return this.apiService.get(this.urlBase2+"componenteModelo/listCompModeloAsignacion?id="+id, {});
  } 
  
  AgregarModuloRol(id: any, data: any): Observable<any> {
    const headers = { 'Content-Type': 'application/json' };
    return this.apiService.post<any>(this.urlBase2 + 'componenteModelo/guardarAsignacion?id=' + id, data, { headers: headers });
  }
}
