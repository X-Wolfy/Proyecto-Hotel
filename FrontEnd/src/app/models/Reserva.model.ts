export interface ReservaRequest {
    idHuesped: number,
    idHabitacion: number,
    fechaEntrada: string, 
    fechaSalida: string,
    idEstado: number
}

export interface ReservaResponse {
    id: number,            
    huesped: DatoHuesped,        
    habitacion: DatoHabitacion,
    fechaEntrada: string, 
    fechaSalida: string, 
    estadoReserva: string
}

export interface DatoHuesped {
    nombre: string,        
    edad: number,
    email: string,
    telefono: string, 
    nacionalidad: string,
    documento: string
}

export interface DatoHabitacion {
  numero: string,
  tipo: string,
  precio: number,
  capacidad: number
}