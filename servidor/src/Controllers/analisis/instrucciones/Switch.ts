import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Break from "./Break";
import Case from "./Case";
import Contador from "../simbolo/Contador";

export default class Switch extends Instruccion {
    private condicion: Instruccion
    private instrucciones: Case[]
    private defaul: Instruccion[]

    constructor(cond: Instruccion, inst: Case[], def: Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = cond
        this.instrucciones = inst
        this.defaul = def
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("Sentencia Switch")
        let variableSw = this.condicion.interpretar(arbol, tabla); //condicion del switch
        //variable de case ejemplo case 0: El 0 es la variable (tampoco hizo falta)
        //let a: any;              
        let temp: any
        //paso es una bandera para ejecutar los demas case sino ejecutan la instruccion break (no hace falta ya que retornamos el break)
        //let paso: boolean = false; 
        //este if es si en el switch vienen case y default
        if (this.instrucciones != null) {
            for (let elemento of this.instrucciones) {
                let condicionCase = elemento.getCondCase(arbol, newTabla);
                //console.log(a)
                //console.log(variableSw)
                if (elemento.condicion.tipoDato.getTipo() != this.condicion.tipoDato.getTipo()) {
                    return new Errores("Semantico", "La condicion del switch debe ser booleana", this.linea, this.columna)
                }

                if (elemento instanceof Break) return elemento;  //caso si viene break
                if (temp != null) return;
                if ((condicionCase == variableSw)) {  //((condicionCase == variableSw) || paso) 
                    temp = elemento.interpretar(arbol, newTabla)
                    //paso = true;
                    if (temp instanceof Break) return temp;
                }
            }
            //Entra al default si this.default != null 
            if (this.defaul != null) {
                for (let temp of this.defaul) {
                    temp.interpretar(arbol, newTabla);
                }
            }
            //este else es si en el switch solo viene el default
        } else {
            //Entra al default si this.default != null 
            if (this.defaul != null) {
                for (let temp of this.defaul) {
                    temp.interpretar(arbol, newTabla);
                }
            }
        }
    }

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        if (this.defaul != null) {
            let nodoSwitch = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoLli = `n${contador.get()}`
            let nodoCas = `n${contador.get()}`
            let nodoDef = `n${contador.get()}`
            let nodoLld = `n${contador.get()}`
            resultado += `${nodoSwitch}[label=\"SWITCH\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoLli}[label=\"{\"];\n`
            resultado += `${nodoCas}[label=\"SENTCASE\"];\n`
            resultado += `${nodoDef}[label=\"SENTDEFAULT\"];\n`
            resultado += `${nodoLld}[label=\"}\"];\n`
            resultado += `${anterior}->${nodoSwitch};\n`
            resultado += `${anterior}->${nodoPI};\n`
            resultado += `${anterior}->${nodoExp};\n`
            resultado += `${anterior}->${nodoPd};\n`
            resultado += `${anterior}->${nodoLli};\n`
            resultado += `${anterior}->${nodoCas};\n`
            resultado += `${anterior}->${nodoDef};\n`
            resultado += `${anterior}->${nodoLld};\n`
            resultado += this.condicion.getAST(nodoExp)
            for (let i of this.instrucciones) {
                resultado += i.getAST(nodoCas)
            }
            for (let i of this.defaul) {
                resultado += i.getAST(nodoDef)
            }
        }else{
            let nodoSwitch = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoLli = `n${contador.get()}`
            let nodoCas = `n${contador.get()}`
            let nodoLld = `n${contador.get()}`
            resultado += `${nodoSwitch}[label=\"SWITCH\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoLli}[label=\"{\"];\n`
            resultado += `${nodoCas}[label=\"SENTCASE\"];\n`
            resultado += `${nodoLld}[label=\"}\"];\n`
            resultado += `${anterior}->${nodoSwitch};\n`
            resultado += `${anterior}->${nodoPI};\n`
            resultado += `${anterior}->${nodoExp};\n`
            resultado += `${anterior}->${nodoPd};\n`
            resultado += `${anterior}->${nodoLli};\n`
            resultado += `${anterior}->${nodoCas};\n`
            resultado += `${anterior}->${nodoLld};\n`
            resultado += this.condicion.getAST(nodoExp)
            for (let i of this.instrucciones) {
                resultado += i.getAST(nodoCas)
            }
        }

        return resultado
    }
}


/* 
PARA HACER PRUEBAS:
int edad=112;
edad=18;
 switch(edad){
 Case 10:
    cout<< "entra 10" <<endl;
 Case 18:
    cout<< "entra 18" <<endl;
    //break;
 Case 25:
    cout<< "entra 25" <<endl;
 Default:
    cout<< "entra default" <<endl;
}
*/