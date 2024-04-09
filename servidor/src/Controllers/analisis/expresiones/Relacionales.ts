import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";

export default class Relacionales extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Operadores

    // al poner op2 con el signo ? estamos diciendo que este parametro es opcional de lo contrario tendriamos que escribir el constructor 2 veces uno con op2 = Instruccion y otra sin el
    constructor(operador: Operadores, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), fila, col)
        this.operacion = operador
        this.operando1 = op1
        this.operando2 = op2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer         //variables que me sirven para guardar el valor interpretado
        opIzq = this.operando1?.interpretar(arbol, tabla)
        if (opIzq instanceof Errores) return opIzq
        opDer = this.operando2?.interpretar(arbol, tabla)
        if (opDer instanceof Errores) return opDer

        switch (this.operacion) {
            case Operadores.MENORQUE:
                return this.menorque(opIzq, opDer)
            case Operadores.MAYORQUE:
                return this.mayorque(opIzq, opDer)
            case Operadores.MENORIGUALQUE:
                return this.menorigualque(opIzq, opDer)
            case Operadores.MAYORIGUALQUE:
                return this.mayorigualque(opIzq, opDer)
            case Operadores.DOBLEIGUAL:
                return this.dobleigual(opIzq, opDer)
            case Operadores.NOIGUAL:
                return this.noigual(opIzq, opDer)
            default:
                return new Errores("Semantico", "Operador Relacional Invalido", this.linea, this.columna)
        }
    }

    menorque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
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
                    default:
                        return new Errores("Semantico", "Relacional menorque Invalido", this.linea, this.columna)
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
                    default:
                        return new Errores("Semantico", "Relacional menorque Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional Invalido", this.linea, this.columna)
        }

    }

    mayorque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
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
                    default:
                        return new Errores("Semantico", "Relacional mayorque Invalido", this.linea, this.columna)
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
                    default:
                        return new Errores("Semantico", "Relacional mayorque Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional Invalido", this.linea, this.columna)
        }

    }

    menorigualque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
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
                    default:
                        return new Errores("Semantico", "Relacional menorigualque Invalido", this.linea, this.columna)
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
                    default:
                        return new Errores("Semantico", "Relacional menorigualque Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional Invalido", this.linea, this.columna)
        }

    }

    mayorigualque(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
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
                    default:
                        return new Errores("Semantico", "Relacional mayorigualque Invalido", this.linea, this.columna)
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
                    default:
                        return new Errores("Semantico", "Relacional mayorigualque Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional Invalido", this.linea, this.columna)
        }

    }

    dobleigual(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
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
                    default:
                        return new Errores("Semantico", "Relacional doble igual Invalido", this.linea, this.columna)
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
                    default:
                        return new Errores("Semantico", "Relacional doble igual Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional Invalido", this.linea, this.columna)
        }

    }

    noigual(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
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
                    default:
                        return new Errores("Semantico", "Relacional no igual Invalido", this.linea, this.columna)
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
                    default:
                        return new Errores("Semantico", "Relacional no igual Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Relacional Invalido", this.linea, this.columna)
        }

    }

}

export enum Operadores {
    MENORQUE,
    MAYORQUE,
    MENORIGUALQUE,
    MAYORIGUALQUE,
    DOBLEIGUAL,
    NOIGUAL
}