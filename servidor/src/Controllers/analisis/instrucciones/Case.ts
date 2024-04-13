import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Break from "./Break";

export default class Case extends Instruccion {
    public condicion: Instruccion
    public instrucciones: Instruccion[]

    constructor(cond: Instruccion, ins: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = cond;
        this.instrucciones = ins;
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let cond = this.condicion.interpretar(arbol, tabla)
        if (cond instanceof Errores) return cond

        //validamos que la condicion sea booleana
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            return new Errores("Semantico", "La condicion debe ser bool", this.linea, this.columna)
        }


    }
}



