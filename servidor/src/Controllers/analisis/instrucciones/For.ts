import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Break from "./Break";
import Contador from "../simbolo/Contador";

export default class For extends Instruccion{
    private declaracionAsignacion : Instruccion
    private condicion : Instruccion
    private actualizacion : Instruccion
    private instrucciones : Instruccion[]

    constructor(decasig : Instruccion, cond : Instruccion, actualiz : Instruccion, inst : Instruccion[], linea: number, columna: number){
        super(new Tipo(tipoDato.VOID), linea, columna)
        this.declaracionAsignacion = decasig
        this.condicion = cond
        this.actualizacion = actualiz
        this.instrucciones = inst
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        let decasig = this.declaracionAsignacion.interpretar(arbol, tabla)
        if (decasig instanceof Errores) return decasig

        //interpreto 1 vez
        let cond = this.condicion.interpretar(arbol, tabla)
        //valido que no me de error
        if (cond instanceof Errores) return cond

        let actualiz = this.actualizacion.interpretar(arbol, tabla)
        if (actualiz instanceof Errores) return actualiz

        //se valida la condicion
        if (this.condicion.tipoDato.getTipo() != tipoDato.BOOL){
            return new Errores("Semantico", "Condicion en For no es booleana", this.linea, this.columna)
        }
        //if (this.declaracionAsignacion.interpretar(arbol,tabla) ){
        //    console.log("asign")
        //}

        let newTabla = new tablaSimbolo(tabla)
        newTabla.setNombre("Sentencia For")
        for(this.declaracionAsignacion.interpretar(arbol,newTabla);this.condicion.interpretar(arbol, newTabla);this.actualizacion.interpretar(arbol,newTabla)){
            for(let i of this.instrucciones){
                //añadimos que pasa si viene un break
                if (i instanceof Break) return;   //si el break viene dentro del ciclo  nada mas
                let resultado = i.interpretar(arbol, newTabla)
                //si el break viene dentro de un if en las instrucciones
                if (resultado instanceof Break) return;
            }
        }
    }

    //TKFOR PARI DECVARIABLE PUNTOCOMA EXPRESION PUNTOCOMA EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED
    //TKFOR PARI ASIGNACION PUNTOCOMA EXPRESION PUNTOCOMA EXPRESION PARD LLAVEI INSTRUCCIONES LLAVED
    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        let nodoT = `n${contador.get()}`
        let nodoFor = `n${contador.get()}`
        let nodoPI = `n${contador.get()}`
        let nodoDA = `n${contador.get()}`
        let nodopc1 = `n${contador.get()}`
        let nodoExp = `n${contador.get()}`
        let nodopc2 = `n${contador.get()}`
        let nodoExp2 = `n${contador.get()}`
        let nodoPd = `n${contador.get()}`
        let nodoLli = `n${contador.get()}`
        let nodoIns = `n${contador.get()}`
        let nodoLld = `n${contador.get()}`
        resultado += `${nodoT}[label=\"SENTFOR\"];\n`
        resultado += `${nodoFor}[label=\"FOR\"];\n`
        resultado += `${nodoPI}[label=\"(\"];\n`
        resultado += `${nodoDA}[label=\"EXPRESION\"];\n`
        resultado += `${nodopc1}[label=\";\"];\n`
        resultado += `${nodoExp}[label=\"EXPRESION\"];\n`
        resultado += `${nodopc2}[label=\";\"];\n`
        resultado += `${nodoExp2}[label=\"EXPRESION\"];\n`
        resultado += `${nodoPd}[label=\")\"];\n`
        resultado += `${nodoLli}[label=\"{\"];\n`
        resultado += `${nodoIns}[label=\"INSTRUCCIONES\"];\n`
        resultado += `${nodoLld}[label=\"}\"];\n`
        resultado += `${anterior}->${nodoT};\n`
        resultado += `${nodoT}->${nodoFor};\n`
        resultado += `${nodoT}->${nodoPI};\n`
        resultado += `${nodoT}->${nodoDA};\n`
        resultado += `${nodoT}->${nodopc1};\n`
        resultado += `${nodoT}->${nodoExp};\n`
        resultado += `${nodoT}->${nodopc2};\n`
        resultado += `${nodoT}->${nodoExp2};\n`
        resultado += `${nodoT}->${nodoPd};\n`
        resultado += `${nodoT}->${nodoLli};\n`
        resultado += `${nodoT}->${nodoIns};\n`
        resultado += `${nodoT}->${nodoLld};\n`
        resultado += this.declaracionAsignacion.getAST(nodoDA)
        resultado += this.condicion.getAST(nodoExp)
        resultado += this.actualizacion.getAST(nodoExp2)
        for(let i of this.instrucciones){
            resultado += i.getAST(nodoIns)
        }
        return resultado
    }
}

/*
cout<< "Primer FOR" <<endl;
for(int i = 0; i<3 ; i++){
    break;
    cout<< i <<endl;
    cout<< "funcion for" <<endl;
}
cout<< "" <<endl;
cout<< "" <<endl;
cout<< "Segundo FOR" <<endl;
int j = 0;
for(j = 2; j<5 ; j++){
    break;
    cout<< j <<endl;
    cout<< "funcion for" <<endl;
}
*/

/*
//prueba con ordenamiento burbuja
int arreglo[] = [2,3,5,4,6,8,1,7];

int n = 8;
for (int i = 0; i < n-1 ; i++) {
    for (int j = 0; j < n - i - 1 ; j++) {
         // Compara elementos adyacentes
         if (arreglo[j] > arreglo[j + 1]) {
            // Intercambia si el elemento actual es mayor que el siguiente
            int temp = arreglo[j];
            arreglo[j] = arreglo[j + 1];
            arreglo[j + 1] = temp;
        }
    }
}
int b = arreglo[0];
cout << b <<endl;
b = arreglo[1];
cout << b <<endl;
b = arreglo[2];
cout << b <<endl;
b = arreglo[3];
cout << b <<endl;
b = arreglo[4];
cout << b <<endl;
b = arreglo[5];
cout << b <<endl;
b = arreglo[6];
cout << b <<endl;
b = arreglo[7];
cout << b <<endl;
*/

