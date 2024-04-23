import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Break from "./Break";
import Contador from "../simbolo/Contador";

export default class Dowhile extends Instruccion{
    private condicion : Instruccion
    private instrucciones : Instruccion[]

    constructor(cond : Instruccion, inst : Instruccion[], linea: number, columna: number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = cond
        this.instrucciones = inst
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //interpreto 1 vez
        let cond = this.condicion.interpretar(arbol, tabla)
        //valido que no me de error
        if (cond instanceof Errores) return cond

        //se valida la condicion
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL){
            return new Errores("Semantico", "Condicion en Do-while no es booleana", this.linea, this.columna)
        }

        //usaremos un Do while donde la condicion sea nuestro metodo interpretar y dentro del do las instrucciones
        do{
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Sentencia Do-While")
            for(let i of this.instrucciones){
                //añadimos que pasa si viene un break
                if (i instanceof Break) return;   //si el break viene dentro del ciclo  nada mas
                let resultado = i.interpretar(arbol, newTabla)
                //si el break viene dentro de un if en las instrucciones
                if (resultado instanceof Break) return;
            }
        }while(this.condicion.interpretar(arbol, tabla));
    }

    //TKDO LLAVEI INSTRUCCIONES LLAVED TKWHILE PARI EXPRESION PARD
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        let nodoT = `n${contador.get()}`
        let nodoDo = `n${contador.get()}`
        let nodoLli = `n${contador.get()}`
        let nodoIns = `n${contador.get()}`
        let nodoLld = `n${contador.get()}`
        let nodoWhile = `n${contador.get()}`
        let nodoPI = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodoPd = `n${contador.get()}`
        let nodopc = `n${contador.get()}`
        resultado += `${nodoT}[label=\"SENTDOWHILE\"];\n`
        resultado += `${nodoDo}[label=\"DO\"];\n`
        resultado += `${nodoLli}[label=\"{\"];\n`
        resultado += `${nodoIns}[label=\"INSTRUCCIONES\"];\n`
        resultado += `${nodoLld}[label=\"}\"];\n`
        resultado += `${nodoWhile}[label=\"WHILE\"];\n`
        resultado += `${nodoPI}[label=\"(\"];\n`
        resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
        resultado += `${nodoPd}[label=\")\"];\n`
        resultado += `${nodopc}[label=\";\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoDo};\n`
        resultado += `${nodoT}->${nodoLli};\n`
        resultado += `${nodoT}->${nodoIns};\n`
        resultado += `${nodoT}->${nodoLld};\n`
        resultado += `${nodoT}->${nodoWhile};\n`
        resultado += `${nodoT}->${nodoPI};\n`
        resultado += `${nodoT}->${nodoExp};\n`
        resultado += `${nodoT}->${nodoPd};\n`
        resultado += `${nodoT}->${nodopc};\n`
        resultado += this.condicion.getAST(nodoExp)
        for(let i of this.instrucciones){
            resultado += i.getAST(nodoIns)
        }
        return resultado
    }
}