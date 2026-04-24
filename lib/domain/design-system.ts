import z from "zod";
import { type PresetConfig } from "shadcn/preset";
import { STYLES } from "./styles";
import { iconLibraries, IconLibraryName } from "shadcn/icons";
import { BASE_COLORS, BaseColorName, } from "./base-colors";
import { ChartColorName, THEMES, ThemeName } from "./theme";
import { fontHeadingValues, fontValues } from "./fonts";
import { MENU_ACCENTS, MENU_COLORS, MenuAccentValue, MenuColorValue } from "./menu";
import { RADII, RadiusValue } from "./radius";

export const designSystemConfigSchema = z
    .object({
        base: "base",
        style: z.enum(STYLES).default("nova"),
        iconLibrary: z.enum(
            Object.keys(iconLibraries) as [IconLibraryName, ...IconLibraryName[]]
        ),
        baseColor: z
            .enum(
                BASE_COLORS.map((c) => c.name) as [BaseColorName, ...BaseColorName[]]
            )
            .default("neutral"),
        theme: z.enum(THEMES.map((t) => t.name) as [ThemeName, ...ThemeName[]]),
        chartColor: z
            .enum(THEMES.map((t) => t.name) as [ChartColorName, ...ChartColorName[]])
            .default("neutral"),
        font: z.enum(fontValues).default("inter"),
        fontHeading: z.enum(fontHeadingValues).default("inherit"),
        item: z.string().optional(),
        rtl: z.boolean().default(false),
        menuAccent: z
            .enum(
                MENU_ACCENTS.map((a) => a.value) as [
                    MenuAccentValue,
                    ...MenuAccentValue[],
                ]
            )
            .default("subtle"),
        menuColor: z
            .enum(
                MENU_COLORS.map((m) => m.value) as [MenuColorValue, ...MenuColorValue[]]
            )
            .default("default"),
        radius: z
            .enum(RADII.map((r) => r.name) as [RadiusValue, ...RadiusValue[]])
            .default("default"),
        template: z
            .enum([
                "next",
                "next-monorepo",
                "start",
                "react-router",
                "vite",
                "vite-monorepo",
                "react-router-monorepo",
                "start-monorepo",
                "astro",
                "astro-monorepo",
                "laravel",
            ])
            .default("next")
            .optional(),
    });

export type DesignSystemConfig = z.infer<typeof designSystemConfigSchema>

export const DEFAULT_CONFIG: DesignSystemConfig = {
    base: "base",
    style: "nova",
    baseColor: "neutral",
    theme: "neutral",
    chartColor: "neutral",
    iconLibrary: "lucide",
    font: "inter",
    fontHeading: "inherit",
    item: "Item",
    rtl: false,
    menuAccent: "subtle",
    menuColor: "default",
    radius: "default",
    template: "next",
}

export function presetConfigToDesignSystem(config: PresetConfig): DesignSystemConfig {
    return {
        ...DEFAULT_CONFIG,
        baseColor: config.baseColor,
        theme: config.theme,
        chartColor: config.chartColor ?? "neutral",
        menuAccent: config.menuAccent,
        radius: config.radius,
        font: config.font,
        fontHeading: config.fontHeading,
        iconLibrary: config.iconLibrary,
        style: config.style,
    }
}