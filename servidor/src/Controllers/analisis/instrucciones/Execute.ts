import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Contador from "../simbolo/Contador";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Declaracion from "./Declaracion";
import Metodo from "./Metodo";

export default class Execute extends Instruccion{
    //aqui se almacena identificador y parametros
    private id : string
    private parametros : Instruccion[]

    constructor(id : string, linea : number, columna : number, parametros : Instruccion[]){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.parametros = parametros
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //cuando llamamos a una funcion primero buscamos
        let busqueda = arbol.getFuncion(this.id)
        if (busqueda == null) return new Errores("Semantico", "Funcion inexistente analisis execute", this.linea, this.columna)
        
        if(busqueda instanceof Metodo) {
            //al llamar a una funcon/metodo primero creamos un nuevo entorno
            let newTabla = new tablaSimbolo(arbol.getTablaGlobal())
            newTabla.setNombre("Execute")
            //verificamos que cantidad de parametros sea igual a la llamada execute y la definicion de la funcion/metodo
            if (busqueda.parametros.length != this.parametros.length) return new Errores("Semantico", "Cantidad de parametros no coinsiden analisis execute", this.linea, this.columna)
            //usaremos un ciclo con index para que sea el mismo orden tanto en la definicion como en el index()
            //declaramos los parametros uno a uno pasando el tipo que deberia tener segun la definicion de la funcion y el valor que vamos a asignar al llamarla con execute
            //en este ciclo solo estamos declarando los parametros
            for (let i = 0; i < busqueda.parametros.length; i++){
                let declaracionparametro = new Declaracion(busqueda.parametros[i].tipo, this.linea, this.columna, 
                    busqueda.parametros[i].id,this.parametros[i])
                //declarando parametro de metodo
                let resultado = declaracionparametro.interpretar(arbol,newTabla)
                if (resultado instanceof Errores) return resultado
            }
            //al haber declarados los parametros interpretamos el metodo /funcion
            let resultadofuncion:any = busqueda.interpretar(arbol,newTabla)
            if (resultadofuncion instanceof Errores) return resultadofuncion

        }
    }

    /*
        TKEXECUTE ID PARI PARAMSCALL PARD   
        | TKEXECUTE ID PARI PARD 
    */
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        if (this.parametros != null){
            let nodoEx = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoParam = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodopc = `n${contador.get()}`
            let obtId = `n${contador.get()}`
            resultado += `${nodoEx}[label=\"EXECUTE\"];\n`
            resultado += `${nodoId}[label=\"ID\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoParam}[label=\"PARAMETROS\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodopc}[label=\";\"];\n`
            resultado += `${obtId}[label=\"${this.id}\"];\n`
            resultado += `${anterior}->${nodoEx};\n`
            resultado += `${anterior}->${nodoId};\n`
            resultado += `${anterior}->${nodoPI};\n`
            resultado += `${anterior}->${nodoParam};\n`
            resultado += `${anterior}->${nodoPd};\n`
            resultado += `${anterior}->${nodopc};\n`
            resultado += `${nodoId}->${obtId};\n`
            for(let i of this.parametros){
                resultado += i.getAST(nodoParam)
            }
        }else{
            let nodoEx = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodopc = `n${contador.get()}`
            let obtId = `n${contador.get()}`
            resultado += `${nodoEx}[label=\"EXECUTE\"];\n`
            resultado += `${nodoId}[label=\"ID\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodopc}[label=\";\"];\n`
            resultado += `${obtId}[label=\"${this.id}\"];\n`
            resultado += `${anterior}->${nodoEx};\n`
            resultado += `${anterior}->${nodoId};\n`
            resultado += `${anterior}->${nodoPI};\n`
            resultado += `${anterior}->${nodoPd};\n`
            resultado += `${anterior}->${nodopc};\n`
            resultado += `${nodoId}->${obtId};\n`
        }
        return resultado
    }
}

//Nota tomar en cuenta que en la pagina 26 del enunciado se mensionan parametros formales por omision
//estos parametros no vienen en los archivos de evaluacion