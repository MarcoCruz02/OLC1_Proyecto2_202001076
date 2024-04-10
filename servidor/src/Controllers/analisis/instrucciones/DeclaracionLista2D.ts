import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Lista2D from "../simbolo/Lista2D";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";

export default class DeclaracionLista2D extends Instruccion{
    private identificador : string
    private valor : Instruccion[][]
    private row: number
    private column: number

    constructor(tipo:Tipo, linea:number, columna: number, id : string, valor : Instruccion[][], row : number, column : number){
        super(tipo, linea, columna)
        this.identificador = id
        this.valor = valor
        this.row = row
        this.column = column
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //declaramos para el primer caso, tipo declaracion de espacio sin datos listadelistas [][] = [#][#]
        if (this.valor == null) {
            switch (this.tipoDato.getTipo()) {
               case tipoDato.ENTERO:
                    console.log("crea lista de listas")
                    //declaramos lista2dvacia de tipo lista de listas asignandole tamaño con row y column y seteandole valores 0
                    let lista2dvacia: number[][] = Array.from(Array(this.row), () => Array(this.column).fill(0));
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvacia, this.row, this.column))){
                        return new Errores("Semantico", "Arreglo ya existe en tabla de simbolos", this.linea, this.columna)
                    }  
            }
        } else {
            /*
           switch (this.tipoDato.getTipo()) {
               case tipoDato.ENTERO:
                   if (!tabla.setLista(new Lista2D(this.tipoDato,this.identificador,this.valor,0))){
                       return new Errores("Semantico", "Arreglo ya existe en tabla de simbolos", this.linea, this.columna)
                   } 
                   this.valor.forEach(elemento => {
                       console.log(elemento);
                   });
               case tipoDato.CADENA:
                   if (!tabla.setLista(new Lista2D(this.tipoDato,this.identificador,this.valor,0))){
                       return new Errores("Semantico", "Arreglo ya existe en tabla de simbolos", this.linea, this.columna)
                   } 
                   this.valor.forEach(elemento => {
                       console.log(elemento);
                   });
            }*/
            console.log("No es lista 2D de inisializacion")

       }

    }
}