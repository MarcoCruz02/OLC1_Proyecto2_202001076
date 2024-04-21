import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Break from "./Break";
import Contador from "../simbolo/Contador";

export default class While extends Instruccion{
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
            return new Errores("Semantico", "Condicion en while no es booleana", this.linea, this.columna)
        }

        //usaremos un while donde la condicion sea nuestro metodo interpretar y las instrucciones dentro del while
        while(this.condicion.interpretar(arbol, tabla)){
            let newTabla = new tablaSimbolo(tabla)
            newTabla.setNombre("Sentencia While")
            for(let i of this.instrucciones){
                //añadimos que pasa si viene un break
                if (i instanceof Break) return;   //si el break viene dentro del ciclo  nada mas
                let resultado = i.interpretar(arbol, newTabla)
                //si el break viene dentro de un if en las instrucciones
                if (resultado instanceof Break) return;
                //faltan manejar errores ..........
            }
        }
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        let nodoWhile = `n${contador.get()}`
        let nodoPI = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodoPd = `n${contador.get()}`
        let nodoLli = `n${contador.get()}`
        let nodoIns = `n${contador.get()}`
        let nodoLld = `n${contador.get()}`
        let nodopc = `n${contador.get()}`
        resultado += `${nodoWhile}[label=\"WHILE\"];\n`
        resultado += `${nodoPI}[label=\"(\"];\n`
        resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
        resultado += `${nodoPd}[label=\")\"];\n`
        resultado += `${nodoLli}[label=\"{\"];\n`
        resultado += `${nodoIns}[label=\"INSTRUCCIONES\"];\n`
        resultado += `${nodoLld}[label=\"}\"];\n`
        resultado += `${nodopc}[label=\";\"];\n`
        resultado += `${anterior}->${nodoWhile};\n`
        resultado += `${anterior}->${nodoPI};\n`
        resultado += `${anterior}->${nodoExp};\n`
        resultado += `${anterior}->${nodoPd};\n`
        resultado += `${anterior}->${nodoLli};\n`
        resultado += `${anterior}->${nodoIns};\n`
        resultado += `${anterior}->${nodoLld};\n`
        resultado += `${anterior}->${nodopc};\n`
        resultado += this.condicion.getAST(nodoExp)
        for(let i of this.instrucciones){
            resultado += i.getAST(nodoIns)
        }
        return resultado
    }
}