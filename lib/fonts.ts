import {
  DM_Sans,
  EB_Garamond,
  Figtree,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  JetBrains_Mono,
  Lora,
  Manrope,
  Merriweather,
  Montserrat,
  Noto_Sans,
  Noto_Serif,
  Nunito_Sans,
  Outfit,
  Oxanium,
  Playfair_Display,
  Public_Sans,
  Raleway,
  Roboto,
  Roboto_Slab,
  Source_Sans_3,
  Space_Grotesk,
} from "next/font/google"

export type FontDefinition = {
  name: string
  title: string
  type: "sans" | "mono" | "serif"
  family: string
  registryVariable: "--font-sans" | "--font-mono" | "--font-serif"
  previewVariable: string
  provider: "google"
  import: string
  dependency: string
  subsets: readonly string[]
  weight?: readonly string[]
}

export const FONT_DEFINITIONS = [
  {
    name: "geist",
    title: "Geist",
    type: "sans",
    family: "'Geist Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-geist-sans",
    provider: "google",
    import: "Geist",
    dependency: "@fontsource-variable/geist",
    subsets: ["latin"],
  },
  {
    name: "inter",
    title: "Inter",
    type: "sans",
    family: "'Inter Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-inter",
    provider: "google",
    import: "Inter",
    dependency: "@fontsource-variable/inter",
    subsets: ["latin"],
  },
  {
    name: "noto-sans",
    title: "Noto Sans",
    type: "sans",
    family: "'Noto Sans Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-noto-sans",
    provider: "google",
    import: "Noto_Sans",
    dependency: "@fontsource-variable/noto-sans",
    subsets: ["latin"],
  },
  {
    name: "nunito-sans",
    title: "Nunito Sans",
    type: "sans",
    family: "'Nunito Sans Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-nunito-sans",
    provider: "google",
    import: "Nunito_Sans",
    dependency: "@fontsource-variable/nunito-sans",
    subsets: ["latin"],
  },
  {
    name: "figtree",
    title: "Figtree",
    type: "sans",
    family: "'Figtree Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-figtree",
    provider: "google",
    import: "Figtree",
    dependency: "@fontsource-variable/figtree",
    subsets: ["latin"],
  },
  {
    name: "roboto",
    title: "Roboto",
    type: "sans",
    family: "'Roboto Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-roboto",
    provider: "google",
    import: "Roboto",
    dependency: "@fontsource-variable/roboto",
    subsets: ["latin"],
  },
  {
    name: "raleway",
    title: "Raleway",
    type: "sans",
    family: "'Raleway Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-raleway",
    provider: "google",
    import: "Raleway",
    dependency: "@fontsource-variable/raleway",
    subsets: ["latin"],
  },
  {
    name: "dm-sans",
    title: "DM Sans",
    type: "sans",
    family: "'DM Sans Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-dm-sans",
    provider: "google",
    import: "DM_Sans",
    dependency: "@fontsource-variable/dm-sans",
    subsets: ["latin"],
  },
  {
    name: "public-sans",
    title: "Public Sans",
    type: "sans",
    family: "'Public Sans Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-public-sans",
    provider: "google",
    import: "Public_Sans",
    dependency: "@fontsource-variable/public-sans",
    subsets: ["latin"],
  },
  {
    name: "outfit",
    title: "Outfit",
    type: "sans",
    family: "'Outfit Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-outfit",
    provider: "google",
    import: "Outfit",
    dependency: "@fontsource-variable/outfit",
    subsets: ["latin"],
  },
  {
    name: "oxanium",
    title: "Oxanium",
    type: "sans",
    family: "'Oxanium Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-oxanium",
    provider: "google",
    import: "Oxanium",
    dependency: "@fontsource-variable/oxanium",
    subsets: ["latin"],
  },
  {
    name: "manrope",
    title: "Manrope",
    type: "sans",
    family: "'Manrope Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-manrope",
    provider: "google",
    import: "Manrope",
    dependency: "@fontsource-variable/manrope",
    subsets: ["latin"],
  },
  {
    name: "space-grotesk",
    title: "Space Grotesk",
    type: "sans",
    family: "'Space Grotesk Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-space-grotesk",
    provider: "google",
    import: "Space_Grotesk",
    dependency: "@fontsource-variable/space-grotesk",
    subsets: ["latin"],
  },
  {
    name: "montserrat",
    title: "Montserrat",
    type: "sans",
    family: "'Montserrat Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-montserrat",
    provider: "google",
    import: "Montserrat",
    dependency: "@fontsource-variable/montserrat",
    subsets: ["latin"],
  },
  {
    name: "ibm-plex-sans",
    title: "IBM Plex Sans",
    type: "sans",
    family: "'IBM Plex Sans Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-ibm-plex-sans",
    provider: "google",
    import: "IBM_Plex_Sans",
    dependency: "@fontsource-variable/ibm-plex-sans",
    subsets: ["latin"],
  },
  {
    name: "source-sans-3",
    title: "Source Sans 3",
    type: "sans",
    family: "'Source Sans 3 Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-source-sans-3",
    provider: "google",
    import: "Source_Sans_3",
    dependency: "@fontsource-variable/source-sans-3",
    subsets: ["latin"],
  },
  {
    name: "instrument-sans",
    title: "Instrument Sans",
    type: "sans",
    family: "'Instrument Sans Variable', sans-serif",
    registryVariable: "--font-sans",
    previewVariable: "--font-instrument-sans",
    provider: "google",
    import: "Instrument_Sans",
    dependency: "@fontsource-variable/instrument-sans",
    subsets: ["latin"],
  },
  {
    name: "jetbrains-mono",
    title: "JetBrains Mono",
    type: "mono",
    family: "'JetBrains Mono Variable', monospace",
    registryVariable: "--font-mono",
    previewVariable: "--font-jetbrains-mono",
    provider: "google",
    import: "JetBrains_Mono",
    dependency: "@fontsource-variable/jetbrains-mono",
    subsets: ["latin"],
  },
  {
    name: "geist-mono",
    title: "Geist Mono",
    type: "mono",
    family: "'Geist Mono Variable', monospace",
    registryVariable: "--font-mono",
    previewVariable: "--font-geist-mono",
    provider: "google",
    import: "Geist_Mono",
    dependency: "@fontsource-variable/geist-mono",
    subsets: ["latin"],
  },
  {
    name: "noto-serif",
    title: "Noto Serif",
    type: "serif",
    family: "'Noto Serif Variable', serif",
    registryVariable: "--font-serif",
    previewVariable: "--font-noto-serif",
    provider: "google",
    import: "Noto_Serif",
    dependency: "@fontsource-variable/noto-serif",
    subsets: ["latin"],
  },
  {
    name: "roboto-slab",
    title: "Roboto Slab",
    type: "serif",
    family: "'Roboto Slab Variable', serif",
    registryVariable: "--font-serif",
    previewVariable: "--font-roboto-slab",
    provider: "google",
    import: "Roboto_Slab",
    dependency: "@fontsource-variable/roboto-slab",
    subsets: ["latin"],
  },
  {
    name: "merriweather",
    title: "Merriweather",
    type: "serif",
    family: "'Merriweather Variable', serif",
    registryVariable: "--font-serif",
    previewVariable: "--font-merriweather",
    provider: "google",
    import: "Merriweather",
    dependency: "@fontsource-variable/merriweather",
    subsets: ["latin"],
  },
  {
    name: "lora",
    title: "Lora",
    type: "serif",
    family: "'Lora Variable', serif",
    registryVariable: "--font-serif",
    previewVariable: "--font-lora",
    provider: "google",
    import: "Lora",
    dependency: "@fontsource-variable/lora",
    subsets: ["latin"],
  },
  {
    name: "playfair-display",
    title: "Playfair Display",
    type: "serif",
    family: "'Playfair Display Variable', serif",
    registryVariable: "--font-serif",
    previewVariable: "--font-playfair-display",
    provider: "google",
    import: "Playfair_Display",
    dependency: "@fontsource-variable/playfair-display",
    subsets: ["latin"],
  },
  {
    name: "eb-garamond",
    title: "EB Garamond",
    type: "serif",
    family: "'EB Garamond Variable', serif",
    registryVariable: "--font-serif",
    previewVariable: "--font-eb-garamond",
    provider: "google",
    import: "EB_Garamond",
    dependency: "@fontsource-variable/eb-garamond",
    subsets: ["latin"],
  },
  {
    name: "instrument-serif",
    title: "Instrument Serif",
    type: "serif",
    family: "'Instrument Serif', serif",
    registryVariable: "--font-serif",
    previewVariable: "--font-instrument-serif",
    provider: "google",
    import: "Instrument_Serif",
    dependency: "@fontsource/instrument-serif",
    subsets: ["latin"],
    weight: ["400"],
  },
] as const satisfies readonly FontDefinition[]

