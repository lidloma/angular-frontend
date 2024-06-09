import { CategoriaModel } from "./categoria.model";
import { ComentarioModel } from "./comentario.model";
import { ImagenModel } from "./imagen.model";
import { IngredienteModel } from "./ingrediente.model";
import { PasoModel } from "./paso.model";
import { UsuarioModel } from "./usuario.model";

export class RecetaModel {
    constructor(
        public id: number,
        public nombre: string,
        public descripcion: string,
        public estado: string,
        public fecha: string,
        public categoriasId: number[],
        public numeroPersonas: number,
        public imagenUrl: { imagen: string }[],
        public ingrediente: IngredienteModel[],
        public tiempo: number,
        public usuarioId: number,
        public complejidad: string,
        public paso: PasoModel[],
        public comentarios?: ComentarioModel[],
        public usuario?: UsuarioModel,
        public recetas?: RecetaModel[],
        public imagen?: ImagenModel[],
        public categorias?: CategoriaModel[],
        public puntuacion?: number,




    ){}
}