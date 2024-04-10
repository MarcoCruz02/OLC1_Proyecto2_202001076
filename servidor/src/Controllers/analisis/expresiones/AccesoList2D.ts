import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Lista2D from "../simbolo/Lista2D";

export default class AccesoList2D extends Instruccion {
    private id: string
    private posicion1: number
    private posicion2: number

    constructor(id: string, linea: number, columna: number, posicion1:number, posicion2:number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.posicion1 = posicion1
        this.posicion2 = posicion2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorListaLista: Lista2D = tabla.getLista2D(this.id)
        if (valorListaLista == null) return new Errores("Semantico", "Acceso a lista 2D no valido", this.linea, this.columna)
        this.tipoDato = valorListaLista.getTipo()
        return valorListaLista.getValor(this.posicion1,this.posicion2)
    }
}