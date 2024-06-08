import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedunidadService {
  unidadSeleccionada = new Subject<string>();
  constructor() { }

  emitirUnidadSeleccionada(unidad: string) {
    this.unidadSeleccionada.next(unidad);
  }
}
