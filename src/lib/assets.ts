// Самодостаточный набор ассетов сайта. Файлы собраны из актуальных v6-кадров
// приложения, поэтому сайт больше не зависит от старого CDN-набора.
const SITE = "/assets";

export const A = {
  logo: `${SITE}/catcode-v6-logo.png`,
  logoMark: `${SITE}/catcode-logo.png`,
  flagRu: `${SITE}/flags/flag-ru.png`,
  flagUs: `${SITE}/flags/flag-us.png`,
  purrAudio: `${SITE}/purring.m4a`,
  cat: {
    idle: `${SITE}/cat-idle.png`,
    typing: `${SITE}/cat-typing.png`,
    pressLeft: `${SITE}/cat-typing.png`,
    pressRight: `${SITE}/cat-typing.png`,
    sleep: `${SITE}/cat-sleep.png`,
    scroll: `${SITE}/cat-scroll.png`,
    walk: `${SITE}/cat-walk.png`,
    hunt: `${SITE}/cat-hunt.png`,
    dance: `${SITE}/cat-dance.png`,
    jumpStart: `${SITE}/cat-dance.png`,
    jumpIng: `${SITE}/cat-dance.png`,
  },
  video: {
    typing: `${SITE}/typing.webm`,
    sleep: `${SITE}/sleep.webm`,
    scroll: `${SITE}/scroll-fixed.webm`,
    walk: `${SITE}/walk.webm`,
    hunt: `${SITE}/hunt.webm`,
    dance: `${SITE}/dance.webm`,
    skins: `${SITE}/skins.webm`,
  },
} as const;

export const TELEGRAM_URL = "https://t.me/catcodeapp";

export type CatPalette = {
  asset?: string;
  fur?: string;
  outline?: string;
  eye?: string;
  eyeL?: string;
  eyeR?: string;
  eyeBg?: string;
  pupil?: number; // процент масштаба зрачка
};
