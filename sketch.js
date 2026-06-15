const loadingFrames = [
  "assets/icons/Loading_0.svg",
  "assets/icons/Loading_20.svg",
  "assets/icons/Loading_50.svg",
  "assets/icons/Loading_80.svg",
  "assets/icons/Loading_100.svg",
];

function getGameFrameSize() {
  const gameFrame = document.querySelector(".game-frame");
  const frameBox = gameFrame?.getBoundingClientRect();

  return {
    width: Math.max(1, Math.round(frameBox?.width || windowWidth)),
    height: Math.max(1, Math.round(frameBox?.height || windowHeight)),
  };
}

let fireflyCanvasSize = { width: 0, height: 0 };

// Mantiene el canvas pegado al marco 16:9.
function syncFireflyCanvasSize() {
  const gameFrameSize = getGameFrameSize();

  if (
    gameFrameSize.width === fireflyCanvasSize.width &&
    gameFrameSize.height === fireflyCanvasSize.height
  ) {
    return;
  }

  resizeCanvas(gameFrameSize.width, gameFrameSize.height, true);
  fireflyCanvasSize = gameFrameSize;
}

// Objeto principal para movernos entre pantallas y salas.
const archiveApp = {
  screens: {},
  rooms: {},
  screenEnterHandlers: new Map(),
  currentScreen: null,
  isLoading: false,
  storageKey: "archivoSentires.currentScreen",

  updateTopUi(screen) {
    const topUi = document.querySelector(".top-ui");

    if (topUi) {
      topUi.classList.toggle("is-hidden", screen === this.screens.entry);
    }
  },

  registerRoom(roomName, roomScreen) {
    if (roomScreen) {
      this.rooms[roomName] = roomScreen;
    }
  },

  onScreenEnter(screen, handler) {
    if (screen) {
      this.screenEnterHandlers.set(screen, handler);
    }
  },

  setupRoom(roomName, roomData) {
    const roomScreen = document.querySelector(`[data-room="${roomName}"]`);

    if (!roomScreen) {
      return;
    }

    const title = roomScreen.querySelector(".room-title span");
    const image = roomScreen.querySelector(".room-image");

    if (title) {
      title.textContent = roomData.title;
    }

    if (image) {
      image.src = roomData.image;
      image.alt = roomData.alt;
    }

    this.registerRoom(roomName, roomScreen);
  },

  // Cambia imagen al pasar el raton por encima.
  bindHoverImage(button) {
    const image = button.querySelector("[data-default-src][data-hover-src]");

    if (!image || button.dataset.hoverBound === "true") {
      return;
    }

    new Image().src = image.dataset.hoverSrc;
    button.dataset.hoverBound = "true";

    button.addEventListener("mouseenter", () => {
      image.src = image.dataset.hoverSrc;
    });

    button.addEventListener("mouseleave", () => {
      image.src = image.dataset.defaultSrc;
    });

    button.addEventListener("focus", () => {
      image.src = image.dataset.hoverSrc;
    });

    button.addEventListener("blur", () => {
      image.src = image.dataset.defaultSrc;
    });
  },

  isAnyMiniGameOpen() {
    return Boolean(window.tvMiniGame?.isOpen || window.coffeeMiniGame?.isOpen || window.flowerMiniGame?.isOpen);
  },

  closeActiveMiniGames(screenToShow) {
    if (screenToShow !== this.rooms.billboards && window.closeTvMiniGame) {
      window.closeTvMiniGame({ resume: false });
    }

    if (screenToShow !== this.rooms.diner && window.closeCoffeeMiniGame) {
      window.closeCoffeeMiniGame();
    }

    if (screenToShow !== this.rooms.lake && window.closeFlowerMiniGame) {
      window.closeFlowerMiniGame();
    }
  },

  closeMiniGamesFor(screenToShow) {
    this.closeActiveMiniGames(screenToShow);
  },

  showOnly(screenToShow) {
    // Esconde todo y deja visible solo la pantalla que toca.
    this.closeActiveMiniGames(screenToShow);

    this.screens.loading.classList.add("is-hidden");
    this.screens.entry.classList.add("is-hidden");
    this.screens.hub.classList.add("is-hidden");
    Object.values(this.rooms).forEach((screen) => {
      screen.classList.add("is-hidden");
      screen.classList.remove("is-fading-in");
    });
    screenToShow.classList.remove("is-hidden");

    if (["billboards", "diner", "lake"].includes(screenToShow.dataset?.room)) {
      void screenToShow.offsetWidth;
      screenToShow.classList.add("is-fading-in");
    }

    this.currentScreen = screenToShow;
    this.updateTopUi(screenToShow);
    this.saveCurrentScreen(screenToShow);

    const screenEnterHandler = this.screenEnterHandlers.get(screenToShow);

    if (screenEnterHandler) {
      screenEnterHandler();
    }
  },

  showLoadingFrame(frame) {
    this.screens.loadingIcon.src = loadingFrames[frame];
    this.screens.loadingIcon.alt = `Loading ${frame + 1} of ${loadingFrames.length}`;
  },

  getScreenName(screen) {
    if (screen === this.screens.entry) {
      return "entry";
    }

    if (screen === this.screens.hub) {
      return "hub";
    }

    return screen?.dataset?.room || "entry";
  },

  getScreenByName(screenName) {
    if (screenName === "hub") {
      return this.screens.hub;
    }

    if (this.rooms[screenName]) {
      return this.rooms[screenName];
    }

    return this.screens.entry;
  },

  saveCurrentScreen(screen) {
    window.sessionStorage.setItem(this.storageKey, this.getScreenName(screen));
  },

  restoreCurrentScreen() {
    const savedScreenName = window.sessionStorage.getItem(this.storageKey);
    const screenToRestore = this.getScreenByName(savedScreenName);
    this.showOnly(screenToRestore);
  },

  showWithLoading(screenToShow) {
    // Pantalla corta de carga antes de entrar a una sala.
    if (this.isLoading) {
      return;
    }

    this.closeActiveMiniGames(screenToShow);

    this.isLoading = true;
    this.screens.entry.classList.add("is-hidden");
    this.screens.hub.classList.add("is-hidden");
    Object.values(this.rooms).forEach((screen) => screen.classList.add("is-hidden"));
    this.screens.loading.classList.remove("is-hidden");
    this.updateTopUi(this.screens.loading);

    let frame = 0;
    this.showLoadingFrame(frame);

    const loadingTimer = window.setInterval(() => {
      frame += 1;

      if (frame >= loadingFrames.length) {
        window.clearInterval(loadingTimer);
        this.showOnly(screenToShow);
        this.isLoading = false;
        return;
      }

      this.showLoadingFrame(frame);
    }, 140);
  },

  setupExitButton() {
    const exitButton = document.querySelector(".exit-button");

    if (!exitButton) {
      return;
    }

    exitButton.addEventListener("click", () => {
      if (this.currentScreen === this.screens.entry || this.isLoading) {
        return;
      }

      if (this.currentScreen === this.screens.hub) {
        this.showWithLoading(this.screens.entry);
        return;
      }

      this.showWithLoading(this.screens.hub);
    });
  },
};

