import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HuespedRequest, HuespedResponse } from '../../models/huesped.model';
import { HuespedService } from '../../services/huesped.service';
import { AuthService } from '../../services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html',
  styleUrl: './huespedes.component.css'
})
export class HuespedesComponent implements OnInit, AfterViewInit{

  listaHuespedes: HuespedResponse[] = [];

  isEditMode: boolean = false;
  selectedHuesped: HuespedResponse | null = null;
  showActions: boolean = false;
  modalText: string = 'Registrar Huésped';

  @ViewChild('huespedModalRef')
  huespedModalEl!: ElementRef;
  huespedForm: FormGroup;

  private modalInstance!: any;

   constructor(private fb: FormBuilder, private huespedService: HuespedService,
    private authService: AuthService
  ){
    this.huespedForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^(?!\s*$).+/)]],
      apellidoPaterno: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^(?!\s*$).+/)]],
      apellidoMaterno: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^(?!\s*$).+/)]],
      edad: [null, [Validators.required, Validators.min(18), Validators.max(100)]],
      email: ['', [Validators.required, Validators.maxLength(100), Validators.minLength(1), Validators.email]],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/^[0-9]{10}$/)]],
      documento: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^(?!\s*$).+/)]],
      nacionalidad: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1), Validators.pattern(/^(?!\s*$).+/)]]
    })
  }

  ngOnInit(): void {
    /* this.listarHuespedes();
    if(this.authService.hasRole(Roles.ADMIN)){
      this.showActions = true;
    } */
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.huespedModalEl.nativeElement, {keyboard: false});
    this.huespedModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    })
  }

  listarHuespedes(): void{
    this.huespedService.getHuesped().subscribe({
      next: resp => {
        this.listaHuespedes = resp;
      }
    })
  }

  resetForm(): void{
    this.isEditMode = false;
    this.selectedHuesped = null;
    this.huespedForm.reset();
  }

  toggleForm(): void{
    this.resetForm();
    this.modalText = 'Registrar Huésped';
    this.modalInstance.show();
  }

  editHuesped(huesped: HuespedResponse): void{
    this.isEditMode = true;
    this.selectedHuesped = huesped;
    this.modalText = 'Editando Huésped: ' + huesped.nombre;

    this.huespedForm.patchValue({...huesped});
    this.modalInstance.show();
  }

   onSubmit(): void{
    if(this.huespedForm.invalid) return;

    const huespedData: HuespedRequest = this.huespedForm.value;

    if(this.isEditMode && this.selectedHuesped){
      this.huespedService.putHuesped(huespedData, this.selectedHuesped.id).subscribe({
        next: registro => {
          const index: number = this.listaHuespedes.findIndex(p => p.id === this.selectedHuesped!.id);
          if(index !== -1) this.listaHuespedes[index] = registro;
          Swal.fire('Actualizado', 'Huésped actualizado correctamente', 'success');
          this.modalInstance.hide();
        }
      });
    } else {
      this.huespedService.postHuesped(huespedData).subscribe({
        next: registro => {
          this.listaHuespedes.push(registro);
          Swal.fire('Registrado', 'Huésped registrado correctamente', 'success');
          this.modalInstance.hide();
        }
      });
    }
  }

  deleteHuesped(idHuesped: number): void{
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'El Huésped será eliminado permanente',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar' 
    }).then(result => {
      if(result.isConfirmed){
        this.huespedService.deleteHuesped(idHuesped).subscribe({
          next: () => {
            this.listaHuespedes = this.listaHuespedes.filter(p => p.id !== idHuesped);
            Swal.fire('Eliminado', 'Huésped eliminado correctamente', 'success');
          },
            error: (error) => {
              console.error('Error al eliminar Huésped:', error);          
          }
        });
      }
    });
  }

}
