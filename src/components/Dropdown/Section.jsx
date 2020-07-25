import React from "react";
import { motion } from "framer-motion";

import { useDropdownContext } from "./Provider";

// import { Container } from './styles';

export function DropdownSection({ option }) {
  const { updateOptionProps, cachedId } = useDropdownContext();

  const { id, optionDimensions, optionCenterX, contentDimension } = option;

  const contentWidth = contentDimension?.width || 0;
  const x = optionCenterX - contentWidth / 2;

  const isActive = cachedId === id;

  return (
    <motion.div
      className="dropdown-section"
      initial={{
        x,
      }}
      animate={{
        x,
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? "unset" : "none",
      }}
      transition={{
        ease: "easeOut",
        opacity: { duration: 0.22 },
      }}
    >
      <option.WrappedContent />
    </motion.div>
  );
}
