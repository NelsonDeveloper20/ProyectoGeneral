import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-json-table',
  templateUrl: './json-table.component.html',
  styleUrls: ['./json-table.component.css']
})
export class JsonTableComponent  {
 
  @Input() data: any;

  // Método para obtener las claves de un objeto
  getKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  // Verificar si el valor es un objeto y no un valor primitivo
  isObject(value: any): boolean {
    return value && typeof value === 'object' && !Array.isArray(value);
  }
}
