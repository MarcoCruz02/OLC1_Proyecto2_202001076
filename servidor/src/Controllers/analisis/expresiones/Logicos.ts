import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Nativo from "./Nativo";
import Relacionales from "./Relacionales";
import AccesoVar from "./AccesoVar";

export default class Logicos extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private logico: Logico
    private operandoUnico: Instruccion | undefined

    private signoObt = ""        //para ast
    private opObt1 = ""          //para ast
    private opObt2 = ""          //para ast

    constructor(Oplogic: Logico, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.BOOL), fila, col)
        this.logico = Oplogic
        if (!op2) this.operandoUnico = op1
        else {
            this.operando1 = op1
            this.operando2 = op2
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer, Unico = null        //variables que me sirven para guardar el valor interpretado
        if (this.operandoUnico != null) {
            //al hacer esto de interpretar nos va a permitir ir bajando hasta que encuentre la hoja y luego subira 
            Unico = this.operandoUnico.interpretar(arbol, tabla)    //en error revisamos la semantica
            if (Unico instanceof Errores) return Unico              //retornamos el error si es el caso
            this.opObt1 = Unico         //para ast
            this.opObt2 = "null"        //para ast
        } else {
            opIzq = this.operando1?.interpretar(arbol, tabla)
            if (opIzq instanceof Errores) return opIzq
            opDer = this.operando2?.interpretar(arbol, tabla)
            if (opDer instanceof Errores) return opDer
            this.opObt1 = opIzq        //para ast
            this.opObt2 = opDer        //para ast
        }

        switch (this.logico) {
            case Logico.OR:
                this.signoObt = "||"        //para ast
                return this.or(opIzq, opDer)
            case Logico.AND:
                this.signoObt = "&&"        //para ast
                return this.and(opIzq, opDer)
            case Logico.NOT:
                this.signoObt = "!"        //para ast
                return this.not(Unico)
            default:
                return new Errores("Semantico", "Operador Logico Invalido", this.linea, this.columna)
        }
    }

    generarAST(anterior: string, arbol: Arbol): string {
        //con cada llamada a .getcontador el id aumenta 
        let id1 = arbol.getContador()
        let id2 = arbol.getContador()
        let id3 = arbol.getContador()
        let id4 = arbol.getContador()
        let id5 = arbol.getContador()
        let cadena = `n${id1}[label="RELACIONAL"];\n`
        if (this.opObt2 != "null"){
            cadena+= `n${id2}[label="EXPRESION"];\n`
            cadena+= `n${id3}[label="EXPRESION"];\n`
            if (this.operando1 instanceof Nativo){
                cadena+= `n${id4}[label="Nativo"];\n`
            }else if (this.operando1 instanceof Relacionales){
                cadena+= `n${id4}[label="RELACIONAL"];\n`
            }else if (this.operando1 instanceof AccesoVar){
                cadena+= `n${id4}[label="AccesoVar"];\n`
            }

            if (this.operando2 instanceof Nativo){
                cadena+= `n${id5}[label="Nativo"];\n`
            }else if (this.operando2 instanceof Relacionales){
                cadena+= `n${id5}[label="RELACIONAL"];\n`
            }else if (this.operando2 instanceof AccesoVar){
                cadena+= `n${id5}[label="AccesoVar"];\n`
            }
            cadena+= `n${id1} -> n${id2};\n`
            cadena+= `n${id1} -> n${this.signoObt};\n`
            cadena+= `n${id1} -> n${id3};\n`
            cadena+= `n${id2} -> n${id4};\n`
            cadena+= `n${id3} -> n${id5};\n`
            cadena+= `n${id4} -> n${this.opObt1};\n`
            cadena+= `n${id5} -> n${this.opObt1};\n`
            cadena+= `${anterior} -> n${id1};\n`
        }else{
            cadena+= `n${id2}[label="EXPRESION"];\n`
            if (this.operando1 instanceof Nativo){
                cadena+= `n${id3}[label="Nativo"];\n`
            }else if (this.operando1 instanceof Relacionales){
                cadena+= `n${id3}[label="RELACIONAL"];\n`
            }else if (this.operando1 instanceof AccesoVar){
                cadena+= `n${id3}[label="AccesoVar"];\n`
            }
            cadena+= `n${id1} -> n${id2};\n`
            cadena+= `n${id2} -> n${this.signoObt};\n`
            cadena+= `n${id2} -> n${id3};\n`
            cadena+= `n${id3} -> n${id4};\n`
            cadena+= `n${id3} -> n${this.opObt1};\n`
            cadena+= `${anterior} -> n${id1};\n`
        }
        return cadena;
    }

    or(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOL:
                switch (tipo2) {
                    //unico caso si el primero es bool y el segundo es bool
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (op1 || op2) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Logico interno or Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Logico or Invalido", this.linea, this.columna)
        }
    }

    and(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.BOOL:
                switch (tipo2) {
                    //unico caso si el primero es bool y el segundo es bool
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (op1 && op2) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Logico interno and Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Logico and Invalido", this.linea, this.columna)
        }
    }

    not(op1: any) {
        //validamos que el tipo cumpla con lo requerido 
        let opU = this.operandoUnico?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.BOOL:
                this.tipoDato = new Tipo(tipoDato.BOOL)
                //si mi opetador es true 
                if (op1 == true) {
                    //lo niego a false
                    return false
                }
                //de lo contrario sera un false entronces devuelvo un true
                return true
            default:
                return new Errores("Semantico", "Logico interno not Invalido", this.linea, this.columna)
        }

    }
}

export enum Logico {
    OR,
    AND,
    NOT
}