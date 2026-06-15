const fireflies = [];
const fireflyCount = 36;

class Firefly {
  constructor(baseX, baseY) {
    this.reset(baseX, baseY);
  }

  reset(baseX = random(0.18, 0.84), baseY = random(0.38, 0.82)) {
    this.baseX = baseX;
    this.baseY = baseY;
    this.x = this.baseX * width;
    this.y = this.baseY * height;
    this.size = random(2, 4);
    this.glowSize = random(10, 18);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.flickerOffset = random(TWO_PI);
    this.speed = random(0.0015, 0.0035);
  }

  update() {
    const driftXAmount = width * 0.025;
    const driftYAmount = height * 0.035;
    const driftX = map(
      noise(this.noiseOffsetX + frameCount * this.speed),
      0,
      1,
      -driftXAmount,
      driftXAmount
    );
    const driftY = map(
      noise(this.noiseOffsetY + frameCount * this.speed),
      0,
      1,
      -driftYAmount,
      driftYAmount
    );

    this.x = this.baseX * width + driftX;
    this.y = this.baseY * height + driftY;
  }

  draw() {
    const pulse = map(sin(frameCount * 0.035 + this.flickerOffset), -1, 1, 0.45, 1);
    const glowAlpha = 48 * pulse;
    const centerAlpha = 190 * pulse;

    fill(255, 229, 145, glowAlpha);
    ellipse(this.x, this.y, this.glowSize, this.glowSize);

    fill(255, 246, 190, centerAlpha);
    rect(floor(this.x), floor(this.y), this.size, this.size);
  }
}

// Esto se llama una vez al crear el canvas.
function createFireflies() {
  fireflies.length = 0;

  const visibleLakeSpots = [
    [0.28, 0.48],
    [0.39, 0.56],
    [0.52, 0.50],
    [0.64, 0.60],
    [0.74, 0.46],
  ];

  visibleLakeSpots.forEach(([baseX, baseY]) => {
    fireflies.push(new Firefly(baseX, baseY));
  });

  for (let i = fireflies.length; i < fireflyCount; i += 1) {
    fireflies.push(new Firefly());
  }
}

function updateFireflies() {
  fireflies.forEach((firefly) => {
    firefly.update();
  });
}

function drawFireflies() {
  noStroke();
  blendMode(ADD);

  fireflies.forEach((firefly) => {
    firefly.draw();
  });

  blendMode(BLEND);
}

