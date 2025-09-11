const inicio = new Date("2023-07-01T00:00:00");

setInterval(() => {
  const actualidad = new Date();
  const diferenciaMilisegundos = actualidad - inicio;

  const dias = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenciaMilisegundos / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenciaMilisegundos / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenciaMilisegundos / 1000) % 60);

  document.querySelector(".countdown").textContent = `Han pasado ${dias} días, ${horas} horas, ${minutos} minutos y ${segundos} segundos desde el 1 de julio de 2023.`;
}, 1000)
