import { Instruccion } from "../abstracto/Instruccion";
import Errores from "../excepciones/Errores";
import tablaSimbolo from "../simbolo/tablaSimbolos";
import Tipo, {tipoDato} from "../simbolo/Tipo";
import Arbol from "../simbolo/Arbol";
import Contador from "../simbolo/Contador";

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

    getAST(anterior:string ): string {
        let contador = Contador.getInstancia()
        let resultado = ""  
        if (this.parametros != null){
            let nodoTipo = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoParam = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoLli = `n${contador.get()}`
            let nodoIns = `n${contador.get()}`
            let nodoLld = `n${contador.get()}`
            let obtTip = `n${contador.get()}`
            let obtId = `n${contador.get()}`
            resultado += `${nodoTipo}[label=\"TIPODATO\"];\n`
            resultado += `${nodoId}[label=\"ID\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoParam}[label=\"PARAMETROS\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoLli}[label=\"{\"];\n`
            resultado += `${nodoIns}[label=\"INSTRUCCIONES\"];\n`
            resultado += `${nodoLld}[label=\"}\"];\n`
            resultado += `${obtTip}[label=\"${this.tipoDato.getTipo()}\"];\n`
            resultado += `${obtId}[label=\"${this.id}\"];\n`
            resultado += `${anterior}->${nodoTipo};\n`
            resultado += `${anterior}->${nodoId};\n`
            resultado += `${anterior}->${nodoPI};\n`
            resultado += `${anterior}->${nodoParam};\n`
            resultado += `${anterior}->${nodoPd};\n`
            resultado += `${anterior}->${nodoLli};\n`
            resultado += `${anterior}->${nodoIns};\n`
            resultado += `${anterior}->${nodoLld};\n`
            resultado += `${nodoTipo}->${obtTip};\n`
            resultado += `${nodoId}->${obtId};\n`
            for(let i of this.parametros){
                resultado += i.getAST(nodoParam)
            }
            for(let i of this.instrucciones){
                resultado += i.getAST(nodoIns)
            }
        }else{
            let nodoTipo = `n${contador.get()}`
            let nodoId = `n${contador.get()}`
            let nodoPI = `n${contador.get()}`
            let nodoPd = `n${contador.get()}`
            let nodoLli = `n${contador.get()}`
            let nodoIns = `n${contador.get()}`
            let nodoLld = `n${contador.get()}`
            let obtTip = `n${contador.get()}`
            let obtId = `n${contador.get()}`
            resultado += `${nodoTipo}[label=\"TIPODATO\"];\n`
            resultado += `${nodoId}[label=\"ID\"];\n`
            resultado += `${nodoPI}[label=\"(\"];\n`
            resultado += `${nodoPd}[label=\")\"];\n`
            resultado += `${nodoLli}[label=\"{\"];\n`
            resultado += `${nodoIns}[label=\"INSTRUCCIONES\"];\n`
            resultado += `${nodoLld}[label=\"}\"];\n`
            resultado += `${obtTip}[label=\"${this.tipoDato.getTipo()}\"];\n`
            resultado += `${obtId}[label=\"${this.id}\"];\n`
            resultado += `${anterior}->${nodoTipo};\n`
            resultado += `${anterior}->${nodoId};\n`
            resultado += `${anterior}->${nodoPI};\n`
            resultado += `${anterior}->${nodoPd};\n`
            resultado += `${anterior}->${nodoLli};\n`
            resultado += `${anterior}->${nodoIns};\n`
            resultado += `${anterior}->${nodoLld};\n`
            resultado += `${nodoTipo}->${obtTip};\n`
            resultado += `${nodoId}->${obtId};\n`
            for(let i of this.instrucciones){
                resultado += i.getAST(nodoIns)
            }
        }
        return resultado
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