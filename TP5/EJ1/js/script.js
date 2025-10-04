let numeroSecreto;
let intentos;
let partidasFinalizadas = 0;
let mejorPuntaje = null;
let promedioIntentos = 0;

const inputNumero = document.getElementById("input-numero");
const btnAdivinar = document.getElementById("btn-adivinar");
const btnReiniciar = document.getElementById("btn-reiniciar")
const mensajeP = document.getElementById("mensaje-p");
const intentosSpan = document.getElementById("intentos-span");
const partidasFinalizadasSpan = document.getElementById("partidas-finalizadas-span");
const promedioIntentosSpan = document.getElementById("promedio-intentos-span");
const mejorPuntajeSpan = document.getElementById("mejor-puntaje-span");

const obtenerEstadisticas = () => {
  const estadisticasLocal = localStorage.getItem("estadisticas");

  if (estadisticasLocal) {
    const estadisticas = JSON.parse(estadisticasLocal);
    mejorPuntaje = estadisticas.mejorPuntaje;
    partidasFinalizadas = estadisticas.partidasFinalizadas;
    promedioIntentos = estadisticas.promedioIntentos;
    actualizarEstadisticasIU();
  } else {
    fetch("data/estadisticas.json")
      .then(response => response.json())
      .then(data => {
        mejorPuntaje = data.mejorPuntaje;
        partidasFinalizadas = data.partidasFinalizadas;
        promedioIntentos = data.promedioIntentos;
        actualizarEstadisticasIU();
        console.log({ mejorPuntaje, partidasFinalizadas, promedioIntentos });
      })
      .catch(error => {
        console.log("Error al obtener las estadísticas: ", error)
      })
  }
}

const guardarEstadisticas = () => {
  const estadisticas = {
    mejorPuntaje,
    partidasFinalizadas,
    promedioIntentos
  }
  localStorage.setItem("estadisticas", JSON.stringify(estadisticas));
}

const obtenerNumero = () => {
  fetch("data/numeroSecreto.json")
    .then(response => response.json())
    .then(data => {
      numeroSecreto = data.numero;
      console.log(`Numero secreto obtenido: ${numeroSecreto}`);
    })
    .catch(error => {
      console.log("Error al obtener el número secreto: ", error)
    })
}

const iniciarPartida = () => {
  obtenerNumero();
  intentos = 0;
  intentosSpan.textContent = intentos;
  mensajeP.textContent = "¡Nueva partida iniciada!";
}

const adivinarNumero = () => {
  const numeroIngresado = parseInt(inputNumero.value);

  if (isNaN(numeroIngresado) || numeroIngresado < 1 || numeroIngresado > 1000) {
    mensajeP.textContent = "⚠️ Ingresa un número válido entre 1 y 1000";
    return;
  }

  intentos++;
  intentosSpan.textContent = intentos;

  if (numeroIngresado < numeroSecreto) {
    mensajeP.textContent = "⬆️ El número secreto es mayor";
  } else if (numeroIngresado > numeroSecreto) {
    mensajeP.textContent = "⬇️ El número secreto es menor";
  } else {
    mensajeP.textContent = `🎉 ¡Acertaste en ${intentos} intentos!`
    mensajeP.classList.add("mensaje-ganador");

    partidasFinalizadas++;
    promedioIntentos = ((promedioIntentos * (partidasFinalizadas - 1)) + intentos) / partidasFinalizadas;
    /*
    Ejemplo: Si antes tenía 2 partidas con promedio 5, suma total es 10. Y si gano una nueva partida en 7 intentos. La nueva suma es 10 + 7 = 17, luego divido en 3 partidas y el nuevo promedio será de 5.67.
    */

    if (mejorPuntaje == null || intentos < mejorPuntaje) {
      mejorPuntaje = intentos;
    }

    guardarEstadisticas();
    actualizarEstadisticasIU();

    btnAdivinar.disabled = true;
  }

  inputNumero.value = "";
  inputNumero.focus();
}

const actualizarEstadisticasIU = () => {
  partidasFinalizadasSpan.textContent = partidasFinalizadas;
  promedioIntentosSpan.textContent = promedioIntentos.toFixed(2);
  mejorPuntajeSpan.textContent = mejorPuntaje ?? "-";
}

const reiniciarPartida = () => {
  btnAdivinar.disabled = false;
  iniciarPartida();
  mensajeP.classList.remove("mensaje-ganador");
}

obtenerEstadisticas();
iniciarPartida();

btnAdivinar.addEventListener("click", adivinarNumero);
btnReiniciar.addEventListener("click", reiniciarPartida);
