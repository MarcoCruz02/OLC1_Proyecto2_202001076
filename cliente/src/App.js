import { useEffect, useState, useRef } from "react"
import './App.css';
import Editor from '@monaco-editor/react';
import { Graphviz } from 'graphviz-react';
import AST from "./AST";


function App() {
  const editorRef = useRef(null);
  const consolaRef = useRef(null);
  const [arrErrores, setArregloErrores] = useState([]);
  const [valorAst, setValorCadenaAst] = useState(String);
  //const [astData, setAstData] = useState({});

  function handleEditorDidMount(editor, id) {
    //aca se almacena la informacion de cada editor 
    if (id === "editor") {
      editorRef.current = editor;
    } else if (id === "consola") {
      consolaRef.current = editor;
    }
  }

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
        console.log(valorAst)
        // Realizar acciones basadas en los datos
      })
      .catch(error => console.error('Error al obtener JSON:', error));           // Manejar errores

    /*fetch('http://localhost:4000/getAST', {
    })
    .then(response => response.json())
    .then(data => setAstData(data));
    if (!astData) return <div>Cargando...</div>;
    const astString = astData.AST;
    const mostrarGrafoAST = `
      <html>
        <head>
          <title>AST</title>
        </head>
        <body>
          ${<Graphviz dot={`${astString}`} />}
        </body>
      </html>
    `;

    const nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.open();
    nuevaVentana.document.write(mostrarGrafoAST);
    nuevaVentana.document.close();*/
  };

  const generarAst = () => {
    mostrarAST();
    const mostrarGrafoAST = `
      <html>
        <head>
          <title>AST</title>
        </head>
        <body>
          <div>
            ${valorAst && <Graphviz dot={valorAst} />}
          </div>
        </body>
      </html>
    `;
    //console.log(globaljsonData); 
    const nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.open();
    nuevaVentana.document.write(mostrarGrafoAST);
    nuevaVentana.document.close();
  };

  const mostrarHTMLErrores = () => {
    reporteErrores();
    const reporteHTMLErrores = `
      <html>
        <head>
          <title>Reporte de Errores</title>
        </head>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Error Type</th>
              <th>Description</th>
              <th>Row</th>
              <th>Column</th>
            </tr>
          </thead>
          <tbody>
            ${arrErrores.map((element, index) => (
      <tr key={index}>
        <td>{index}</td>
        <td>{element.tipoError}</td>
        <td>{element.desc}</td>
        <td>{element.fila}</td>
        <td>{element.col}</td>
      </tr>
    ))}
          </tbody>
        </table>
      </html>
    `;

    const nuevaVentana = window.open("", "_blank");
    nuevaVentana.document.open();
    nuevaVentana.document.write(reporteHTMLErrores);
    nuevaVentana.document.close();
  };

  function reporteErrores() {
    fetch("http://localhost:4000/mostrarErrores", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },

    })
      .then(response => response.json())
      .then(data => {
        setArregloErrores(data.ArregloErrores);

        console.log(data.ArregloErrores)
        console.log("Arreglo de errores")
        console.log(arrErrores);

      })
      .catch((error) => {
        alert("Error al generar el reporte de errores.");
        console.error("Error:", error);
      });
  }

  function interpretar() {
    var entrada = editorRef.current.getValue();
    fetch('http://localhost:4000/interpretar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entrada: entrada }),
    })
      .then(response => response.json())
      .then(data => {
        consolaRef.current.setValue(data.Respuesta);
      })
      .catch((error) => {
        alert("Ocurrio un Error")
        console.error('Error:', error);
      });
  }

  const CargarArchivo = (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      var contents = event.target.result;
      editorRef.current.setValue(contents);
    };
    reader.readAsText(file);
  }

  const OpenNewWindowButton = () => {
    const handleClick = () => {
      // Function to handle button click
      const newWindow = window.open("", '_blank'); // Replace with desired URL
      if (newWindow) {
        newWindow.focus(); // Focus on the new window
      }
    };

    return (
      <input type="button" value="Op" id="btnCargar" className="btn btn-outline-secondary" onClick={handleClick}></input>
      //<button onClick={handleClick}>Abrir nueva ventana</button>
    );
  };

  const GenAst = () => {
    return(
        <div>
            {valorAst && <Graphviz dot={valorAst} />}
        </div>
    );
  };

  //<input type="button" value="Interpretar" id="btnCargar" class="form-control form-control-lg" onClick={interpretar} />

  //<input type="button" value="AST" id="btnCargar" className="btn btn-outline-secondary" onClick={generarAst} />
  //<button class="btn btn-outline-secondary" onClick={mostrarAST}>Mostrar AST</button>
  //<OpenNewWindowButton />
  return (
    <div className="App">
      <div className="background-color: #F0F8FF p-2 text-white bg-opacity-75">
        <div className='text-center style="color: #F8F9FA;'>
          <h1>Proyecto 2 - OLC1</h1>
        </div>
        <br></br>
        <div className='text-center'>
          <div className="container">
            <div className="row">
              <input type="file" id="file" className="form-control form-control-lg" onChange={CargarArchivo} />
            </div>
            <br></br>
            <div className="row">
              <input type="button" value="Interpretar" id="btnCargar" className="btn btn-outline-secondary" onClick={interpretar} />
              <input type="button" value="Error" id="btnCargar" className="btn btn-outline-secondary" onClick={mostrarHTMLErrores} />
              <input type="button" value="AST" id="btnCargar" className="btn btn-outline-secondary" onClick={mostrarAST} />
            </div>
          </div>
        </div>
        <br></br>
        <div className='text-center style={{ height: "80%", width: "80%" }} '>
          <div className="container" >
            <div className="row">
              <div className="col">
                <p>Entrada</p>
                <Editor height="90vh" defaultLanguage="java" defaultValue="" theme="vs-dark" onMount={(editor) => handleEditorDidMount(editor, "editor")} />
              </div>
              <div className="col">
                <p>Consola</p>
                <Editor height="90vh" defaultLanguage="cpp" defaultValue="" theme="vs-dark" options={{ readOnly: true }} onMount={(editor) => handleEditorDidMount(editor, "consola")} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3>Grafico Ast</h3>
      <div className="containerAst">
        <GenAst />
      </div>
    </div>
  );
}

