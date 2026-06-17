function setupDinerScene(app) {
  app.setupRoom("diner", {
    title: "Registro 02",
    image: "assets/images/Diner/Diner_room.png",
    alt: "Rainy diner room",
  });

  const roomScreen = app.rooms.diner;
  const dinerLight = roomScreen?.querySelector(".diner-light");
  const dinerDarkness = roomScreen?.querySelector(".diner-darkness");
  const dinerCaption = roomScreen?.querySelector(".diner-caption");
  const dinerCaptionText = dinerCaption?.querySelector("span");
  const dinerCaptionNextButton = dinerCaption?.querySelector(".caption-next-button");
  const coffeeChoiceButtons = dinerCaption?.querySelector(".coffee-choice-buttons");
  const coffeeYesButton = dinerCaption?.querySelector(".coffee-yes-button");
  const coffeeNoButton = dinerCaption?.querySelector(".coffee-no-button");
  const dinerHintCaption = roomScreen?.querySelector(".diner-hint-caption");
  const dinerHintCaptionText = dinerHintCaption?.querySelector("span");
  const dinerDialogueBox = roomScreen?.querySelector(".diner-dialogue-box");
  const dinerDialogueText = dinerDialogueBox?.querySelector("span");
  const dinerDialogueNextButton = dinerDialogueBox?.querySelector(".text-next-button");
  const dinerCharacterButton = roomScreen?.querySelector(".diner-character-button");
  const dinerCharacterImage = dinerCharacterButton?.querySelector("img");
  const coffeeMiniGame = document.querySelector(".coffee-minigame");
  const coffeeWindow = coffeeMiniGame?.querySelector(".coffee-window");
  const coffeeCupImage = coffeeMiniGame?.querySelector(".coffee-cup-image");
  const coffeePotButton = coffeeMiniGame?.querySelector(".coffee-pot-button");
  const coffeePotImage = coffeeMiniGame?.querySelector(".coffee-pot-image");
  const coffeeSugarButton = coffeeMiniGame?.querySelector(".coffee-sugar-button");
  const coffeeSugarImage = coffeeMiniGame?.querySelector(".coffee-sugar-image");
  const coffeeExitHint = coffeeMiniGame?.querySelector(".coffee-exit-hint");
  const coffeeCaptionHome = dinerCaption?.parentElement;
  const coffeeCaptionNextSibling = dinerCaption?.nextElementSibling;
  const rainFrames = [
    roomScreen?.querySelector(".diner-rain-one"),
    roomScreen?.querySelector(".diner-rain-two"),
    roomScreen?.querySelector(".diner-rain-three"),
  ];
  const rainImageSets = [
    [
      "assets/images/Diner/Rain_1.png",
      "assets/images/Diner/Rain_1_2.png",
    ],
    [
      "assets/images/Diner/Rain_2.png",
      "assets/images/Diner/Rain_2_2.png",
    ],
    [
      "assets/images/Diner/Rain_3.png",
      "assets/images/Diner/Rain_3_2.png",
    ],
  ];
  const rainIndexes = [1, 1, 1];
  const entryMessages = [
    "La lluvia golpea el cristal con paciencia.",
    "Dentro, la luz no llega muy lejos.",
    "Hay una mesa ocupada al fondo.",
  ];
  const idleHint = "Alguien sigue sentado bajo la única lámpara encendida.";
  const dinerDialogues = [
    "No esperaba que entrara nadie.",
    "A estas horas, casi todo el mundo pasa de largo.",
    "No tienes que decir nada todavía.",
    "Hay lugares que parecen hechos para esperar.",
    `Antes aquí había más ruido.
Más voces. Más platos. Más pasos.`,
    `Ahora la máquina del café tarda demasiado
y la lluvia contesta por todos.`,
    "A veces vengo aquí porque fuera todo se mueve muy rápido.",
    "Aquí, al menos, las cosas se quedan quietas.",
    `No sé si eso es estar en calma
o simplemente no tener fuerzas para moverse.`,
    "La gente suele pensar que estar solo es no tener a nadie cerca.",
    `Pero a veces es mirar la puerta cada vez que suena,
aunque sepas que nadie viene.`,
    "Si vas a quedarte un momento, siéntate.",
    "No hace falta llenar el silencio.",
  ];
  const coffeePromptMessage = "¿Prepararle un café?";
  const coffeeMessages = {
    start: `¿Servir el café?`,
    afterCoffee: "Aún falta algo.",
    poured: "El café cae despacio.",
    afterSugarPrompt: "¿Añadir azúcar?",
    afterSugar: "Así está bien.",
    finalThanks: "Gracias.",
    final: "A veces lo más pequeño hace que la soledad pese menos.",
  };
  const coffeeAssets = {
    backdrop: "assets/images/Diner/Coffee_minigame/Backdrop_coffee.png",
    counter: "assets/images/Diner/Coffee_minigame/Counter.png",
    cupEmpty: "assets/images/Diner/Coffee_minigame/Cup_empty.png",
    cupFull: "assets/images/Diner/Coffee_minigame/Cup_full.png",
    cupFinal: "assets/images/Diner/Coffee_minigame/Cup_final.png",
    potEmpty: "assets/images/Diner/Coffee_minigame/Pot_empty.png",
    potFull: "assets/images/Diner/Coffee_minigame/Pot_full.png",
    sugarEmpty: "assets/images/Diner/Coffee_minigame/Sugar_empty.png",
    sugarFull: "assets/images/Diner/Coffee_minigame/Sugar_full.png",
  };
  const dinerCharacterAssets = {
    normal: "assets/images/Diner/Ghost.png",
    happy: "assets/images/Diner/Gohst_happy.png",
  };
  const captionFadeDuration = 420;
  let dinerLightTimer = null;
  let rainTimer = null;
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
  let hasClickedCharacter = false;
  let isCoffeePromptActive = false;
  let isCoffeeMiniGameOpen = false;
  let hasPouredCoffee = false;
  let hasAddedSugar = false;
  let isCoffeeComplete = false;
  let coffeeCloseHintTimer = null;

  if (
    !roomScreen ||
    !dinerLight ||
    !dinerDarkness ||
    !dinerCaption ||
    !dinerCaptionText ||
    !dinerCaptionNextButton ||
    !coffeeChoiceButtons ||
    !coffeeYesButton ||
    !coffeeNoButton ||
    !dinerHintCaption ||
    !dinerHintCaptionText ||
    !dinerDialogueBox ||
    !dinerDialogueText ||
    !dinerDialogueNextButton ||
    !dinerCharacterButton ||
    !dinerCharacterImage ||
    !coffeeMiniGame ||
    !coffeeWindow ||
    !coffeeCupImage ||
    !coffeePotButton ||
    !coffeePotImage ||
    !coffeeSugarButton ||
    !coffeeSugarImage ||
    !coffeeExitHint ||
    !coffeeCaptionHome ||
    rainFrames.some((frame) => !frame)
  ) {
    return;
  }

  // Precarga las imagenes del minijuego del cafe.
  Object.values(coffeeAssets).forEach((image) => {
    new Image().src = image;
  });
  new Image().src = "assets/images/Diner/Light.png";
  new Image().src = "assets/images/Diner/Back_1.png";
  new Image().src = "assets/images/Diner/Back_2.png";
  new Image().src = dinerCharacterAssets.normal;
  new Image().src = dinerCharacterAssets.happy;
  rainImageSets.flat().forEach((image) => {
    new Image().src = image;
  });

  function flickerDinerLight() {
    dinerLight.classList.remove("is-flickering");
    dinerDarkness.classList.remove("is-flickering");
    void dinerLight.offsetWidth;
    void dinerDarkness.offsetWidth;
    dinerLight.classList.add("is-flickering");
    dinerDarkness.classList.add("is-flickering");

    dinerLightTimer = window.setTimeout(flickerDinerLight, 7000 + Math.random() * 6000);
  }

  function swapRainSet(index) {
    rainFrames[index].src = rainImageSets[index][rainIndexes[index]];
    rainIndexes[index] = (rainIndexes[index] + 1) % rainImageSets[index].length;
  }

  function swapRain() {
    rainFrames.forEach((frame, index) => {
      swapRainSet(index);
    });
  }

  // Limpieza de timers de textos del diner.
  function clearDinerCaptionTimers() {
    if (typewriterTimer) {
      window.clearInterval(typewriterTimer);
      typewriterTimer = null;
      window.archiveAudio?.stopTypingSound();
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

  function clearDinerHintTimers() {
    if (hintTypewriterTimer) {
      window.clearInterval(hintTypewriterTimer);
      hintTypewriterTimer = null;
      window.archiveAudio?.stopTypingSound();
    }

    if (hintCaptionFadeTimer) {
      window.clearTimeout(hintCaptionFadeTimer);
      hintCaptionFadeTimer = null;
    }
  }

  function clearDinerDialogueTimers() {
    if (dialogueTypewriterTimer) {
      window.clearInterval(dialogueTypewriterTimer);
      dialogueTypewriterTimer = null;
      window.archiveAudio?.stopTypingSound();
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

  function clearCoffeeCloseHintTimer() {
    if (coffeeCloseHintTimer) {
      window.clearTimeout(coffeeCloseHintTimer);
      coffeeCloseHintTimer = null;
    }
  }

  // Textos del minijuego del cafe.
  function moveCoffeeCaptionIntoOverlay() {
    if (dinerCaption.parentElement === coffeeMiniGame) {
      return;
    }

    coffeeMiniGame.insertBefore(dinerCaption, coffeeExitHint);
  }

  function moveCoffeeCaptionBackToRoom() {
    if (dinerCaption.parentElement === coffeeCaptionHome) {
      return;
    }

    coffeeCaptionHome.insertBefore(dinerCaption, coffeeCaptionNextSibling);
  }

  function hideCoffeeChoices() {
    coffeeChoiceButtons.classList.add("is-hidden");
    dinerCaptionNextButton.classList.remove("is-hidden");
  }

  function showCoffeeChoices() {
    coffeeChoiceButtons.classList.remove("is-hidden");
    dinerCaptionNextButton.classList.add("is-hidden");
  }

  function showTypedCoffeeCaption(text, afterTyped) {
    isCoffeePromptActive = false;
    hideCoffeeChoices();
    dinerCaptionNextButton.classList.add("is-hidden");
    clearDinerCaptionTimers();
    window.archiveAudio?.startTypingSound();
    dinerCaptionText.textContent = "";
    dinerCaption.classList.remove("is-fading-out");
    dinerCaption.classList.remove("is-hidden");

    let characterIndex = 0;

    typewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      dinerCaptionText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(typewriterTimer);
        typewriterTimer = null;
        window.archiveAudio?.stopTypingSound();

        if (afterTyped) {
          afterTyped();
        }
      }
    }, 34);
  }

  function showDinerCharacter() {
    dinerCharacterButton.classList.remove("is-hidden");
    void dinerCharacterButton.offsetWidth;
    dinerCharacterButton.classList.add("is-visible");
  }

  function hideDinerCharacter() {
    dinerCharacterButton.classList.remove("is-visible");
    dinerCharacterButton.classList.add("is-hidden");
  }

  // Textos normales del diner.
  function showTypedDinerCaption(text) {
    isCoffeePromptActive = false;
    hideCoffeeChoices();
    clearDinerCaptionTimers();
    window.archiveAudio?.startTypingSound();
    dinerCaptionText.textContent = "";
    dinerCaption.classList.remove("is-fading-out");
    dinerCaption.classList.remove("is-hidden");

    let characterIndex = 0;

    typewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      dinerCaptionText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(typewriterTimer);
        typewriterTimer = null;
        window.archiveAudio?.stopTypingSound();
        holdCaptionTimer = window.setTimeout(fadeOutDinerCaption, 3000);
      }
    }, 34);
  }

  function showTypedDinerHint(text) {
    clearDinerHintTimers();
    window.archiveAudio?.startTypingSound();
    dinerHintCaptionText.textContent = "";
    dinerHintCaption.classList.remove("is-fading-out");
    dinerHintCaption.classList.remove("is-hidden");

    let characterIndex = 0;

    hintTypewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      dinerHintCaptionText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(hintTypewriterTimer);
        hintTypewriterTimer = null;
        window.archiveAudio?.stopTypingSound();
      }
    }, 34);
  }

  // Textos de dialogo.
  function showTypedDinerDialogue(text, afterHide) {
    if (isCoffeeMiniGameOpen) {
      return;
    }

    clearDinerDialogueTimers();
    window.archiveAudio?.startTypingSound();
    dinerDialogueText.textContent = "";
    dinerDialogueBox.classList.remove("is-fading-out");
    dinerDialogueBox.classList.remove("is-hidden");

    let characterIndex = 0;

    dialogueTypewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      dinerDialogueText.textContent = text.slice(0, characterIndex);

      if (characterIndex >= text.length) {
        window.clearInterval(dialogueTypewriterTimer);
        dialogueTypewriterTimer = null;
        window.archiveAudio?.stopTypingSound();
        dialogueHoldTimer = window.setTimeout(() => {
          fadeOutDinerDialogue(afterHide);
        }, 3000);
      }
    }, 34);
  }

  function fadeOutDinerCaption() {
    clearDinerCaptionTimers();
    dinerCaption.classList.add("is-fading-out");

    captionFadeTimer = window.setTimeout(() => {
      dinerCaption.classList.add("is-hidden");
      dinerCaption.classList.remove("is-fading-out");
      captionFadeTimer = null;
      showNextDinerCaptionInSequence();
    }, captionFadeDuration);
  }

  function fadeOutDinerHint() {
    clearDinerHintTimers();
    dinerHintCaption.classList.add("is-fading-out");

    hintCaptionFadeTimer = window.setTimeout(() => {
      dinerHintCaption.classList.add("is-hidden");
      dinerHintCaption.classList.remove("is-fading-out");
      hintCaptionFadeTimer = null;
    }, captionFadeDuration);
  }

  function fadeOutDinerDialogue(afterHide) {
    clearDinerDialogueTimers();
    dinerDialogueBox.classList.add("is-fading-out");

    dialogueFadeTimer = window.setTimeout(() => {
      dinerDialogueBox.classList.add("is-hidden");
      dinerDialogueBox.classList.remove("is-fading-out");
      dialogueFadeTimer = null;

      if (afterHide) {
        afterHide();
      }
    }, captionFadeDuration);
  }

  function showNextDinerCaptionInSequence() {
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
    showTypedDinerCaption(captionText);
  }

  function showDinerCaptionSequence(captions, afterEnd) {
    isCoffeePromptActive = false;
    hideCoffeeChoices();
    currentCaptionSequence = captions;
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = afterEnd || null;
    showNextDinerCaptionInSequence();
  }

  function showNextDinerDialogueInSequence() {
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
    showTypedDinerDialogue(dialogueText, showNextDinerDialogueInSequence);
  }

  function showDinerDialogueSequence(dialogues, afterEnd) {
    currentDialogueSequence = dialogues;
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = afterEnd || null;
    showNextDinerDialogueInSequence();
  }

  function clearDinerCaptionSequence() {
    isCoffeePromptActive = false;
    hideCoffeeChoices();
    clearDinerCaptionTimers();
    currentCaptionSequence = [];
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = null;
    dinerCaption.classList.add("is-hidden");
    dinerCaption.classList.remove("is-fading-out");
  }

  function hideDinerDialogue() {
    clearDinerDialogueTimers();
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    dinerDialogueBox.classList.add("is-hidden");
    dinerDialogueBox.classList.remove("is-fading-out");
  }

  function hideDinerTextBeforeCoffee() {
    clearIdleHintTimer();
    clearDinerCaptionTimers();
    clearDinerHintTimers();
    clearDinerDialogueTimers();
    currentCaptionSequence = [];
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = null;
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    isCoffeePromptActive = false;
    hideCoffeeChoices();
    dinerCaption.classList.add("is-hidden");
    dinerHintCaption.classList.add("is-hidden");
    dinerDialogueBox.classList.add("is-hidden");
    dinerCaption.classList.remove("is-fading-out");
    dinerHintCaption.classList.remove("is-fading-out");
    dinerDialogueBox.classList.remove("is-fading-out");
  }

  function showCoffeePromptCaption() {
    clearDinerCaptionTimers();
    clearDinerHintTimers();
    clearDinerDialogueTimers();
    window.archiveAudio?.startTypingSound();
    currentCaptionSequence = [];
    currentCaptionSequenceIndex = 0;
    currentCaptionSequenceAfterEnd = null;
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    isCoffeePromptActive = true;
    showCoffeeChoices();
    dinerCaptionText.textContent = "";
    dinerCaption.classList.remove("is-fading-out");
    dinerCaption.classList.remove("is-hidden");
    dinerHintCaption.classList.add("is-hidden");
    dinerDialogueBox.classList.add("is-hidden");

    let characterIndex = 0;

    typewriterTimer = window.setInterval(() => {
      characterIndex += 1;
      dinerCaptionText.textContent = coffeePromptMessage.slice(0, characterIndex);

      if (characterIndex >= coffeePromptMessage.length) {
        window.clearInterval(typewriterTimer);
        typewriterTimer = null;
        window.archiveAudio?.stopTypingSound();
      }
    }, 34);
  }

  function dismissCoffeePrompt() {
    isCoffeePromptActive = false;
    hideCoffeeChoices();
    clearDinerCaptionTimers();
    dinerCaption.classList.add("is-hidden");
    dinerCaption.classList.remove("is-fading-out");
  }

  // Abre el minijuego despues de aceptar el cafe.
  function openCoffeeMiniGameOverlay() {
    if (isCoffeeMiniGameOpen) {
      return;
    }

    hideDinerTextBeforeCoffee();
    hideCoffeeChoices();
    isCoffeeMiniGameOpen = true;
    window.coffeeMiniGame.isOpen = true;
    window.coffeeMiniGame.isComplete = false;
    hasPouredCoffee = false;
    hasAddedSugar = false;
    isCoffeeComplete = false;
    clearCoffeeCloseHintTimer();
    coffeeExitHint.classList.add("is-hidden");
    coffeeCupImage.src = coffeeAssets.cupEmpty;
    coffeePotImage.src = coffeeAssets.potFull;
    coffeeSugarImage.src = coffeeAssets.sugarFull;
    coffeeMiniGame.classList.remove("is-hidden");
    moveCoffeeCaptionIntoOverlay();
    showTypedCoffeeCaption(coffeeMessages.start);
  }

  // Actualiza la taza: primero cafe y luego azucar.
  function pourCoffee() {
    if (!isCoffeeMiniGameOpen || hasPouredCoffee) {
      return;
    }

    hasPouredCoffee = true;
    coffeeCupImage.src = coffeeAssets.cupFull;
    coffeePotImage.src = coffeeAssets.potEmpty;
    clearCoffeeCloseHintTimer();
    showTypedCoffeeCaption(coffeeMessages.poured, () => {
      coffeeCloseHintTimer = window.setTimeout(() => {
        showTypedCoffeeCaption(coffeeMessages.afterCoffee, () => {
          coffeeCloseHintTimer = window.setTimeout(() => {
            showTypedCoffeeCaption(coffeeMessages.afterSugarPrompt);
            coffeeCloseHintTimer = null;
          }, 900);
        });
      }, 900);
    });
  }

  function addSugar() {
    if (!isCoffeeMiniGameOpen || !hasPouredCoffee || hasAddedSugar) {
      return;
    }

    hasAddedSugar = true;
    coffeeCupImage.src = coffeeAssets.cupFinal;
    coffeeSugarImage.src = coffeeAssets.sugarEmpty;
    clearCoffeeCloseHintTimer();
    showTypedCoffeeCaption(coffeeMessages.afterSugar, () => {
      coffeeCloseHintTimer = window.setTimeout(() => {
        showTypedCoffeeCaption(coffeeMessages.finalThanks, () => {
          coffeeCloseHintTimer = window.setTimeout(() => {
            showTypedCoffeeCaption(coffeeMessages.final, () => {
              coffeeCloseHintTimer = window.setTimeout(() => {
                dinerCaption.classList.add("is-hidden");
                coffeeExitHint.classList.remove("is-hidden");
                isCoffeeComplete = true;
                dinerCharacterImage.src = dinerCharacterAssets.happy;
                window.coffeeMiniGame.isComplete = true;
                coffeeCloseHintTimer = null;
              }, 1800);
            });
          }, 1800);
        });
      }, 900);
    });
  }

  // Cierra el minijuego y vuelve al diner.
  function closeCoffeeMiniGameOverlay() {
    const wasOpen = isCoffeeMiniGameOpen;

    coffeeMiniGame.classList.add("is-hidden");
    coffeeExitHint.classList.add("is-hidden");
    clearCoffeeCloseHintTimer();
    isCoffeeMiniGameOpen = false;
    window.coffeeMiniGame.isOpen = false;
    window.coffeeMiniGame.isComplete = false;
    moveCoffeeCaptionBackToRoom();

    if (wasOpen) {
      clearDinerCaptionSequence();
    }
  }

  function resetDinerDialogue() {
    closeCoffeeMiniGameOverlay();
    clearIdleHintTimer();
    clearDinerCaptionSequence();
    clearDinerHintTimers();
    hideDinerDialogue();
    currentDialogueSequence = [];
    currentDialogueSequenceIndex = 0;
    currentDialogueSequenceAfterEnd = null;
    hasClickedCharacter = false;
    dinerCharacterImage.src = dinerCharacterAssets.normal;
    dinerHintCaption.classList.add("is-hidden");
    dinerHintCaption.classList.remove("is-fading-out");
    hideDinerCharacter();
  }

  function scheduleIdleHint() {
    clearIdleHintTimer();

    idleHintTimer = window.setTimeout(() => {
      idleHintTimer = null;

      if (app.currentScreen === roomScreen && !hasClickedCharacter && !isCoffeeMiniGameOpen) {
        showTypedDinerHint(idleHint);
      }
    }, 9000);
  }

  function startDinerDialogue() {
    if (hasClickedCharacter) {
      return;
    }

    hasClickedCharacter = true;
    clearIdleHintTimer();
    clearDinerCaptionSequence();
    clearDinerHintTimers();
    dinerHintCaption.classList.add("is-hidden");
    dinerHintCaption.classList.remove("is-fading-out");

    showDinerDialogueSequence(dinerDialogues, showCoffeePromptCaption);
  }

  function handleDinerActivity() {
    if (app.currentScreen !== roomScreen || isCoffeeMiniGameOpen) {
      return;
    }

    if (
      !dinerCaption.classList.contains("is-hidden") ||
      !dinerHintCaption.classList.contains("is-hidden") ||
      !dinerDialogueBox.classList.contains("is-hidden") ||
      currentCaptionSequence.length > 0
    ) {
      return;
    }

    scheduleIdleHint();
  }

  ["click", "keydown", "mousemove", "touchstart"].forEach((eventName) => {
    window.addEventListener(eventName, handleDinerActivity, { passive: true });
  });

  dinerCharacterButton.addEventListener("click", (event) => {
    event.stopPropagation();
    startDinerDialogue();
  });

  dinerCaptionNextButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!dinerCaption.classList.contains("is-hidden")) {
      fadeOutDinerCaption();
    }
  });

  coffeeYesButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openCoffeeMiniGameOverlay();
  });

  coffeeNoButton.addEventListener("click", (event) => {
    event.stopPropagation();
    dismissCoffeePrompt();
  });

  dinerDialogueNextButton.addEventListener("click", (event) => {
    event.stopPropagation();

    if (!dinerDialogueBox.classList.contains("is-hidden")) {
      fadeOutDinerDialogue(showNextDinerDialogueInSequence);
    }
  });

  coffeePotButton.addEventListener("click", (event) => {
    event.stopPropagation();
    pourCoffee();
  });

  coffeeSugarButton.addEventListener("click", (event) => {
    event.stopPropagation();
    addSugar();
  });

  coffeeMiniGame.addEventListener("click", (event) => {
    if (event.target === coffeeMiniGame && isCoffeeComplete) {
      closeCoffeeMiniGameOverlay();
    }
  });

  window.coffeeMiniGame = {
    isOpen: false,
    isComplete: false,
  };
  window.closeCoffeeMiniGame = closeCoffeeMiniGameOverlay;

  app.onScreenEnter(roomScreen, () => {
    resetDinerDialogue();
    showDinerCharacter();
    showDinerCaptionSequence(entryMessages, scheduleIdleHint);

    if (!rainTimer) {
      rainTimer = window.setInterval(swapRain, 450);
    }

    if (!dinerLightTimer) {
      dinerLightTimer = window.setTimeout(flickerDinerLight, 3000 + Math.random() * 4000);
    }
  });

  app.onScreenEnter(app.screens.hub, resetDinerDialogue);
  app.onScreenEnter(app.screens.entry, resetDinerDialogue);
}
