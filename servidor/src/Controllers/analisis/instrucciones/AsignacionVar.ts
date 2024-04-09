import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class AsignacionVar extends Instruccion{
    private id : string
    private expresion : Instruccion

    constructor(id:string, expresion:Instruccion, linea: number, columna: number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.expresion = expresion
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //al interpretar expresion sera una instruccion por lo tanto tenemos que saber su valor resultante
        let newValor = this.expresion.interpretar(arbol,tabla)
        if (newValor instanceof Errores) return newValor

        //verificamos que a la variable a la que se le va a signar exista
        let valor = tabla.getVariable(this.id.toLocaleLowerCase())
        if (valor == null) return new Errores("Semantico", "Variable no existente", this.linea, this.columna)
        
        //validamos que sea del mismo tipo
        if(this.expresion.tipoDato.getTipo() != valor.getTipo().getTipo()) return new Errores("Semantico", "Asignacion erronea no coinciden los tipos", this.linea, this.columna)
        
        this.tipoDato = valor.getTipo()
        valor.setValor(newValor)
    }
}