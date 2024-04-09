import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";

export default class PrintLn extends Instruccion{
    //el contenido de print sera una expresion
    private expresion : Instruccion

    constructor(exp : Instruccion, linea : number, col: number){
        //como es una instruccion no tiene tipo por lo tanto lo ponemos de tipo void
        super(new Tipo(tipoDato.VOID), linea, col)
        this.expresion = exp
    }

    //antes de mostrar esa exp en consola tenemos que interpretarla
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valor = this.expresion.interpretar(arbol, tabla)
        //si valor es instancia de error retornamos el error 
        if (valor instanceof Errores) return valor
        //si no es error ejecutamos printLn
        arbol.PrintLn(valor)
    }
}