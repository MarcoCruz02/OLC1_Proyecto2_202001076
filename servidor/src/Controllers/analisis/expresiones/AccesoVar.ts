import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Contador from "../simbolo/Contador";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";

export default class AccesoVar extends Instruccion{
    private id : string
    private obtVal =""    //para AST

    constructor(id:string, linea:number, columna:number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //casteamos con <Simbolo>
        let valorVariable: Simbolo = <Simbolo> tabla.getVariable(this.id)
        if (valorVariable == null) return new Errores("Semantico", "Acceso a varible invalido", this.linea, this.columna)
        //este tipo es para siempre estar verificando el tipo que estamos obteniendo de lo contrario sera tipo void
        this.tipoDato = valorVariable.getTipo()
        this.obtVal = String(valorVariable.getValor()) //para AST
        return valorVariable.getValor()
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoValVar = `n${contador.get()}`
        let nodoId = `n${contador.get()}`
        let nodoVal = `n${contador.get()}`
        resultado += `${nodoValVar}[label=\"ID\"];\n`
        resultado += `${nodoId}[label=\"${this.id}\"];\n`
        resultado += `${nodoVal}[label=\"${this.obtVal}\"];\n`
        resultado += `${anterior}->${nodoValVar};\n`
        resultado += `${nodoValVar}->${nodoId};\n`
        resultado += `${nodoId}->${nodoVal};\n`
        return resultado
    }
}