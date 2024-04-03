import{Request, Response} from 'express'
import Arbol  from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';

class controller {
    public prueba (req:Request , res:Response){
        res.json({message:"Hola mundo"})
    }

    /*public metodoPost(req:Request , res:Response){
        //este req.body accede a todo el cuerpo del json q recibe 
        console.log(req.body)
        //si quisieramos acceder a algun atributo espesifico ejemplo notas  "notas": 100 seria 
        //console.log(req.body.notas)
        res.json({message:"Metodo post"})
    }*/

    public interpretar(req: Request, res: Response) {
        try {
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("Ejemplo 1")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            for (let i of ast.getInstrucciones()){
                //agarramos instruccion por instruccion e interpretamos
                var resultado = i.interpretar(ast, tabla)
                console.log(resultado)
            }
            //hasemos modificacion ast.getconsole para imprimir por medio de palabra print
            res.send({ "Respuesta": ast.getConsola() })
        } catch (err: any) {
            res.json({ message: "Error al ejecutar analisis" })
            console.log(err)
        }
    }

} 

export const indexController = new controller();