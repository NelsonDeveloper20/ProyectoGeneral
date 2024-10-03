import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionDialogComponent } from './asignacion-dialog.component';

describe('AsignacionDialogComponent', () => {
  let component: AsignacionDialogComponent;
  let fixture: ComponentFixture<AsignacionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignacionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
