import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Break from "./Break";

export default class Case extends Instruccion{
    public condicion: Instruccion
    public instrucciones: Instruccion[]

    constructor(condCase:Instruccion,instCase: Instruccion[], linea : number, columna : number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = condCase
        this.instrucciones = instCase
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let a :any|null
        for(let elemento of this.instrucciones){
            a = elemento.interpretar(arbol,tabla);
            if(a!=null) return a;
            //si la instruccion es break retornamos
            if (elemento instanceof Break) return elemento;
            //caso si viene un break dentro de un cilo en el case
            if (a instanceof Break) return a
        }
    }  

    public getCondCase(arbol: Arbol, tabla: tablaSimbolo){
        return this.condicion.interpretar(arbol,tabla)
    }
}



