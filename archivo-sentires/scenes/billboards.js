function setupBillboardsScene(app) {
  const billboardCycleDelay = 13000;
  const secondBillboardSetDelay = 6000;
  const starsCycleDelay = 3000;

  app.setupRoom("billboards", {
    title: "Registro 03",
    image: "assets/images/Billboards/Billboards_room.png",
    alt: "Billboards room",
  });

  const roomScreen = app.rooms.billboards;
  const billboardFrames = [
    roomScreen?.querySelector(".billboard-frame-one"),
    roomScreen?.querySelector(".billboard-frame-two"),
  ];
  const starsFrames = [
    roomScreen?.querySelector(".stars-frame-one"),
    roomScreen?.querySelector(".stars-frame-two"),
  ];
  const exitLight = roomScreen?.querySelector(".exit-light");
  const billboardCaption = roomScreen?.querySelector(".billboard-caption");
  const billboardCaptionText = billboardCaption?.querySelector("span");
  const billboardCaptionNextButton = billboardCaption?.querySelector(".caption-next-button");
  const billboardHintCaption = roomScreen?.querySelector(".billboard-hint-caption");
  const billboardHintCaptionText = billboardHintCaption?.querySelector("span");
  const billboardDialogueBox = roomScreen?.querySelector(".billboard-dialogue-box");
  const billboardDialogueText = billboardDialogueBox?.querySelector("span");
  const billboardDialogueNextButton = billboardDialogueBox?.querySelector(".text-next-button");
  const catButton = roomScreen?.querySelector(".billboard-cat-button");
  const catImage = catButton?.querySelector("img");
  const tvEntryButton = roomScreen?.querySelector(".billboard-tv-entry-button");
  const tvMiniGame = document.querySelector(".tv-minigame");
  const tvSmackButton = document.querySelector(".tv-smack-button");
  const tvFrame = document.querySelector(".tv-frame");
  const tvExitHint = document.querySelector(".tv-exit-hint");
  const billboardCaptionHome = billboardCaption?.parentElement;
  const billboardCaptionNextSibling = billboardCaption?.nextElementSibling;
  const billboardImageSets = [
    [
      "assets/images/Billboards/Billboards_1_1.png",
      "assets/images/Billboards/Billboards_1_2.png",
    ],
    [
      "assets/images/Billboards/Billboards_2_1.png",
      "assets/images/Billboards/Billboards_2_2.png",
    ],
  ];
  const starsImages = [
    "assets/images/Billboards/Stars_1.png",
    "assets/images/Billboards/Stars_2.png",
  ];
  const catFrames = [
    "assets/images/Billboards/Cat_1.png",
    "assets/images/Billboards/Cat_2.png",
    "assets/images/Billboards/Cat_3.png",
    "assets/images/Billboards/Cat_4.png",
    "assets/images/Billboards/Cat_3.png",
    "assets/images/Billboards/Cat_2.png",
  ];
  const catFrameDurations = [7000, 1000, 1000, 1000, 1000, 1000];

  // Estados de la tele: normal, glitch y final.
  const tvImageStates = [
    {
      normal: "assets/images/Billboards/TV_1_1.png",
      glitch: "assets/images/Billboards/TV_1_2.png",
    },
    {
      normal: "assets/images/Billboards/TV_2_1.png",
      glitch: "assets/images/Billboards/TV_2_2.png",
    },
    {
      normal: "assets/images/Billboards/TV_3_1.png",
      glitch: "assets/images/Billboards/TV_3_2.png",
    },
    {
      normal: "assets/images/Billboards/TV_final.png",
      glitch: "assets/images/Billboards/TV_final.png",
    },
  ];

  const entryMessages = [
    "La ciudad no habla con una sola voz.",
    "Los carteles cambian antes de que puedas entenderlos.",
    "Desde aquí arriba, todo parece lejos.",
  ];
  const idleHint = "Un gato te observa desde la cornisa.";
  const catDialogues = [
    "No mires demasiado tiempo.",
    "Las luces saben parecer importantes.",
    `Cambian de color.
Se repiten.
Te llaman por nombres que no son tuyos.`,
    "Yo antes perseguía cada brillo.",
    "Pensaba que si algo se encendía, era porque tenía que mirarlo.",
    "Después entendí que algunas cosas solo brillan para ocupar espacio.",
    "La ciudad hace eso a veces.",
    `Llena el cielo de mensajes
y luego te deja a ti la culpa de no entenderlos.`,
    "Pero no todo lo que aparece delante de ti necesita una respuesta.",
    "No todos los carteles son señales.",
    "No todas las voces dicen la verdad.",
    "Y no todo lo que llama tu atención merece quedarse con ella.",
    "Hay una televisión vieja por ahí.",
    `Lleva rato intentando decir algo,
pero el ruido no la deja.`,
    `Si consigues escucharla,
quizá entiendas mejor este lugar.`,
  ];
  const tvMessages = [
    `La televisión no responde.
Tal vez necesita un par de golpes.`,
    `La imagen tiembla.
Aparecen letras sueltas.`,
    `Algunas palabras empiezan a quedarse quietas.`,
    "La pantalla se aclara.",
    "NO TODO ES SEÑAL.",
  ];
  const finalMessages = [
    "Por un momento, el ruido no desapareció.",
    "Solo dejó espacio para pensar.",
  ];
  const captionFadeDuration = 420;
  const billboardIndexes = [0, 0];
  let currentStarsIndex = 0;
  let currentCatFrameIndex = 0;
  let billboardTimer = null;
  let delayedBillboardTimer = null;
  let starsTimer = null;
  let exitLightTimer = null;
  let catFrameTimer = null;
  let tvFlickerTimer = null;
  let tvShowsGlitchImage = false;
  let idleHintTimer = null;
  let typewriterTimer = null;
  let holdCaptionTimer = null;
  let hintTypewriterTimer = null;
  let dialogueTypewriterTimer = null;
  let dialogueHoldTimer = null;
  let captionFadeTimer = null;
  let hintCaptionFadeTimer = null;
  let dialogueFadeTimer = null;
  let currentCaptionSequence = [];
  let currentCaptionSequenceIndex = 0;
  let currentCaptionSequenceAfterEnd = null;
  let currentDialogueSequence = [];
  let currentDialogueSequenceIndex = 0;
  let currentDialogueSequenceAfterEnd = null;
  let hasClickedCat = false;
  let tvClickCount = 0;
  let tvState = 0;
  let pausedBillboardDialogue = null;
  let isShowingTvCaptionSequence = false;
  let isTvMiniGameFinished = false;

  if (
    !roomScreen ||
    billboardFrames.some((frame) => !frame) ||
    starsFrames.some((frame) => !frame) ||
    !exitLight ||
    !billboardCaption ||
    !billboardCaptionText ||
    !billboardCaptionNextButton ||
    !billboardCaptionHome ||
    !billboardHintCaption ||
    !billboardHintCaptionText ||
    !billboardDialogueBox ||
    !billboardDialogueText ||
    !billboardDialogueNextButton ||
    !catButton ||
    !catImage ||
    !tvEntryButton ||
    !tvMiniGame ||
    !tvSmackButton ||
    !tvFrame ||
    !tvExitHint
  ) {
    return;
  }

  billboardImageSets.flat().forEach((image) => {
    new Image().src = image;
  });

  starsImages.forEach((image) => {
    new Image().src = image;
  });
  catFrames.forEach((image) => {
    new Image().src = image;
  });
  tvImageStates.forEach((state) => {
    new Image().src = state.normal;
    new Image().src = state.glitch;
  });
  new Image().src = "assets/images/Billboards/Exit_light.png";

  function swapBillboardSet(index) {
    const frame = billboardFrames[index];
    const images = billboardImageSets[index];

    billboardIndexes[index] = (billboardIndexes[index] + 1) % images.length;
    frame.classList.remove("is-glitching");
    void frame.offsetWidth;
    frame.classList.add("is-glitching");
    frame.src = images[billboardIndexes[index]];
  }

  function swapBillboards() {
    swapBillboardSet(0);

    delayedBillboardTimer = window.setTimeout(() => {
      swapBillboardSet(1);
      delayedBillboardTimer = null;
    }, secondBillboardSetDelay);
  }

  function swapStars() {
    currentStarsIndex = (currentStarsIndex + 1) % starsFrames.length;

    starsFrames.forEach((frame, index) => {
      frame.classList.toggle("is-visible", index === currentStarsIndex);
    });
  }

  function flickerExitLight() {
    exitLight.classList.remove("is-flickering");
    void exitLight.offsetWidth;
    exitLight.classList.add("is-flickering");

    exitLightTimer = window.setTimeout(flickerExitLight, 7000 + Math.random() * 6000);
  }

  function clearCatFrameTimer() {
    if (catFrameTimer) {
      window.clearTimeout(catFrameTimer);
      catFrameTimer = null;
    }
  }

  function showCatFrame(frameIndex) {
    currentCatFrameIndex = frameIndex;
    catImage.src = catFrames[currentCatFrameIndex];
  }

  function scheduleNextCatFrame() {
    clearCatFrameTimer();

    catFrameTimer = window.setTimeout(() => {
      if (app.currentScreen !== roomScreen) {
        catFrameTimer = null;
        return;
      }

      showCatFrame((currentCatFrameIndex + 1) % catFrames.length);
      scheduleNextCatFrame();
    }, catFrameDurations[currentCatFrameIndex]);
  }

  function startCatAnimation() {
    showCatFrame(0);
    scheduleNextCatFrame();
  }

  // Limpieza de timers de textos de billboards.
  function clearBillboardCaptionTimers() {
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

  function clearBillboardHintTimers() {
    if (hintTypewriterTimer) {
      window.clearInterval(hintTypewriterTimer);
      hintTypewriterTimer = null;
    }

    if (hintCaptionFadeTimer) {
      window.clearTimeout(hintCaptionFadeTimer);
      hintCaptionFadeTimer = null;
    }
  }

  function clearBillboardDialogueTimers() {
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

  function clearTvFlickerTimer() {
    if (tvFlickerTimer) {
      window.clearTimeout(tvFlickerTimer);
      tvFlickerTimer = null;
    }
  }

  // Textos del minijuego de la tele.
  function moveBillboardCaptionToTv() {
    if (billboardCaption.parentElement === tvMiniGame) {
      return;
    }

    tvMiniGame.insertBefore(billboardCaption, tvExitHint);
  }

  function moveBillboardCaptionBackToRoom() {
    if (billboardCaption.parentElement === billboardCaptionHome) {
      return;
    }

    billboardCaptionHome.insertBefore(billboardCaption, billboardCaptionNextSibling);
  }

  function updateTvImage() {
    const imageState = tvImageStates[tvState];
    const shouldShowGlitch = tvState < 3 && tvShowsGlitchImage;

    tvFrame.src = shouldShowGlitch ? imageState.glitch : imageState.normal;
    tvShowsGlitchImage = !tvShowsGlitchImage;
  }

  function startTvFlicker() {
    clearTvFlickerTimer();
    updateTvImage();

    if (tvState >= 3 || !window.tvMiniGame?.isOpen) {
      return;
    }

    tvFlickerTimer = window.setTimeout(startTvFlicker, 90);
  }

  // Textos normales de billboards.
  function showTypedBillboardCaption(text) {
    clearBillboardCaptionTimers();
    billboardCaptionText.textContent = "";
    billboardCaption.classList.remove("is-fading-out");
    billboardCaption.classList.remove("is-hidden");

    let characterIndex = 0;

    typewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      billboardCaptionText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(typewriterTimer);
        typewriterTimer = null;
        holdCaptionTimer = window.setTimeout(fadeOutBillboardCaption, 3000);
      }
    }, 34);
  }

  function showTypedBillboardHint(text) {
    if (window.tvMiniGame?.isOpen) {
      return;
    }

    clearBillboardHintTimers();
    billboardHintCaptionText.textContent = "";
    billboardHintCaption.classList.remove("is-fading-out");
    billboardHintCaption.classList.remove("is-hidden");

    let characterIndex = 0;

    hintTypewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      billboardHintCaptionText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(hintTypewriterTimer);
        hintTypewriterTimer = null;
      }
    }, 34);
  }

  // Textos de dialogo.
  function showTypedBillboardDialogue(text, afterHide) {
    if (window.tvMiniGame?.isOpen) {
      return;
    }

    clearBillboardDialogueTimers();
    billboardDialogueText.textContent = "";
    billboardDialogueBox.classList.remove("is-fading-out");
    billboardDialogueBox.classList.remove("is-hidden");

    let characterIndex = 0;

    dialogueTypewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      billboardDialogueText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(dialogueTypewriterTimer);
        dialogueTypewriterTimer = null;
        dialogueHoldTimer = window.setTimeout(() => {
          fadeOutBillboardDialogue(afterHide);
        }, 3000);
      }
    }, 34);
  }

  function fadeOutBillboardCaption() {
    clearBillboardCaptionTimers();
    billboardCaption.classList.add("is-fading-out");

    captionFadeTimer = window.setTimeout(() => {
      billboardCaption.classList.add("is-hidden");
      billboardCaption.classList.remove("is-fading-out");
      captionFadeTimer = null;
      showNextBillboardCaptionInSequence();
    }, captionFadeDuration);
  }

  function fadeOutBillboardHint() {
    clearBillboardHintTimers();
    billboardHintCaption.classList.add("is-fading-out");

    hintCaptionFadeTimer = window.setTimeout(() => {
      billboardHintCaption.classList.add("is-hidden");
      billboardHintCaption.classList.remove("is-fading-out");
      hintCaptionFadeTimer = null;
    }, captionFadeDuration);
  }

  function fadeOutBillboardDialogue(afterHide) {
    clearBillboardDialogueTimers();
    billboardDialogueBox.classList.add("is-fading-out");

    dialogueFadeTimer = window.setTimeout(() => {
      billboardDialogueBox.classList.add("is-hidden");
      billboardDialogueBox.classList.remove("is-fading-out");
      dialogueFadeTimer = null;

      if (afterHide) {
        afterHide();
      }
    }, captionFadeDuration);
  }

  function showNextBillboardCaptionInSequence() {
    if (
      app.currentScreen !== roomScreen ||
      (window.tvMiniGame?.isOpen && !isShowingTvCaptionSequence)
    ) {
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
    showTypedBillboardCaption(captionText);
  }

  function showBillboardCaptionSequence(captions, afterEnd) {
    currentCaptionSequence = captions;
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = afterEnd || null;
    showNextBillboardCaptionInSequence();
  }

  function showNextBillboardDialogueInSequence() {
    if (app.currentScreen !== roomScreen || window.tvMiniGame?.isOpen) {
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
    showTypedBillboardDialogue(dialogueText, showNextBillboardDialogueInSequence);
  }

  function showBillboardDialogueSequence(dialogues, afterEnd) {
    currentDialogueSequence = dialogues;
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = afterEnd || null;
    showNextBillboardDialogueInSequence();
  }

  function clearBillboardCaptionSequence() {
    clearBillboardCaptionTimers();
    currentCaptionSequence = [];
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = null;
    billboardCaption.classList.add("is-hidden");
    billboardCaption.classList.remove("is-fading-out");
  }

  function hideBillboardDialogue() {
    clearBillboardDialogueTimers();
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    billboardDialogueBox.classList.add("is-hidden");
    billboardDialogueBox.classList.remove("is-fading-out");
  }

  function pauseBillboardDialogueForTv() {
    pausedBillboardDialogue = {
      captionText: billboardCaptionText.textContent,
      captionWasVisible: !billboardCaption.classList.contains("is-hidden"),
      hintText: billboardHintCaptionText.textContent,
      hintWasVisible: !billboardHintCaption.classList.contains("is-hidden"),
      dialogueText: billboardDialogueText.textContent,
      dialogueWasVisible: !billboardDialogueBox.classList.contains("is-hidden"),
      captionSequence: [...currentCaptionSequence],
      captionSequenceIndex: currentCaptionSequenceIndex,
      captionSequenceAfterEnd: currentCaptionSequenceAfterEnd,
      dialogueSequence: [...currentDialogueSequence],
      dialogueSequenceIndex: currentDialogueSequenceIndex,
      dialogueSequenceAfterEnd: currentDialogueSequenceAfterEnd,
    };

    clearIdleHintTimer();
    clearBillboardCaptionTimers();
    clearBillboardHintTimers();
    clearBillboardDialogueTimers();
    currentCaptionSequence = [];
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = null;
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    billboardCaption.classList.add("is-hidden");
    billboardHintCaption.classList.add("is-hidden");
    billboardDialogueBox.classList.add("is-hidden");
    billboardCaption.classList.remove("is-fading-out");
    billboardHintCaption.classList.remove("is-fading-out");
    billboardDialogueBox.classList.remove("is-fading-out");
  }

  function resumePausedBillboardDialogue() {
    if (!pausedBillboardDialogue || app.currentScreen !== roomScreen) {
      pausedBillboardDialogue = null;
      return;
    }

    const paused = pausedBillboardDialogue;
    pausedBillboardDialogue = null;
    currentCaptionSequence = paused.captionSequence;
    currentCaptionSequenceIndex = paused.captionSequenceIndex;
    currentCaptionSequenceAfterEnd = paused.captionSequenceAfterEnd;
    currentDialogueSequence = paused.dialogueSequence;
    currentDialogueSequenceIndex = paused.dialogueSequenceIndex;
    currentDialogueSequenceAfterEnd = paused.dialogueSequenceAfterEnd;

    if (paused.dialogueWasVisible) {
      billboardDialogueText.textContent = paused.dialogueText;
      billboardDialogueBox.classList.remove("is-hidden");
      dialogueHoldTimer = window.setTimeout(() => {
        fadeOutBillboardDialogue(showNextBillboardDialogueInSequence);
      }, 2200);
      return;
    }

    if (paused.captionWasVisible) {
      billboardCaptionText.textContent = paused.captionText;
      billboardCaption.classList.remove("is-hidden");
      holdCaptionTimer = window.setTimeout(fadeOutBillboardCaption, 2200);
      return;
    }

    if (paused.hintWasVisible) {
      billboardHintCaptionText.textContent = paused.hintText;
      billboardHintCaption.classList.remove("is-hidden");
      return;
    }

    if (currentDialogueSequence.length > 0) {
      showNextBillboardDialogueInSequence();
      return;
    }

    if (currentCaptionSequence.length > 0) {
      showNextBillboardCaptionInSequence();
      return;
    }

    scheduleIdleHint();
  }

  function resetBillboardDialogue() {
    clearIdleHintTimer();
    clearBillboardCaptionSequence();
    clearBillboardHintTimers();
    hideBillboardDialogue();
    hasClickedCat = false;
    closeTvMiniGame({ resume: false });
    billboardHintCaption.classList.add("is-hidden");
    billboardHintCaption.classList.remove("is-fading-out");
  }

  // Clicks y estados del minijuego de la tele.
  function updateTvState() {
    // La tele cambia segun cuantos clicks lleva.
    // 0-2, 3-5, 6-8 y 9+.
    const nextTvState = Math.min(3, Math.floor(tvClickCount / 3));

    if (nextTvState === tvState && tvClickCount !== 0) {
      return;
    }

    tvState = nextTvState;

    if (window.tvMiniGame) {
      window.tvMiniGame.state = tvState;
    }

    startTvFlicker();

    // Actualiza los textos que salen debajo de la tele.
    if (tvState === 0) {
      showTypedBillboardCaption(tvMessages[0]);
    } else if (tvState === 3) {
      isShowingTvCaptionSequence = true;
      showBillboardCaptionSequence([tvMessages[3], tvMessages[4]], () => {
        showBillboardCaptionSequence(finalMessages, () => {
          isShowingTvCaptionSequence = false;
          isTvMiniGameFinished = true;
          tvExitHint.classList.remove("is-hidden");
        });
      });
    } else {
      showTypedBillboardCaption(tvMessages[tvState]);
    }
  }

  function openTvMiniGame() {
    if (window.tvMiniGame?.isOpen) {
      return;
    }

    tvClickCount = 0;
    tvState = 0;
    tvShowsGlitchImage = false;
    isTvMiniGameFinished = false;
    tvExitHint.classList.add("is-hidden");
    tvMiniGame.classList.remove("is-hidden");
    document.body.classList.add("is-tv-minigame-open");
    pauseBillboardDialogueForTv();
    moveBillboardCaptionToTv();

    window.tvMiniGame = {
      isOpen: true,
      state: tvState,
      frame: tvFrame,
    };

    updateTvState();
  }

  function closeTvMiniGame(options = {}) {
    const shouldResume = options.resume !== false;
    const wasOpen = window.tvMiniGame?.isOpen;

    tvMiniGame.classList.add("is-hidden");
    tvExitHint.classList.add("is-hidden");
    document.body.classList.remove("is-tv-minigame-open");
    moveBillboardCaptionBackToRoom();
    clearTvFlickerTimer();

    if (wasOpen) {
      clearBillboardCaptionSequence();
    }

    if (window.tvMiniGame) {
      window.tvMiniGame.isOpen = false;
    }

    if (wasOpen && shouldResume) {
      isShowingTvCaptionSequence = false;
      isTvMiniGameFinished = false;
      resumePausedBillboardDialogue();
    } else {
      isShowingTvCaptionSequence = false;
      isTvMiniGameFinished = false;
      pausedBillboardDialogue = null;
    }
  }

  function smackTv() {
    if (!window.tvMiniGame?.isOpen) {
      return;
    }

    tvClickCount += 1;
    updateTvState();
    tvSmackButton.classList.remove("is-smacked");
    void tvSmackButton.offsetWidth;
    tvSmackButton.classList.add("is-smacked");
  }

  function scheduleIdleHint() {
    clearIdleHintTimer();

    idleHintTimer = window.setTimeout(() => {
      idleHintTimer = null;

      if (app.currentScreen === roomScreen && !hasClickedCat && !window.tvMiniGame?.isOpen) {
        showTypedBillboardHint(idleHint);
      }
    }, 9000);
  }

  function startCatDialogue() {
    if (hasClickedCat) {
      return;
    }

    hasClickedCat = true;
    clearIdleHintTimer();
    clearBillboardCaptionSequence();
    clearBillboardHintTimers();
    billboardHintCaption.classList.add("is-hidden");
    billboardHintCaption.classList.remove("is-fading-out");

    showBillboardDialogueSequence(catDialogues);
  }

  function handleBillboardActivity() {
    if (app.currentScreen !== roomScreen || window.tvMiniGame?.isOpen) {
      return;
    }

    if (
      !billboardCaption.classList.contains("is-hidden") ||
      !billboardHintCaption.classList.contains("is-hidden") ||
      !billboardDialogueBox.classList.contains("is-hidden") ||
      currentCaptionSequence.length > 0
    ) {
      return;
    }

    scheduleIdleHint();
  }

  ["click", "keydown", "mousemove", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, handleBillboardActivity, { passive: true });
  });

  catButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startCatDialogue();
  });

  tvEntryButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openTvMiniGame();
  });

  tvSmackButton.addEventListener("click", (event) => {
    event.stopPropagation();
    smackTv();
  });

  tvMiniGame.addEventListener("click", (event) => {
    if (event.target === tvMiniGame && isTvMiniGameFinished) {
      closeTvMiniGame({ resume: true });
    }
  });

  billboardCaptionNextButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!billboardCaption.classList.contains("is-hidden")) {
      fadeOutBillboardCaption();
    }
  });

  billboardDialogueNextButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!billboardDialogueBox.classList.contains("is-hidden")) {
      fadeOutBillboardDialogue(showNextBillboardDialogueInSequence);
    }
  });

  window.closeTvMiniGame = closeTvMiniGame;

  app.onScreenEnter(roomScreen, () => {
    closeTvMiniGame({ resume: false });
    resetBillboardDialogue();
    showBillboardCaptionSequence(entryMessages, scheduleIdleHint);

    if (!catFrameTimer) {
      startCatAnimation();
    }

    if (billboardTimer) {
      return;
    }

    if (delayedBillboardTimer) {
      window.clearTimeout(delayedBillboardTimer);
      delayedBillboardTimer = null;
    }

    billboardTimer = window.setInterval(swapBillboards, billboardCycleDelay);
    starsTimer = window.setInterval(swapStars, starsCycleDelay);
    exitLightTimer = window.setTimeout(flickerExitLight, 3000 + Math.random() * 4000);
  });

  app.onScreenEnter(app.screens.hub, () => {
    closeTvMiniGame({ resume: false });
    resetBillboardDialogue();
  });
  app.onScreenEnter(app.screens.entry, () => {
    closeTvMiniGame({ resume: false });
    resetBillboardDialogue();
  });
}
