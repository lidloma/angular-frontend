import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { BuscadorComponent } from './componentes/buscador/buscador.component';
import { InicioSesionComponent } from './componentes/inicio-sesion/inicio-sesion.component';
import { RecetaComponent } from './componentes/receta/receta.component';
import { NgModule } from '@angular/core';
import { RecetaFormComponent } from './componentes/receta-form/receta-form.component';
import { UserGuardGuard } from './utils/user-guard.guard';
import { AdminComponent } from './componentes/admin/admin.component';
import { PerfilComponent } from './componentes/perfil/perfil.component';
import { ListasComponent } from './componentes/listas/listas.component';
import { Error404Component } from './componentes/error404/error404.component';


export const routes: Routes = [
    { 
        path: 'buscador',
        component: BuscadorComponent 
    },
    { 
        path: 'login',
        component: InicioSesionComponent 
    },
    { 
        path: 'inicio',
        component: InicioComponent 
    },
    { 
        path: 'recetas/:receta', 
        component: RecetaComponent 
    },

    { 
        path: 'perfil/:nombreUsuario', 
        component: PerfilComponent 
    },
    { 
        path: 'listas/:nombreUsuario', 
        component: ListasComponent 
    },
    { 
        path: 'recetaform', 
        component: RecetaFormComponent 
    },
    {   path: 'admin', 
        component: AdminComponent, canActivate: [UserGuardGuard]},
    { 
        path: '', redirectTo:'inicio',
        pathMatch:'full' 
    },
    { 
        path: 'inicio', 
        redirectTo:'', 
        pathMatch:'full' 
    },
    { path: '**', component: Error404Component } 



    
    

];
  

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
