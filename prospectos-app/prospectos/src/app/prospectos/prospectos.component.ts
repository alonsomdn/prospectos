import { Component, OnInit } from '@angular/core';
import { Prospecto } from '../prospecto';
import { ProspectoService } from '../prospecto.service';

@Component({
  selector: 'app-prospectos',
  templateUrl: './prospectos.component.html',
  styleUrls: ['./prospectos.component.css']
})
export class ProspectosComponent implements OnInit {
  prospectos: Prospecto[];
  idProspecto: number;
  prospectoSeleccionado: Prospecto;
  constructor(private prospectoService: ProspectoService) { }

  ngOnInit(): void {
    this.prospectos=[];
    this.idProspecto = -1;

    this.getProspectos();
  }

  nuevoProspecto(): void {
    this.prospectoSeleccionado = {
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      telefono: '',
      calle: '',
      codigoPostal: '',
      colonia: '',
      numero: '',
      observaciones: '',
      rfc: '',
      status: '',
      id: -1,
      documentos: [],
    };
  }
  
  prospectoEditButtonClick(prospecto: Prospecto): void {
    this.prospectoService.getProspecto(prospecto.id).subscribe(result => {
      this.prospectoSeleccionado = result;
    });
  }

  cancelarEdicion(): void {
    if(confirm('Perderá todos los cambios. ¿Desea continuar?')) {
      delete this.prospectoSeleccionado;
    }
  }

  getProspectos(): void {
    this.prospectoService.getProspectos()
      .subscribe(prospectos => {
        this.prospectos = prospectos;
      });
  }
}
