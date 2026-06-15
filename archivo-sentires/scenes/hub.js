function setupHubScene(app) {
  const doorButtons = document.querySelectorAll("[data-room-target]");
  const hubCaption = app.screens.hub.querySelector(".hub-caption");
  const captionFadeDuration = 420;
  let captionTimer = null;
  let captionFadeTimer = null;

  function hideHubCaption() {
    if (captionTimer) {
      window.clearTimeout(captionTimer);
      captionTimer = null;
    }

    if (hubCaption) {
      if (captionFadeTimer) {
        window.clearTimeout(captionFadeTimer);
        captionFadeTimer = null;
      }

      if (hubCaption.classList.contains("is-hidden")) {
        hubCaption.classList.remove("is-fading-out");
        return;
      }

      hubCaption.classList.add("is-fading-out");

      captionFadeTimer = window.setTimeout(() => {
        hubCaption.classList.add("is-hidden");
        hubCaption.classList.remove("is-fading-out");
        captionFadeTimer = null;
      }, captionFadeDuration);
    }
  }

  app.onScreenEnter(app.screens.hub, () => {
    hideHubCaption();

    captionTimer = window.setTimeout(() => {
      if (app.currentScreen === app.screens.hub && hubCaption) {
        hubCaption.classList.remove("is-fading-out");
        hubCaption.classList.remove("is-hidden");
      }
    }, 1000);
  });

  doorButtons.forEach((button) => {
    app.bindHoverImage(button);

    button.addEventListener("click", () => {
      const targetRoom = button.dataset.roomTarget;
      const roomScreen = app.rooms[targetRoom];

      if (roomScreen) {
        hideHubCaption();
        app.showWithLoading(roomScreen);
      }
    });
  });
}
