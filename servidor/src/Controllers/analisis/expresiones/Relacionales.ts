import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import { Guid } from "guid-typescript/dist/guid";

export default class Relacionales extends Instruccion {
    private operando1: Instruccion
    private operando2: Instruccion
    private relacional: Relacional

    private signoObt = ""        //para ast
    private opObt1 = ""          //para ast
    private opObt2 = ""          //para ast


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
        this.opObt1 = opIzq        //para ast
        this.opObt2 = opDer        //para ast

        switch (this.relacional) {
            case Relacional.MENORQUE:
                this.signoObt = "<"        //para ast
                return this.menorque(opIzq, opDer)
            case Relacional.MAYORQUE:
                this.signoObt = ">"        //para ast
                return this.mayorque(opIzq, opDer)
            case Relacional.MENORIGUALQUE:
                this.signoObt = "<="        //para ast
                return this.menorigualque(opIzq, opDer)
            case Relacional.MAYORIGUALQUE:
                this.signoObt = ">="        //para ast
                return this.mayorigualque(opIzq, opDer)
            case Relacional.DOBLEIGUAL:
                this.signoObt = "=="        //para ast
                return this.dobleigual(opIzq, opDer)
            case Relacional.NOIGUAL:
                this.signoObt = "!="        //para ast
                return this.noigual(opIzq, opDer)
            default:
                return new Errores("Semantico", "Operador Relacional Invalido", this.linea, this.columna)
        }
    }

    /*generarAST(anterior: string, arbol: Arbol): string {
        //con cada llamada a .getcontador el id aumenta 
        let id1 = arbol.getContador()
        let id2 = arbol.getContador()
        let id3 = arbol.getContador()
        let id4 = arbol.getContador()
        let cadena: string = `n${id1} [label="RELACIONAL"];\n`;
        cadena+= `n${id2}[label="${this.operando1}"];\n`
        cadena+= `n${id4}[label="${this.operando2}"];\n`

        cadena += `n${id1} -> n${id2};\n`;
        cadena += this.operando1.generarAST(anterior, arbol);

        cadena += `n${id1} -> n${id3}op;\n n${id3}op[label="${this.relacional}"];\n`;

        cadena += `n${id1} -> n${id4};\n`;
        cadena += this.operando2.generarAST(anterior, arbol);

        return cadena;
    }*/

    /*identify: string = Guid.create().toString().replace(/-/gm, ""); 
    graph(): string {
        let str: string = `node${this.identify} [label="Relational"];\n`;

        str += `node${this.identify} -> node${this.operando1.};\n`;
        str += this.operando1.g();

        str += `node${this.identify} -> node${this.identify}op;\n node${this.identify}op[label="${this.relacional}"];\n`;

        str += `node${this.identify} -> node${this.operando2.identify};\n`;
        str += this.operando2.graph();

        return str;
    }*/

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