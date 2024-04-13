import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Case from "./Case";

export default class Switch extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Case[]


    constructor(cond: Instruccion, inst: Case[], linea: number, columna: number) {
        console.log("entra constructor")
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = cond
        this.instrucciones = inst
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let cond = this.condicion.interpretar(arbol, tabla)
        if (cond instanceof Errores) return cond

        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("Sentencia Switch")
        for (var i = 0; i < this.instrucciones.length; i++) {
            console.log("entro a condicion del case")
            var objCase = this.instrucciones[i];
            var condCase = objCase.condicion.interpretar(arbol, newTabla)
            console.log(condCase)     
            var instCase = objCase.instrucciones
            for (var j = 0; j < instCase.length; j++){
                console.log("entro a instrucciones del case")
                var istCase = instCase[j].interpretar(arbol,newTabla);
                console.log(instCase)
            }
        }
    }
}