import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Lista from "../simbolo/Lista";
import Simbolo from "../simbolo/Simbolo";

export default class AccesoList extends Instruccion {
    private id: string
    private posicion: Instruccion

    constructor(id: string, linea: number, columna: number, posicion:Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.posicion = posicion
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorLista: Lista =<Lista> tabla.getLista(this.id)
        if (valorLista == null) return new Errores("Semantico", "Acceso a lista no valido", this.linea, this.columna)
        this.tipoDato = valorLista.getTipo()

        //verificamos que el valor de posicion pertenezcan a la tabla de simbolos por lo tanto sera variable
        let valorVarpos: Simbolo = <Simbolo> tabla.getVariable(String(this.posicion.interpretar(arbol,tabla)))

        //si exite solo para el caso donde [a] y la posicion este marcada por variable
        if (valorVarpos != null){
            //retorna como posicion el valor de las variable encontrada
            return valorLista.getValor(valorVarpos.getValor())
        }
        //de lo contrario es un numeros comun y su acceso se interpreta normal
        //console.log(this.posicion)
        return valorLista.getValor(this.posicion.interpretar(arbol,tabla))
    }
}