function setup() {
  archiveApp.screens = {
    entry: document.querySelector(".entry-screen"),
    hub: document.querySelector(".hub-screen"),
    loading: document.querySelector(".loading-screen"),
    loadingIcon: document.querySelector(".loading-icon"),
  };
  archiveApp.currentScreen = archiveApp.screens.entry;

  setupBillboardsScene(archiveApp);
  setupDinerScene(archiveApp);
  setupLakeScene(archiveApp);
  setupFinalScene(archiveApp);
  setupEntryScene(archiveApp);
  setupHubScene(archiveApp);

  // Canvas de p5 para las luciernagas del lago.
  const gameFrameSize = getGameFrameSize();
  const fireflyCanvas = createCanvas(gameFrameSize.width, gameFrameSize.height);
  fireflyCanvas.class("firefly-canvas");
  fireflyCanvas.parent(archiveApp.rooms.lake);
  fireflyCanvasSize = gameFrameSize;
  pixelDensity(1);
  noSmooth();
  createFireflies();

  const gameFrame = document.querySelector(".game-frame");
  if (gameFrame && "ResizeObserver" in window) {
    const frameResizeObserver = new ResizeObserver(syncFireflyCanvasSize);
    frameResizeObserver.observe(gameFrame);
  }

  archiveApp.setupExitButton();
  archiveApp.restoreCurrentScreen();
}

function draw() {
  syncFireflyCanvasSize();
  clear();

  // Dibuja las luciernagas solo cuando se ve el lago.
  if (
    archiveApp.isLoading ||
    archiveApp.currentScreen !== archiveApp.rooms.lake ||
    archiveApp.rooms.lake?.classList.contains("is-hidden")
  ) {
    return;
  }

  updateFireflies();
  drawFireflies();
}

function windowResized() {
  syncFireflyCanvasSize();
}
