import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import Lista2D from "../simbolo/Lista2D";
import Simbolo from "../simbolo/Simbolo";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";

export default class DeclaracionLista2D extends Instruccion {
    private identificador: string
    private valor: Instruccion[][]
    private row: Instruccion
    private column: Instruccion

    constructor(tipo: Tipo, linea: number, columna: number, id: string, valor: Instruccion[][], row: Instruccion, column: Instruccion) {
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
                    //console.log("crea lista de listas sin datos")
                    //declaramos lista2dvacia de tipo lista de listas asignandole tamaño con row y column 
                    //console.log("declaracion L2D cadenas")
                    let lista2dvacia: number[][] = Array.from(Array(parseInt(this.row.interpretar(arbol, tabla))), () => Array(parseInt(this.column.interpretar(arbol, tabla))));
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvacia, parseInt(this.row.interpretar(arbol, tabla)), parseInt(this.column.interpretar(arbol, tabla))))) {
                        //console.log("entro a err tabla sim matix")
                        return new Errores("Semantico", "Lista 2D tipo int ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.CADENA:
                    //console.log("crea lista de listas sin datos")
                    //declaramos lista2dvacia de tipo lista de listas asignandole tamaño con row y column 
                    let lista2dvaciaCad: string[][] = Array.from(Array(parseInt(this.row.interpretar(arbol, tabla))), () => Array(parseInt(this.column.interpretar(arbol, tabla))));
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaCad, parseInt(this.row.interpretar(arbol, tabla)), parseInt(this.column.interpretar(arbol, tabla))))) {
                        //console.log("entro a err tabla sim matix")
                        return new Errores("Semantico", "Lista 2D tipo string ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.DECIMAL:
                    //console.log("crea lista de listas sin datos")
                    //declaramos lista2dvacia de tipo lista de listas asignandole tamaño con row y column 
                    let lista2dvaciaDec: number[][] = Array.from(Array(parseInt(this.row.interpretar(arbol, tabla))), () => Array(parseInt(this.column.interpretar(arbol, tabla))));
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaDec, parseInt(this.row.interpretar(arbol, tabla)), parseInt(this.column.interpretar(arbol, tabla))))) {
                        //console.log("entro a err tabla sim matix")
                        return new Errores("Semantico", "Lista 2D tipo string ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.BOOL:
                    //console.log("crea lista de listas sin datos")
                    //declaramos lista2dvacia de tipo lista de listas asignandole tamaño con row y column 
                    let lista2dvaciaBol: boolean[][] = Array.from(Array(parseInt(this.row.interpretar(arbol, tabla))), () => Array(parseInt(this.column.interpretar(arbol, tabla))));
                    console.log("declaracion L2D cadenas")
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaBol, parseInt(this.row.interpretar(arbol, tabla)), parseInt(this.column.interpretar(arbol, tabla))))) {
                        //console.log("entro a err tabla sim matix")
                        return new Errores("Semantico", "Lista 2D tipo string ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.CARACTER:
                    //console.log("crea lista de listas sin datos")
                    //declaramos lista2dvacia de tipo lista de listas asignandole tamaño con row y column 
                    let lista2dvaciaCar: string[][] = Array.from(Array(parseInt(this.row.interpretar(arbol, tabla))), () => Array(parseInt(this.column.interpretar(arbol, tabla))));
                    console.log("declaracion L2D cadenas")
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaCar, parseInt(this.row.interpretar(arbol, tabla)), parseInt(this.column.interpretar(arbol, tabla))))) {
                        //console.log("entro a err tabla sim matix")
                        return new Errores("Semantico", "Lista 2D tipo string ya existe en tabla de simbolos", this.linea, this.columna)
                    }
            }
        } else {
            //Caso si la lista de 2 dimensiones trae datos dentro , this.valor != null
            //console.log(this.valor.length)
            //console.log(this.valor[0]?.length)
            //this.valor.forEach(elemento => {
            //    console.log(elemento);
            //});
            switch (this.tipoDato.getTipo()) {
                case tipoDato.ENTERO:
                    // aunque el this.valor nos retorne una lista vamos a crear una lista aparte con los parametros iguales 
                    let lista2dvacia: number[][] = Array.from(Array(this.valor.length), () => Array(this.valor[0]?.length));
                    //llenamos la lista creada con los datos de la lista que retorna this.valor 
                    for (let i = 0; i < this.valor.length; i++) {
                        for (let j = 0; j < this.valor[i].length; j++) {
                            //al llenarla la interpretamos debido a que nos retorna un Object tipo Instruccion
                            lista2dvacia[i][j] = this.valor[i][j].interpretar(arbol, tabla);
                        }
                    }
                    //asignamos lista a tabla
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvacia, this.valor.length, this.valor[0]?.length))) {
                        return new Errores("Semantico", "Lista 2D llena ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.CADENA:
                    let lista2dvaciaCad: string[][] = Array.from(Array(this.valor.length), () => Array(this.valor[0]?.length));
                    for (let i = 0; i < this.valor.length; i++) {
                        for (let j = 0; j < this.valor[i].length; j++) {
                            lista2dvaciaCad[i][j] = this.valor[i][j].interpretar(arbol, tabla);
                        }
                    }
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaCad, this.valor.length, this.valor[0]?.length))) {
                        return new Errores("Semantico", "Lista 2D llena ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.DECIMAL:
                    let lista2dvaciaDec: number[][] = Array.from(Array(this.valor.length), () => Array(this.valor[0]?.length));
                    for (let i = 0; i < this.valor.length; i++) {
                        for (let j = 0; j < this.valor[i].length; j++) {
                            lista2dvaciaDec[i][j] = this.valor[i][j].interpretar(arbol, tabla);
                        }
                    }
                    //asignamos lista a tabla
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaDec, this.valor.length, this.valor[0]?.length))) {
                        return new Errores("Semantico", "Lista 2D llena ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.BOOL:
                    let lista2dvaciaBol: boolean[][] = Array.from(Array(this.valor.length), () => Array(this.valor[0]?.length));
                    for (let i = 0; i < this.valor.length; i++) {
                        for (let j = 0; j < this.valor[i].length; j++) {
                            lista2dvaciaBol[i][j] = this.valor[i][j].interpretar(arbol, tabla);
                        }
                    }
                    //asignamos lista a tabla
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaBol, this.valor.length, this.valor[0]?.length))) {
                        return new Errores("Semantico", "Lista 2D llena ya existe en tabla de simbolos", this.linea, this.columna)
                    }
                case tipoDato.CARACTER:
                    let lista2dvaciaCar: string[][] = Array.from(Array(this.valor.length), () => Array(this.valor[0]?.length));
                    for (let i = 0; i < this.valor.length; i++) {
                        for (let j = 0; j < this.valor[i].length; j++) {
                            lista2dvaciaCar[i][j] = this.valor[i][j].interpretar(arbol, tabla);
                        }
                    }
                    //asignamos lista a tabla
                    if (!tabla.setLista2D(new Lista2D(this.tipoDato, this.identificador, lista2dvaciaCar, this.valor.length, this.valor[0]?.length))) {
                        return new Errores("Semantico", "Lista 2D llena ya existe en tabla de simbolos", this.linea, this.columna)
                    }
            }
            //console.log("No es lista 2D de inisializacion")

        }

    }

}

