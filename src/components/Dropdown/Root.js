import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useDropdownContext } from "./Provider";

import { DropdownSection } from "./Section";

const refDuration = 0.22;

export function DropdownRoot() {
  const { options, cachedId, getOptionById, targetId } = useDropdownContext();

  const cachedOption = useMemo(() => getOptionById(cachedId), [
    cachedId,
    getOptionById,
  ]);

  let [width, height, x] = [0, 0, 0];

  if (cachedOption) {
    const { optionCenterX, contentDimension } = cachedOption;

    width = contentDimension?.width;
    height = contentDimension?.height;
    x = optionCenterX - width / 2;
  }

  const [hovering, setHovering] = useState(false);

  const isActive = targetId !== null || hovering;

  // FIRST INTERACTION
  const [hasInteracted, setHasinteracted] = useState(false);
  const isFirstInteraction = isActive && !hasInteracted;

  if (isFirstInteraction) {
    setTimeout(() => {
      if (!hasInteracted) setHasinteracted(true);
    }, 15);
  }

  // ACTIVE TIMEOUT
  useEffect(() => {
    if (!isActive) return;

    let timeout = setTimeout(
      () => setHasinteracted(false),
      refDuration * 1000 * 0.9
    );

    return () => clearImmediate(timeout);
  }, [isActive]);

  return (
    <div style={{ perspective: 2000 }}>
      <motion.div
        className="dropdown-root"
        animate={{
          opacity: isActive ? 1 : 0,
          rotateX: isActive ? 0 : -15,
        }}
        transition={{
          opacity: { duration: refDuration, delay: 0.05 },
          rotateX: { duration: refDuration, delay: 0.05 },
        }}
      >
        <motion.div
          className="dropdown-container"
          animate={{
            x,
            width,
            height,
            pointerEvents: isActive ? "unset" : "none",
          }}
          transition={{
            ease: "easeOut",
            x: { duration: isFirstInteraction ? 0 : refDuration },
            width: { duration: isFirstInteraction ? 0 : refDuration * 0.93 },
            height: { duration: isFirstInteraction ? 0 : refDuration * 0.93 },
            /* BUG FIX */
            pointerEvents: { delay: 0.5 },
          }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <motion.div
            animate={{
              x: -x,
            }}
            transition={{
              x: isFirstInteraction ? { duration: 0 } : undefined,
            }}
          >
            {options.map((item) => (
              <DropdownSection key={item.id} option={item} />
            ))}
          </motion.div>
        </motion.div>
        <DropdownArrow isFirstInteraction={isFirstInteraction} />
      </motion.div>
    </div>
  );
}

function DropdownArrow({ isFirstInteraction }) {
  const { cachedId, getOptionById } = useDropdownContext();

  const cachedOption = useMemo(() => getOptionById(cachedId), [
    cachedId,
    getOptionById,
  ]);

  const x = cachedOption ? cachedOption.optionCenterX : 0;

  return (
    <motion.div
      className="dropdown-arrow"
      initial={{
        opacity: 0,
      }}
      animate={{
        x,
        pointerEvents: "none",
        opacity: x > 0 ? 1 : 0,
      }}
      transition={{
        ease: "easeOut",
        x: {
          duration: isFirstInteraction ? 0 : refDuration,
        },
      }}
    />
  );
}