export type FontName = (typeof FONT_DEFINITIONS)[number]["name"]

type PreviewFont = ReturnType<typeof Inter>

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
})

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
})

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
})

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
})

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
})

const PREVIEW_FONTS = {
  geist: geistSans,
  inter,
  "noto-sans": notoSans,
  "nunito-sans": nunitoSans,
  figtree,
  roboto,
  raleway,
  "dm-sans": dmSans,
  "public-sans": publicSans,
  outfit,
  oxanium,
  manrope,
  "space-grotesk": spaceGrotesk,
  montserrat,
  "ibm-plex-sans": ibmPlexSans,
  "source-sans-3": sourceSans3,
  "instrument-sans": instrumentSans,
  "jetbrains-mono": jetbrainsMono,
  "geist-mono": geistMono,
  "noto-serif": notoSerif,
  "roboto-slab": robotoSlab,
  merriweather,
  lora,
  "playfair-display": playfairDisplay,
  "eb-garamond": ebGaramond,
  "instrument-serif": instrumentSerif,
} satisfies Record<FontName, PreviewFont>

function createFontOption(name: FontName) {
  const definition = FONT_DEFINITIONS.find((font) => font.name === name)

  if (!definition) {
    throw new Error(`Unknown font definition: ${name}`)
  }

  return {
    name: definition.title,
    value: definition.name,
    font: PREVIEW_FONTS[name],
    type: definition.type,
  } as const
}

