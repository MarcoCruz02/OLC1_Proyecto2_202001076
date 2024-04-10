import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Lista from "../simbolo/Lista";

export default class AccesoList extends Instruccion {
    private id: string
    private posicion: number

    constructor(id: string, linea: number, columna: number,posicion:number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.posicion = posicion
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorVariable: Lista = tabla.getLista(this.id)
        if (valorVariable == null) return new Errores("Semantico", "Acceso a lista no valido", this.linea, this.columna)
        this.tipoDato = valorVariable.getTipo()
        return valorVariable.getValor(this.posicion)
    }
}