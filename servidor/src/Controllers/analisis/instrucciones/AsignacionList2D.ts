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

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoT = `n${contador.get()}`
        let nodoId = `n${contador.get()}`
        let nodoCI = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodoCD = `n${contador.get()}`
        let nodoCI2 = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        let nodoCD2 = `n${contador.get()}`
        let nodoIgual = `n${contador.get()}`
        let nodoExp3 = `n${contador.get()}`
        let nodopc = `n${contador.get()}`
        let obtId = `n${contador.get()}`
        resultado += `${nodoT}[label=\"ASIGNLISTA\"];\n`
        resultado += `${nodoId}[label=\"ID\"];\n`
        resultado += `${nodoCI}[label=\"[\"];\n`
        resultado += `${nodoExp}[label=\"EXPRECION\"];\n`
        resultado += `${nodoCD}[label=\"]\"];\n`
        resultado += `${nodoCI2}[label=\"[\"];\n`
        resultado += `${nodoExp2}[label=\"EXPRECION\"];\n`
        resultado += `${nodoCD2}[label=\"]\"];\n`
        resultado += `${nodoIgual}[label=\"=\"];\n`
        resultado += `${nodoExp3}[label=\"EXPRECION\"];\n`
        resultado += `${nodopc}[label=\";\"];\n`
        resultado += `${obtId}[label=\"${this.id}\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoId};\n`
        resultado += `${nodoT}->${nodoCI};\n`
        resultado += `${nodoT}->${nodoExp};\n`
        resultado += `${nodoT}->${nodoCD};\n`
        resultado += `${nodoT}->${nodoCI2};\n`
        resultado += `${nodoT}->${nodoExp2};\n`
        resultado += `${nodoT}->${nodoCD2};\n`
        resultado += `${nodoT}->${nodoIgual};\n`
        resultado += `${nodoT}->${nodoExp3};\n`
        resultado += `${nodoT}->${nodopc};\n`
        resultado += `${nodoId}->${obtId};\n`
        resultado += this.row.getAST(nodoExp)
        resultado += this.column.getAST(nodoExp2)
        resultado += this.expresion.getAST(nodoExp3)
        return resultado
    }
}