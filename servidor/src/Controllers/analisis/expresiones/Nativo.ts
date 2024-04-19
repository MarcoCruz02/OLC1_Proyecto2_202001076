import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
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
    generarAST(anterior:string , arbol:Arbol): string {
        //con cada llamada a .getcontador el id aumenta 
        let id1 = arbol.getContador()
        let id2 = arbol.getContador()
        let cadena = `n${id1}[label="Nativo"];\n`
        cadena+= `n${id2}[label="${this.valor}"];\n`
        cadena+= `n${id1} -> n${id2};\n`
        cadena+= `${anterior} -> n${id1};\n`
        return cadena;
        
    }
}