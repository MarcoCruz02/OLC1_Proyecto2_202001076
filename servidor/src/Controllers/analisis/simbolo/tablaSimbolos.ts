import Simbolo from "./Simbolo";
import Tipo,{tipoDato} from "./Tipo";

export default class tablaSimbolo{
    //en esta linea estoy diciendo que mi tabla de simbolos anterior puede ser una tabla de simbolos o cualquier cosa
    private tabAnterior : tablaSimbolo | any
    private tabActual : Map<string, Simbolo>   //hashmap
    private nombre: string

    constructor(anterior?:tablaSimbolo){
        this.tabAnterior = anterior
        this.tabActual = new Map<string, Simbolo>
        this.nombre = ""
    }

    //Getters y Setters
    public getAnterior(): tablaSimbolo {
        return this.tabAnterior
    }

    public setAnterior(anterior: tablaSimbolo): void {
        this.tabAnterior = anterior
    }

    public getTabla(): Map<String, Simbolo> {
        return this.tabActual;
    }

    public setTabla(tabla: Map<string, Simbolo>) {
        this.tabActual = tabla
    }

    public getVariable(id: string) {
        //return <Simbolo> this.getTabla().get(id.toLocaleLowerCase())
        return <Simbolo>this.getTabla().get(id.toLocaleLowerCase())
    }

    //agrega variables a tabla de simbolos
    public setVariable(simbolo: Simbolo) {
        let busqueda: Simbolo = <Simbolo>this.getTabla().get(simbolo.getId().toLocaleLowerCase())
        if (busqueda == null){
            this.tabActual.set(simbolo.getId().toLocaleLowerCase(), simbolo)
            return true
        }
        return false
    }


    public getNombre(): string {
        return this.nombre
    }

    public setNombre(nombre: string): void {
        this.nombre = nombre
    }
}