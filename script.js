(() => {
  "use strict";

  const template = document.getElementById("cat-template");
  const purr = document.getElementById("purr-audio");
  const stageCat = document.querySelector(".cat-host-stage");
  const bubble = document.getElementById("cat-bubble");
  const catAssets = {
    idle: "assets/cat-misty-idle.svg",
    purring: "assets/cat-misty-purring.svg",
    sleep: "assets/cat-misty-sleep.svg",
    attention: "assets/cat-misty-attention.svg",
  };
  const stateText = {
    idle: "\u042f \u0440\u044f\u0434\u043e\u043c",
    typing: "\u0412\u043e\u0442 \u044d\u0442\u043e \u0442\u0435\u043c\u043f",
    sleep: "\u0422\u0438\u0448\u0435. \u042f \u0441\u043f\u043b\u044e.",
    attention: "\u041f\u043e\u0433\u043b\u0430\u0434\u044c \u043c\u0435\u043d\u044f, \u043f\u043e\u0436\u0430\u043b\u0443\u0439\u0441\u0442\u0430",
  };

  document.querySelectorAll(".cat-host").forEach((host) => {
    host.append(template.content.cloneNode(true));
  });

  function setCatAsset(host, state) {
    const image = host.querySelector(".cat-object");
    if (!image) return;
    const asset = catAssets[state] || catAssets.idle;
    if (!image.src.endsWith(asset)) image.src = asset;
  }

  function setState(host, state) {
    host.dataset.catState = state;
    setCatAsset(host, state === "typing" ? "idle" : state);
  }

  function stopPurring() {
    document.querySelectorAll(".cat-host").forEach((host) => {
      host.classList.remove("is-petted");
      if (host.dataset.catState === "idle") setCatAsset(host, "idle");
    });
    if (purr) purr.pause();
  }

  let purrStopTimer = null;
  function startPurring(host) {
    if (host.dataset.catState !== "idle") return;
    host.classList.add("is-petted");
    setCatAsset(host, "purring");
    if (host === stageCat && bubble) {
      bubble.textContent = "\u041c\u0440\u0440\u0440. \u0415\u0449\u0451 \u043d\u0435\u043c\u043d\u043e\u0433\u043e.";
    }
    if (purr?.paused) {
      purr.currentTime = 0;
      purr.play().catch(() => {});
    }
    window.clearTimeout(purrStopTimer);
    purrStopTimer = window.setTimeout(stopPurring, 420);
  }

  document.querySelectorAll(".cat-host").forEach((host) => {
    host.addEventListener("pointermove", () => startPurring(host));
    host.addEventListener("pointerdown", () => startPurring(host));
    host.addEventListener("pointerleave", () => {
      window.clearTimeout(purrStopTimer);
      purrStopTimer = window.setTimeout(stopPurring, 420);
    });
  });

  document.querySelectorAll(".state-button").forEach((button) => {
    button.addEventListener("click", () => {
      const state = button.dataset.state;
      window.clearTimeout(purrStopTimer);
      stopPurring();
      document.querySelectorAll(".state-button").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      if (stageCat) setState(stageCat, state);
      if (bubble) bubble.textContent = stateText[state] || stateText.idle;
    });
  });

  const completeTaskButton = document.getElementById("complete-task");
  const completionStage = document.querySelector(".completion-stage");
  const completionCat = document.getElementById("completion-cat");
  const agentStatus = document.getElementById("agent-status");
  const agentMessage = document.getElementById("agent-message");
  let completionTimers = [];

  function playCompletionJump() {
    if (!completeTaskButton || !completionStage || !completionCat) return;
    completionTimers.forEach((timer) => window.clearTimeout(timer));
    completionTimers = [];
    completeTaskButton.disabled = true;
    completionStage.classList.add("is-completing");
    agentStatus?.classList.add("is-complete");
    if (agentStatus) agentStatus.textContent = "Задача выполнена";
    if (agentMessage) agentMessage.textContent = "Задача выполнена!";

    const frames = [
      ["start", 0, "0px"],
      ["start", 140, "0px"],
      ["ing", 300, "-16px"],
      ["ing", 500, "-26px"],
      ["ing", 660, "-24px"],
      ["start", 860, "-5px"],
      ["start", 1040, "0px"],
      ["ing", 1240, "-16px"],
      ["ing", 1440, "-26px"],
      ["ing", 1600, "-24px"],
      ["start", 1800, "-5px"],
      ["start", 1980, "0px"],
      [null, 2220, "0px"],
    ];

    frames.forEach(([frame, delay, y]) => {
      completionTimers.push(window.setTimeout(() => {
        completionStage.style.setProperty("--jump-y", y);
        if (frame) {
          completionCat.src = frame === "start" ? "assets/cat-misty-jump-start.svg" : "assets/cat-misty-jump-ing.svg";
          return;
        }
        completionCat.src = "assets/cat-misty-idle.svg";
        completionStage.classList.remove("is-completing");
        completeTaskButton.disabled = false;
        completeTaskButton.textContent = "Повторить анимацию";
      }, delay));
    });
  }

  completeTaskButton?.addEventListener("click", playCompletionJump);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
})();
