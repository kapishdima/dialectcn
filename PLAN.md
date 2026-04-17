Название проекта: dialectcn

Основные требования
1. Приложение должно быть хорошо оптимзируемым
2. Минималистичный дизайн - используем shadcn/ui
3. Не делаем ручных html тегов где это возможно - используем shadcn/ui , например, вместо button - используем Button, для полей ввода - Field>Label+Input, для карточек Card и т.д используем shadcn skills и shadcn docs для получение структуры и информации

Веб-приложение с коллекций заранее созданных shadcn/presets (https://ui.shadcn.com/docs/changelog/2026-03-cli-v4#introducing---preset)
Коллекции генерируюся рандом с помощью shadcn/presets generateRandomPreset, preset это base62 code который может encode/decord с помощью shadcn/presets

Я хочу добавить коллекции brand presets - пресеты которые по стилю похожи на популярные бренды - vercel, claude, codex, linear и т.д
Пресеты можно лайкать
Пресеты должны иметь кнопки copy preset code, copy shadcn init command, link to shadcn/create page

Реф: tweakcn - показываем цвета, шрифты, закругления на карточках 

Пользователи должны иметь возможность добавлять свои пресеты с помощью формы, это значит что должна быть БД с списком всех пресетов, но нужно помечать пресеты из community, brand пресеты и сгенерированые рандомно

Пересет это просто base62 код которые декодируется в config

```
export type PresetConfig = {
  style: (typeof PRESET_STYLES)[number]
  baseColor: (typeof PRESET_BASE_COLORS)[number]
  theme: (typeof PRESET_THEMES)[number]
  chartColor?: (typeof PRESET_CHART_COLORS)[number]
  iconLibrary: (typeof PRESET_ICON_LIBRARIES)[number]
  font: (typeof PRESET_FONTS)[number]
  fontHeading: (typeof PRESET_FONT_HEADINGS)[number]
  radius: (typeof PRESET_RADII)[number]
  menuAccent: (typeof PRESET_MENU_ACCENTS)[number]
  menuColor: (typeof PRESET_MENU_COLORS)[number]
}

```

Это значит что нам еще нужно генерировать css который подставлять на карточку, внутри страницы и т.д. Я нашел в исходниках shadcn вот такие функции, можно попробовать их использовать - если можешь поищи еще

```
function buildCssRule(selector: string, cssVars?: Record<string, string>) {
  const declarations = Object.entries(cssVars ?? {})
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n")

  if (!declarations) {
    return `${selector} {}\n`
  }

  return `${selector} {\n${declarations}\n}\n`
}

function buildThemeCssText(cssVars: RegistryThemeCssVars) {
  return [
    buildCssRule(":root", {
      ...(cssVars.theme ?? {}),
      ...(cssVars.light ?? {}),
    }),
    buildCssRule(".dark", cssVars.dark),
  ].join("\n")
}

```

В бд не нужно сохранять json c css - только preset code, кодирование и декодирование - происходит на клиенте
В приложении НЕЛЬЗЯ создать свой preset - для этого используем shadcn/create страницу - наверное нужно показать пользователю ссылку на нее

