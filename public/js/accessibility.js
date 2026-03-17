(function () {
  const enabled = localStorage.getItem("dyslexicFont") === "true";

  if (enabled) {
    $("body").addClass("dyslexic-font");
  }
})();