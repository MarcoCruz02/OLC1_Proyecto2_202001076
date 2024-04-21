import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Contador from "../simbolo/Contador";

export default class Relacionales extends Instruccion {
    private operando1: Instruccion
    private operando2: Instruccion
    private relacional: Relacional


    // al poner op2 con el signo ? estamos diciendo que este parametro es opcional de lo contrario tendriamos que escribir el constructor 2 veces uno con op2 = Instruccion y otra sin el
    constructor(Oprelacional: Relacional, fila: number, col: number, op1: Instruccion, op2: Instruccion) {
        super(new Tipo(tipoDato.BOOL), fila, col)
        this.relacional = Oprelacional
        this.operando1 = op1
        this.operando2 = op2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer         //variables que me sirven para guardar el valor interpretado
        opIzq = this.operando1.interpretar(arbol, tabla)
        if (opIzq instanceof Errores) return opIzq
        opDer = this.operando2.interpretar(arbol, tabla)
        if (opDer instanceof Errores) return opDer

        switch (this.relacional) {
            case Relacional.MENORQUE:
                return this.menorque(opIzq, opDer)
            case Relacional.MAYORQUE:
                return this.mayorque(opIzq, opDer)
            case Relacional.MENORIGUALQUE:
                return this.menorigualque(opIzq, opDer)
            case Relacional.MAYORIGUALQUE:
                return this.mayorigualque(opIzq, opDer)
            case Relacional.DOBLEIGUAL:
                return this.dobleigual(opIzq, opDer)
            case Relacional.NOIGUAL:
                return this.noigual(opIzq, opDer)
            default:
                return new Errores("Semantico", "Operador Relacional Invalido", this.linea, this.columna)
        }
    }

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoExp1 = `n${contador.get()}`
        let nodoRelacional = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        resultado += `${nodoExp1}[label=\"EXPRESION\"];\n`
        if (this.relacional == Relacional.MENORQUE){
            resultado = `${nodoRelacional}[label=\"<\"];\n`
        }else if (this.relacional == Relacional.MAYORQUE){
            resultado = `${nodoRelacional}[label=\">\"];\n`
        }else if (this.relacional == Relacional.MENORIGUALQUE){
            resultado = `${nodoRelacional}[label=\"<=\"];\n`
        }else if (this.relacional == Relacional.MAYORIGUALQUE){
            resultado = `${nodoRelacional}[label=\">=\"];\n`
        }else if (this.relacional == Relacional.DOBLEIGUAL){
            resultado = `${nodoRelacional}[label=\"==\"];\n`
        }else if (this.relacional == Relacional.NOIGUAL){
            resultado = `${nodoRelacional}[label=\"!=\"];\n`
        }
        resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
        resultado += `${anterior}->${nodoExp1};\n`
        resultado += `${anterior}->${nodoRelacional};\n`
        resultado += `${anterior}->${nodoExp2};\n`
        resultado += this.operando1.getAST(nodoExp1)
        resultado += this.operando2.getAST(nodoExp2)
        return resultado
    }

    menorque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1.tipoDato.getTipo()
        let tipo2 = this.operando2.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero < entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) < parseInt(op2)) {
                            return true
                        }
                        return false
                    //case entero < decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) < parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case entero < caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) < parseInt(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional menorque entero Invalido", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal < entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) < parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal < decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) < parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal < caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) < parseFloat(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional menorque decimal Invalido", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter < entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1.charCodeAt(0)) < parseInt(op2)) {
                            return true
                        }
                        return false
                    //case caracter < decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1.charCodeAt(0)) < parseFloat(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional menorque caracter Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional menorque Invalido", this.linea, this.columna)
        }

    }

    mayorque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1.tipoDato.getTipo()
        let tipo2 = this.operando2.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero > entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) > parseInt(op2)) {
                            return true
                        }
                        return false
                    //case entero > decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) > parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case entero > caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) > parseInt(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional mayorque entero Invalido", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal > entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) > parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal > decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) > parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal > caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) > parseFloat(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional mayorque decimal Invalido", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter > entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1.charCodeAt(0)) > parseInt(op2)) {
                            return true
                        }
                        return false
                    //case caracter > decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1.charCodeAt(0)) > parseFloat(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional mayorque caracter Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional mayorque Invalido", this.linea, this.columna)
        }

    }

    menorigualque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1.tipoDato.getTipo()
        let tipo2 = this.operando2.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero <= entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) <= parseInt(op2)) {
                            return true
                        }
                        return false
                    //case entero <= decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) <= parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case entero <= caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) <= parseInt(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional menorigualque entero Invalido", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal <= entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) <= parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal <= decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) <= parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal <= caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) <= parseFloat(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional menorigualque decimal Invalido", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter <= entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1.charCodeAt(0)) <= parseInt(op2)) {
                            return true
                        }
                        return false
                    //case caracter <= decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1.charCodeAt(0)) <= parseFloat(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional menorigualque caracter Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional menorigualque Invalido", this.linea, this.columna)
        }

    }

    mayorigualque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1.tipoDato.getTipo()
        let tipo2 = this.operando2.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero >= entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) >= parseInt(op2)) {
                            return true
                        }
                        return false
                    //case entero >= decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) >= parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case entero >= caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) >= parseInt(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional mayorigualque entero Invalido", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal >= entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) >= parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal >= decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) >= parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal >= caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) >= parseFloat(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional mayorigualque decimal Invalido", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter >= entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1.charCodeAt(0)) >= parseInt(op2)) {
                            return true
                        }
                        return false
                    //case caracter >= decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1.charCodeAt(0)) >= parseFloat(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional mayorigualque caracter Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional mayorigualque Invalido", this.linea, this.columna)
        }

    }

    dobleigual(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1.tipoDato.getTipo()
        let tipo2 = this.operando2.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero == entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) == parseInt(op2)) {
                            return true
                        }
                        return false
                    //case entero == decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) == parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case entero == caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) == parseInt(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional doble igual entero Invalido", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal == entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) == parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal == decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) == parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal == caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) == parseFloat(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional doble igual decimal Invalido", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter == entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1.charCodeAt(0)) == parseInt(op2)) {
                            return true
                        }
                        return false
                    //case caracter == decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1.charCodeAt(0)) == parseFloat(op2)) {
                            return true
                        }
                        return false
                    //caso caracter == caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (String(op1) == String(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional doble igual caracter Invalido", this.linea, this.columna)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    //caso cadena == cadena
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (String(op1) == String(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional doble igual cadena Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional doble igual Invalido", this.linea, this.columna)
        }

    }

    noigual(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1.tipoDato.getTipo()
        let tipo2 = this.operando2.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero != entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) != parseInt(op2)) {
                            return true
                        }
                        return false
                    //case entero != decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) != parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case entero != caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1) != parseInt(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional no igual entero Invalido", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal != entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) != parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal != decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) != parseFloat(op2)) {
                            return true
                        }
                        return false
                    //case decimal != caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1) != parseFloat(op2.charCodeAt(0))) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional no igual decimal Invalido", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter != entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseInt(op1.charCodeAt(0)) != parseInt(op2)) {
                            return true
                        }
                        return false
                    //case caracter != decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (parseFloat(op1.charCodeAt(0)) != parseFloat(op2)) {
                            return true
                        }
                        return false
                    //caso caracter != caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (String(op1) != String(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional no igual caracter Invalido", this.linea, this.columna)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    //caso cadena != cadena
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.BOOL)
                        if (String(op1) != String(op2)) {
                            return true
                        }
                        return false
                    default:
                        return new Errores("Semantico", "Relacional no igual cadena Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional no igual Invalido", this.linea, this.columna)
        }

    }
}

export enum Relacional {
    MENORQUE,
    MAYORQUE,
    MENORIGUALQUE,
    MAYORIGUALQUE,
    DOBLEIGUAL,
    NOIGUAL
}