export default App;


/*
<input type="button" value="AST" id="btnCargar" className="btn btn-outline-secondary" onClick={mostrarAST} />
              <div>
                {valorAst && <Graphviz dot={valorAst} />}
              </div>
*/

/*
return (
    <div className="App">
      <div class="background-color: #F0F8FF p-2 text-white bg-opacity-75">
        <div class='text-center style="color: #F8F9FA;'>
          <h1>Proyecto 2 - OLC1</h1>
        </div>
        <br></br>
        <div class='text-center'>
          <div class="container">
            <div class="row">
              <input type="file" id="file" class="form-control form-control-lg" onChange={CargarArchivo} />
            </div>
            <br></br>
            <div class="row">
              <input type="button" value="Interpretar" id="btnCargar" class="btn btn-outline-secondary" onClick={interpretar} />
            </div>
          </div>
        </div>
        <br></br>
        <div class='text-center style={{ height: "80%", width: "80%" }} '>
          <div class="container" >
            <div class="row">
              <div class="col">
                <p>Entrada</p>
                <Editor height="90vh" defaultLanguage="java" defaultValue="" theme="vs-dark" onMount={(editor) => handleEditorDidMount(editor, "editor")} />
              </div>
              <div class="col">
                <p>Consola</p>
                <Editor height="90vh" defaultLanguage="cpp" defaultValue="" theme="vs-dark" options={{ readOnly: true }} onMount={(editor) => handleEditorDidMount(editor, "consola")} />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
*/