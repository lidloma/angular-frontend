import { CategoriaModel } from "./categoria.model";
import { ComentarioModel } from "./comentario.model";
import { ListaModel } from "./lista.model";
import { RecetaModel } from "./receta.model";

export class UsuarioModel {
    constructor(
        public nombre: string,
        public apellidos: string,
        public email: string,
        public contrasenia: string,
        public imagen: string,
        public nombreUsuario: string,
        public provincia: string,
        public roles:string[],
        public id: number,
        public categorias:CategoriaModel[],
        public recetas?: RecetaModel[],
        public listas?: ListaModel[],
        public comentarios?: ComentarioModel[],
        public usuarios?: UsuarioModel[],


    ){}
}