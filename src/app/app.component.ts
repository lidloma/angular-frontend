import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';



//Componentes
import { NavbarComponent } from './componentes/navbar/navbar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';




@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
            NavbarComponent, 
            FooterComponent,
            InicioComponent,
            BuscadorComponent,
            FormsModule,
            InicioSesionComponent,
            HttpClientModule,
            ReactiveFormsModule,
            RouterModule,
            RouterLink,
            RouterLinkActive,
            MultiSelectModule,
            CommonModule,
            ToastModule
          
            
   ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'angular-frontend';
}
