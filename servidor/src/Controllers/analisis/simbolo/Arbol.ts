import tablaSimbolo from "./tablaSimbolos";
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Metodo from "../instrucciones/Metodo";

export default class Arbol {
    private instrucciones : Array <Instruccion>
    private consola : string
    private tabGlobal : tablaSimbolo
    private errores : Array <Errores>
    public contador : number
    private funciones : Array <Instruccion>

    constructor(instrucciones: Array<Instruccion>){
        this.instrucciones = instrucciones
        this.consola = ""
        this.tabGlobal = new tablaSimbolo()
        this.errores = new Array<Errores>
        this.funciones = new Array<Instruccion>
        this.contador = 0
    }

    public Print(contenido:any) {   //con esto decimos que el contenido sera de cualquier tipo
        //a consola si ya tiene contenido le añadimos alto de linea y añadimos contenido o si no solo añadimos
        this.consola = `${this.consola}${contenido}`; // `` estos simbolos se sacan con la tecla al lado de la p si shift o ascii 96
    }

    public PrintLn(contenido:any) {   //con esto decimos que el contenido sera de cualquier tipo
        //a consola si ya tiene contenido le añadimos alto de linea y añadimos contenido o si no solo añadimos
        this.consola = `${this.consola}${contenido}\n`; // `` estos simbolos se sacan con la tecla al lado de la p si shift o ascii 96
    }

    public getInstrucciones(): Array<Instruccion> {
        return this.instrucciones
    }

    public setInstrucciones(instrucciones: Array<Instruccion>): void {
        this.instrucciones = instrucciones
    }

    public getConsola(): string {
        return this.consola
    }

    public setConsola(consola: string): void {
        this.consola = consola
    }

    public getTablaGlobal(): tablaSimbolo {
        return this.tabGlobal
    }

    public setTablaGlobal(tablaG: tablaSimbolo) {
        this.tabGlobal = tablaG
    }
    
    public getErrores(): any {
        return this.errores
    }

    public getFunciones(){
        return this.funciones
    }

    public setFunciones(funciones: Array<Instruccion>){
        this.funciones = funciones
    }

    public addFunciones(funcion : Instruccion){
        this.funciones.push(funcion)
    }

    public getFuncion(id : string){
        for (let i of this.getFunciones()){
            if (i instanceof Metodo){
                if(i.id.toLocaleLowerCase() == id.toLocaleLowerCase()) return i
            }
        }
        return null
    }

    //para uso de ast
    public getContador(): number{
        this.contador++;
        return this.contador
    }
}
