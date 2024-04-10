import Simbolo from "./Simbolo";
import Tipo,{tipoDato} from "./Tipo";
import Lista from "./Lista";
import Lista2D from "./Lista2D";

export default class tablaSimbolo{
    //en esta linea estoy diciendo que mi tabla de simbolos anterior puede ser una tabla de simbolos o cualquier cosa
    private tabAnterior : tablaSimbolo | any
    private tabActual : Map<string, Simbolo | Lista | Lista2D>   //hashmap
    private nombre: string

    constructor(anterior?:tablaSimbolo){
        this.tabAnterior = anterior
        this.tabActual = new Map<string, Simbolo>()
        this.nombre = ""
    }

    //Getters y Setters
    public getAnterior(): tablaSimbolo {
        return this.tabAnterior
    }

    public setAnterior(anterior: tablaSimbolo): void {
        this.tabAnterior = anterior
    }

    public getTabla(): Map<String, Simbolo | Lista | Lista2D> {
        return this.tabActual;
    }

    public setTabla(tabla: Map<string, Simbolo | Lista | Lista2D>) {
        this.tabActual = tabla
    }

    public getVariable(id: string) {
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
    
    //obtenemos lista
    public getLista(id : string){
        return <Lista>this.getTabla().get(id.toLocaleLowerCase())
    }

    //agregamos listas a tabla de simbolos
    public setLista(simbolo : Lista){
        let busquedaArr : Lista = <Lista>this.getTabla().get(simbolo.getId().toLocaleLowerCase())
        if (busquedaArr == null){
            this.tabActual.set(simbolo.getId().toLocaleLowerCase(), simbolo)
            return true
        }
        return false
    }

    //obtenemos lista2D
    public getLista2D(id : string){
        return <Lista2D>this.getTabla().get(id.toLocaleLowerCase())
    }

    //agregamos listas2D a tabla de simbolos
    public setLista2D(simbolo : Lista2D){
        let busquedaListList : Lista2D = <Lista2D>this.getTabla().get(simbolo.getId().toLocaleLowerCase())
        if (busquedaListList == null){
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
