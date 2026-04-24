import { THEMES } from "@/lib/domain/theme"


export const BASE_COLORS = THEMES.filter((theme) =>
    ["neutral", "stone", "zinc", "mauve", "olive", "mist", "taupe"].includes(
        theme.name
    )
)

export type BaseColor = (typeof BASE_COLORS)[number]
export type BaseColorName = BaseColor["name"]

export function getBaseColor(name: BaseColorName) {
    return BASE_COLORS.find((color) => color.name === name)
}