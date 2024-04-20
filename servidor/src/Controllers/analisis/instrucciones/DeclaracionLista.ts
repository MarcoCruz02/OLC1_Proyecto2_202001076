import { Instruccion } from "../abstracto/Instruccion";
import Lista from "../simbolo/Lista";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import FuncionalidadesEspeciales from "./FuncionalidadesEspeciales";
import Simbolo from "../simbolo/Simbolo";

//export const listAux: any[] = [];

export default class DeclaracionLista extends Instruccion {
    private identificador: string
    private valor: Instruccion[]
    private lenght: Instruccion

    constructor(tipo: Tipo, linea: number, columna: number, id: string, valor: Instruccion[], lenght: Instruccion) {
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
                    let listaVacia: number[] = new Array(parseInt(this.lenght.interpretar(arbol, tabla)));
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVacia, parseInt(this.lenght.interpretar(arbol, tabla))))) {
                        return new Errores("Semantico", "Lista vacia ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.CADENA:
                    let listaVaciaCad: number[] = new Array(parseInt(this.lenght.interpretar(arbol, tabla)));
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCad, parseInt(this.lenght.interpretar(arbol, tabla))))) {
                        return new Errores("Semantico", "Lista ya vacia existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.DECIMAL:
                    let listaVaciaDec: number[] = new Array(parseInt(this.lenght.interpretar(arbol, tabla)));
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaDec, parseInt(this.lenght.interpretar(arbol, tabla))))) {
                        return new Errores("Semantico", "Lista ya vacia existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.BOOL:
                    let listaVaciaBol: number[] = new Array(parseInt(this.lenght.interpretar(arbol, tabla)));
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaBol, parseInt(this.lenght.interpretar(arbol, tabla))))) {
                        return new Errores("Semantico", "Lista ya vacia existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.CARACTER:
                    let listaVaciaCar: number[] = new Array(parseInt(this.lenght.interpretar(arbol, tabla)));
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCar, parseInt(this.lenght.interpretar(arbol, tabla))))) {
                        return new Errores("Semantico", "Lista ya vacia existe en tabla de simbolos", this.linea, this.columna)
                    }
            }
        } else {
            //console.log("lista de tipo llena")
            switch (this.tipoDato.getTipo()) {
                case tipoDato.ENTERO:
                    let listaVacia: number[] = new Array(this.valor.length);
                    for (let i = 0; i < this.valor.length; i++) {
                        listaVacia[i] = this.valor[i].interpretar(arbol, tabla);
                    }
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVacia, this.valor.length))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                //this.valor.forEach(elemento => {
                //    console.log(elemento);
                //});
                case tipoDato.CADENA:
                    let listaVaciaCad: string[] = new Array(this.valor.length);
                    for (let i = 0; i < this.valor.length; i++) {
                        listaVaciaCad[i] = this.valor[i].interpretar(arbol, tabla);
                    }
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCad, this.valor.length))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.DECIMAL:
                    let listaVaciaDec: number[] = new Array(this.valor.length);
                    for (let i = 0; i < this.valor.length; i++) {
                        listaVaciaDec[i] = this.valor[i].interpretar(arbol, tabla);
                    }
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaDec, this.valor.length))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.BOOL:
                    let listaVaciaBol: boolean[] = new Array(this.valor.length);
                    for (let i = 0; i < this.valor.length; i++) {
                        listaVaciaBol[i] = this.valor[i].interpretar(arbol, tabla);
                    }
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaBol, this.valor.length))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.CARACTER:
                    let valorVarcstr: Simbolo = <Simbolo>tabla.getVariable(String(this.valor))
                    if (valorVarcstr != null) {  //para el caso que sea la funcion especial c_str
                        let mycadena: string = valorVarcstr.getValor();
                        //console.log("entra cstr")
                        let charactersArray: string[] = mycadena.split('');
                        if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, charactersArray, charactersArray.length))) {
                            return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                        }
                        //let listaVaciacstr: string[] = new Array(charactersArray.length);
                    } else {
                        let listaVaciaCar: string[] = new Array(this.valor.length);
                        for (let i = 0; i < this.valor.length; i++) {
                            listaVaciaCar[i] = this.valor[i].interpretar(arbol, tabla);
                        }
                        if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCar, this.valor.length))) {
                            return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                        }
                    }
                /*if (this.valor instanceof FuncionalidadesEspeciales) {
                    console.log("entro funcionalidades")
                    let listaVaciaCar: string[] = new Array(this.valor.length);
                    for (let i = 0; i < this.valor.length; i++) {
                        for (let j = 0; j < this.valor[i].interpretar(arbol, tabla).length; j++) {
                            listaVaciaCar[j] = this.valor[i].interpretar(arbol, tabla)[j];
                        }
                    }
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCar, this.valor.length))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
 
                    for (let i = 0; i < listAux.length; i++) {
                        //valLg = this.valor[i].interpretar(arbol, tabla).length
                        console.log(listAux[i])
                    }
                    let valLg ;
                    for (let i = 0; i < this.valor.length; i++) {
                        console.log("entra 1 for")
                        valLg = this.valor[i].interpretar(arbol, tabla).length
                        //console.log(this.valor[i].interpretar(arbol, tabla))
                    }
                    console.log(valLg)
                    let listaVaciaCar: string[] = new Array(valLg);
                    for (let i = 0; i < this.valor.length; i++) {
                        let listaVaciaCar: string[] = new Array(this.valor[i].interpretar(arbol, tabla).length);
                        for (let j = 0; j < this.valor[i].interpretar(arbol, tabla).length; j++) {
                            console.log("entra 2 for")
                            console.log(this.valor[i].interpretar(arbol, tabla)[j])
                            listaVaciaCar[j] = String(this.valor[i].interpretar(arbol, tabla)[j])
                        }
                    }
                    for (let i = 0; i < listaVaciaCar.length; i++) {
                        console.log(listaVaciaCar[i])
                        //listaVaciaCar[i] = String(i);
                    }
                    //console.log(listaVaciaCar)
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCar, valLg))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                } else {
                    console.log("entro else")
                    /*let listaVaciaCar: string[] = new Array(this.valor.length);
                    for (let i = 0; i < this.valor.length; i++) {
                        console.log(this.valor[i].interpretar(arbol, tabla))
                        listaVaciaCar[i] = this.valor[i].interpretar(arbol, tabla);
                    }
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCar, this.valor.length))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                    let valLg ;
                    for (let i = 0; i < this.valor.length; i++) {
                        valLg = this.valor[i].interpretar(arbol, tabla).length
                    }
                    console.log(valLg)
                    let listaVaciaCar: string[] = new Array(valLg);
                    for (let i = 0; i < this.valor.length; i++) {
                        let listaVaciaCar: string[] = new Array(this.valor[i].interpretar(arbol, tabla).length);
                        for (let j = 0; j < this.valor[i].interpretar(arbol, tabla).length; j++) {
                            //console.log(this.valor[i].interpretar(arbol, tabla)[j])
                            listaVaciaCar[j] = String(this.valor[i].interpretar(arbol, tabla)[j])
                        }
                    }
                    for (let i = 0; i < listaVaciaCar.length; i++) {
                        console.log(listaVaciaCar[i])
                        //listaVaciaCar[i] = String(i);
                    }
                    //console.log(listaVaciaCar)
                    if (!tabla.setLista(new Lista(this.tipoDato, this.identificador, listaVaciaCar, valLg))) {
                        return new Errores("Semantico", "Lista ya existe en tabla de simbolos", this.linea, this.columna)
                    }
 
                }*/


            }

        }
    }
}