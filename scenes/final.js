function setupFinalScene(app) {
  app.setupRoom("final", {
    title: "Registro ???",
  });

  const roomScreen = app.rooms.final;
  const poemText = roomScreen?.querySelector(".final-poem-text");
  // Texto final que se escribe dentro del poema.
  const poem = `No todo lo que sentiste
tenía que quedarse para siempre.

Algunas cosas solo necesitaban
un lugar donde descansar.

El lago no borró el peso,
pero dejó que pudiera flotar un momento.

La mesa no llenó el silencio,
pero hizo que pareciera menos solo.

Las luces no dejaron de parpadear,
pero aprendiste a mirar sin seguir todos sus destellos.

Y aun así,
seguiste entrando.

Abriste puertas
que no prometían respuestas,
solo pequeños espacios
donde mirar sin huir.

Quizá este archivo no guarda lo que pasó,
sino la forma en que intentaste atravesarlo.

Quizá no era necesario ordenar cada emoción,
ni entender por qué algunas volvían siempre al mismo lugar.

Si has llegado hasta aquí,
puedes dejar la última puerta abierta.

No para volver a empezar,
sino para recordar que incluso lo que pesa
puede encontrar un sitio donde descansar.`;
  let poemTypewriterTimer = null;

  if (!roomScreen || !poemText) {
    return;
  }

  function clearPoemTypewriter() {
    if (poemTypewriterTimer) {
      window.clearInterval(poemTypewriterTimer);
      poemTypewriterTimer = null;
    }
  }

  function startPoemTypewriter() {
    // Reinicia el poema cada vez que se entra a la sala final.
    clearPoemTypewriter();
    poemText.textContent = "";

    let characterIndex = 0;

    poemTypewriterTimer = window.setInterval(() => {
      if (app.currentScreen !== roomScreen) {
        clearPoemTypewriter();
        return;
      }

      characterIndex += 1;
      poemText.textContent = poem.slice(0, characterIndex);
      poemText.scrollTop = poemText.scrollHeight;

      if (characterIndex >= poem.length) {
        clearPoemTypewriter();
      }
    }, 42);
  }

  app.onScreenEnter(roomScreen, startPoemTypewriter);
}
