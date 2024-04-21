import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Lista from "../simbolo/Lista";
import Simbolo from "../simbolo/Simbolo";
import Contador from "../simbolo/Contador";

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

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoT = `n${contador.get()}`
        let nodoId = `n${contador.get()}`
        let nodoCI = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodoCD = `n${contador.get()}`
        resultado += `${nodoT}[label=\"ACCESOLISTA\"];\n`
        resultado += `${nodoId}[label=\"ID\"];\n`
        resultado += `${nodoCI}[label=\"[\"];\n`
        resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
        resultado += `${nodoCD}[label=\"]\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoId};\n`
        resultado += `${nodoT}->${nodoCI};\n`
        resultado += `${nodoT}->${nodoExp};\n`
        resultado += `${nodoT}->${nodoCD};\n`
        resultado += this.posicion.getAST(nodoExp)
        return resultado
    }
}