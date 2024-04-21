import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Lista from "../simbolo/Lista";
import Simbolo from "../simbolo/Simbolo";
import Lista2D from "../simbolo/Lista2D";
import Contador from "../simbolo/Contador";


export default class FuncionalidadesEspeciales extends Instruccion {
    private tipoF: string
    private expresion: Instruccion

    constructor(tipoFunc: string, exp: Instruccion, linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.tipoF = tipoFunc
        this.expresion = exp
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //interpretamos expresion en funcion especial
        /*let expE;   //declaramos lo que contendra a la declaracion
        let tipoexpE;  //si espresion puede ser interpretada obtenemos su tipo
        //verificamos si existe en tabla de simbolos (para el caso de id que se obtine para .lenght)
        let valorVariable: Simbolo = <Simbolo> tabla.getVariable(String(this.expresion))
        if (valorVariable == null){
            //si no esta en tabla de simbolos obtenemos valores con interpretar
            expE = this.expresion.interpretar(arbol, tabla)
            tipoexpE = this.expresion.tipoDato.getTipo()
        }else{
            //sino solo declaramos nombre
            expE = this.expresion
        }
        //let tipoexpE = this.expresion.tipoDato.getTipo()
        //si expresion es un error retornamos 
        if (expE instanceof Errores) return expE*/

        //console.log(this.tipoF)
        switch (this.tipoF) {
            case "tolower":
                let expEtl = this.expresion.interpretar(arbol, tabla)
                let tipoexpEtl = this.expresion.tipoDato.getTipo()
                switch (tipoexpEtl) {
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(expEtl).toLowerCase()
                }
            case "toupper":
                //Esta función recibe como parámetro una expresión de tipo cadena y retorna una nueva cadena con todas las letras mayúsculas
                let expEtu = this.expresion.interpretar(arbol, tabla)
                let tipoexpEtu = this.expresion.tipoDato.getTipo()
                switch (tipoexpEtu) {
                    case tipoDato.CADENA:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(expEtu).toUpperCase()
                }
            case "round":
                //recibe como parámetro un valor numérico permitiendo redondear decimales
                let expEtro = this.expresion.interpretar(arbol, tabla)
                let tipoexpEro = this.expresion.tipoDato.getTipo()
                switch (tipoexpEro) {
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.DECIMAL)
                        let parteDecimal = expEtro % 1;
                        //console.log(expEtro)
                        if (parteDecimal >= 0.5) {
                            return Math.ceil(expEtro);
                        } else {
                            return Math.floor(expEtro);
                        }
                }
            case "length":
                //recibe como parámetro un vector, una lista o una cadena y devuelve el tamaño de este
                this.tipoDato = new Tipo(tipoDato.ENTERO)
                let expElg;   //declaramos lo que contendra a la declaracion
                let leng;
                let valorVariable: Simbolo = <Simbolo>tabla.getVariable(String(this.expresion))
                if (valorVariable == null) {
                    //si no esta en tabla de simbolos obtenemos cadena
                    expElg = this.expresion
                    leng = String(expElg).length
                } else {
                    //sino solo declaramos nombre
                    expElg = this.expresion
                    let valorLista = <Lista>tabla.getLista(String(expElg))
                    leng = valorLista.getLenght()
                }
                return leng
            case "typeof":
                //Esta función retorna una cadena con el nombre del tipo de dato evaluado
                this.tipoDato = new Tipo(tipoDato.CADENA)  //el tipo de retorno sera cadena
                let typE;
                //para verificar si existe en tabla de simbolos
                let valorVariablet: Simbolo = <Simbolo>tabla.getVariable(String(this.expresion))
                //para verificar si es una instancia de lista
                let valorLista: Lista = <Lista>tabla.getLista(String(this.expresion))
                //para verificar si es una instancia de lista 2D
                let valorL2d: Lista2D = <Lista2D>tabla.getLista2D(String(this.expresion))
                //console.log(valorLista)
                if (valorVariablet != null && !(valorLista instanceof Lista) && !(valorL2d instanceof Lista2D)) {
                    if (valorVariablet.getTipo().getTipo() == tipoDato.CADENA) {
                        typE = "std::string"
                    } else if (valorVariablet.getTipo().getTipo() == tipoDato.ENTERO) {
                        typE = "int"
                    } else if (valorVariablet.getTipo().getTipo() == tipoDato.BOOL) {
                        typE = "bool"
                    } else if (valorVariablet.getTipo().getTipo() == tipoDato.CARACTER) {
                        typE = "char"
                    }
                } else if (valorVariablet != null && valorLista instanceof Lista && !(valorL2d instanceof Lista2D)) {
                    typE = "vector"
                } else if (valorVariablet != null && !(valorLista instanceof Lista) && valorL2d instanceof Lista2D) {
                    typE = "Matriz"
                }
                return String(typE)
            case "std::toString":
                //convierte en cadena solo para ENTERO DECIMAL o BOOL si no error semantico
                let expEts = this.expresion.interpretar(arbol, tabla)
                let tipoexpEts = this.expresion.tipoDato.getTipo()
                switch (tipoexpEts) {
                    case tipoDato.ENTERO:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(expEts)
                    case tipoDato.DECIMAL:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(expEts)
                    case tipoDato.BOOL:
                        this.tipoDato = new Tipo(tipoDato.CADENA)
                        return String(expEts)
                    default:
                        return new Errores("Semantico", "valor no admitido en funcion std::toString", this.linea, this.columna)
                }
            case "c_str":
                //console.log("entra cstr")
                //Esta función permite convertir una cadena en un vector de caracteres.
                this.tipoDato = new Tipo(tipoDato.CARACTER)
                //console.log(this.expresion)
                let valorVarcstr: Simbolo = <Simbolo>tabla.getVariable(String(this.expresion))
                if (valorVarcstr != null) {
                    let mycadena: string = valorVarcstr.getValor();
                    //console.log("entra cstr")
                    let charactersArray: string[] = mycadena.split('');
                    //let listaVaciacstr: string[] = new Array(charactersArray.length);
                    /*for (let i = 0; i < charactersArray.length; i++) {
                        listAux[i] = charactersArray[i];
                    }*/
                    //console.log(listaVaciacstr)
                    //return charactersArray
                } else {
                    //console.log("no entra cstr")
                    return new Errores("Semantico", "valor no admitido en funcion c_str variable no encontrada", this.linea, this.columna)
                }
            default:
                //console.log("entra error en func esp")
                return new Errores("Semantico", "Lo recivido no corresponde con ninguna funcion especial", this.linea, this.columna)

        }
    }

    getAST(anterior: string): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoT = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        resultado += `${nodoT}[label=\"FUNCIONALIDADES ESPECIALES\"];\n`
        resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoExp};\n`
        if (this.tipoF == "tolower") {
            let nodoLw = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp2 = `n${contador.get()}`
            let nodoPD = `n${contador.get()}`
            resultado += `${nodoLw}[label=\"TOLOWER\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPD}[label=\")\"];\n`
            resultado += `${nodoExp}->${nodoLw};\n`
            resultado += `${nodoExp}->${nodoPI};\n`
            resultado += `${nodoExp}->${nodoExp2};\n`
            resultado += `${nodoExp}->${nodoPD};\n`
            resultado += this.expresion.getAST(nodoExp2)
        } else if (this.tipoF == "toupper") {
            let nodoTu = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp2 = `n${contador.get()}`
            let nodoPD = `n${contador.get()}`
            resultado += `${nodoTu}[label=\"TOUPPER\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPD}[label=\")\"];\n`
            resultado += `${nodoExp}->${nodoTu};\n`
            resultado += `${nodoExp}->${nodoPI};\n`
            resultado += `${nodoExp}->${nodoExp2};\n`
            resultado += `${nodoExp}->${nodoPD};\n`
            resultado += this.expresion.getAST(nodoExp2)
        } else if (this.tipoF == "round") {
            let nodoRo = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp2 = `n${contador.get()}`
            let nodoPD = `n${contador.get()}`
            resultado += `${nodoRo}[label=\"TOUPPER\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPD}[label=\")\"];\n`
            resultado += `${nodoExp}->${nodoRo};\n`
            resultado += `${nodoExp}->${nodoPI};\n`
            resultado += `${nodoExp}->${nodoExp2};\n`
            resultado += `${nodoExp}->${nodoPD};\n`
            resultado += this.expresion.getAST(nodoExp2)
        } else if (this.tipoF == "length") {
            let nodoExp2 = `n${contador.get()}`
            let nodoPt = `n${contador.get()}`
            let nodoTl = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoPD = `n${contador.get()}`
            resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPt}[label=\".\"];\n`
            resultado += `${nodoTl}[label=\"LENGTH\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoPD}[label=\")\"];\n`
            resultado += `${nodoExp}->${nodoExp2};\n`
            resultado += `${nodoExp}->${nodoPt};\n`
            resultado += `${nodoExp}->${nodoTl};\n`
            resultado += `${nodoExp}->${nodoPI};\n`
            resultado += `${nodoExp}->${nodoPD};\n`
            resultado += this.expresion.getAST(nodoExp2)
        } else if (this.tipoF == "typeof") {
            let nodoTy = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp2 = `n${contador.get()}`
            let nodoPD = `n${contador.get()}`
            resultado += `${nodoTy}[label=\"TYPEOF\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPD}[label=\")\"];\n`
            resultado += `${nodoExp}->${nodoTy};\n`
            resultado += `${nodoExp}->${nodoPI};\n`
            resultado += `${nodoExp}->${nodoExp2};\n`
            resultado += `${nodoExp}->${nodoPD};\n`
            resultado += this.expresion.getAST(nodoExp2)
        } else if (this.tipoF == "std::toString") {
            let nodoTo = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoExp2 = `n${contador.get()}`
            let nodoPD = `n${contador.get()}`
            resultado += `${nodoTo}[label=\"STD::TOSTRING\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPD}[label=\")\"];\n`
            resultado += `${nodoExp}->${nodoTo};\n`
            resultado += `${nodoExp}->${nodoPI};\n`
            resultado += `${nodoExp}->${nodoExp2};\n`
            resultado += `${nodoExp}->${nodoPD};\n`
            resultado += this.expresion.getAST(nodoExp2)
        } else if (this.tipoF == "c_str") {
            let nodoExp2 = `n${contador.get()}`
            let nodoPt = `n${contador.get()}`
            let nodoCs = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoPD = `n${contador.get()}`
            resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
            resultado += `${nodoPt}[label=\".\"];\n`
            resultado += `${nodoCs}[label=\"C_STR\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoPD}[label=\")\"];\n`
            resultado += `${nodoExp}->${nodoExp2};\n`
            resultado += `${nodoExp}->${nodoPt};\n`
            resultado += `${nodoExp}->${nodoCs};\n`
            resultado += `${nodoExp}->${nodoPI};\n`
            resultado += `${nodoExp}->${nodoPD};\n`
            resultado += this.expresion.getAST(nodoExp2)
        }

        return resultado
    }
}

