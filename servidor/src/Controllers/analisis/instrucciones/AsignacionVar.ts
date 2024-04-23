import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from '../simbolo/Tipo'
import Contador from "../simbolo/Contador";

export default class AsignacionVar extends Instruccion {
    private id: string
    private expresion: Instruccion

    constructor(id: string, expresion: Instruccion, linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.expresion = expresion
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //al interpretar expresion sera una instruccion por lo tanto tenemos que saber su valor resultante
        let newValor = this.expresion.interpretar(arbol, tabla)
        if (newValor instanceof Errores) return newValor

        //verificamos que a la variable a la que se le va a signar exista
        let valorL2D = tabla.getVariable(this.id.toLocaleLowerCase())
        if (valorL2D == null) return new Errores("Semantico", "Variable no existente", this.linea, this.columna)

        //validamos que sea del mismo tipo
        if (this.expresion.tipoDato.getTipo() != valorL2D.getTipo().getTipo()) return new Errores("Semantico", "Asignacion erronea no coinciden los tipos", this.linea, this.columna)

        this.tipoDato = valorL2D.getTipo()
        valorL2D.setValor(newValor)
    }

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoT = `n${contador.get()}`
        let nodoId = `n${contador.get()}`
        let nodoIgual = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodopc = `n${contador.get()}`
        let obtId = `n${contador.get()}`
        resultado += `${nodoT}[label=\"ASIGNACION\"];\n`
        resultado += `${nodoId}[label=\"ID\"];\n`
        resultado += `${nodoIgual}[label=\"=\"];\n`
        resultado += `${nodoExp}[label=\"EXPRECION\"];\n`
        resultado += `${nodopc}[label=\";\"];\n`
        resultado += `${obtId}[label=\"${this.id}\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoId};\n`
        resultado += `${nodoT}->${nodoIgual};\n`
        resultado += `${nodoT}->${nodoExp};\n`
        resultado += `${nodoT}->${nodopc};\n`
        resultado += `${nodoId}->${obtId};\n`
        resultado += this.expresion.getAST(nodoExp)
        return resultado
    }
}