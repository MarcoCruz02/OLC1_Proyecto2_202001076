import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class AsignacionList2D extends Instruccion{
    private id : string
    private expresion : Instruccion 
    private posicion : Instruccion

    constructor(id:string, expresion:Instruccion, linea: number, columna: number, pos : Instruccion){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.expresion = expresion
        this.posicion = pos
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //al interpretar expresion sera una instruccion por lo tanto tenemos que saber su valor resultante
        let newValorL = this.expresion.interpretar(arbol,tabla)
        if (newValorL instanceof Errores) return newValorL

        //verificamos que a la lista de 2 dimensiones a la que se le va a signar exista
        let valor = tabla.getLista(this.id.toLocaleLowerCase())
        if (valor == null) return new Errores("Semantico", "Lista  no existente", this.linea, this.columna)
        
        //validamos que sea del mismo tipo
        if(this.expresion.tipoDato.getTipo() != valor.getTipo().getTipo()) return new Errores("Semantico", "Asignacion Lista erronea no coinciden los tipos", this.linea, this.columna)
        this.tipoDato = valor.getTipo()
        //verificamos si el valor es de tipo variable
        let valorVarpos: Simbolo = <Simbolo> tabla.getVariable(String(this.posicion.interpretar(arbol,tabla)))

        //si exite solo para el caso donde [a] y la posicion este marcada por variable
        if (valorVarpos != null){
            //asignamos valor con el valor de vriable
            valor.setValor(newValorL,valorVarpos.getValor())
        }
        //de lo contrario asignamos con posicion normal
        valor.setValor(newValorL,this.posicion.interpretar(arbol,tabla))

    }
}