/*
//pruebas
std::string vector2[][] = new std::string [3][3];
int a = 1;
int c = 2;
vector2[0][0] = "ab";
vector2[0][1] = "cd";
vector2[0][2] = "ef";
vector2[1][0] = "gh";
vector2[1][1] = "ij";
vector2[1][2] = "kl";
vector2[2][0] = "mn";
vector2[2][1] = "ño";
vector2[2][2] = "pq";
//hasta aqui

std::string b = vector2[0][0];
cout << b <<endl;
b = vector2[0][1];
cout << b <<endl;
b = vector2[0][2];
cout << b <<endl;
b = vector2[1][0];
cout << b <<endl;
b = vector2[1][1];
cout << b <<endl;
b = vector2[1][2];
cout << b <<endl;
b = vector2[2][0];
cout << b <<endl;
b = vector2[2][1];
cout << b <<endl;
b = vector2[2][2];
cout << b <<endl;

//booleans
bool vector2[][] = new bool [3][3];
int a = 1;
int c = 2;
vector2[0][0] = true;
vector2[0][1] = false;
vector2[0][2] = true;
vector2[1][0] = false;
vector2[1][1] = true;
vector2[1][2] = false;
vector2[2][0] = true;
vector2[2][1] = false;
vector2[2][2] = true;
//hasta aqui

bool b = vector2[0][0];
cout << b <<endl;
b = vector2[0][1];
cout << b <<endl;
b = vector2[0][2];
cout << b <<endl;
b = vector2[1][0];
cout << b <<endl;
b = vector2[1][1];
cout << b <<endl;
b = vector2[1][2];
cout << b <<endl;
b = vector2[2][0];
cout << b <<endl;
b = vector2[2][1];
cout << b <<endl;
b = vector2[2][2];
cout << b <<endl;

//double
double vector2[][] = new double [3][3];
int a = 1;
int c = 2;
vector2[0][0] = 1.1;
vector2[0][1] = 1.2;
vector2[0][2] = 1.7;
vector2[1][0] = 1.3;
vector2[1][1] = 1.4;
vector2[1][2] = 1.5;
vector2[2][0] = 1.6;
vector2[2][1] = 1.8;
vector2[2][2] = 1.9;
//hasta aqui

double b = vector2[0][0];
cout << b <<endl;
b = vector2[0][1];
cout << b <<endl;
b = vector2[0][2];
cout << b <<endl;
b = vector2[1][0];
cout << b <<endl;
b = vector2[1][1];
cout << b <<endl;
b = vector2[1][2];
cout << b <<endl;
b = vector2[2][0];
cout << b <<endl;
b = vector2[2][1];
cout << b <<endl;
b = vector2[2][2];
cout << b <<endl;
*/