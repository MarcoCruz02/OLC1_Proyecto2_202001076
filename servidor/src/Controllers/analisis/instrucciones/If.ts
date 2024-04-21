import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Break from "./Break";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";

export default class If extends Instruccion {
    //almacena la condicion del if
    private condicion: Instruccion
    //almacena todo lo que esta dentro del if esperando a verificar si se ejecuta o no
    private instrucciones: Instruccion[]
    private instrucciones2: Instruccion[]


    constructor(cond: Instruccion, inst: Instruccion[],instSec:Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = cond
        this.instrucciones = inst
        this.instrucciones2=instSec
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //al estar en un if la condicion se valida en el ambito fuera de el
        let cond = this.condicion.interpretar(arbol, tabla)
        if (cond instanceof Errores) return cond

        //validamos que la condicion sea booleana
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            //console.log("entra err bool")
            return new Errores("Semantico", "La condicion debe ser bool", this.linea, this.columna)
        }

        //creamos tabla para el ambito nuevo del if
        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("Sentencia If")

        //si el valor interpretado es verdadero ejecutamos instrucciones de lo contrario no
        //console.log(cond)
        if (cond) {
            for (let i of this.instrucciones) {
                //dentro de el if tambien puede venir un break para detener en caso este pertenezca a un ciclo
                if (i instanceof Break) return i;    //si dentro del if viene un break directo retorno el break
                let resultado = i.interpretar(arbol, newTabla)
                //validacion si viene in if dentro de otro y se debe retornar el break
                if (resultado instanceof Break) return resultado
            }
        }else{
        //si no toma la instruccion secundaria
            if(this.instrucciones2){
                for (let i of this.instrucciones2) {
                    if (i instanceof Break) return i;    //si dentro del if viene un break retorno el break
                    let resultado = i.interpretar(arbol, newTabla)
                    //validacion si viene in if dentro de otro y se debe retornar el break
                    if (resultado instanceof Break) return resultado
                }
            }  
        }
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        if (this.instrucciones2 != null){
            let nodoT = `n${contador.get()}`
            let nodoIf = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoLli = `n${contador.get()}`
            let nodoIns = `n${contador.get()}`
            let nodoLld = `n${contador.get()}`
            let nodoElse = `n${contador.get()}`
            resultado += `${nodoT}[label=\"SENTIF\"];\n`
            resultado += `${nodoIf}[label=\"IF\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoLli}[label=\"{\"];\n`
            resultado += `${nodoIns}[label=\"INSTRUCCIONES\"];\n`
            resultado += `${nodoLld}[label=\"}\"];\n`
            resultado += `${nodoElse}[label=\"ELSE\"];\n`
            resultado += `${anterior}->${nodoT};\n`
            resultado += `${nodoT}->${nodoIf};\n`
            resultado += `${nodoT}->${nodoPI};\n`
            resultado += `${nodoT}->${nodoExp};\n`
            resultado += `${nodoT}->${nodoPd};\n`
            resultado += `${nodoT}->${nodoLli};\n`
            resultado += `${nodoT}->${nodoIns};\n`
            resultado += `${nodoT}->${nodoLld};\n`
            resultado += `${nodoT}->${nodoElse};\n`
            resultado += this.condicion.getAST(nodoExp)
            for(let i of this.instrucciones){
                resultado += i.getAST(nodoIns)
            }
            for(let i of this.instrucciones2){
                resultado += i.getAST(nodoElse)
            }
        }else{
            let nodoT = `n${contador.get()}`
            let nodoIf = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoLli = `n${contador.get()}`
            let nodoIns = `n${contador.get()}`
            let nodoLld = `n${contador.get()}`
            resultado += `${nodoT}[label=\"SENTIF\"];\n`
            resultado += `${nodoIf}[label=\"IF\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoLli}[label=\"{\"];\n`
            resultado += `${nodoIns}[label=\"INSTRUCCIONES\"];\n`
            resultado += `${nodoLld}[label=\"}\"];\n`
            resultado += `${anterior}->${nodoT};\n`
            resultado += `${nodoT}->${nodoIf};\n`
            resultado += `${nodoT}->${nodoPI};\n`
            resultado += `${nodoT}->${nodoExp};\n`
            resultado += `${nodoT}->${nodoPd};\n`
            resultado += `${nodoT}->${nodoLli};\n`
            resultado += `${nodoT}->${nodoIns};\n`
            resultado += `${nodoT}->${nodoLld};\n`
            resultado += this.condicion.getAST(nodoExp)
            for(let i of this.instrucciones){
                resultado += i.getAST(nodoIns)
            }
        }
        return resultado
    }
}

/*
ejempo de un break dentro de un if dentro de un ciclo
while(){
    if(){
        break:
        console.log("hola")
    }
}
en este caso el break para antes del cosole para revidar si este pertenece a un ciclo
*/ 