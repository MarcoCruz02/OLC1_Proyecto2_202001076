import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Break from "./Break";
import Contador from "../simbolo/Contador";

export default class Case extends Instruccion {
    public condicion: Instruccion
    public instrucciones: Instruccion[]

    constructor(condCase: Instruccion, instCase: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = condCase
        this.instrucciones = instCase
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let a: any | null
        for (let elemento of this.instrucciones) {
            a = elemento.interpretar(arbol, tabla);
            if (a != null) return a;
            //si la instruccion es break retornamos
            if (elemento instanceof Break) return elemento;
            //caso si viene un break dentro de un cilo en el case
            if (a instanceof Break) return a
        }
    }

    public getCondCase(arbol: Arbol, tabla: tablaSimbolo) {
        return this.condicion.interpretar(arbol, tabla)
    }

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoT = `n${contador.get()}`
        let nodoCase = `n${contador.get()}`
        let nodoExp1 = `n${contador.get()}`
        let nododp = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        resultado += `${nodoT}[label=\"SENTCASE\"];\n`
        resultado += `${nodoCase}[label=\"CASE\"];\n`
        resultado += `${nodoExp1}[label=\"EXPRECION\"];\n`
        resultado += `${nododp}[label=\":\"];\n`
        resultado += `${nodoExp2}[label=\"EXPRECION\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoCase};\n`
        resultado += `${nodoT}->${nodoExp1};\n`
        resultado += `${nodoT}->${nododp};\n`
        resultado += `${nodoT}->${nodoExp2};\n`
        resultado += this.condicion.getAST(nodoExp1)
        for(let i of this.instrucciones){
            resultado += i.getAST(nodoExp2)
        }

        return resultado
    }
}



