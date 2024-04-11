import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class AsignacionList2D extends Instruccion{
    private id : string
    private expresion : Instruccion 
    private row : number
    private column : number

    constructor(id:string, expresion:Instruccion, linea: number, columna: number, row : number, column : number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.expresion = expresion
        this.row = row
        this.column = column
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //al interpretar expresion sera una instruccion por lo tanto tenemos que saber su valor resultante
        let newValorL2D = this.expresion.interpretar(arbol,tabla)
        if (newValorL2D instanceof Errores) return newValorL2D

        //verificamos que a la lista de 2 dimensiones a la que se le va a signar exista
        let valor = tabla.getLista2D(this.id.toLocaleLowerCase())
        if (valor == null) return new Errores("Semantico", "Lista 2D no existente", this.linea, this.columna)
        
        //validamos que sea del mismo tipo
        if(this.expresion.tipoDato.getTipo() != valor.getTipo().getTipo()) return new Errores("Semantico", "Asignacion Lista 2D erronea no coinciden los tipos", this.linea, this.columna)
        this.tipoDato = valor.getTipo()
        valor.setValor(newValorL2D,this.row,this.column)
    }
}