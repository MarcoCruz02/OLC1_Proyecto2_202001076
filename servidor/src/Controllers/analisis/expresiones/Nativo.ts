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

    /*identify: string = Guid.create().toString().replace(/-/gm, "");   //identificador unico para el nodo
    graph(): string {
        let str: string = `node${this.identify} [label="${this.valor}"];\n`;
        return str;
    }*/

    //identify: string = Guid.create().toString().replace(/-/gm, ""); //identificador unico para el nodo
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let nodoNativo = `n${contador.get()}`
        let nodoValor = `n${contador.get()}`
        let resultado = `n${nodoNativo}[label = \"Nativo\"];\n`
        resultado += `n${nodoValor}[label = \"${this.valor}\"];\n`
        resultado += `n${nodoNativo}[label = \"${this.valor}\"];\n`
        resultado += `n${anterior}[label = \"${this.valor}\"];\n`
        return resultado
    }
}