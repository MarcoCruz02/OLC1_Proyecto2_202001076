import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Lista2D from "../simbolo/Lista2D";
import Simbolo from "../simbolo/Simbolo";
import Contador from "../simbolo/Contador";

export default class AccesoList2D extends Instruccion {
    private id: string
    private posicion1: Instruccion
    private posicion2: Instruccion

    constructor(id: string, linea: number, columna: number, posicion1:Instruccion, posicion2:Instruccion) {
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.id = id
        this.posicion1 = posicion1
        this.posicion2 = posicion2
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let valorListaLista: Lista2D = <Lista2D>tabla.getLista2D(this.id)
        if (valorListaLista == null) return new Errores("Semantico", "Acceso a lista 2D no valido", this.linea, this.columna)
        this.tipoDato = valorListaLista.getTipo()

        //verificamos que el valor de posicion 1 y 2 pertenezcan a la tabla de simbolos por lo tanto seran variables
        let valorVarposi1: Simbolo = <Simbolo> tabla.getVariable(String(this.posicion1.interpretar(arbol,tabla)))
        let valorVarposi2: Simbolo = <Simbolo> tabla.getVariable(String(this.posicion2.interpretar(arbol,tabla)))

        //si ambos exiten solo para el caso donde [a] [b] ambas posiciones esten marcadas por variables
        if (valorVarposi1 != null && valorVarposi2 != null){
            //retorna como posicion el valor de las variables encontradas
            return valorListaLista.getValor(valorVarposi1.getValor(),valorVarposi2.getValor())
        }else if (valorVarposi1 != null && valorVarposi2 == null){
            //retorna como posicion el valor de las variable encontrada en este caso variable posicion 1
            return valorListaLista.getValor(valorVarposi1.getValor(),this.posicion2.interpretar(arbol,tabla))
        }else if (valorVarposi1 == null && valorVarposi2 != null){
            //retorna como posicion el valor de las variable encontrada
            return valorListaLista.getValor(this.posicion1.interpretar(arbol,tabla),valorVarposi2.getValor())
        }
        //de lo contrario son numeros comunes y su acceso se interpreta normal
        //console.log(this.posicion1)
        return valorListaLista.getValor(this.posicion1.interpretar(arbol,tabla),this.posicion2.interpretar(arbol,tabla))
    }

    //ID CORI EXPRESION CORD CORI EXPRESION CORD
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""
        let nodoId = `n${contador.get()}`
        let nodoCI1 = `n${contador.get()}`
        let nodoExp1 = `n${contador.get()}`
        let nodoCD1 = `n${contador.get()}`
        let nodoCI2 = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        let nodoCD2 = `n${contador.get()}`
        resultado += `${nodoId}[label=\"ID\"];\n`
        resultado += `${nodoCI1}[label=\"[\"];\n`
        resultado += `${nodoExp1}[label=\"EXPRESION\"];\n`
        resultado += `${nodoCD1}[label=\"]\"];\n`
        resultado += `${nodoCI2}[label=\"[\"];\n`
        resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
        resultado += `${nodoCD2}[label=\"]\"];\n`
        resultado += `${anterior}->${nodoId};\n`
        resultado += `${anterior}->${nodoCI1};\n`
        resultado += `${anterior}->${nodoExp1};\n`
        resultado += `${anterior}->${nodoCD1};\n`
        resultado += `${anterior}->${nodoCI2};\n`
        resultado += `${anterior}->${nodoExp2};\n`
        resultado += `${anterior}->${nodoCD2};\n`
        resultado += this.posicion1.getAST(nodoExp1)
        resultado += this.posicion2.getAST(nodoExp2)
        return resultado
    }
}