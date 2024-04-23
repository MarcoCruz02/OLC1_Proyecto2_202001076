import { useEffect, useState, useRef } from "react"
import Editor from '@monaco-editor/react';
import { Graphviz } from 'graphviz-react';


function AST() {
  const [valorAst, setValorCadenaAst] = useState(String);

  const mostrarAST = () => {
    fetch('http://localhost:4000/getAST', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())                                         // Analizar la respuesta JSON
    .then(jsonData => {
        //console.log(jsonData["AST"]);                                                  // Use los datos JSON
        //globaljsonData = jsonData;
        //return jsonData;
        setValorCadenaAst(jsonData.AST);
        //console.log(valorAst)
                                                                              // Realizar acciones basadas en los datos
    })
    .catch(error => console.error('Error al obtener JSON:', error));           // Manejar errores
  };

  //<Graphviz dot={`${valorAst}`} />
  return (
    <div className="generadorAst">
        <input type="button" value="Interpretar" id="btnCargar" className="btn btn-outline-secondary" onClick={mostrarAST} />
        <div>
                {valorAst && <Graphviz dot={valorAst} />}
        </div>
    </div>
  );
}


export default AST;