import { Request, Response } from 'express'
import Arbol from './analisis/simbolo/Arbol';
import tablaSimbolo from './analisis/simbolo/tablaSimbolos';
import Errores from './analisis/excepciones/Errores';
import Metodo from './analisis/instrucciones/Metodo';
import Declaracion from './analisis/instrucciones/Declaracion';
import Execute from './analisis/instrucciones/Execute';
export let ArregloErrores: Array<Errores> = []      //cambiar*********

class controller {
    public prueba(req: Request, res: Response) {
        res.json({ message: "Hola mundo"})
    }

    /*public metodoPost(req:Request , res:Response){
        //este req.body accede a todo el cuerpo del json q recibe 
        console.log(req.body)
        //si quisieramos acceder a algun atributo espesifico ejemplo notas  "notas": 100 seria 
        //console.log(req.body.notas)
        res.json({message:"Metodo post"})
    }*/

    public interpretar(req: Request, res: Response) {
        ArregloErrores = new Array<Errores>
        try {
            let parser = require('./analisis/analizador')
            let ast = new Arbol(parser.parse(req.body.entrada))
            let tabla = new tablaSimbolo()
            tabla.setNombre("Ejemplo 1")
            ast.setTablaGlobal(tabla)
            ast.setConsola("")
            let execute = null;
            /*
            realizamos el primer recorrido del arbol donde vamos a reconocer 
            variables globales funciones o metodos
            */
            for (let i of ast.getInstrucciones()) {
                //almacenamos metodos
                if (i instanceof Metodo) {
                    i.id = i.id.toLocaleLowerCase()
                    ast.addFunciones(i)
                }
                //verificamos si hay variables globales
                if (i instanceof Declaracion) {
                    i.interpretar(ast, tabla)
                    //falta manejo de errores
                }
                //guardamos en var execute el execute
                if (i instanceof Execute) {
                    execute = i
                    //falta validar que el execute venga solo 1 vez
                }
            }
            if (execute != null) {
                execute.interpretar(ast, tabla)
                //manejo de errores
            }
            //esto se uso cuando no habian funciones ni metodso ni execute
            /*for (let i of ast.getInstrucciones()) {
                //agarramos instruccion por instruccion e interpretamos
                //console.log(i)
                //var resultado = i.interpretar(ast, tabla)
                if(i instanceof Errores) {
                    ArregloErrores.push(i)
                }
                var resultado = i.interpretar(ast, tabla)
                if (resultado instanceof Errores) {
                    ArregloErrores.push(resultado)
                }
                //console.log(resultado)

            }*/
            console.log(tabla)
            console.log(ArregloErrores)
            //hasemos modificacion ast.getconsole para imprimir por medio de palabra print
            res.send({ "Respuesta": ast.getConsola() })
        } catch (err: any) {
            res.json({ message: "Error al ejecutar analisis" })
            console.log(err)
        }
    }

    public mostrarErrores(req: Request, res: Response) {  //cambiar************
        try {
            //console.log(ArregloErrores)
            res.json({ "ArregloErrores": ArregloErrores })
        } catch (err: any) {
            res.send({ "Error": "Ya no sale compi2" })
        }
    }

}


export const indexController = new controller();