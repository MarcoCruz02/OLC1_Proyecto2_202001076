import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Contador from "../simbolo/Contador";

export default class Aritmeticas extends Instruccion {
    private operando1: Instruccion | undefined
    private operando2: Instruccion | undefined
    private operacion: Operadores
    private operandoUnico: Instruccion | undefined

    // al poner op2 con el signo ? estamos diciendo que este parametro es opcional de lo contrario tendriamos que escribir el constructor 2 veces uno con op2 = Instruccion y otra sin el
    constructor(operador: Operadores, fila: number, col: number, op1: Instruccion, op2?: Instruccion) {
        super(new Tipo(tipoDato.ENTERO), fila, col)
        this.operacion = operador
        if (!op2) this.operandoUnico = op1
        else {
            this.operando1 = op1
            this.operando2 = op2
        }
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let opIzq, opDer, Unico = null          //variables que me sirven para guardar el valor interpretado
        //con este if else ya subimos todo lo que podia venir ,valores o error
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

        switch (this.operacion) {
            case Operadores.SUMA:
                return this.suma(opIzq, opDer)
            case Operadores.RESTA:
                return this.resta(opIzq, opDer)
            case Operadores.MULTIPLICACION:
                return this.multiplicacion(opIzq, opDer)
            case Operadores.DIVISION:
                return this.division(opIzq, opDer)
            case Operadores.POTENCIA:
                return this.potencia(opIzq, opDer)
            case Operadores.MODULO:
                return this.modulo(opIzq, opDer)
            case Operadores.NEG:
                return this.negacion(Unico)
            default:
                return new Errores("Semantico", "Operador Aritmetico Invalido", this.linea, this.columna)
        }
    }

    /*getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        if (this.operacion == Operadores.NEG){
            let nodoNegacion = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            `n${nodoNativo}[label = \"Nativo\"];\n`
        }
        return resultado
    }*/

