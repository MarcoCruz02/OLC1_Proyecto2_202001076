import { Instruccion } from "../abstracto/Instruccion";
import Arbol from "../simbolo/Arbol";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, { tipoDato } from "../simbolo/Tipo";
import Errores from "../excepciones/Errores";
import Break from "./Break";

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

