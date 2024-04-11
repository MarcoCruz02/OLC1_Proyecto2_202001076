import { Instruccion } from "../abstracto/Instruccion";
import Lista from "../simbolo/Lista";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";

export default class DeclaracionLista extends Instruccion{
    private identificador : string
    private valor : Instruccion[]
    private lenght : number

    constructor(tipo:Tipo, linea:number, columna: number, id : string, valor : Instruccion[], lenght : number){
        super(tipo, linea, columna)
        this.identificador = id
        this.valor = valor
        this.lenght = lenght
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        //declaramos para el primer caso, tipo declaracion de espacio sin datos arr [] = [#]
        if (this.valor == null) {
            switch (this.tipoDato.getTipo()) {
                case tipoDato.ENTERO:
                    let arregloVacio: number[] = new Array(this.lenght);
                    for (let i = 0; i < arregloVacio.length; i++) {
                        arregloVacio.fill(0);
                    }
                    if (!tabla.setLista(new Lista(this.tipoDato,this.identificador, arregloVacio, this.lenght))){
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }  
            }
        } else {
            switch (this.tipoDato.getTipo()) {
                case tipoDato.ENTERO:
                    if (!tabla.setLista(new Lista(this.tipoDato,this.identificador,this.valor,0))){
                        return new Errores("Semantico", "Arreglo ya existe en tabla de simbolos", this.linea, this.columna)
                    } 
                    this.valor.forEach(elemento => {
                        console.log(elemento);
                    });
                case tipoDato.CADENA:
                    if (!tabla.setLista(new Lista(this.tipoDato,this.identificador,this.valor,0))){
                        return new Errores("Semantico", "Arreglo ya existe en tabla de simbolos", this.linea, this.columna)
                    } 
                    this.valor.forEach(elemento => {
                        console.log(elemento);
                    });
            }

        }

    }
}