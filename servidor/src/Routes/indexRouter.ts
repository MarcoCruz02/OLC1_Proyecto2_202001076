import { Router } from "express";
import { indexController } from "../Controllers/indexController";

class router {
    public router: Router = Router();
    constructor(){
        this.config();
    }

    config(): void {
        this.router.get('/', indexController.prueba);
        this.router.get('/getAST', indexController.generadorAst);
        //this.router.post('/post', indexController.metodoPost);
        this.router.post('/interpretar', indexController.interpretar);
        this.router.post('/mostrarErrores', indexController.mostrarErrores);
    }
}

const indexRouter = new router();
export default indexRouter.router;

/*
explicacion de una api y lo que se usara en el proyecto 2
Modelo Vista-Controlador
Cliente - Servidor - DB

Web -> Servidor(procesa) -> get (recuperar datos)
    <- respuesta            <- respuesta

Web -> Servidor -> post (enviar datos) por medio de un json {usuario, constraseña, correo, etc}
Web -> Servidor -> put (actualizar datos) {usuario, datosAactualizar}
Web -> Servidor -> delete (eliminar datos) {usuario}
Web -> Servidor -> patch (actualizar datos) {usuario, datosAactualizar}

todo esto se hace por medio de una Peticion HTTP

*/