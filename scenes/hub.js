function setupHubScene(app) {
  const doorButtons = document.querySelectorAll("[data-room-target]");
  const hubCaption = app.screens.hub.querySelector(".hub-caption");
  const hubCaptionText = hubCaption?.querySelector("span");
  const finalDoorButton = app.screens.hub.querySelector('[data-room-target="final"]');
  const finalDoorLock = finalDoorButton?.querySelector(".door-lock-icon");
  const requiredRooms = ["lake", "diner", "billboards"];
  const visitedStorageKey = "archivoSentires.visitedRooms";
  const defaultHubCaptionText = hubCaptionText?.textContent || "Elige un archivo.";
  const lockedDoorText = "Esta puerta aún no se puede abrir.";
  const captionFadeDuration = 420;
  const lockedMessageDuration = 4000;
  const visitedRooms = new Set(readVisitedRooms());
  let captionTimer = null;
  let captionFadeTimer = null;
  let lockedCaptionTimer = null;

  function readVisitedRooms() {
    try {
      const savedRooms = JSON.parse(window.sessionStorage.getItem(visitedStorageKey) || "[]");
      return Array.isArray(savedRooms) ? savedRooms : [];
    } catch {
      return [];
    }
  }

  function saveVisitedRooms() {
    window.sessionStorage.setItem(visitedStorageKey, JSON.stringify([...visitedRooms]));
  }

  function isFinalRoomUnlocked() {
    return requiredRooms.every((roomName) => visitedRooms.has(roomName));
  }

  function updateFinalDoorState() {
    if (!finalDoorButton) {
      return;
    }

    const isUnlocked = isFinalRoomUnlocked();
    finalDoorButton.classList.toggle("is-locked", !isUnlocked);
    finalDoorButton.classList.toggle("is-hover-disabled", !isUnlocked);
    finalDoorButton.setAttribute("aria-disabled", String(!isUnlocked));

    if (finalDoorLock) {
      finalDoorLock.classList.toggle("is-hidden", isUnlocked);
    }
  }

  function clearCaptionTimers() {
    if (captionTimer) {
      window.clearTimeout(captionTimer);
      captionTimer = null;
    }

    if (lockedCaptionTimer) {
      window.clearTimeout(lockedCaptionTimer);
      lockedCaptionTimer = null;
    }

    if (captionFadeTimer) {
      window.clearTimeout(captionFadeTimer);
      captionFadeTimer = null;
    }
  }

  function showHubCaption(text) {
    if (!hubCaption || !hubCaptionText) {
      return;
    }

    hubCaptionText.textContent = text;
    hubCaption.classList.remove("is-fading-out");
    hubCaption.classList.remove("is-hidden");
  }

  function scheduleDefaultHubCaption(delay = 1000) {
    clearCaptionTimers();

    captionTimer = window.setTimeout(() => {
      if (app.currentScreen === app.screens.hub) {
        showHubCaption(defaultHubCaptionText);
      }
    }, delay);
  }

  function hideHubCaption({ restoreDefault = false, defaultDelay = 250 } = {}) {
    clearCaptionTimers();

    if (hubCaption) {
      if (hubCaption.classList.contains("is-hidden")) {
        hubCaption.classList.remove("is-fading-out");
        if (restoreDefault) {
          scheduleDefaultHubCaption(defaultDelay);
        }
        return;
      }

      hubCaption.classList.add("is-fading-out");

      captionFadeTimer = window.setTimeout(() => {
        hubCaption.classList.add("is-hidden");
        hubCaption.classList.remove("is-fading-out");
        captionFadeTimer = null;

        if (restoreDefault) {
          scheduleDefaultHubCaption(defaultDelay);
        }
      }, captionFadeDuration);
    }
  }

  function showLockedDoorHint() {
    clearCaptionTimers();
    showHubCaption(lockedDoorText);

    lockedCaptionTimer = window.setTimeout(() => {
      lockedCaptionTimer = null;
      hideHubCaption({ restoreDefault: true });
    }, lockedMessageDuration);
  }

  app.isFinalRoomUnlocked = isFinalRoomUnlocked;
  updateFinalDoorState();

  app.onScreenEnter(app.screens.hub, () => {
    updateFinalDoorState();
    hideHubCaption({ restoreDefault: true, defaultDelay: 1000 });
  });

  requiredRooms.forEach((roomName) => {
    app.onScreenEnter(app.rooms[roomName], () => {
      visitedRooms.add(roomName);
      saveVisitedRooms();
      updateFinalDoorState();
    });
  });

  doorButtons.forEach((button) => {
    app.bindHoverImage(button);

    button.addEventListener("click", () => {
      const targetRoom = button.dataset.roomTarget;
      const roomScreen = app.rooms[targetRoom];

      if (targetRoom === "final" && !isFinalRoomUnlocked()) {
        showLockedDoorHint();
        return;
      }

      if (roomScreen) {
        hideHubCaption();
        app.showWithLoading(roomScreen);
      }
    });
  });
}
