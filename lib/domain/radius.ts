
export const RADII = [
    { name: "default", label: "Default", value: "" },
    { name: "none", label: "None", value: "0" },
    { name: "small", label: "Small", value: "0.45rem" },
    { name: "medium", label: "Medium", value: "0.625rem" },
    { name: "large", label: "Large", value: "0.875rem" },
] as const

export type Radius = (typeof RADII)[number]

export type RadiusValue = Radius["name"]