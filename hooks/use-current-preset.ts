import { useAtomValue } from "jotai";
import { currentPresetAtom } from "@/lib/atoms/current-preset";
import { decodePreset } from "shadcn/preset";

export const useCurrentPreset = () => {
    const preset = useAtomValue(currentPresetAtom);

    if (!preset) return null;

    return decodePreset(preset.code);
}