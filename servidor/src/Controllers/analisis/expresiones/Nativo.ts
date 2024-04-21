import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import Contador from "../simbolo/Contador";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import { Guid } from "guid-typescript/dist/guid";

//enteros y decimales
export default class Nativo extends Instruccion {
    valor: any

    constructor(tipo: Tipo, valor: any, fila: number, columna: number) {
        super(tipo, fila, columna)
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return this.valor
    }

    /*
     Generar un nodo nativo ,valor
     Nativo -> valor
     anterior -> Nativo
    */

    //identify: string = Guid.create().toString().replace(/-/gm, ""); //identificador unico para el nodo
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let nodoNativo = `n${contador.get()}`
        let nodoValor = `n${contador.get()}`
        let resultado = `${nodoNativo}[label=\"NATIVO\"];\n`
        resultado += `${nodoValor}[label=\"${this.valor}\"];\n`
        resultado += `${nodoNativo}->${nodoValor};\n`
        resultado += `${anterior}->${nodoNativo};\n`
        return resultado
    }
}