import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";

export default class AccesoVar extends Instruccion{
    private id : string

    constructor(id:string, linea:number, columna:number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorVariable: Simbolo = tabla.getVariable(this.id)
        if (valorVariable == null) return new Errores("Semantico", "Acceso a varible invalido", this.linea, this.columna)
        //este tipo es para siempre estar verificando el tipo que estamos obteniendo de lo contrario sera tipo void
        this.tipoDato = valorVariable.getTipo()
        return valorVariable.getValor()
    }
}