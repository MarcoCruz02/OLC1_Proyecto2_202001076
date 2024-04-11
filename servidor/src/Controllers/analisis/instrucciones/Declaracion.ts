import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Lista from "../simbolo/Lista";
import Lista2D from "../simbolo/Lista2D";

export default class Declaracion extends Instruccion{
    //declaramos identificador como lista para cuando se declare asi int x,y,z ...
    private identificador : string[]
    private valor : Instruccion

    constructor(tipo:Tipo, linea:number, columna: number, id : string[], valor : Instruccion){
        super(tipo, linea, columna)
        this.identificador = id
        this.valor = valor
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        if (this.valor != null){
            //primero se verifica que no sea un error
            let valorFinal = this.valor.interpretar(arbol, tabla)
            console.log(valorFinal)
            console.log(typeof valorFinal)
            if (valorFinal instanceof Errores) return valorFinal
            
            if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()){
                return new Errores("Semantico", "No es posible declarar variable", this.linea, this.columna)
            }
            //si ya se verifico que el valor no es un error y los tipos coinciden, ya se puede declarar
            //ahora que es una lista debemos recorrerla para declarar y almacenar ids
            this.identificador.forEach(identificadorActual => {   
                if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, valorFinal))){
                    return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                }   
            });
        } else {
            //si la expresion es null entra para asignar por defecto
            switch (this.tipoDato.getTipo()) {
                case tipoDato.ENTERO:
                    //si el tipo es entero agregamos el valor por defecto 0 y asi con cada tipo
                    this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, 0))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                case tipoDato.DECIMAL:
                    this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, 0.0))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                case tipoDato.BOOL:
                    this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, true))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                case tipoDato.CARACTER:
                        this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, '0'))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                case tipoDato.CADENA:
                    this.identificador.forEach(identificadorActual => {
                        if (!tabla.setVariable(new Simbolo(this.tipoDato, identificadorActual, ""))){
                            return new Errores("Semantico", "No es posible declarar variable por que ya existe", this.linea, this.columna)
                        }   
                    });
                case tipoDato.VOID:
                    return new Errores("Semantico", "No es posible declarar variables tipo void", this.linea, this.columna)
            }
        }    
    }
}

/* 
        //esto para variables no listas
        //primero se verifica que no sea un error
        let valorFinal = this.valor.interpretar(arbol, tabla)
        if (valorFinal instanceof Errores) return valorFinal
        
        if (this.valor.tipoDato.getTipo() != this.tipoDato.getTipo()){
            return new Errores("Semantico", "No es posible declarar variable", this.linea, this.columna)
        }
        //si ya se verifico que el valor no es un error y los tipos coinciden, ya se puede declarar
        if(!tabla.setVariable(new Simbolo(this.tipoDato, this.identificador, valorFinal))){
            return new Errores("Semantico", "No es posible declarar variable debido a que ya existe", this.linea, this.columna)
        }
*/

