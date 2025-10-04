const inputLimiteInferior = document.getElementById("input-limite-inferior");
const inputLimiteSuperior = document.getElementById("input-limite-superior");
const btnRandom = document.getElementById("btn-random");
const btnReiniciar = document.getElementById("btn-reiniciar");
const resultadoNumeroSpan = document.getElementById("resultado-numero-span");
const mensajeAlerta = document.getElementById("mensaje-alerta");

let limiteInferior = null;
let limiteSuperior = null;
let numeroRandom = null;
let cantidadMaxima = null;
let datos = null;

const guardarLimites = () => {
  limiteInferior = parseInt(inputLimiteInferior.value);
  limiteSuperior = parseInt(inputLimiteSuperior.value);
  localStorage.setItem("inferior", limiteInferior);
  localStorage.setItem("superior", limiteSuperior);

  if (datos) {
    datos["limite inferior"] = limiteInferior;
    datos["limite superior"] = limiteSuperior;
    localStorage.setItem("datosLoteria", JSON.stringify(datos));
  }
}

const limitesValidos = () => {
  if (inputLimiteInferior.value > inputLimiteSuperior.value) return false;
  if (inputLimiteInferior.value === "" || inputLimiteSuperior.value === "") return false;
  return true;
}

const obtenerLimites = () => {
  limiteInferior = localStorage.getItem("inferior");
  limiteSuperior = localStorage.getItem("superior");
  inputLimiteInferior.value = limiteInferior;
  inputLimiteSuperior.value = limiteSuperior;
}

const reiniciar = () => {
  localStorage.clear();
  btnRandom.disabled = false;
  datos = null
  limiteInferior = null;
  limiteSuperior = null;
  inputLimiteInferior.value = "";
  inputLimiteSuperior.value = "";
  resultadoNumeroSpan.textContent = "-";
  mensajeAlerta.textContent = "";
}

const obtenerNumeroRandom = () => Math.floor(Math.random() * (limiteSuperior - limiteInferior + 1)) + limiteInferior;
const obtenerCantidadMaximaDeNumeros = () => (limiteSuperior - limiteInferior) + 1;

const chequearNumero = () => {
  let numeros = datos["números"];

  if (numeros.length < cantidadMaxima) {
    while (numeros.some(obj => obj["número"] === numeroRandom)) {
      numeroRandom = obtenerNumeroRandom();
    }
    numeros.push({ "número": numeroRandom });
    datos["números"] = numeros;

    // Guardo en localStorage
    localStorage.setItem("datosLoteria", JSON.stringify(datos));

    resultadoNumeroSpan.textContent = numeroRandom;
    mensajeAlerta.textContent = "";
  } else {
    mensajeAlerta.textContent = "⚠️Todos los números están generados⚠️";
    btnRandom.disabled = true;
  }
}

obtenerLimites();

inputLimiteInferior.addEventListener("input", () => {
  localStorage.removeItem("datosLoteria");
  btnRandom.disabled = false;
  datos = null;
  mensajeAlerta.textContent = "";
});

inputLimiteSuperior.addEventListener("input", () => {
  localStorage.removeItem("datosLoteria");
  btnRandom.disabled = false;
  datos = null;
  mensajeAlerta.textContent = "";
});

btnReiniciar.addEventListener("click", reiniciar);

btnRandom.addEventListener("click", () => {
  if (limitesValidos()) {
    guardarLimites();

    numeroRandom = obtenerNumeroRandom()
    cantidadMaxima = obtenerCantidadMaximaDeNumeros();

    // cargo estado desde localStorage o JSON
    datos = JSON.parse(localStorage.getItem("datosLoteria"));

    if (!datos) {
      // Si no hay nada en localStorage, arranco desde datos.json
      fetch("data/datos.json")
        .then(response => response.json())
        .then(json => {
          datos = json;
          datos["limite inferior"] = limiteInferior;
          datos["limite superior"] = limiteSuperior;

          // Genero y guardo primer número
          numeroRandom = obtenerNumeroRandom();
          datos["números"].push({ "número": numeroRandom });
          localStorage.setItem("datosLoteria", JSON.stringify(datos));

          resultadoNumeroSpan.textContent = numeroRandom;
          mensajeAlerta.textContent = "";
        });
    } else {
      chequearNumero();
    }
  } else {
    mensajeAlerta.textContent = "⚠️Límites inválidos⚠️";
  }
});