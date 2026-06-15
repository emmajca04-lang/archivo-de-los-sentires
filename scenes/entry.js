function setupEntryScene(app) {
  const logoButton = document.querySelector(".entry-logo-button");

  if (!logoButton) {
    return;
  }

  app.bindHoverImage(logoButton);

  logoButton.addEventListener("click", () => {
    app.showWithLoading(app.screens.hub);
  });
}
