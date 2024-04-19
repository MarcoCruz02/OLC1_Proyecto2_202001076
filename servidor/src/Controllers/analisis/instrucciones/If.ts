import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Break from "./Break";
import Tipo, {tipoDato} from "../simbolo/Tipo";

export default class If extends Instruccion {
    //almacena la condicion del if
    private condicion: Instruccion
    //almacena todo lo que esta dentro del if esperando a verificar si se ejecuta o no
    private instrucciones: Instruccion[]
    private instrucciones2: Instruccion[]


    constructor(cond: Instruccion, inst: Instruccion[],instSec:Instruccion[], linea: number, columna: number) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.condicion = cond
        this.instrucciones = inst
        this.instrucciones2=instSec
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //al estar en un if la condicion se valida en el ambito fuera de el
        let cond = this.condicion.interpretar(arbol, tabla)
        if (cond instanceof Errores) return cond

        //validamos que la condicion sea booleana
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL) {
            //console.log("entra err bool")
            return new Errores("Semantico", "La condicion debe ser bool", this.linea, this.columna)
        }

        //creamos tabla para el ambito nuevo del if
        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("Sentencia If")

        //si el valor interpretado es verdadero ejecutamos instrucciones de lo contrario no
        //console.log(cond)
        if (cond) {
            for (let i of this.instrucciones) {
                //dentro de el if tambien puede venir un break para detener en caso este pertenezca a un ciclo
                if (i instanceof Break) return i;    //si dentro del if viene un break directo retorno el break
                let resultado = i.interpretar(arbol, newTabla)
                //validacion si viene in if dentro de otro y se debe retornar el break
                if (resultado instanceof Break) return resultado
            }
        }else{
        //si no toma la instruccion secundaria
            if(this.instrucciones2){
                for (let i of this.instrucciones2) {
                    if (i instanceof Break) return i;    //si dentro del if viene un break retorno el break
                    let resultado = i.interpretar(arbol, newTabla)
                    //validacion si viene in if dentro de otro y se debe retornar el break
                    if (resultado instanceof Break) return resultado
                }
            }  
        }
    }
}

/*
ejempo de un break dentro de un if dentro de un ciclo
while(){
    if(){
        break:
        console.log("hola")
    }
}
en este caso el break para antes del cosole para revidar si este pertenece a un ciclo
*/ 