import tablaSimbolo from "./tablaSimbolos";
import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";

export default class Arbol {
    private instrucciones : Array <Instruccion>
    private consola : string
    private tabGlobal : tablaSimbolo
    private errores : Array <Errores>

    constructor(instrucciones: Array<Instruccion>){
        this.instrucciones = instrucciones
        this.consola = ""
        this.tabGlobal = new tablaSimbolo()
        this.errores = new Array<Errores>
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
}