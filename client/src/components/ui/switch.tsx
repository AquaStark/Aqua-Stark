import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

/**
 * A reusable and stylized Switch component.
 *
 * @param {string} [className] 
 * @param {object} [props]
 */
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-blue-500/50 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "bg-gradient-to-r from-blue-700/60 to-blue-800/60 shadow-lg hover:from-blue-600/70 hover:to-blue-700/70 hover:border-blue-400/70 hover:shadow-xl",
      "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-teal-500/80 data-[state=checked]:to-cyan-600/80 data-[state=checked]:border-teal-400/70 data-[state=checked]:shadow-xl",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-all duration-300",
        "data-[state=unchecked]:translate-x-0.5",
        "data-[state=checked]:translate-x-5"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