export const FONTS = [
  createFontOption("geist"),
  createFontOption("inter"),
  createFontOption("noto-sans"),
  createFontOption("nunito-sans"),
  createFontOption("figtree"),
  createFontOption("roboto"),
  createFontOption("raleway"),
  createFontOption("dm-sans"),
  createFontOption("public-sans"),
  createFontOption("outfit"),
  createFontOption("oxanium"),
  createFontOption("manrope"),
  createFontOption("space-grotesk"),
  createFontOption("montserrat"),
  createFontOption("ibm-plex-sans"),
  createFontOption("source-sans-3"),
  createFontOption("instrument-sans"),
  createFontOption("geist-mono"),
  createFontOption("jetbrains-mono"),
  createFontOption("noto-serif"),
  createFontOption("roboto-slab"),
  createFontOption("merriweather"),
  createFontOption("lora"),
  createFontOption("playfair-display"),
  createFontOption("eb-garamond"),
  createFontOption("instrument-serif"),
] as const

export type Font = (typeof FONTS)[number]

export const FONT_HEADING_OPTIONS = [
  {
    name: "Inherit",
    value: "inherit",
    font: null,
    type: "default",
  },
  ...FONTS,
] as const

export type FontHeadingOption = (typeof FONT_HEADING_OPTIONS)[number]
