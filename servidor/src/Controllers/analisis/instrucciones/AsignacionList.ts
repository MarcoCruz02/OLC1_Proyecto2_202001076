import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Contador from "../simbolo/Contador";

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

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoT = `n${contador.get()}`
        let nodoId = `n${contador.get()}`
        let nodoCI = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodoCD = `n${contador.get()}`
        let nodoIgual = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        let nodopc = `n${contador.get()}`
        let obtId = `n${contador.get()}`
        resultado += `${nodoT}[label=\"ASIGNLISTA\"];\n`
        resultado += `${nodoId}[label=\"ID\"];\n`
        resultado += `${nodoCI}[label=\"[\"];\n`
        resultado += `${nodoExp}[label=\"EXPRECION\"];\n`
        resultado += `${nodoCD}[label=\"]\"];\n`
        resultado += `${nodoIgual}[label=\"=\"];\n`
        resultado += `${nodoExp2}[label=\"EXPRECION\"];\n`
        resultado += `${nodopc}[label=\";\"];\n`
        resultado += `${obtId}[label=\"${this.id}\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoId};\n`
        resultado += `${nodoT}->${nodoCI};\n`
        resultado += `${nodoT}->${nodoExp};\n`
        resultado += `${nodoT}->${nodoCD};\n`
        resultado += `${nodoT}->${nodoIgual};\n`
        resultado += `${nodoT}->${nodoExp2};\n`
        resultado += `${nodoT}->${nodopc};\n`
        resultado += `${nodoId}->${obtId};\n`
        resultado += this.posicion.getAST(nodoExp)
        resultado += this.expresion.getAST(nodoExp2)
        return resultado
    }
}