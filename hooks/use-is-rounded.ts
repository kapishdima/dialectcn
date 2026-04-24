import { useCurrentPreset } from "./use-current-preset";

export const useIsRounded = () => {
    const preset = useCurrentPreset();

    if (!preset) return true;

    return !["lyra", "sera"].includes(preset?.style);
}