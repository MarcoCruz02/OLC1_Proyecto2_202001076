import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";

export default class AccesoIncDec extends Instruccion{
    private id : string
    private signo : string
    private obtVal = ""  //para AST

    constructor(id:string, signo:string, linea:number, columna:number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.signo = signo
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //casteamos con <Simbolo>
        let valorVariable: Simbolo = <Simbolo> tabla.getVariable(this.id)
        if (valorVariable == null) return new Errores("Semantico", "Acceso a Variable Incrementada invalido", this.linea, this.columna)
        //este tipo es para siempre estar verificando el tipo que estamos obteniendo de lo contrario sera tipo void
        this.obtVal = String(valorVariable.getValor())  // para AST
        this.tipoDato = valorVariable.getTipo()
        if (this.signo == "++"){
            if (this.tipoDato.getTipo() == tipoDato.ENTERO){
                let varIncrementada = parseInt(valorVariable.getValor()) + 1 ;
                valorVariable.setValor(String(varIncrementada))
            }else if (this.tipoDato.getTipo() == tipoDato.DECIMAL){
                let varIncrementada = parseFloat(valorVariable.getValor()) + 1 ;
                valorVariable.setValor(String(varIncrementada))
            } 
        }else if (this.signo == "--"){
            if (this.tipoDato.getTipo() == tipoDato.ENTERO){
                let varDecremento = parseInt(valorVariable.getValor()) - 1 ;
                valorVariable.setValor(String(varDecremento))
            }else if (this.tipoDato.getTipo() == tipoDato.DECIMAL){
                let varDecremento = parseFloat(valorVariable.getValor()) - 1 ;
                valorVariable.setValor(String(varDecremento))
            } 
        }else{
            return new Errores("Semantico", "Variable a incrementar o decrementar no aceptada", this.linea, this.columna)
        }
        return valorVariable.getValor()
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        if (this.signo == "++"){
            let nodoAumento = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoVal = `n${contador.get()}`
            resultado = `${nodoAumento}[label=\"++\"];\n`
            resultado = `${nodoExp}[label=\"EXPRESION\"];\n`
            resultado = `${nodoId}[label=\"${this.id}\"];\n`
            resultado = `${nodoVal}[label=\"${this.obtVal}\"];\n`
            resultado += `${anterior}->${nodoAumento};\n`
            resultado += `${anterior}->${nodoExp};\n`
            resultado += `${nodoExp}->${nodoId};\n`
            resultado += `${nodoId}->${nodoVal};\n`
            //return resultado
        } else if (this.signo == "--"){
            let nodoAumento = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoVal = `n${contador.get()}`
            resultado = `${nodoAumento}[label=\"--\"];\n`
            resultado = `${nodoExp}[label=\"EXPRESION\"];\n`
            resultado = `${nodoId}[label=\"${this.id}\"];\n`
            resultado = `${nodoVal}[label=\"${this.obtVal}\"];\n`
            resultado += `${anterior}->${nodoAumento};\n`
            resultado += `${anterior}->${nodoExp};\n`
            resultado += `${nodoExp}->${nodoId};\n`
            resultado += `${nodoId}->${nodoVal};\n`
            //return resultado
        }
        return resultado
    }
}