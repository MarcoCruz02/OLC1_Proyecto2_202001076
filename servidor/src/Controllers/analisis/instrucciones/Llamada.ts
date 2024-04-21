import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Contador from "../simbolo/Contador";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import AsignacionVar from "./AsignacionVar";
import Declaracion from "./Declaracion";
import Metodo from "./Metodo";

export default class Llamada extends Instruccion {

    private id: string
    private parametros: Instruccion[]

    constructor(id: string, linea: number, columna: number, parametros: Instruccion[]) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.parametros = parametros
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let busqueda = arbol.getFuncion(this.id)
        if (busqueda == null) {
            return new Errores("SEMANTICO", "Funcion no existente", this.linea, this.columna)
        }

        if (busqueda instanceof Metodo) {
            let newTabla = new tablaSimbolo(arbol.getTablaGlobal())
            newTabla.setNombre("LLAMADA METODO " + this.id)

            //validacion parametros
            if (busqueda.parametros.length != this.parametros.length) {
                return new Errores("SEMANTICO", "Parametros invalidos", this.linea, this.columna)
            }
            // es igual al run en su mayoria :D
            for (let i = 0; i < busqueda.parametros.length; i++) {
                //console.log("entro for")
                let declaracionParametro = new Declaracion(
                    busqueda.parametros[i].tipo, this.linea, this.columna,
                    busqueda.parametros[i].id,this.parametros[i])   

                // declaramos variable en el ambito de la funcion
                let resultado = declaracionParametro.interpretar(arbol, newTabla)
                if (resultado instanceof Errores) return resultado

                //caso Actualizacion
                // interpretamos su valor
                /*let valor = this.parametros[i].interpretar(arbol, tabla)
                if (valor instanceof Errores) return valor

                let variable = newTabla.getVariable(busqueda.parametros[i].id)
                if (variable == null) return new Errores("Semantico", "algo salio mal", this.linea, this.columna)
                if (variable.getTipo().getTipo() != this.parametros[i].tipoDato.getTipo()) {
                    return new Errores("Semantico", "algo salio mal", this.linea, this.columna)
                }*/
                //variable.setValor(valor)
                //console.log(variable)
                //console.log(valor)

            }
            // interpretar la funcion a llamar
            let resultadoFuncion: any = busqueda.interpretar(arbol, newTabla)
            if (resultadoFuncion instanceof Errores) return resultadoFuncion

        }
    }
 
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        if (this.parametros != null){
            let nodoT = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoParam = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoobtId = `n${contador.get()}`
            resultado += `${nodoT}[label=\"LLAMADA\"];\n`
            resultado += `${nodoId}[label=\"ID\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoParam}[label=\"PARAMETROS\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoobtId}[label=\"${this.id}\"];\n`
            resultado += `${anterior}->${nodoT};\n`
            resultado += `${nodoT}->${nodoId};\n`
            resultado += `${nodoT}->${nodoPI};\n`
            resultado += `${nodoT}->${nodoParam};\n`
            resultado += `${nodoT}->${nodoPd};\n`
            resultado += `${nodoId}->${nodoobtId};\n`
            for(let i of this.parametros){
                resultado += i.getAST(nodoParam)
            }
        }else{
            let nodoT = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoobtId = `n${contador.get()}`
            resultado += `${nodoT}[label=\"LLAMADA\"];\n`
            resultado += `${nodoId}[label=\"ID\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoobtId}[label=\"${this.id}\"];\n`
            resultado += `${anterior}->${nodoT};\n`
            resultado += `${nodoT}->${nodoId};\n`
            resultado += `${nodoT}->${nodoPI};\n`
            resultado += `${nodoT}->${nodoPd};\n`
            resultado += `${nodoId}->${nodoobtId};\n`
        }
        return resultado
    }
}

/*
execute metodo1();

void metodo0(){
    return true;
}

void metodo1(){
    bool i = true;
    int j = i+2;
    cout << j <<endl;
   /*for(int i = 0; i<5; i++){
        cout<< i <<endl;
        if (i==2){
            cout<< "entro if" <<endl;
            return i;
        }
    }
    //return j;
}
*/


/*
Version corregida de llamada
export default class Llamada extends Instruccion {

    private id: string
    private parametros: Instruccion[]

    constructor(id: string, linea: number, columna: number, parametros: Instruccion[]) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.parametros = parametros
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let busqueda = arbol.getFuncion(this.id)
        if (busqueda == null) {
            return new Errores("SEMANTICO", "Funcion no existente", this.linea, this.columna)
        }

        if (busqueda instanceof Metodo) {
            console.log("tipo func " + busqueda.tipoDato.getTipo())
            let newTabla = new tablaSimbolo(arbol.getTablaGlobal())
            newTabla.setNombre("LLAMADA METODO " + this.id)

            //validacion parametros
            if (busqueda.parametros.length != this.parametros.length) {
                console.log("parametros invalidos")
                return new Errores("SEMANTICO", "Parametros invalidos", this.linea, this.columna)
            }

            // es igual al run en su mayoria :D
            for (let i = 0; i < busqueda.parametros.length; i++) {
                console.log("entro for")
                let declaracionParametro = new Declaracion(
                    busqueda.parametros[i].tipo, this.linea, this.columna,
                    busqueda.parametros[i].id)
                    console.log("-> "+busqueda.parametros[i].tipo.getTipo())
                    console.log(busqueda.parametros[i].id)
                // declaramos variable en el ambito de la funcion
                let resultado = declaracionParametro.interpretar(arbol, newTabla)
                console.log("decparametro "+declaracionParametro.tipoDato.getTipo())
                if (resultado instanceof Errores) return resultado

                // interpretamos su valor
                console.log("conticnua")
                let valor = this.parametros[i].interpretar(arbol, tabla)
                console.log(this.parametros[i])
                if (valor instanceof Errores) return valor

                let variable = newTabla.getVariable(busqueda.parametros[i].id)
                if (variable == null) return new Errores("Semantico", "algo salio mal", this.linea, this.columna)
                if (variable.getTipo().getTipo() != this.parametros[i].tipoDato.getTipo()) {
                    return new Errores("Semantico", "algo salio mal", this.linea, this.columna)
                }
                variable.setValor(valor)
                console.log(variable)
                console.log(valor)
            }
            // interpretar la funcion a llamar
            let resultadoFuncion: any = busqueda.interpretar(arbol, newTabla)
            if (resultadoFuncion instanceof Errores) return resultadoFuncion

        }
    }
}
*/