    suma(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido para una suma ejemplo si se puede sumar entero + bool etc..
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero + entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) + parseInt(op2)
                    //caso entero + decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        //.toFixed(2)  <-  indica que redondeara a 2 decimales
                        return (parseFloat(op1) + parseFloat(op2)).toFixed(2)
                    //caso entero + boolean
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        let resop2: number = 1;
                        if (op2 == false) {
                            resop2 = 0
                        }
                        return parseInt(op1) + resop2
                    //caso entero + caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        //op2.charCodeAt(0); devuelve el numero ascii del caracter en la pos 0 de la cadena en este caso solo sera 1 caracter
                        return parseInt(op1) + op2.charCodeAt(0);
                    //caso entero + cadena
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal + entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) + parseFloat(op2)).toFixed(2)
                    //caso decimal + decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) + parseFloat(op2)).toFixed(2)
                    //caso decimal +  booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        let resop2: number = 1;
                        if (op2 == false) {
                            resop2 = 0
                        }
                        return parseFloat(op1) + resop2
                    //caso decimal + caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) + parseFloat(op2.charCodeAt(0))).toFixed(2);
                    //caso decimal + cadena
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.columna)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    //caso booleano + entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        let resop1E: number = 1;
                        if (op1 == false) {
                            resop1E = 0
                        }
                        return resop1E + parseInt(op2)
                    //caso booleano + decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        let resop1D: number = 1;
                        if (op1 == false) {
                            resop1D = 0
                        }
                        return (resop1D + parseFloat(op2)).toFixed(2)
                    //caso booleano + cadena
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter + entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1.charCodeAt(0)) + parseInt(op2)
                    //caso caracter + decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1.charCodeAt(0)) + parseFloat(op2)).toFixed(2)
                    //caso caracter + caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2);
                    //caso caracter + cadena
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.columna)
                }
            case tipoDato.CADENA:
                switch (tipo2) {
                    //caso cadena + entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    //caso cadena + decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    //caso cadena +  booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    //caso cadena + caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2);
                    //caso cadena + cadena
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(op1) + String(op2)
                    default:
                        return new Errores("Semantico", "Suma Invalida", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Suma Invalida", this.linea, this.columna)
        }

    }

    resta(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido para una resta 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero - entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) - parseInt(op2)
                    //caso entero - decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) - parseFloat(op2)).toFixed(2)
                    //caso entero - booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        let resop2: number = 1;
                        if (op2 == false) {
                            resop2 = 0
                        }
                        return parseInt(op1) - resop2
                    //caso entero - caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) - op2.charCodeAt(0);
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal - entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) - parseFloat(op2))).toFixed(2)
                    //caso decimal - decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) - parseFloat(op2))).toFixed(2)
                    //caso decimal - booleano
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        let resop2: number = 1;
                        if (op2 == false) {
                            resop2 = 0
                        }
                        return parseFloat(op1) - resop2
                    //caso decimal - caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) - parseFloat(op2.charCodeAt(0))).toFixed(2);
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.columna)
                }
            case tipoDato.BOOL:
                switch (tipo2) {
                    //caso booleano - entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        let resop1E: number = 1;
                        if (op1 == false) {
                            resop1E = 0
                        }
                        return resop1E - parseInt(op2)
                    //caso booleano - decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        let resop1D: number = 1;
                        if (op1 == false) {
                            resop1D = 0
                        }
                        return (resop1D - parseFloat(op2)).toFixed(2)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter - entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1.charCodeAt(0)) - parseInt(op2)
                    //caso caracter - decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1.charCodeAt(0)) - parseFloat(op2)).toFixed(2)
                    default:
                        return new Errores("Semantico", "Resta Invalida", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Resta Invalida", this.linea, this.columna)
        }

    }

    multiplicacion(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido para una multiplicacion 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero * entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) * parseInt(op2)
                    //caso entero * decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) * parseFloat(op2)).toFixed(2)
                    //caso entero * caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1) * op2.charCodeAt(0);
                    default:
                        return new Errores("Semantico", "Multiplicacion Invalida", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal * entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) * parseFloat(op2))).toFixed(2)
                    //caso decimal * decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) * parseFloat(op2))).toFixed(2)
                    //caso decimal * caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) * parseFloat(op2.charCodeAt(0))).toFixed(2);
                    default:
                        return new Errores("Semantico", "Multiplicacion Invalida", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter * entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return parseInt(op1.charCodeAt(0)) * parseInt(op2)
                    //caso caracter * decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1.charCodeAt(0)) * parseFloat(op2)).toFixed(2)
                    default:
                        return new Errores("Semantico", "Multiplicacion Invalida", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Multiplicacion Invalida", this.linea, this.columna)
        }

    }

    division(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido para una division 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero / entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) / parseFloat(op2)).toFixed(2)
                    //caso entero / decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) / parseFloat(op2)).toFixed(2)
                    //caso entero / caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) / parseFloat(op2.charCodeAt(0))).toFixed(2);
                    default:
                        return new Errores("Semantico", "Division Invalida", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal / entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) / parseFloat(op2))).toFixed(2)
                    //caso decimal / decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) / parseFloat(op2))).toFixed(2)
                    //caso decimal / caracter
                    case tipoDato.CARACTER:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) / parseFloat(op2.charCodeAt(0))).toFixed(2);
                    default:
                        return new Errores("Semantico", "Division Invalida", this.linea, this.columna)
                }
            case tipoDato.CARACTER:
                switch (tipo2) {
                    //caso caracter / entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1.charCodeAt(0)) / parseFloat(op2)).toFixed(2)
                    //caso caracter / decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1.charCodeAt(0)) / parseFloat(op2)).toFixed(2)
                    default:
                        return new Errores("Semantico", "Division Invalida", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Division Invalida", this.linea, this.columna)
        }

    }

    potencia(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido para una potencia 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero pow entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.ENTERO)
                        return  Math.pow(parseInt(op1), parseInt(op2))
                    //caso entero pow decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (Math.pow(parseFloat(op1),parseFloat(op2))).toFixed(2)
                    default:
                        return new Errores("Semantico", "Potencia Invalida", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal pow entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (Math.pow(parseFloat(op1),parseFloat(op2))).toFixed(2)
                    //caso decimal pow decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (Math.pow(parseFloat(op1),parseFloat(op2))).toFixed(2)
                    default:
                        return new Errores("Semantico", "Potencia Invalida", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Potencia Invalida", this.linea, this.columna)
        }

    }

    modulo(op1: any, op2: any) {
        //validamos que el tipo cumpla con lo requerido para un modulo 
        let tipo1 = this.operando1?.tipoDato.getTipo()
        let tipo2 = this.operando2?.tipoDato.getTipo()
        switch (tipo1) {
            case tipoDato.ENTERO:
                switch (tipo2) {
                    //caso entero % entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) % parseFloat(op2)).toFixed(2)
                    //caso entero % decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return (parseFloat(op1) % parseFloat(op2)).toFixed(2)
                    default:
                        return new Errores("Semantico", "Modulo Invalido", this.linea, this.columna)
                }
            case tipoDato.DECIMAL:
                switch (tipo2) {
                    //caso decimal % entero
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) % parseFloat(op2))).toFixed(2)
                    //caso decimal % decimal
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        return ((parseFloat(op1) % parseFloat(op2))).toFixed(2)
                    default:
                        return new Errores("Semantico", "Modulo Invalido", this.linea, this.columna)
                }
            default:
                return new Errores("Semantico", "Modulo Invalido", this.linea, this.columna)
        }

    }

    negacion(op1: any) {
        let opU = this.operandoUnico?.tipoDato.getTipo()
        switch (opU) {
            case tipoDato.ENTERO:
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                return parseInt(op1) * -1
            case tipoDato.DECIMAL:
                this.tipoDato = new Tipo(tipoDato.DECIMAL)
                return parseFloat(op1) * -1
            default:
                return new Errores("Semantico", "Negacion Unaria invalida", this.linea, this.columna)
        }
    }

    /*
     Generar un nodo Expresion ,operacion , Expresion para caso suma o resta
     en caso negacion nodo - y nodo expresion 
     expresion -> valor  ....
    */
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        if(this.operacion == Operadores.NEG){
            let nodoNegacion = `n${contador.get()}`
            let nodoExp = `n${contador.get()}`
            resultado = `${nodoNegacion}[label=\"-\"];\n`
            resultado = `${nodoNegacion}[label=\"EXPRESION\"];\n`
            resultado += `${anterior}->${nodoNegacion};\n`
            resultado += `${anterior}->${nodoExp};\n`
            resultado += this.operandoUnico?.getAST(nodoExp)
            return resultado
        }
        let nodoExp1 = `n${contador.get()}`
        let nodoOperacion = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        resultado += `${nodoExp1}[label=\"EXPRESION\"];\n`
        if (this.operacion == Operadores.SUMA){
            resultado = `${nodoOperacion}[label=\"+\"];\n`
        }else if (this.operacion == Operadores.RESTA){
            resultado = `${nodoOperacion}[label=\"-\"];\n`
        }else if (this.operacion == Operadores.MULTIPLICACION){
            resultado = `${nodoOperacion}[label=\"*\"];\n`
        }else if (this.operacion == Operadores.DIVISION){
            resultado = `${nodoOperacion}[label=\"/\"];\n`
        }else if (this.operacion == Operadores.POTENCIA){
            resultado = `${nodoOperacion}[label=\"POW\"];\n`
        }else if (this.operacion == Operadores.MODULO){
            resultado = `${nodoOperacion}[label=\"%\"];\n`
        }
        resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
        resultado += `${anterior}->${nodoExp1};\n`
        resultado += `${anterior}->${nodoOperacion};\n`
        resultado += `${anterior}->${nodoExp2};\n`
        resultado += this.operando1?.getAST(nodoExp1)
        resultado += this.operando2?.getAST(nodoExp2)
        return resultado
    }

}

export enum Operadores {
    SUMA,
    RESTA,
    MULTIPLICACION,
    DIVISION,
    POTENCIA,
    MODULO,
    NEG
}