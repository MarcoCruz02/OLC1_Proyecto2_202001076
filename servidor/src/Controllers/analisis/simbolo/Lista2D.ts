import Tipo from './Tipo'

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
        //console.log(this.valor[posicion].valor)
        return this.valor[posicion1][posicion2].valor
    }

    public setValor(valor: any[][]) {
        this.valor = valor
    }  

}