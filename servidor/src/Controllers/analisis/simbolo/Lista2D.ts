import Tipo from './Tipo'
import Errores from '../excepciones/Errores'

export default class Lista2D {
    private tipo: Tipo
    private id: string
    private valor: any[][]
    private row: number
    private column: number

    constructor(tipo: Tipo, id: string, valor: any[][], row: number, column: number) {
        this.tipo = tipo
        this.id = id.toLocaleLowerCase()
        this.valor = valor
        this.row = row
        this.column = column
    }

    public getTipo(): Tipo {
        return this.tipo
    }

    public setTipo(tipo: Tipo) {
        this.tipo = tipo
    }

    public getId() {
        return this.id
    }

    public setId(id: string) {
        this.id = id
    }

    public getValor(posicion1: number, posicion2: number) {
        //console.log(this.row)
        //console.log(this.column)
        //console.log("--------------")
        if (  this.row > posicion1 &&   this.column > posicion2){
            console.log(this.valor[posicion1][posicion2])
            return this.valor[posicion1][posicion2]
        }
        console.log("fuera de rango en lista de 2 dimensiones")
    }

    public setValor(valor: any, posicion1: number, posicion2: number) {
        //console.log(valor)
        //console.log(posicion1)
        //console.log(posicion2)
        //console.log("--------------")
        if (  this.row > posicion1  &&  this.column > posicion2){
            //console.log(this.valor.length)
            //console.log(this.valor[0]?.length)
            this.valor[posicion1][posicion2] = valor
            //console.log("asignacion 2d realizada")
        }
    }

}