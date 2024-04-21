import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Contador from "../simbolo/Contador";

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

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let nodoImpresion= `n${contador.get()}`
        let nodoCout = `n${contador.get()}`
        let nodoDM1 = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodoDM2 = `n${contador.get()}`
        let nodoend = `n${contador.get()}`
        let nodopc = `n${contador.get()}`
        let resultado = `${nodoImpresion}[label=\"IMPRESION\"];\n`
        resultado += `${nodoCout}[label=\"COUT\"];\n`
        resultado += `${nodoDM1}[label=\"<<\"];\n`
        resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
        resultado += `${nodoDM2}[label=\"<<\"];\n`
        resultado += `${nodoend}[label=\"ENDL\"];\n`
        resultado += `${nodopc}[label=\";\"];\n`
        resultado += `${anterior}->${nodoImpresion};\n`
        resultado += `${nodoImpresion}->${nodoCout};\n`
        resultado += `${nodoImpresion}->${nodoDM1};\n`
        resultado += `${nodoImpresion}->${nodoExp};\n`
        resultado += `${nodoImpresion}->${nodoDM2};\n`
        resultado += `${nodoImpresion}->${nodoend};\n`
        resultado += `${nodoImpresion}->${nodopc};\n`
        resultado += this.expresion.getAST(nodoExp)

        return resultado
    }
}