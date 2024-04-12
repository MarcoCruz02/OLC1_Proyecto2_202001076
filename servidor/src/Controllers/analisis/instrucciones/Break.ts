import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";

export default class Break extends Instruccion{
    constructor(linea : number, columna : number){
        super(new Tipo(tipoDato.VOID), linea, columna)
    }

    //ya que el break solo me ayuda a salir de un ciclo , basta solo con el return
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        return;
    }
}