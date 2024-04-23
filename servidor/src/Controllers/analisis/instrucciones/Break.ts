import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";

export default class Break extends Instruccion{
    constructor(linea : number, columna : number){
        super(new Tipo(tipoDato.VOID), linea, columna)
    }

    //ya que el break solo me ayuda a salir de un ciclo , basta solo con el return
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return;
    }

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoT = `n${contador.get()}`
        let nodoBreak = `n${contador.get()}`
        let nodoPc = `n${contador.get()}`
        resultado += `${nodoT}[label=\"SENTBREAK\"];\n`
        resultado += `${nodoBreak}[label=\"BREAK\"];\n`
        resultado += `${nodoPc}[label=\";\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoBreak};\n`
        resultado += `${nodoT}->${nodoPc};\n`
        return resultado
    }
}