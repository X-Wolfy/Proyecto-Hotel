import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservaRequest, ReservaResponse } from '../../models/Reserva.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservasService } from '../../services/reserva.service';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-reservas',
  standalone: false,
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})

export class ReservasComponent implements OnInit, AfterViewInit {

  listaReservas: ReservaResponse[] = [];

  isEditMode: boolean = false;
  selectedReserva: ReservaResponse | null = null;
  showActions: boolean = true;
  modalText: string = 'Registrar reserva';

  @ViewChild('reservaModalRef')
  reservaModalEl!: ElementRef;
  reservaForm: FormGroup;

  private modalInstance!: any;


  constructor(private fb: FormBuilder, private reservaService: ReservasService,
    private authService: AuthService
  ) {
    this.reservaForm = this.fb.group({
      id: [null],
      idHuesped: [null, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      idHabitacion: [null, [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)]],
      fechaEntrada: ['', [Validators.required]],
      fechaSalida: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.listarReservas();
    /*
    if(this.authService.hasRole(Roles.ADMIN)){
      this.showActions = true;
    } */
  }

  ngAfterViewInit(): void {
    this.modalInstance = new bootstrap.Modal(this.reservaModalEl.nativeElement, { keyboard: false });
    this.reservaModalEl.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.resetForm();
    })
  }

  listarReservas(): void {
    this.reservaService.getReservas().subscribe({
      next: resp => {
        this.listaReservas = resp;
      }
    })
  }

  resetForm(): void {
    this.isEditMode = false;
    this.selectedReserva = null;
    this.reservaForm.reset();
  }

  toggleForm(): void {
    this.resetForm();
    this.modalText = 'Registrar reserva';
    this.modalInstance.show();
  }

  editReserva(reserva: ReservaResponse): void {
    this.isEditMode = true;
    this.selectedReserva = reserva;
    this.modalText = 'Editando reserva: ' + reserva.id;

    this.reservaForm.patchValue({ ...reserva });
    this.modalInstance.show();
  }

  private formato(fechaInput: string): string {
    if (!fechaInput) return '';

    const fecha = new Date(fechaInput);

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }

  onSubmit(): void {
    if (this.reservaForm.invalid) return;
    
    const formValue = this.reservaForm.value;
    const reservaData: ReservaRequest = {
      ...formValue,
      fechaEntrada: this.formato(formValue.fechaEntrada),
      fechaSalida: this.formato(formValue.fechaSalida)
    };
    if (this.isEditMode && this.selectedReserva) {
      this.reservaService.putReserva(reservaData, this.selectedReserva.id).subscribe({
        next: registro => {
          const index: number = this.listaReservas.findIndex(p => p.id === this.selectedReserva!.id);
          if (index !== -1) this.listaReservas[index] = registro;
          Swal.fire('Actualizado', 'Reserva actualizado correctamente', 'success');
          this.modalInstance.hide();
        }
      });
    } else {
      this.reservaService.postReserva(reservaData).subscribe({
        next: registro => {
          this.listaReservas.push(registro);
          Swal.fire('Registrado', 'Reserva registrado correctamente', 'success');
          this.modalInstance.hide();
        }
      });
    }
  }

  deleteReserva(idReserva: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La reserva será eliminado permanente',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.reservaService.deleteReserva(idReserva).subscribe({
          next: () => {
            this.listaReservas = this.listaReservas.filter(p => p.id !== idReserva);
            Swal.fire('Eliminado', 'Reserva eliminado correctamente', 'success');
          },
          error: (error) => {
            console.error('Error al eliminar reserva:', error);
          }
        });
      }
    });
  }

}