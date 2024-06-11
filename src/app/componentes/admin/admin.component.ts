import { Component } from '@angular/core';
import { DenunciaService } from '../../servicios/denuncia.service';
import { CommonModule } from '@angular/common';
import { RecetasService } from '../../servicios/recetas.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  denuncias: any[] = [];

  constructor(private _denunciaService: DenunciaService, private _recetasService: RecetasService) { }

  ngOnInit(): void {
    this._denunciaService.listarDenuncias().subscribe(data => {
      this.denuncias = data;
    }, (error:any) => {
      console.error('Error al obtener las denuncias:', error);
    });
  }

  eliminarReceta(id: number): void {
    this._recetasService.eliminarReceta(id).subscribe((response: any) => {
      console.log('Receta eliminada:', response);
    }, (error: any) => {
      console.error('Error eliminando receta:', error);
    });
  }
  
}

