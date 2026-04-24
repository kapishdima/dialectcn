
export const MENU_ACCENTS = [
    { value: "subtle", label: "Subtle" },
    { value: "bold", label: "Bold" },
] as const

export type MenuAccent = (typeof MENU_ACCENTS)[number]
export type MenuAccentValue = MenuAccent["value"]

export const MENU_COLORS = [
    { value: "default", label: "Default" },
    { value: "inverted", label: "Inverted" },
    { value: "default-translucent", label: "Default Translucent" },
    { value: "inverted-translucent", label: "Inverted Translucent" },
] as const

export type MenuColor = (typeof MENU_COLORS)[number]

export type MenuColorValue = MenuColor["value"]
