export interface HuespedRequest {
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    edad: number,
    email: string,
    telefono: string, 
    nacionalidad: string,
    documento: string
}

export interface HuespedResponse {
    id: number,            
    nombre: string,        
    edad: number,
    email: string,
    telefono: string, 
    nacionalidad: string,
    documento: string,
    estadoRegistro: string
}