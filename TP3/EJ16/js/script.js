const inputTipo = document.getElementById("tipo");
const inputDni = document.getElementById("dni");
const inputDv = document.getElementById("dv");
const validoMsg = document.getElementById('valido');
const invalidoMsg = document.getElementById('invalido');

const esTipoValido = tipo => {
  const tiposValidos = ["20", "23", "24", "27", "30", "33", "34"];
  return tiposValidos.includes(tipo);
}

const esDniValido = dni => {
  return dni.length === 8;
}

const obtenerDigitoVerificador = numeros => {
  const digitosInvertidos = numeros.split("").reverse();
  const serie = [2, 3, 4, 5, 6, 7];

  let j = 0, sumaP = 0;
  for (let i = 0; i < digitosInvertidos.length; i++) {
    sumaP += digitosInvertidos[i] * serie[j];
    j = (j == serie.length - 1) ? 0 : j + 1;
  }
  const sumaMod11 = sumaP % 11;
  const digito = 11 - sumaMod11;
  if (digito === 11) return 0;
  console.log(digito)
  return digito;
}

const esCuilValido = (tipo, dni, digito) => {
  if (!esTipoValido(tipo)) return false;
  if (!esDniValido(dni)) return false;

  const digitoVerificador = obtenerDigitoVerificador(tipo + dni);
  if (digitoVerificador != digito || digitoVerificador == 10) return false;

  return true;
}

const validarCampos = () => {
  if (inputTipo.value && inputDni.value && inputDv.value) {
    if (esCuilValido(inputTipo.value, inputDni.value, inputDv.value)) {
      validoMsg.classList.remove("oculto");
      invalidoMsg.classList.add("oculto");
    } else {
      invalidoMsg.classList.remove("oculto");
      validoMsg.classList.add("oculto");
    }
  } else if (inputTipo.value || inputDni.value || inputDv.value) {
    validoMsg.classList.add("oculto");
    invalidoMsg.classList.add("oculto");
  }
}

inputTipo.addEventListener('input', validarCampos);
inputDni.addEventListener('input', validarCampos);
inputDv.addEventListener('input', validarCampos);

// Ejemplos válidos
// 20-12345678-6
// 20-45882956-0
// 20-22250018-5
// 20-17087583-5