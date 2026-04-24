import { type RefObject, useEffect } from "react";

export function useScrollActiveIntoView(
  containerRef: RefObject<HTMLElement | null>,
  activeKey: string | null,
) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !activeKey) return;
    const el = container.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el) return;
    el.scrollIntoView({ block: "center", inline: "nearest" });
  }, [containerRef, activeKey]);
}
