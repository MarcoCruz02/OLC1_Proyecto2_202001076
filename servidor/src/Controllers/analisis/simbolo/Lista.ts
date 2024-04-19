import Tipo from './Tipo'

export default class Lista {
    private tipo: Tipo
    private id: string
    private valor: any[]
    private lenght: number

    constructor(tipo: Tipo, id: string, valor: any[],lenght: number) {
        this.tipo = tipo
        this.id = id.toLocaleLowerCase()
        this.valor = valor
        this.lenght = lenght
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

    public getValor(posicion: number) {
        if ( this.lenght > posicion){
            //console.log(this.valor[posicion])
            return this.valor[posicion]
        }
        console.log("fuera de rango en lista ")
        //return this.valor[posicion]
    }

    public setValor(valor: any[], posicion : number) {
        if ( this.lenght > posicion ){
            this.valor[posicion] = valor
        }
        //this.valor = valor
    }
    
    public getLenght() {
        return this.valor.length
    }

}