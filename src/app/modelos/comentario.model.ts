import { UsuarioModel } from "./usuario.model";

export class ComentarioModel {
    constructor(
        public id: number,
        public usuario_id: number,
        public receta_id: number,
        public descripcion: string, 
        public puntuacion?: number,
        public complejidad?: number,     
        public comentario_id?: number,
        public usuario?: UsuarioModel,
        public respuestas?: ComentarioModel[],


  
  
    ){}
}