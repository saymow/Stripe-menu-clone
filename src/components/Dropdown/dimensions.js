import { useState, useCallback, useLayoutEffect } from "react";

const getDimensions = (element) => element.getBoundingClientRect();

export function useDimensions(responsive = true) {
  const [dimensions, setDimensions] = useState(null);
  const [element, setElement] = useState(null);

  const hook = useCallback((e) => setElement(e), [setElement]);

  useLayoutEffect(() => {
    if (element) {
      function updateDimension() {
        window.requestAnimationFrame(() => {
          setDimensions(getDimensions(element));
        });
      }
      updateDimension();
      if (responsive) {
        window.addEventListener("resize", updateDimension);

        return () => window.removeEventListener("resize", updateDimension);
      }
    }
  }, [element, hook, responsive]);

  return [hook, dimensions, element];
}
