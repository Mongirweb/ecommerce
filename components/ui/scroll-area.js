"use client";

import React, { forwardRef } from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

// ScrollArea Component
const ScrollArea = forwardRef((props, ref) => {
  const { className, children, ...rest } = props;

  return (
    <ScrollAreaPrimitive.Root ref={ref} {...rest}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = "ScrollArea";

// ScrollBar Component
const ScrollBar = forwardRef((props, ref) => {
  const { className, orientation = "vertical", ...rest } = props;

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      {...rest}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = "ScrollBar";

export { ScrollArea, ScrollBar };
