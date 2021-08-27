export interface Prospecto {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    calle: string;
    numero: string;
    colonia: string;
    codigoPostal: string;
    telefono: string;
    rfc: string;
    status: string;
    observaciones: string;
    documentos: string[];
}