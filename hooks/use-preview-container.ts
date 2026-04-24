import * as React from "react";

const PREVIEW_CONTAINER_SELECTOR = "[data-preview-container]";

export function usePreviewContainer(): HTMLElement | null {
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    setContainer(
      document.querySelector<HTMLElement>(PREVIEW_CONTAINER_SELECTOR),
    );
  }, []);

  return container;
}
