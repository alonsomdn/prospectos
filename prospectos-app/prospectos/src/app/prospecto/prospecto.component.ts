import { Component, Input, OnInit } from '@angular/core';
import { Prospecto } from '../prospecto';
import { ProspectoService } from '../prospecto.service';

@Component({
  selector: 'app-prospecto',
  templateUrl: './prospecto.component.html',
  styleUrls: ['./prospecto.component.css']
})
export class ProspectoComponent implements OnInit {
  @Input() prospecto: Prospecto;
  documentos: File[];

  constructor(private prospectoService: ProspectoService) { 
    this.documentos = [];
  }

  ngOnInit(): void {
  }

  cancelar(): void {
    if(this.prospecto.id < 0 && confirm('Perderá todos los cambios. ¿Desea continuar?')) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  }

  guardar(): void {
    this.prospectoService.postProspecto(this.prospecto).subscribe(res => {
      if(res) {
        alert("Datos guardados");
        window.location.reload();
      } else {
        alert("Verifique los datos capturados");
      }
    }, error => {
      alert("Verifique los datos capturados");
    })
  }

  autorizar(): void {
    if(!confirm("¿Desea autorizar el prospecto?")) {
      return
    }
    this.prospectoService.autorizar(this.prospecto).subscribe(res => {
      if(res) {
        alert("Prospecto autorizado");
        window.location.reload();
      } else {
        alert("Verifique los datos capturados");
      }
    }, error => {
      alert("Verifique los datos capturados");
    });
  }

  rechazar(): void {
    if(!this.prospecto.observaciones || this.prospecto.observaciones.length == 0) {
      alert("Debe proporcionar las observaciones para rechazar el prospecto");
      return;
    }
    if(!confirm("¿Desea rechazar el prospecto?")) {
      return;
    }

    this.prospectoService.rechazar(this.prospecto).subscribe(res => {
      if(res) {
        alert("Prospecto rechazado");
        window.location.reload();
      } else {
        alert("Verifique los datos capturados");
      }
    }, error => {
      alert("Verifique los datos capturados");
    });
  }

  seleccionarArchivo(): void {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      // you can use this method to get file and perform respective operations
              let files =   Array.from(input.files);
              files.map(file => {
                this.documentos.push(file);
              })
          };
    input.click();
  }
  
}
