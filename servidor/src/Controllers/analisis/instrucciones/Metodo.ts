import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Arbol from "../simbolo/Arbol";

export default class Metodo extends Instruccion{
    public id : string
    public parametros : any[]    //asi tambien le puedo pasar una tupla
    public instrucciones : Instruccion[]

    constructor(id : string, tipo : Tipo, instrucciones : Instruccion[], linea : number, columna : number, parametros : any[]){
        super(tipo,linea,columna)
        this.id = id
        this.parametros = parametros     //los parametros tienen que estar declarados cuando llamo a la funcion
        this.instrucciones = instrucciones
    }

    interpretar(arbol: Arbol, tabla: tablaSimbolo) {
        for(let i of this.instrucciones){
            let resultado = i.interpretar(arbol,tabla)

            //falta recuperacion de errores
            //falta return
        }
    }
}

/* 
//pruebas
int varglobal = 100;

execute metodo1();

void metodo1(){
    cout<<"metodo 1"<<endl;
    cout<<"acceso a la variable global"<<endl;
    if (varglobal < 200){
        cout<<varglobal<<endl;
    }
    metodo2(2);
}

void metodo2(int localVar){
    cout<<"metodo 2"<<endl;
    cout<<localVar<<endl;
    cout<<"sera llamado por metodo 1"<<endl;
}
*/