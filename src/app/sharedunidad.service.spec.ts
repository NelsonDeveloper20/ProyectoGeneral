import { TestBed } from '@angular/core/testing';

import { SharedunidadService } from './sharedunidad.service';

describe('SharedunidadService', () => {
  let service: SharedunidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedunidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
