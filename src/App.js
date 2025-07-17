import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [tema, setTema] = useState({
    fondo: "#ffffff",
    botones: "#f0f0",
    texto: "#333333",
    borde: "#cccccc",
  });
  const [dolarBlue, setDolarBlue] = useState(null);

  useEffect(() => {
    fetch("https://api.bluelytics.com.ar/v2/latest")
      .then((res) => res.json())
      .then((data) => {
        setDolarBlue(data.blue.value_sell);
      });
  }, []);

  const temas = {
    claro: {
      fondo: "#ffffff",
      botones: "#f0f0",
      texto: "#333333",
      borde: "#cccccc",
    },
    oscuro: {
      fondo: "#222222",
      botones: "#404040",
      texto: "#ffffff",
      borde: "#555555",
    },
    azul: {
      fondo: "#e3f2fd",
      botones: "#bbdefb",
      texto: "#1565c0",
      borde: "#2196f3",
    },
    verde: {
      fondo: "#e8f5e8",
      botones: "#c8e6c9",
      texto: "#2e7d32",
      borde: "#4caf50",
    },
    rosa: {
      fondo: "#fce4ec",
      botones: "#f8bbd9",
      texto: "#c2185b",
      borde: "#e91e63",
    },
  };

  // Aplicar tema al CSS
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--fondo-calculadora", tema.fondo);
    root.style.setProperty("--color-botones", tema.botones);
    root.style.setProperty("--color-texto", tema.texto);
    root.style.setProperty("--color-borde", tema.borde);
  }, [tema]);

  // Agregar soporte para teclado
  useEffect(() => {
    const manejarTeclado = (event) => {
      const tecla = event.key;

      // Números del 0-9
      if (/^[0-9]$/.test(tecla)) {
        agregarValor(tecla);
      }
      // Operadores
      else if (["+", "-", "*", "/"].includes(tecla)) {
        agregarValor(tecla);
      }
      // Punto decimal
      else if (tecla === ".") {
        agregarDecimal();
      }
      // Enter para calcular
      else if (tecla === "Enter" || tecla === "=") {
        calcular();
      }
      // Escape para limpiar
      else if (tecla === "Escape") {
        limpiar();
      }
      // Backspace para borrar último carácter
      else if (tecla === "Backspace") {
        setInput(input.slice(0, -1));
      }
    };

    document.addEventListener("keydown", manejarTeclado);

    // Limpiar el event listener cuando el componente se desmonte
    return () => {
      document.removeEventListener("keydown", manejarTeclado);
    };
  }, [input]); // Dependencia en input para que el listener tenga acceso al valor actual

  const agregarValor = (valor) => {
    setInput(input + valor);
  };

  const agregarDecimal = () => {
    // Verificar si ya hay un punto decimal en el número actual
    const partes = input.split(/[\+\-\*\/]/);
    const ultimoNumero = partes[partes.length - 1];

    if (!ultimoNumero.includes(".")) {
      setInput(input + ".");
    }
  };

  const calcular = () => {
    try {
      setInput(eval(input).toString());
    } catch {
      setInput("Error");
    }
  };

  const limpiar = () => {
    setInput("");
  };

  const cambiarTema = (nombreTema) => {
    setTema(temas[nombreTema]);
    setMostrarConfiguracion(false);
  };

  const copiarAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(input);
      // Mostrar feedback visual temporal
      const boton = document.querySelector(".boton-copiar");
      if (boton) {
        const textoOriginal = boton.innerHTML;
        boton.innerHTML = "✅";
        boton.title = "¡Copiado!";
        setTimeout(() => {
          boton.innerHTML = textoOriginal;
          boton.title = "Copiar al portapapeles";
        }, 1000);
      }
    } catch (err) {
      console.error("Error al copiar:", err);
      // Fallback para navegadores que no soportan clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = input;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const elevarAlCuadrado = () => {
    // Encuentra el último número en el input
    const partes = input.split(/([\+\-\*\/])/);
    if (partes.length === 0) return;
    let ultimo = partes[partes.length - 1];
    // Si el último es un operador, no hacer nada
    if (["+", "-", "*", "/"].includes(ultimo)) return;
    // Eleva al cuadrado el último número
    const cuadrado = (parseFloat(ultimo) ** 2).toString();
    partes[partes.length - 1] = cuadrado;
    setInput(partes.join(""));
  };

  return (
    <div className="App">
      <h1>Calculadora Cursor</h1>
      {dolarBlue && (
        <div className="dolar-blue">
          <strong>Dólar Blue:</strong> ${dolarBlue}
        </div>
      )}
      <div className="calculadora">
        <div className="header-calculadora">
          <input type="text" value={input} readOnly />
          <div className="botones-header-vertical">
            <button
              className="boton-configuracion"
              onClick={() => setMostrarConfiguracion(!mostrarConfiguracion)}
              title="Configuración"
            >
              ⚙️
            </button>
            <button
              className="boton-copiar"
              onClick={copiarAlPortapapeles}
              title="Copiar al portapapeles"
              disabled={!input || input === "Error"}
            >
              📋
            </button>
          </div>
        </div>

        {mostrarConfiguracion && (
          <div className="modal-configuracion">
            <h3>Cambiar Tema</h3>
            <div className="opciones-tema">
              <button
                className="opcion-tema claro"
                onClick={() => cambiarTema("claro")}
                title="Tema Claro"
              >
                ☀️ Claro
              </button>
              <button
                className="opcion-tema oscuro"
                onClick={() => cambiarTema("oscuro")}
                title="Tema Oscuro"
              >
                🌙 Oscuro
              </button>
              <button
                className="opcion-tema azul"
                onClick={() => cambiarTema("azul")}
                title="Tema Azul"
              >
                �� Azul
              </button>
              <button
                className="opcion-tema verde"
                onClick={() => cambiarTema("verde")}
                title="Tema Verde"
              >
                🟢 Verde
              </button>
              <button
                className="opcion-tema rosa"
                onClick={() => cambiarTema("rosa")}
                title="Tema Rosa"
              >
                🎀 Rosa
              </button>
            </div>
          </div>
        )}

        <div className="botones">
          <button onClick={limpiar}>C</button>
          <button onClick={() => agregarValor("1")}>1</button>
          <button onClick={() => agregarValor("2")}>2</button>
          <button onClick={() => agregarValor("3")}>3</button>
          <button onClick={() => agregarValor("+")}>+</button>

          <button onClick={() => agregarValor("4")}>4</button>
          <button onClick={() => agregarValor("5")}>5</button>
          <button onClick={() => agregarValor("6")}>6</button>
          <button onClick={() => agregarValor("-")}>-</button>

          <button onClick={() => agregarValor("7")}>7</button>
          <button onClick={() => agregarValor("8")}>8</button>
          <button onClick={() => agregarValor("9")}>9</button>
          <button onClick={() => agregarValor("*")}>*</button>

          <button onClick={() => agregarValor("0")}>0</button>
          <button onClick={agregarDecimal}>.</button>
          <button onClick={calcular}>=</button>
          <button onClick={() => agregarValor("/")}>/</button>
          <button onClick={elevarAlCuadrado}>x²</button>
        </div>
        <div className="instrucciones-teclado">
          <p>
            Usa el teclado: números, +, -, *, /, ., Enter (=), Escape (C),
            Backspace
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
