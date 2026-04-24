export type HotkeyEntry = {
  keys: string[];
  label: string;
  description?: string;
};

export type HotkeyGroup = {
  id: string;
  title: string;
  hint?: string;
  items: HotkeyEntry[];
};

export const HOTKEY_GROUPS: HotkeyGroup[] = [
  {
    id: "navigation",
    title: "Navigation",
    hint: "Move between presets in the feed.",
    items: [
      { keys: ["J"], label: "Previous preset" },
      { keys: ["K"], label: "Next preset" },
      { keys: ["R"], label: "Random preset" },
    ],
  },
  {
    id: "actions",
    title: "Preset actions",
    hint: "Act on the preset you’re viewing.",
    items: [
      { keys: ["C"], label: "Copy install command" },
      { keys: ["I"], label: "Open install dialog" },
      { keys: ["O"], label: "Open in shadcn/create" },
      { keys: ["L"], label: "Like / unlike" },
    ],
  },
  {
    id: "interface",
    title: "Interface",
    hint: "App-wide shortcuts.",
    items: [
      { keys: ["⌘", "B"], label: "Toggle sidebar" },
      { keys: ["?"], label: "Show keyboard shortcuts" },
      { keys: ["Esc"], label: "Close dialogs" },
    ],
  },
];

export const ESSENTIAL_HOTKEYS: HotkeyEntry[] = [
  { keys: ["J"], label: "Prev" },
  { keys: ["K"], label: "Next" },
  { keys: ["R"], label: "Random" },
  { keys: ["C"], label: "Copy" },
  { keys: ["?"], label: "More" },
];
