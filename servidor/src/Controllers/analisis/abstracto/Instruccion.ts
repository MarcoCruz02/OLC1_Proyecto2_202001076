import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo from "../simbolo/Tipo";
import Arbol from "../simbolo/Arbol";


// todo va a estar dentro de esta clase como un numero 5 
//lo que sea expresion como un for un while lo manejaremos dentro de la carpeta expresiones
export abstract class Instruccion {
    public tipoDato: Tipo
    public linea: number
    public columna: number

    constructor(tipo: Tipo, linea: number, columna: number) {
        this.tipoDato = tipo
        this.linea = linea
        this.columna = columna
    }

    //todas nuestras instrucciones tendran este metodo permitiendo que por ejemplo una suma pueda ejecutar a sus hijos
    abstract interpretar(arbol: Arbol, tabla: tablaSimbolo): any

    //generamos grafico ast
    abstract getAST(anterior: string): string


}
