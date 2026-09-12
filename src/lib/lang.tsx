import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "ru" | "en";

const dict = {
  ru: {
    nav: { demo: "Демо", rhythm: "Ритм", play: "Игра", focus: "Фокус", skins: "Скины", faq: "FAQ" },
    headerCta: "Забрать кота",

    heroEyebrow: "Десктопный компаньон — Windows · macOS · Linux",
    heroTitleA: "Кот, который",
    heroTitleB: "живёт",
    heroTitleC: "на вашем рабочем столе",
    heroLead:
      "CatCode печатает вместе с вами, засыпает в паузах, следит взглядом за курсором, напоминает о воде и разминке — и просто делает рабочий стол чуть живее.",
    heroPrimary: "Забрать кота — 500 ₽",
    heroSecondary: "Потрогать демо",
    heroBadge1: "Бессрочная лицензия",
    heroBadge2: "Офлайн после активации",
    heroChipPomodoro: "Фокус",
    heroChipBreak: "до перерыва",
    heroChipWater: "Пора воды",
    heroHint: "Кот следит за вашим курсором — поводите мышью",

    demoEyebrow: "Живая демонстрация",
    demoTitle: "Это не видео. Это рабочий стол, и кот уже на нём.",
    demoLead:
      "Настоящая графика и анимации из приложения. Печатайте в редакторе, листайте заметки, включите музыку — кот отреагирует по-своему.",
    demoDesktopLabel: "рабочий стол",
    demoEditorTitle: "main.ts — редактор",
    demoEditorHint: "Кликните сюда и печатайте — кот будет нажимать клавиши вместе с вами",
    demoNotesTitle: "Заметки",
    demoNotesHint: "Прокрутите список колёсиком",
    demoPlayerTitle: "Плеер",
    demoTrack: "lo-fi fur focus",
    demoBtnPet: "Погладить",
    demoBtnWater: "Напомнить о воде",
    demoBtnStretch: "Разминка",
    demoBtnSteal: "Украсть курсор",
    demoBtnStealBusy: "Кот уже несёт курсор…",
    demoHuntLabel: "Охота за курсором",
    demoHuntNote: "по умолчанию выключена — как в приложении",
    demoHuntHint: "Быстро поводите курсором влево-вправо рядом с котом",
    demoSleepNote: "Не двигайте мышью ~15 секунд — кот уснёт и покажет ZZZ",
    demoToastWater: "Пора воды. Кот показывает пример.",
    demoToastStretch: "Пять минут разминки — спина скажет спасибо.",
    demoToastFocusDone: "Фокус закончен. Короткий перерыв!",
    demoPurr: "мр-р-р…",
    demoStolenHint: "Кот утащил курсор. Сейчас вернёт (почти всегда).",

    rhythmEyebrow: "Механики",
    rhythmTitle: "Не картинка в углу. Кот живёт в вашем ритме.",
    rhythmLead:
      "CatCode реагирует на понятные события на компьютере, но не читает текст документов и содержимое экрана.",
    rhythm1t: "Печатает вместе с вами",
    rhythm1d:
      "Пока идёт набор, кот оживляется и нажимает клавиши в такт. Пауза — и он спокойно отдыхает рядом.",
    rhythm1tags: ["Печать", "Пауза", "Отдых"],
    rhythm2t: "Следит взглядом",
    rhythm2d:
      "Зрачки следуют за курсором по-настоящему — это тот самый механизм из приложения. Проведите мышью над котом на этом сайте.",
    rhythm2tags: ["Курсор", "Взгляд"],
    rhythm3t: "Засыпает, когда вы молчите",
    rhythm3d: "Нет активности — кот сворачивается и показывает ZZZ. Первое движение мыши будит его.",
    rhythm3tags: ["Сон", "ZZZ", "Пробуждение"],
    rhythm4t: "Чувствует прокрутку",
    rhythm4d: "Листаете длинный документ — у кота есть отдельная реакция на прокрутку.",
    rhythm4tags: ["Скролл"],
    rhythmVideoNote: "записано в приложении",

    playEyebrow: "Игровые механики",
    playTitle: "Иногда он играет.",
    playLead: "Всё игровое включается отдельно и никогда не навязывается. Кот знает, когда вы заняты.",
    play1t: "Прогулки",
    play1d: "Гуляет по экрану, прячется у края и возвращается, когда вы снова свободны.",
    play2t: "Охота за курсором",
    play2d:
      "Выключена по умолчанию. Быстро проведите курсором влево-вправо рядом с котом — он присядет и начнёт следить за целью.",
    play2tags: ["выкл. по умолчанию", "срабатывает рядом с котом"],
    play3t: "Кража курсора",
    play3d: "Кот может схватить курсор и ненадолго унести его в сторону, а затем вернуть обратно.",
    play3tags: ["выкл. по умолчанию", "можно включить отдельно"],
    play4t: "Танцы",
    play4d: "Закончили задачу? Есть повод потанцевать. Кот умеет отмечать маленькие победы.",
    playTryHint: "попробуйте в демо выше",

    careEyebrow: "Фокус и забота",
    careTitle: "Помнит о паузах, не отвлекая от дела.",
    carePomodoroT: "Pomodoro-фокус",
    carePomodoroD: "Рабочие отрезки и короткие перерывы в удобном темпе. Таймер живёт рядом с котом.",
    carePomodoroFocus: "Фокус",
    carePomodoroBreak: "Перерыв",
    careStart: "Старт",
    carePause: "Пауза",
    careReset: "Сброс",
    careWaterT: "Вода и разминка",
    careWaterD: "Мягкие напоминания попить и размяться. Настраиваются по интервалу — или выключаются полностью.",
    careRemindT: "Напоминания",
    careRemindD: "Одноразовые и повторяющиеся задачи — чтобы важное не забывалось.",
    careRemindOnce: "одноразовое",
    careRemindRepeat: "повторяется",
    careEmotionT: "Эмоции",
    careEmotionD: "Кот злится, мурчит, радуется и отвечает на внимание.",
    careEmotionBtn: "Послушать мурчание",
    careEmotionPlaying: "мурчит…",
    careEmotionAudioNote: "звук из приложения",

    skinsEyebrow: "Внешность",
    skinsTitle: "Выберите готовый окрас для своего кота.",
    skinsLead: "В приложении есть каталог готовых скинов. Выберите вариант — и кот будет выглядеть именно так.",
    skinsNote: "Все варианты взяты из актуального каталога CatCode.",
    skinsEditorTitle: "Каталог актуальных скинов",
    skinsFur: "Шерсть",
    skinsOutline: "Контур",
    skinsEyes: "Глаза",
    skinsOdd: "Разные глаза",
    skinsEyeL: "Левый",
    skinsEyeR: "Правый",
    skinsPupil: "Зрачки",
    skinsReset: "Вернуть Snowball",
    skinsCatalog: "каталог скинов в приложении",
    skinsPresetLabel: "готовые скины",
    skinsParts: ["шерсть", "тени", "контур", "уши", "глаза", "нос и рот"],

    privacyEyebrow: "Приватность",
    privacyTitle: "Ваш рабочий стол остаётся вашим.",
    privacyText:
      "CatCode реагирует на ритм работы, но не читает содержимое документов, кода, переписок или экрана.",
    privacySeesT: "Кот замечает",
    privacySees: ["ритм печати и паузы", "прокрутку", "время бездействия", "включённые вами механики"],
    privacyNotT: "Кот не читает",
    privacyNot: ["текст документов и кода", "содержимое окон и экрана", "переписку и сообщения", "личные данные"],
    privacyControlT: "Вы управляете механиками",
    privacyControlD: "Вода, разминка, охота за курсором и игровые реакции включаются отдельно.",
    privacyQuietT: "Кот не мешает",
    privacyQuietD: "Размер, позицию, край экрана и видимость можно настроить.",
    privacyQuietDemoSize: "Размер",
    privacyMech: ["вода", "разминка", "охота", "игры"],
    privacyOfflineT: "Офлайн после активации",
    privacyOfflineD: "Приложение продолжает работать без постоянного подключения.",

    platformsEyebrow: "Платформы",
    platformsTitle: "Один кот. Все ваши системы.",
    platformWin: "Windows 10 / 11",
    platformMac: "macOS 12 и новее",
    platformLinux: "доступно",

    ctaEyebrow: "CatCode для Windows, macOS и Linux",
    ctaTitle: "Один кот. Бессрочная лицензия.",
    ctaPrice: "500 ₽",
    ctaPer: "один компьютер",
    ctaButton: "Написать в Telegram",
    ctaNote: "Покупка и активация — в Telegram",

    faqEyebrow: "FAQ",
    faqTitle: "Коротко о главном.",
    faq: [
      {
        q: "На каких системах работает CatCode?",
        a: "На Windows 10 / 11, macOS 12 или новее и Linux.",
      },
      {
        q: "Можно выключить игровые механики?",
        a: "Да. Охота, прогулки, кража курсора и другие реакции настраиваются отдельно — можно оставить только спокойного кота.",
      },
      {
        q: "Можно изменить имя кота?",
        a: "Да. CatCode — это имя кота. В настройках можно задать своё, и кот будет обращаться к вам по нему.",
      },
      {
        q: "Можно выбрать другой окрас?",
        a: "Да. В приложении есть каталог готовых скинов, которые можно выбрать в настройках.",
      },
      {
        q: "Нужен ли интернет?",
        a: "Только для активации. После неё приложение работает офлайн.",
      },
    ],

    footerTagline: "Живой кот для рабочего стола",
    footerAlt: "Альтернативная концепция сайта",
    footerRights: "сделано с настоящими ассетами приложения",
  },

  en: {
    nav: { demo: "Demo", rhythm: "Rhythm", play: "Play", focus: "Focus", skins: "Skins", faq: "FAQ" },
    headerCta: "Get the cat",

    heroEyebrow: "Desktop companion — Windows · macOS · Linux",
    heroTitleA: "A cat that",
    heroTitleB: "lives",
    heroTitleC: "on your desktop",
    heroLead:
      "CatCode types with you, sleeps during quiet moments, watches your cursor, reminds you to drink and stretch — and simply makes the desktop feel alive.",
    heroPrimary: "Get CatCode — 500 ₽",
    heroSecondary: "Try the live demo",
    heroBadge1: "Lifetime license",
    heroBadge2: "Offline after activation",
    heroChipPomodoro: "Focus",
    heroChipBreak: "until break",
    heroChipWater: "Time to drink",
    heroHint: "The cat is watching your cursor — move the mouse",

    demoEyebrow: "Live demonstration",
    demoTitle: "Not a video. A desktop — and the cat is already on it.",
    demoLead:
      "Real artwork and animations from the app. Type in the editor, scroll the notes, play some music — the cat will react.",
    demoDesktopLabel: "desktop",
    demoEditorTitle: "main.ts — editor",
    demoEditorHint: "Click here and type — the cat presses the keys with you",
    demoNotesTitle: "Notes",
    demoNotesHint: "Scroll the list with your wheel",
    demoPlayerTitle: "Player",
    demoTrack: "lo-fi fur focus",
    demoBtnPet: "Pet the cat",
    demoBtnWater: "Water reminder",
    demoBtnStretch: "Stretch",
    demoBtnSteal: "Steal the cursor",
    demoBtnStealBusy: "The cat is carrying it…",
    demoHuntLabel: "Cursor hunting",
    demoHuntNote: "off by default — just like in the app",
    demoHuntHint: "Shake the cursor left-right near the cat",
    demoSleepNote: "Don't move the mouse for ~15s — the cat falls asleep and shows ZZZ",
    demoToastWater: "Time to drink. The cat leads by example.",
    demoToastStretch: "Five minutes of stretching. Your back says thanks.",
    demoToastFocusDone: "Focus complete. Short break!",
    demoPurr: "purr-r-r…",
    demoStolenHint: "The cat took your cursor. It'll be back (almost always).",

    rhythmEyebrow: "Mechanics",
    rhythmTitle: "Not a picture in a corner. The cat lives in your rhythm.",
    rhythmLead: "CatCode responds to clear computer events without reading your documents or screen content.",
    rhythm1t: "Types with you",
    rhythm1d: "While you type, the cat comes alive and presses the keys with you. Pause — and it calmly rests.",
    rhythm1tags: ["Typing", "Pause", "Rest"],
    rhythm2t: "Watches your cursor",
    rhythm2d:
      "The pupils truly follow the cursor — the very mechanism from the app. Move your mouse over the cat on this page.",
    rhythm2tags: ["Cursor", "Gaze"],
    rhythm3t: "Sleeps when you're quiet",
    rhythm3d: "No activity — the cat curls up and shows ZZZ. The first mouse movement wakes it.",
    rhythm3tags: ["Sleep", "ZZZ", "Wake"],
    rhythm4t: "Feels the scroll",
    rhythm4d: "Scrolling a long document? The cat has its own reaction to that.",
    rhythm4tags: ["Scroll"],
    rhythmVideoNote: "recorded in the app",

    playEyebrow: "Play mechanics",
    playTitle: "Sometimes it plays.",
    playLead: "Everything playful is optional and never in the way. The cat knows when you're busy.",
    play1t: "Walks",
    play1d: "Wanders across the screen, hides at the edge and comes back when you're free.",
    play2t: "Cursor hunting",
    play2d:
      "Off by default. Shake the cursor left-right near the cat — it crouches and locks onto the target.",
    play2tags: ["off by default", "triggers near the cat"],
    play3t: "Cursor theft",
    play3d: "The cat can grab the cursor, carry it away for a moment, and bring it back.",
    play3tags: ["off by default", "enabled separately"],
    play4t: "Dancing",
    play4d: "Finished a task? Time for a small dance. The cat loves celebrating tiny victories.",
    playTryHint: "try it in the demo above",

    careEyebrow: "Focus & care",
    careTitle: "Remembers your breaks without interrupting the work.",
    carePomodoroT: "Pomodoro focus",
    carePomodoroD: "Work sessions and short breaks at a comfortable pace. The timer lives next to the cat.",
    carePomodoroFocus: "Focus",
    carePomodoroBreak: "Break",
    careStart: "Start",
    carePause: "Pause",
    careReset: "Reset",
    careWaterT: "Water & stretching",
    careWaterD: "Gentle reminders to drink and stretch. Configurable — or turn them off completely.",
    careRemindT: "Reminders",
    careRemindD: "One-time and recurring tasks so nothing important is forgotten.",
    careRemindOnce: "one-time",
    careRemindRepeat: "recurring",
    careEmotionT: "Emotions",
    careEmotionD: "The cat gets grumpy, purrs, celebrates and responds to your attention.",
    careEmotionBtn: "Play the purr",
    careEmotionPlaying: "purring…",
    careEmotionAudioNote: "sound from the app",

    skinsEyebrow: "Appearance",
    skinsTitle: "Choose a ready-made coat for your cat.",
    skinsLead: "The app includes a catalog of ready-made skins. Pick a variant and see the cat in that look.",
    skinsNote: "Every option comes from the current CatCode catalog.",
    skinsEditorTitle: "Current skin catalog",
    skinsFur: "Fur",
    skinsOutline: "Outline",
    skinsEyes: "Eyes",
    skinsOdd: "Odd eyes",
    skinsEyeL: "Left",
    skinsEyeR: "Right",
    skinsPupil: "Pupils",
    skinsReset: "Reset palette",
    skinsCatalog: "skin catalog inside the app",
    skinsPresetLabel: "ready-made skins",
    skinsParts: ["fur", "shadows", "outline", "ears", "eyes", "nose & mouth"],

    privacyEyebrow: "Privacy",
    privacyTitle: "Your desktop stays yours.",
    privacyText:
      "CatCode responds to your work rhythm — it does not read documents, code, chats or the screen.",
    privacySeesT: "The cat notices",
    privacySees: ["typing rhythm and pauses", "scrolling", "idle time", "the mechanics you enable"],
    privacyNotT: "The cat never reads",
    privacyNot: ["document and code text", "window and screen content", "chats and messages", "personal data"],
    privacyControlT: "You control the mechanics",
    privacyControlD: "Water, stretching, cursor hunting and playful reactions are enabled separately.",
    privacyQuietT: "The cat stays out of the way",
    privacyQuietD: "Size, position, screen edge and visibility are all adjustable.",
    privacyQuietDemoSize: "Size",
    privacyMech: ["water", "stretch", "hunt", "play"],
    privacyOfflineT: "Offline after activation",
    privacyOfflineD: "The app keeps working without a permanent connection.",

    platformsEyebrow: "Platforms",
    platformsTitle: "One cat. All your systems.",
    platformWin: "Windows 10 / 11",
    platformMac: "macOS 12 or newer",
    platformLinux: "available",

    ctaEyebrow: "CatCode for Windows, macOS and Linux",
    ctaTitle: "One cat. A lifetime license.",
    ctaPrice: "500 ₽",
    ctaPer: "one computer",
    ctaButton: "Write on Telegram",
    ctaNote: "Purchase and activation — via Telegram",

    faqEyebrow: "FAQ",
    faqTitle: "The essentials, briefly.",
    faq: [
      {
        q: "Which systems run CatCode?",
        a: "Windows 10 / 11, macOS 12 or newer, and Linux.",
      },
      {
        q: "Can I turn the playful mechanics off?",
        a: "Yes. Hunting, walks, cursor theft and other reactions are configured separately — keep just the calm cat if you like.",
      },
      {
        q: "Can I rename the cat?",
        a: "Yes. CatCode is the cat's name. Set your own in settings and the cat will address you by it.",
      },
      {
        q: "Can I pick a different coat?",
        a: "Yes. The app includes a catalog of ready-made skins you can choose in settings.",
      },
      {
        q: "Does it need the internet?",
        a: "Only for activation. After that the app works offline.",
      },
    ],

    footerTagline: "A living cat for your desktop",
    footerAlt: "An alternative site concept",
    footerRights: "built with the app's real assets",
  },
} as const;

export type Copy = (typeof dict)["ru"];

type LangCtx = { lang: Lang; t: Copy; setLang: (l: Lang) => void };
const Ctx = createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem("cc-lang");
      return saved === "en" ? "en" : "ru";
    } catch {
      return "ru";
    }
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("cc-lang", lang);
    } catch {
      /* noop */
    }
  }, [lang]);

  const value: LangCtx = { lang, t: dict[lang] as Copy, setLang };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useLang outside provider");
  return ctx;
}