function setupLakeScene(app) {
  app.setupRoom("lake", {
    title: "Registro 01",
    image: "assets/images/Lake/Lake_room.png",
    alt: "Calm lake room",
  });

  const roomScreen = app.rooms.lake;
  const lakeCaption = roomScreen?.querySelector(".lake-caption");
  const lakeCaptionText = lakeCaption?.querySelector("span");
  const lakeCaptionNextButton = lakeCaption?.querySelector(".caption-next-button");
  const lakeHintCaption = roomScreen?.querySelector(".lake-hint-caption");
  const lakeHintCaptionText = lakeHintCaption?.querySelector("span");
  const lakeDialogueBox = roomScreen?.querySelector(".lake-dialogue-box");
  const lakeDialogueText = lakeDialogueBox?.querySelector("span");
  const lakeDialogueNextButton = lakeDialogueBox?.querySelector(".text-next-button");
  const lakeFrogButton = roomScreen?.querySelector(".lake-frog-button");
  const lakeFrogImage = lakeFrogButton?.querySelector("img");
  const lakeFlowersOverlay = roomScreen?.querySelector(".lake-flowers-overlay");
  const flowerMiniGame = document.querySelector(".flower-minigame");
  const flowerCaption = flowerMiniGame?.querySelector(".flower-caption");
  const flowerCaptionText = flowerCaption?.querySelector("span");
  const flowerExitHint = flowerMiniGame?.querySelector(".flower-exit-hint");
  const flowerPetalButtons = [...(flowerMiniGame?.querySelectorAll(".flower-petal-button") || [])];
  const entryMessages = [
    "Has llegado a un lugar que no pide nada.",
    "El agua se mueve despacio.",
    "Puedes quedarte un momento.",
  ];
  const idleHint = "Hay algo pequeño observando desde la orilla.";
  const frogDialogues = [
    `Ah.
Pensé que tardarías más en encontrarme.`,
    `No te preocupes. Aquí nadie llega tarde.
El lago no cuenta el tiempo como lo cuentan fuera.`,
    "Muchas cosas vienen hasta aquí buscando una respuesta.",
    `Pero el lago casi nunca responde.
Solo refleja lo que tiene delante.`,
    "Al principio eso parece poco.",
    "Luego entiendes que mirar algo con calma también cambia la forma de llevarlo.",
    `Que no todo lo que se mueve está perdido.
Que no todo lo que se queda quieto está vacío.`,
    "Si has venido cargando algo, puedes sentarte cerca.",
    "No hace falta resolverlo hoy.",
    "Cuando quieras seguir, la puerta seguirá ahí.",
    "Y si no quieres seguir todavía, también está bien.",
    "El archivo no se cierra porque descanses.",
  ];
  const finalMessages = [
    "El lago no respondió con palabras nuevas.",
    "Pero durante un instante, todo pareció pesar menos.",
  ];
  const flowerStartMessage = `Quita los pétalos, uno a uno.
El lago sabrá qué hacer con ellos.`;
  const flowerPetalMessages = [
    "No hace falta resolverlo todo.",
    "Puedes soltar una parte.",
    "Lo pequeño también pesa.",
    "El lago sigue aquí.",
    "Respira. No tienes que irte todavía.",
  ];
  const flowerFinalMessage = "Algo quedó más ligero.";
  const captionFadeDuration = 420;
  const frogFrames = [
    "assets/images/Lake/Frog_1.png",
    "assets/images/Lake/Frog_2.png",
    "assets/images/Lake/Frog_3.png",
    "assets/images/Lake/Frog_2.png",
  ];
  const frogFrameDurations = [7000, 1000, 1000, 1000];
  let idleHintTimer = null;
  let typewriterTimer = null;
  let holdCaptionTimer = null;
  let hintTypewriterTimer = null;
  let hintHoldCaptionTimer = null;
  let dialogueTypewriterTimer = null;
  let dialogueHoldTimer = null;
  let captionFadeTimer = null;
  let hintCaptionFadeTimer = null;
  let dialogueFadeTimer = null;
  let frogFrameTimer = null;
  let currentFrogFrameIndex = 0;
  let currentAfterHide = null;
  let currentAfterManualClose = null;
  let currentCaptionSequence = [];
  let currentCaptionSequenceIndex = 0;
  let currentCaptionSequenceAfterEnd = null;
  let currentDialogueSequence = [];
  let currentDialogueSequenceIndex = 0;
  let currentDialogueSequenceAfterEnd = null;
  let hasClickedFrog = false;
  let isFlowerMiniGameOpen = false;
  let removedFlowerPetalCount = 0;
  let flowerFinalMessageTimer = null;
  let flowerHitCanvas = null;
  let flowerHitContext = null;

  if (
    !roomScreen ||
    !lakeCaption ||
    !lakeCaptionText ||
    !lakeCaptionNextButton ||
    !lakeHintCaption ||
    !lakeHintCaptionText ||
    !lakeDialogueBox ||
    !lakeDialogueText ||
    !lakeDialogueNextButton ||
    !lakeFrogButton ||
    !lakeFrogImage ||
    !lakeFlowersOverlay ||
    !flowerMiniGame ||
    !flowerCaption ||
    !flowerCaptionText ||
    !flowerExitHint ||
    flowerPetalButtons.length !== 5
  ) {
    return;
  }

  frogFrames.forEach((frame) => {
    new Image().src = frame;
  });

  // Crea un mapa invisible para saber donde hay flor y donde hay transparencia.
  function prepareFlowerHitMap() {
    if (!lakeFlowersOverlay.complete || !lakeFlowersOverlay.naturalWidth || !lakeFlowersOverlay.naturalHeight) {
      return;
    }

    flowerHitCanvas = document.createElement("canvas");
    flowerHitCanvas.width = lakeFlowersOverlay.naturalWidth;
    flowerHitCanvas.height = lakeFlowersOverlay.naturalHeight;
    flowerHitContext = flowerHitCanvas.getContext("2d", { willReadFrequently: true });
    flowerHitContext.drawImage(lakeFlowersOverlay, 0, 0);
  }

  function isPointOnLakeFlowers(event) {
    if (!flowerHitContext) {
      prepareFlowerHitMap();
    }

    if (!flowerHitContext) {
      return false;
    }

    const overlayBox = lakeFlowersOverlay.getBoundingClientRect();
    const relativeX = (event.clientX - overlayBox.left) / overlayBox.width;
    const relativeY = (event.clientY - overlayBox.top) / overlayBox.height;

    if (relativeX < 0 || relativeX > 1 || relativeY < 0 || relativeY > 1) {
      return false;
    }

    const pixelX = Math.min(lakeFlowersOverlay.naturalWidth - 1, Math.floor(relativeX * lakeFlowersOverlay.naturalWidth));
    const pixelY = Math.min(lakeFlowersOverlay.naturalHeight - 1, Math.floor(relativeY * lakeFlowersOverlay.naturalHeight));
    const alpha = flowerHitContext.getImageData(pixelX, pixelY, 1, 1).data[3];

    // Si el pixel tiene transparencia, no cuenta como click en la flor.
    return alpha > 24;
  }

  if (lakeFlowersOverlay.complete) {
    prepareFlowerHitMap();
  } else {
    lakeFlowersOverlay.addEventListener("load", prepareFlowerHitMap, { once: true });
  }

  function clearCaptionTimers() {
    if (typewriterTimer) {
      window.clearInterval(typewriterTimer);
      typewriterTimer = null;
    }

    if (holdCaptionTimer) {
      window.clearTimeout(holdCaptionTimer);
      holdCaptionTimer = null;
    }

    if (captionFadeTimer) {
      window.clearTimeout(captionFadeTimer);
      captionFadeTimer = null;
    }
  }

  function clearHintCaptionTimers() {
    if (hintTypewriterTimer) {
      window.clearInterval(hintTypewriterTimer);
      hintTypewriterTimer = null;
    }

    if (hintHoldCaptionTimer) {
      window.clearTimeout(hintHoldCaptionTimer);
      hintHoldCaptionTimer = null;
    }

    if (hintCaptionFadeTimer) {
      window.clearTimeout(hintCaptionFadeTimer);
      hintCaptionFadeTimer = null;
    }
  }

  function clearDialogueTimers() {
    if (dialogueTypewriterTimer) {
      window.clearInterval(dialogueTypewriterTimer);
      dialogueTypewriterTimer = null;
    }

    if (dialogueHoldTimer) {
      window.clearTimeout(dialogueHoldTimer);
      dialogueHoldTimer = null;
    }

    if (dialogueFadeTimer) {
      window.clearTimeout(dialogueFadeTimer);
      dialogueFadeTimer = null;
    }
  }

  function clearIdleHintTimer() {
    if (idleHintTimer) {
      window.clearTimeout(idleHintTimer);
      idleHintTimer = null;
    }
  }

  function clearFrogFrameTimer() {
    if (frogFrameTimer) {
      window.clearTimeout(frogFrameTimer);
      frogFrameTimer = null;
    }
  }

  function clearFlowerFinalMessageTimer() {
    if (flowerFinalMessageTimer) {
      window.clearTimeout(flowerFinalMessageTimer);
      flowerFinalMessageTimer = null;
    }
  }

  function showTypedLakeCaption(text, afterHide, afterManualClose) {
    clearCaptionTimers();
    currentAfterHide = afterHide || null;
    currentAfterManualClose = afterManualClose || null;
    lakeCaptionText.textContent = "";
    lakeCaption.classList.remove("is-fading-out");
    lakeCaption.classList.remove("is-hidden");

    let characterIndex = 0;

    typewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      lakeCaptionText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(typewriterTimer);
        typewriterTimer = null;

        holdCaptionTimer = window.setTimeout(() => {
          closeLakeCaption(false);
        }, 3000);
      }
    }, 34);
  }

  function showTypedLakeHint(text) {
    clearHintCaptionTimers();
    lakeHintCaptionText.textContent = "";
    lakeHintCaption.classList.remove("is-fading-out");
    lakeHintCaption.classList.remove("is-hidden");

    let characterIndex = 0;

    hintTypewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      lakeHintCaptionText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(hintTypewriterTimer);
        hintTypewriterTimer = null;
      }
    }, 34);
  }

  function showTypedLakeDialogue(text, afterHide) {
    clearDialogueTimers();
    lakeDialogueText.textContent = "";
    lakeDialogueBox.classList.remove("is-fading-out");
    lakeDialogueBox.classList.remove("is-hidden");

    let characterIndex = 0;

    dialogueTypewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      lakeDialogueText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(dialogueTypewriterTimer);
        dialogueTypewriterTimer = null;

        dialogueHoldTimer = window.setTimeout(() => {
          fadeOutLakeDialogue(afterHide);
        }, 3000);
      }
    }, 34);
  }

  function showLakeFrog() {
    lakeFrogButton.classList.remove("is-hidden");
    void lakeFrogButton.offsetWidth;
    lakeFrogButton.classList.add("is-visible");
  }

  function hideLakeFrog() {
    clearFrogFrameTimer();
    lakeFrogButton.classList.remove("is-visible");
    lakeFrogButton.classList.add("is-hidden");
  }

  function showFrogFrame(frameIndex) {
    currentFrogFrameIndex = frameIndex;
    lakeFrogImage.src = frogFrames[currentFrogFrameIndex];
    lakeFrogButton.classList.toggle("is-frame-three", currentFrogFrameIndex === 2);
  }

  function scheduleNextFrogFrame() {
    clearFrogFrameTimer();

    frogFrameTimer = window.setTimeout(() => {
      if (app.currentScreen !== roomScreen) {
        return;
      }

      showFrogFrame((currentFrogFrameIndex + 1) % frogFrames.length);
      scheduleNextFrogFrame();
    }, frogFrameDurations[currentFrogFrameIndex]);
  }

  function startFrogAnimation() {
    showFrogFrame(0);
    scheduleNextFrogFrame();
  }

  function fadeOutLakeHint() {
    clearHintCaptionTimers();
    lakeHintCaption.classList.add("is-fading-out");

    hintCaptionFadeTimer = window.setTimeout(() => {
      lakeHintCaption.classList.add("is-hidden");
      lakeHintCaption.classList.remove("is-fading-out");
      hintCaptionFadeTimer = null;
    }, captionFadeDuration);
  }

  function fadeOutLakeDialogue(afterHide) {
    clearDialogueTimers();
    lakeDialogueBox.classList.add("is-fading-out");

    dialogueFadeTimer = window.setTimeout(() => {
      lakeDialogueBox.classList.add("is-hidden");
      lakeDialogueBox.classList.remove("is-fading-out");
      dialogueFadeTimer = null;

      if (afterHide) {
        afterHide();
      }
    }, captionFadeDuration);
  }

  function showNextCaptionInSequence() {
    if (app.currentScreen !== roomScreen) {
      return;
    }

    if (currentCaptionSequenceIndex >= currentCaptionSequence.length) {
      const afterEnd = currentCaptionSequenceAfterEnd;
      currentCaptionSequence = [];
      currentCaptionSequenceIndex = 0;
      currentCaptionSequenceAfterEnd = null;

      if (afterEnd) {
        afterEnd();
      }

      return;
    }

    const captionText = currentCaptionSequence[currentCaptionSequenceIndex];
    currentCaptionSequenceIndex += 1;
    showTypedLakeCaption(captionText, showNextCaptionInSequence, showNextCaptionInSequence);
  }

  function showLakeCaptionSequence(captions, afterEnd) {
    currentCaptionSequence = captions;
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = afterEnd || null;
    showNextCaptionInSequence();
  }

  function showNextDialogueInSequence() {
    if (app.currentScreen !== roomScreen) {
      return;
    }

    if (currentDialogueSequenceIndex >= currentDialogueSequence.length) {
      const afterEnd = currentDialogueSequenceAfterEnd;
      currentDialogueSequence = [];
      currentDialogueSequenceIndex = 0;
      currentDialogueSequenceAfterEnd = null;

      if (afterEnd) {
        afterEnd();
      }

      return;
    }

    const dialogueText = currentDialogueSequence[currentDialogueSequenceIndex];
    currentDialogueSequenceIndex += 1;
    showTypedLakeDialogue(dialogueText, showNextDialogueInSequence);
  }

  function showLakeDialogueSequence(dialogues, afterEnd) {
    currentDialogueSequence = dialogues;
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = afterEnd || null;
    showNextDialogueInSequence();
  }

  function clearLakeCaptionSequence() {
    clearCaptionTimers();
    currentAfterHide = null;
    currentAfterManualClose = null;
    currentCaptionSequence = [];
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = null;
    lakeCaption.classList.add("is-hidden");
    lakeCaption.classList.remove("is-fading-out");
  }

  function hideLakeDialogue() {
    clearDialogueTimers();
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    lakeDialogueBox.classList.add("is-hidden");
    lakeDialogueBox.classList.remove("is-fading-out");
  }

  function startFrogDialogue() {
    if (hasClickedFrog) {
      return;
    }

    hasClickedFrog = true;
    clearIdleHintTimer();
    clearLakeCaptionSequence();
    clearHintCaptionTimers();
    lakeHintCaption.classList.add("is-hidden");
    lakeHintCaption.classList.remove("is-fading-out");

    showLakeDialogueSequence(frogDialogues, () => {
      showLakeCaptionSequence(finalMessages);
    });
  }

  function closeLakeCaption(isManualClose = true) {
    clearCaptionTimers();
    lakeCaption.classList.add("is-fading-out");

    const afterHide = isManualClose && currentAfterManualClose ? currentAfterManualClose : currentAfterHide;
    currentAfterHide = null;
    currentAfterManualClose = null;

    captionFadeTimer = window.setTimeout(() => {
      lakeCaption.classList.add("is-hidden");
      lakeCaption.classList.remove("is-fading-out");
      captionFadeTimer = null;

      if (afterHide) {
        afterHide();
      }
    }, captionFadeDuration);
  }

  function hideLakeCaption() {
    closeFlowerMiniGame();
    clearIdleHintTimer();
    clearCaptionTimers();
    clearHintCaptionTimers();
    hideLakeDialogue();
    currentAfterHide = null;
    currentAfterManualClose = null;
    currentCaptionSequence = [];
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = null;
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    hasClickedFrog = false;
    clearFrogFrameTimer();
    lakeCaption.classList.add("is-hidden");
    lakeCaption.classList.remove("is-fading-out");
    lakeHintCaption.classList.add("is-hidden");
    lakeHintCaption.classList.remove("is-fading-out");
    hideLakeFrog();
  }

  function openFlowerMiniGame() {
    if (isFlowerMiniGameOpen) {
      return;
    }

    clearIdleHintTimer();
    clearLakeCaptionSequence();
    clearHintCaptionTimers();
    hideLakeDialogue();
    lakeHintCaption.classList.add("is-hidden");
    lakeHintCaption.classList.remove("is-fading-out");
    roomScreen.classList.remove("is-over-lake-flowers");
    clearFlowerFinalMessageTimer();
    removedFlowerPetalCount = 0;
    flowerPetalButtons.forEach((button) => {
      button.classList.remove("is-removed");
      button.disabled = false;
    });
    flowerCaptionText.textContent = flowerStartMessage;
    flowerCaption.classList.remove("is-hidden");
    flowerCaption.classList.remove("is-fading-out");
    flowerExitHint.classList.add("is-hidden");
    flowerMiniGame.classList.remove("is-hidden");
    isFlowerMiniGameOpen = true;
    window.flowerMiniGame.isOpen = true;
  }

  function closeFlowerMiniGame() {
    clearFlowerFinalMessageTimer();
    flowerMiniGame.classList.add("is-hidden");
    flowerCaption.classList.add("is-hidden");
    flowerCaption.classList.remove("is-fading-out");
    flowerExitHint.classList.add("is-hidden");
    isFlowerMiniGameOpen = false;

    if (window.flowerMiniGame) {
      window.flowerMiniGame.isOpen = false;
    }
  }

  // Cada petalo se borra por separado.
  function removeFlowerPetal(button) {
    if (!isFlowerMiniGameOpen || button.classList.contains("is-removed")) {
      return;
    }

    button.classList.add("is-removed");
    button.disabled = true;

    const message = flowerPetalMessages[removedFlowerPetalCount];
    removedFlowerPetalCount += 1;
    flowerCaptionText.textContent = message;

    if (removedFlowerPetalCount >= flowerPetalButtons.length) {
      clearFlowerFinalMessageTimer();
      flowerFinalMessageTimer = window.setTimeout(() => {
        flowerCaptionText.textContent = flowerFinalMessage;
        flowerFinalMessageTimer = window.setTimeout(() => {
          flowerCaption.classList.add("is-fading-out");
          flowerFinalMessageTimer = window.setTimeout(() => {
            flowerCaption.classList.add("is-hidden");
            flowerCaption.classList.remove("is-fading-out");
            flowerExitHint.classList.remove("is-hidden");
            flowerFinalMessageTimer = null;
          }, captionFadeDuration);
        }, 1800);
      }, 1800);
    }
  }

  function scheduleIdleHint() {
    clearIdleHintTimer();

    idleHintTimer = window.setTimeout(() => {
      idleHintTimer = null;

      if (app.currentScreen === roomScreen && !hasClickedFrog) {
        showTypedLakeHint(idleHint);
      }
    }, 5000);
  }

  function handleLakeActivity() {
    if (app.currentScreen !== roomScreen || isFlowerMiniGameOpen) {
      return;
    }

    if (
      !lakeCaption.classList.contains("is-hidden") ||
      !lakeHintCaption.classList.contains("is-hidden") ||
      !lakeDialogueBox.classList.contains("is-hidden") ||
      currentCaptionSequence.length > 0
    ) {
      return;
    }

    scheduleIdleHint();
  }

  ["click", "keydown", "mousemove", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, handleLakeActivity, { passive: true });
  });

  roomScreen.addEventListener("click", (event) => {
    if (app.currentScreen !== roomScreen || event.target.closest("button")) {
      return;
    }

    if (isPointOnLakeFlowers(event)) {
      event.stopPropagation();
      openFlowerMiniGame();
    }
  });

  roomScreen.addEventListener("mousemove", (event) => {
    if (app.currentScreen !== roomScreen || event.target.closest("button")) {
      roomScreen.classList.remove("is-over-lake-flowers");
      return;
    }

    roomScreen.classList.toggle("is-over-lake-flowers", isPointOnLakeFlowers(event));
  });

  roomScreen.addEventListener("mouseleave", () => {
    roomScreen.classList.remove("is-over-lake-flowers");
  });

  flowerMiniGame.addEventListener("click", (event) => {
    if (event.target === flowerMiniGame) {
      closeFlowerMiniGame();
    }
  });

  flowerPetalButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      removeFlowerPetal(button);
    });
  });

  lakeFrogButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startFrogDialogue();
  });

  lakeCaptionNextButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!lakeCaption.classList.contains("is-hidden")) {
      closeLakeCaption(true);
    }
  });

  lakeDialogueNextButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!lakeDialogueBox.classList.contains("is-hidden")) {
      fadeOutLakeDialogue(showNextDialogueInSequence);
    }
  });

  window.flowerMiniGame = {
    isOpen: false,
  };
  window.closeFlowerMiniGame = closeFlowerMiniGame;

  app.onScreenEnter(roomScreen, () => {
    hideLakeCaption();
    showLakeFrog();
    startFrogAnimation();
    showLakeCaptionSequence(entryMessages, scheduleIdleHint);
  });

  app.onScreenEnter(app.screens.hub, hideLakeCaption);
  app.onScreenEnter(app.screens.entry, hideLakeCaption);
}
