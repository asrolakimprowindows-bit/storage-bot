(() => {
  const tilt = document.querySelector("[data-tilt]");
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!tilt) {
    return;
  }

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = 0;

  const render = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    tilt.style.transform =
      `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) ` +
      `rotateX(${(-currentY * 0.12).toFixed(2)}deg) rotateY(${(currentX * 0.12).toFixed(2)}deg)`;

    animationFrame = window.requestAnimationFrame(render);
  };

  const start = () => {
    const canTilt = !motionQuery.matches && window.matchMedia("(pointer: fine)").matches;

    if (canTilt && !animationFrame) {
      animationFrame = window.requestAnimationFrame(render);
    }
  };

  const stop = () => {
    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }

    animationFrame = 0;
    targetX = 0;
    targetY = 0;
    currentX = 0;
    currentY = 0;
    tilt.style.transform = "";
  };

  window.addEventListener("pointermove", (event) => {
    const horizontal = event.clientX / window.innerWidth - 0.5;
    const vertical = event.clientY / window.innerHeight - 0.5;

    targetX = horizontal * 18;
    targetY = vertical * 14;
  }, { passive: true });

  window.addEventListener("blur", stop);

  motionQuery.addEventListener("change", () => {
    if (motionQuery.matches) {
      stop();
    } else {
      start();
    }
  });

  start();
})();