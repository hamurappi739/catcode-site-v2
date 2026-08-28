(() => {
  "use strict";

  const copy = {
    ru: {
      navMechanics: "Механики", navFocus: "Фокус", navSkins: "Скины", navPrivacy: "Приватность",
      heroEyebrow: "ДЕСКТОПНОЕ ПРИЛОЖЕНИЕ ДЛЯ WINDOWS, macOS И LINUX",
      heroLead: "Живой кот, который остаётся рядом, пока вы работаете.",
      heroText: "Он печатает вместе с вами, засыпает в паузах, напоминает о воде и разминке, умеет охотиться за курсором и просто делает рабочий стол чуть живее.",
      buyButton: "Получить за 500 ₽", mechanicsButton: "Посмотреть механики", linuxAvailability: "доступно",
      lifetimeLicense: "Бессрочная лицензия", offlineAfterActivation: "После активации работает офлайн",
      mechanicsEyebrow: "МЕХАНИКИ", mechanicsTitle: "Не картинка в углу. Кот живёт в вашем ритме.",
      mechanicsIntro: "CatCode реагирует на понятные события на компьютере, но не читает текст документов и содержимое экрана.",
      mechanicWorkTitle: "Работает рядом", mechanicWorkText: "При активной печати кот оживляется и нажимает клавиши вместе с вами. После паузы спокойно отдыхает.",
      typingTag: "Печать", scrollTag: "Прокрутка", sleepTag: "Сон после бездействия",
      mechanicPlayTitle: "Иногда играет", mechanicPlayText: "Кот гуляет по экрану, прячется у края, танцует и может охотиться за курсором, если включить эту механику.",
      walkTag: "Прогулки", cursorTheftTag: "Кража курсора", danceTag: "Танцы",
      mechanicHuntTitle: "Охотится по вашему жесту", mechanicHuntText: "Включите «Охотиться за курсором», затем быстро проведите курсором влево-вправо рядом с котом. Он присядет и будет следить за целью.",
      huntDefaultTag: "Механика выключена по умолчанию", huntNearTag: "Срабатывает только рядом с котом",
      focusEyebrow: "ФОКУС И ЗАБОТА", focusTitle: "Помнит о паузах, не отвлекая от дела.",
      focusTimerTitle: "Таймер фокуса", focusTimerText: "Рабочие и короткие перерывы в удобном темпе.",
      waterTitle: "Вода и разминка", waterText: "Мягкие напоминания, которые можно настроить или выключить.",
      remindersTitle: "Напоминания", remindersText: "Одноразовые и повторяющиеся задачи, когда важно ничего не забыть.",
      emotionsTitle: "Эмоции", emotionsText: "Кот может злиться, мурчать, радоваться и отвечать на внимание.",
      characterEyebrow: "НЕМНОГО ХАРАКТЕРА", characterTitle: "Закончили задачу? Есть повод потанцевать.",
      characterText: "CatCode умеет отмечать приятные моменты: радоваться, показывать эмоции и включать танец, когда хочется маленькой награды за сделанную работу.",
      looksEyebrow: "ВНЕШНОСТЬ", looksTitle: "Выберите готовый окрас или настройте свой.",
      looksIntro: "В каталоге есть разные коты. В редакторе можно подобрать основной окрас, тени, контур, внутреннюю часть ушей, глаза, нос и рот.",
      looksNote: "Палитра меняет цвет, не ломая глаза, лапы, предметы и анимации.",
      privacyEyebrow: "КОНТРОЛЬ", privacyTitle: "Ваш рабочий стол остаётся вашим.",
      privacyText: "CatCode реагирует на ритм работы, но не читает содержимое документов, кода, переписок или экрана.",
      privacyControlTitle: "Вы управляете механиками", privacyControlText: "Вода, разминка, охота за курсором и игровые реакции включаются отдельно.",
      privacyQuietTitle: "Кот не мешает", privacyQuietText: "Размер, позицию, край экрана и видимость можно настроить.",
      privacyOfflineTitle: "После активации — офлайн", privacyOfflineText: "Приложение продолжает работать без постоянного подключения.",
      buyEyebrow: "CATCODE ДЛЯ WINDOWS, macOS И LINUX", buyTitle: "Один кот. Бессрочная лицензия.", oneComputer: "один компьютер",
      telegramButton: "Написать в Telegram", platformSummary: "Windows 10 / 11, macOS 12+ и Linux.",
      faqEyebrow: "ВОПРОСЫ", faqTitle: "Коротко о главном.",
      faqSystemQuestion: "На какой системе работает CatCode?", faqSystemAnswer: "CatCode работает на Windows 10 / 11, macOS 12 или новее и Linux.",
      faqMechanicsQuestion: "Можно выключить игровые механики?", faqMechanicsAnswer: "Да. Охоту, прогулки и другие реакции можно настраивать отдельно.",
      faqNameQuestion: "Можно изменить имя кота?", faqNameAnswer: "Да. Имя CatCode — имя кота. В настройках можно задать своё имя, которым кот будет к вам обращаться.",
      faqSkinQuestion: "Можно ли выбрать другой окрас?", faqSkinAnswer: "Да. Есть каталог готовых скинов и редактор палитры для собственного цвета.",
      footerTagline: "Живой кот для рабочего стола"
    },
    en: {
      navMechanics: "Mechanics", navFocus: "Focus", navSkins: "Skins", navPrivacy: "Privacy",
      heroEyebrow: "A DESKTOP COMPANION FOR WINDOWS, macOS AND LINUX",
      heroLead: "A living cat that stays close while you work.",
      heroText: "It types with you, sleeps during quiet moments, reminds you to drink water and stretch, chases your cursor, and makes the desktop feel more alive.",
      buyButton: "Get CatCode for 500 ₽", mechanicsButton: "See the mechanics", linuxAvailability: "available",
      lifetimeLicense: "Lifetime license", offlineAfterActivation: "Works offline after activation",
      mechanicsEyebrow: "MECHANICS", mechanicsTitle: "Not a picture in the corner. The cat lives in your rhythm.",
      mechanicsIntro: "CatCode responds to clear computer events without reading your documents or screen content.",
      mechanicWorkTitle: "Works beside you", mechanicWorkText: "When you type, the cat comes alive and presses the keys with you. After a pause, it rests.",
      typingTag: "Typing", scrollTag: "Scrolling", sleepTag: "Sleep after inactivity",
      mechanicPlayTitle: "Plays sometimes", mechanicPlayText: "The cat walks across the screen, hides at the edge, dances, and can chase the cursor when enabled.",
      walkTag: "Walks", cursorTheftTag: "Cursor theft", danceTag: "Dances",
      mechanicHuntTitle: "Hunts on your gesture", mechanicHuntText: "Enable cursor hunting, then make a quick left-right movement near the cat. It crouches and follows the target.",
      huntDefaultTag: "Off by default", huntNearTag: "Triggered near the cat",
      focusEyebrow: "FOCUS AND CARE", focusTitle: "Remembers your breaks without interrupting the work.",
      focusTimerTitle: "Focus timer", focusTimerText: "Work sessions and short breaks at a pace that suits you.",
      waterTitle: "Water and stretching", waterText: "Gentle reminders you can configure or turn off.",
      remindersTitle: "Reminders", remindersText: "One-time and recurring tasks for the things you do not want to forget.",
      emotionsTitle: "Emotions", emotionsText: "The cat can get angry, purr, celebrate, and respond to your attention.",
      characterEyebrow: "A LITTLE PERSONALITY", characterTitle: "Finished a task? Time for a small dance.",
      characterText: "CatCode celebrates the good moments: it can cheer, show emotion, and dance when your work deserves a little reward.",
      looksEyebrow: "APPEARANCE", looksTitle: "Choose a ready-made coat or create your own.",
      looksIntro: "Choose from different cats, or set the coat, shadows, outline, ears, eyes, nose, and mouth in the editor.",
      looksNote: "The palette changes colour without breaking eyes, paws, props, or animation.",
      privacyEyebrow: "CONTROL", privacyTitle: "Your desktop stays yours.",
      privacyText: "CatCode responds to your work rhythm without reading documents, code, conversations, or the screen.",
      privacyControlTitle: "You control the mechanics", privacyControlText: "Water, stretching, cursor hunting, and playful reactions can be enabled separately.",
      privacyQuietTitle: "The cat stays out of the way", privacyQuietText: "Adjust its size, position, screen edge, and visibility.",
      privacyOfflineTitle: "Offline after activation", privacyOfflineText: "The app keeps working without a permanent connection.",
      buyEyebrow: "CATCODE FOR WINDOWS, macOS AND LINUX", buyTitle: "One cat. A lifetime license.", oneComputer: "one computer",
      telegramButton: "Write on Telegram", platformSummary: "Windows 10 / 11, macOS 12+ and Linux.",
      faqEyebrow: "QUESTIONS", faqTitle: "The essentials, briefly.",
      faqSystemQuestion: "Which systems does CatCode support?", faqSystemAnswer: "CatCode supports Windows 10 / 11, macOS 12 or later, and Linux.",
      faqMechanicsQuestion: "Can I turn off the playful mechanics?", faqMechanicsAnswer: "Yes. Hunting, walking, and other reactions can be configured separately.",
      faqNameQuestion: "Can I change the cat's name?", faqNameAnswer: "Yes. CatCode is the cat's name. In settings, choose the name it should use for you.",
      faqSkinQuestion: "Can I choose another coat?", faqSkinAnswer: "Yes. There is a catalogue of ready-made skins and a palette editor for your own colours.",
      footerTagline: "A living cat for your desktop"
    }
  };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const videos = [...document.querySelectorAll("video")];
  function syncMotionPreference() {
    videos.forEach((video) => {
      if (reducedMotion.matches) video.pause();
      else video.play().catch(() => {});
    });
  }

  function setLanguage(language) {
    const selected = copy[language] ? language : "ru";
    document.documentElement.lang = selected;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = copy[selected][element.dataset.i18n];
      if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === selected;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    localStorage.setItem("catcode-site-language", selected);
  }

  syncMotionPreference();
  reducedMotion.addEventListener?.("change", syncMotionPreference);
  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });
  setLanguage(localStorage.getItem("catcode-site-language") || "ru");

  const buyPanel = document.querySelector(".buy-panel");
  document.querySelectorAll('a[href="#buy"]').forEach((link) => {
    link.addEventListener("click", () => {
      window.setTimeout(() => {
        if (!buyPanel) return;
        buyPanel.classList.remove("is-targeted");
        void buyPanel.offsetWidth;
        buyPanel.classList.add("is-targeted");
        window.setTimeout(() => buyPanel.classList.remove("is-targeted"), 1400);
      }, 450);
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
})();
