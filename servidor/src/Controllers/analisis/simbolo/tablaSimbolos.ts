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
        this.tabActual = new Map<string, Simbolo | Lista | Lista2D>()
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
        //esto nos permitira trabajar con entornos
        //tablasimbolo = this por que recorremos nuestra tabla actual y si no hay tabla anterior retorna null como en una lista enlazada de fin a inicio
        for(let i: tablaSimbolo = this; i != null; i = i.getAnterior()){
            //console.log("id tabsim "+ id)
            let busqueda : Simbolo = <Simbolo> i.getTabla().get(id.toLocaleLowerCase()) //se modifico de id.toLocaleLowerCase() a String(id).toLocaleLowerCase()  por actualizacion
            if (busqueda != null) return busqueda
        }
        //aca retorno lo que encuentre en mi hash si no estuviera trabajando con entornos solo con tabla actual
        //return <Simbolo>this.getTabla().get(id.toLocaleLowerCase())
        return null
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
        for(let i: tablaSimbolo = this; i != null; i = i.getAnterior()){
            let busqueda : Lista = <Lista> i.getTabla().get(id.toLocaleLowerCase())
            if (busqueda != null) return busqueda
        }
        //return <Lista>this.getTabla().get(id.toLocaleLowerCase())
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
        for(let i: tablaSimbolo = this; i != null; i = i.getAnterior()){
            let busqueda : Lista2D = <Lista2D> i.getTabla().get(id.toLocaleLowerCase())
            if (busqueda != null) return busqueda
        }
        //return <Lista2D>this.getTabla().get(id.toLocaleLowerCase())
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
