import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Contador from "../simbolo/Contador";

export default class Declaracion extends Instruccion{
    //declaramos identificador como lista para cuando se declare asi int x,y,z ...
    private identificador : string[]
    private valor : Instruccion 

    constructor(tipo:Tipo, linea:number, columna: number, id : string[], valor : Instruccion){
        super(tipo, linea, columna)
        this.identificador = id
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if (this.valor != null){
            //primero se verifica que no sea un error
            let valorFinal = this.valor.interpretar(arbol, tabla)
            //console.log(valorFinal)
            //console.log(typeof valorFinal)
            if (valorFinal instanceof Errores) return valorFinal
            
            if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()){
                //console.log("-> "+this.valor.tipoDato.getTipo())
                //console.log("-> "+this.tipoDato.getTipo())
                return new Errores("Semantico", "No es posible declarar variable tipos no coinciden", this.linea, this.columna)
            }
            //si ya se verifico que el valor no es un error y los tipos coinciden, ya se puede declarar
            //ahora que es una lista debemos recorrerla para declarar y almacenar ids
            //console.log(this.identificador)
            this.identificador.forEach(identificadorActual => { 
                if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, valorFinal))){
                    return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                }   
            });
        } else {
            //si la expresion es null entra para asignar por defecto
            switch (this.tipoDato.getTipo()) {
                case tipoDato.ENTERO:
                    //si el tipo es entero agregamos el valor por defecto 0 y asi con cada tipo
                    this.identificador.forEach(identificadorActual => {
                        //console.log("entra entero " +identificadorActual)
                        //console.log(this.tipoDato.getTipo())
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, 0))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                    //break;
                case tipoDato.DECIMAL:
                    this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, 0.0))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                    //break;
                case tipoDato.BOOL:
                    this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, true))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                    //break;
                case tipoDato.CARACTER:
                        this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, ''))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                    //break;
                case tipoDato.CADENA:
                    this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, ""))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                    //break;
                case tipoDato.VOID:
                    //console.log("----< "+this.identificador)
                    //console.log("----< "+this.tipoDato.getTipo())
                    return new Errores("Semantico", "No es posible declarar variables tipo void", this.linea, this.columna)
                    //break;
                }
        }    
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        if (this.valor != null){
            let nodoT= `n${contador.get()}`
            let nodoTipo = `n${contador.get()}`
            let nodoExp1 = `n${contador.get()}`
            let nodoIgual = `n${contador.get()}`
            let nodoExp2 = `n${contador.get()}`
            let nodopc = `n${contador.get()}`
            let obtId = `n${contador.get()}`
            resultado += `${nodoT}[label=\"DECVARIABLE\"];\n`
            resultado += `${nodoTipo}[label=\"TIPODATO\"];\n`
            resultado += `${nodoExp1}[label=\"ID\"];\n`
            resultado += `${nodoIgual}[label=\"=\"];\n`
            resultado += `${nodoExp2}[label=\"EXPRECION\"];\n`
            resultado += `${nodopc}[label=\";\"];\n`
            let ids = ""  //para obtener ids de this.identificador
            for(let i = 0 ; i< this.identificador.length ;i++){
                if(i == 0){
                    ids += this.identificador[i]
                }
                ids += String(","+this.identificador[i])
            }
            resultado += `${obtId}[label=\"${ids}\"];\n`
            resultado += `${anterior}->${nodoT};\n`
            resultado += `${nodoT}->${nodoTipo};\n`
            resultado += `${nodoT}->${nodoExp1};\n`
            resultado += `${nodoT}->${nodoIgual};\n`
            resultado += `${nodoT}->${nodoExp2};\n`
            resultado += `${nodoT}->${nodopc};\n`
            resultado += `${nodoExp1}->${obtId};\n`
            resultado += this.valor.getAST(nodoExp2)
        }else{
            let nodoT= `n${contador.get()}`
            let nodoTipo = `n${contador.get()}`
            let nodoExp1 = `n${contador.get()}`
            let nodopc = `n${contador.get()}`
            let obtId = `n${contador.get()}`
            resultado += `${nodoT}[label=\"DECVARIABLE\"];\n`
            resultado += `${nodoTipo}[label=\"TIPODATO\"];\n`
            resultado += `${nodoExp1}[label=\"ID\"];\n`
            resultado += `${nodopc}[label=\";\"];\n`
            let ids = ""  //para obtener ids de this.identificador
            for(let i = 0 ; i< this.identificador.length ;i++){
                if(i == 0){
                    ids += this.identificador[i]
                }
                ids += String(","+this.identificador[i])
            }
            resultado += `${obtId}[label=\"${ids}\"];\n`
            resultado += `${anterior}->${nodoT};\n`
            resultado += `${nodoT}->${nodoTipo};\n`
            resultado += `${nodoT}->${nodoExp1};\n`
            resultado += `${nodoT}->${nodopc};\n`
            resultado += `${nodoExp1}->${obtId};\n`
        }
        return resultado
    }
}

/* 
        //esto para variables no listas
        //primero se verifica que no sea un error
        let valorFinal = this.valor.interpretar(arbol, tabla)
        if (valorFinal instanceof Errores) return valorFinal
        
        if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()){
            return new Errores("Semantico", "No es posible declarar variable", this.linea, this.columna)
        }
        //si ya se verifico que el valor no es un error y los tipos coinciden, ya se puede declarar
        if(!tabla.setVariable(new Simbolo(this.tipoDato, this.identificador, valorFinal))){
            return new Errores("Semantico", "No es posible declarar variable debido a que ya existe", this.linea, this.columna)
        }
*/

