import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Metodo from "./Metodo";
import Declaracion from "./Declaracion";
import Return from "./Return";

export default class Llamada extends Instruccion{
    private id : string
    private parametros : Instruccion[]

    constructor(id:string, linea:number, columna:number, parametros:Instruccion[]){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.parametros = parametros
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let busqueda = arbol.getFuncion(this.id)
        if(busqueda == null)return new Errores("Semantico","Funcion no existente",this.linea, this.columna)
        
        if (busqueda instanceof Metodo){
            console.log("encontro metodo")
            let newTabla = new tablaSimbolo(arbol.getTablaGlobal())
            newTabla.setNombre("Llamada a Metodo " +this.id )
            //validacion parametros
            if (busqueda.parametros.length != this.parametros.length){
                console.log("error params metodo")
                return new Errores("Semantico","Parametros no coinciden", this.linea, this.columna)
            }

            //es igual al run en su mayoria
            for (let i = 0; i < busqueda.parametros.length; i++){
                console.log("entra for")
                let declaracionparametro = new Declaracion(busqueda.parametros[i].tipo, this.linea, this.columna, 
                    busqueda.parametros[i].id)
                
                //declaramos variable en el ambito de la funcion
                let resultado = declaracionparametro.interpretar(arbol,newTabla)
                if (resultado instanceof Errores) return resultado

                //interpretamos su valor
                let valor = this.parametros[i].interpretar(arbol,tabla)
                if(valor instanceof Errores) return valor

                let variable = newTabla.getVariable(busqueda.parametros[i].id)
                if (variable == null) return new Errores("Semantico","Error variable no encontrada analisis de llamada", this.linea, this.columna)

                if (variable.getTipo().getTipo() != this.parametros[i].tipoDato.getTipo()){
                    return new Errores("Semantico","Error tipos no coinsiden analisis de llamada", this.linea, this.columna)
                }
                variable.setValor(valor)
                console.log("-------")
                console.log(variable)
                console.log("-------")
                console.log(valor)
                console.log("-------")
            }
            //interpretamos la funcion que se va a llamar
            let resultadoFuncion: any = busqueda.interpretar(arbol,newTabla)
            //if (resultadoFuncion instanceof Return) return resultadoFuncion
            if (resultadoFuncion instanceof Errores) return resultadoFuncion
        }
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