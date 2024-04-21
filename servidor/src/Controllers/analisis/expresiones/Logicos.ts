import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Nativo from "./Nativo";
import Relacionales from "./Relacionales";
import AccesoVar from "./AccesoVar";
import Contador from "../simbolo/Contador";

export default class Logicos extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private logico: Logico
    private operandoUnico: Instruccion | undefined

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

        } else {
            opIzq = this.operando1?.interpretar(arbol, tabla)
            if (opIzq instanceof Errores) return opIzq
            opDer = this.operando2?.interpretar(arbol, tabla)
            if (opDer instanceof Errores) return opDer

        }

        switch (this.logico) {
            case Logico.OR:
                return this.or(opIzq, opDer)
            case Logico.AND:
                return this.and(opIzq, opDer)
            case Logico.NOT:
                return this.not(Unico)
            default:
                return new Errores("Semantico", "Operador Logico Invalido", this.linea, this.columna)
        }
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        if (this.logico == Logico.NOT){
            let nodoNot = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            resultado = `${nodoNot}[label=\"!\"];\n`
            resultado = `${nodoNot}[label=\"EXPRESION\"];\n`
            resultado += `${anterior}->${nodoNot};\n`
            resultado += `${anterior}->${nodoExp};\n`
            resultado += this.operandoUnico?.getAST(nodoExp)
            return resultado
        }
        let nodoExp1 = `n${contador.get()}`
        let nodoLogicos = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        resultado += `${nodoExp1}[label=\"EXPRESION\"];\n`
        if (this.logico == Logico.OR){
            resultado = `${nodoLogicos}[label=\"||\"];\n`
        }else if (this.logico == Logico.AND){
            resultado = `${nodoLogicos}[label=\"&&\"];\n`
        }
        resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
        resultado += `${anterior}->${nodoExp1};\n`
        resultado += `${anterior}->${nodoLogicos};\n`
        resultado += `${anterior}->${nodoExp2};\n`
        resultado += this.operando1?.getAST(nodoExp1)
        resultado += this.operando2?.getAST(nodoExp2)
        return resultado
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