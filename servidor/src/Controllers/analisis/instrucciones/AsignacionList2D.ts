import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'

export default class AsignacionList2D extends Instruccion{
    private id : string
    private expresion : Instruccion 
    private row : Instruccion
    private column : Instruccion

    constructor(id:string, expresion:Instruccion, linea: number, columna: number, row : Instruccion, column : Instruccion){
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
        let valorLista2D = tabla.getLista2D(this.id.toLocaleLowerCase())
        if (valorLista2D == null) return new Errores("Semantico", "Lista 2D no existente", this.linea, this.columna)
        
        //validamos que sea del mismo tipo
        if(this.expresion.tipoDato.getTipo() != valorLista2D.getTipo().getTipo()) return new Errores("Semantico", "Asignacion Lista 2D erronea no coinciden los tipos", this.linea, this.columna)
        this.tipoDato = valorLista2D.getTipo()
        //obtenemos row y column y verificamos si existen en tabla de simbolos
        let valorVarposi1: Simbolo = <Simbolo> tabla.getVariable(String(this.row.interpretar(arbol,tabla)))
        let valorVarposi2: Simbolo = <Simbolo> tabla.getVariable(String(this.column.interpretar(arbol,tabla)))

        //si exite solo para el caso donde [a] y la posicion este marcada por variable
        if (valorVarposi1 != null && valorVarposi2 != null){
            //accede al valor de las variables pasadas como parametro posicion
            valorLista2D.setValor(newValorL2D,valorVarposi1.getValor(),valorVarposi2.getValor())
        }else if (valorVarposi1 != null && valorVarposi2 == null){
            //accede como posicion el valor de las variable encontrada en este caso variable posicion 1
            valorLista2D.setValor(newValorL2D,valorVarposi1.getValor(),this.column.interpretar(arbol,tabla))
        }else if (valorVarposi1 == null && valorVarposi2 != null){
            //accede como posicion el valor de las variable encontrada
            valorLista2D.setValor(newValorL2D,this.row.interpretar(arbol,tabla),valorVarposi2.getValor())
        }
        valorLista2D.setValor(newValorL2D,this.row.interpretar(arbol,tabla),this.column.interpretar(arbol,tabla))
    }
}