import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";


export default class Return extends Instruccion{
    private expresion : Instruccion
    private valor : any
    constructor(exp :  Instruccion, valor : any, linea : number, columna : number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.expresion = exp
        this.valor = valor
    }

    //ya que el break solo me ayuda a salir de un ciclo , basta solo con el return
    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        this.valor = this.expresion.interpretar(arbol,tabla)
        if (this.expresion.tipoDato.getTipo() == tipoDato.ENTERO){
            this.tipoDato = new Tipo(tipoDato.ENTERO)
            //console.log("tipo ent en return")
            //console.log(this.valor)
            return this.valor;
        } else if (this.expresion.tipoDato.getTipo() == tipoDato.CADENA){
            this.tipoDato = new Tipo(tipoDato.CADENA)
            //console.log("tipo cad en return")
            //console.log(this.valor)
            return this.valor;
        } else if (this.expresion.tipoDato.getTipo() == tipoDato.DECIMAL){
            this.tipoDato = new Tipo(tipoDato.DECIMAL)
            //console.log("tipo dec en return")
            //console.log(this.valor)
            return this.valor;
        } else if (this.expresion.tipoDato.getTipo() == tipoDato.CARACTER){
            this.tipoDato = new Tipo(tipoDato.CARACTER)
            //console.log("tipo car en return")
            //console.log(this.valor)
            return this.valor;
        } else if (this.expresion.tipoDato.getTipo() == tipoDato.BOOL){
            this.tipoDato = new Tipo(tipoDato.BOOL)
            //console.log("tipo bol en return")
            //console.log(this.valor)
            return this.valor;
        }
        //console.log(this.valor)
        return;
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        let nodoReturn = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodopc = `n${contador.get()}`
        resultado += `${nodoReturn}[label=\"RETURN\"];\n`
        resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
        resultado += `${nodopc}[label=\";\"];\n`
        resultado += `${anterior}->${nodoReturn};\n`
        resultado += `${anterior}->${nodoExp};\n`
        resultado += `${anterior}->${nodopc};\n`
        resultado += this.expresion.getAST(nodoExp)
        return resultado
    }
}