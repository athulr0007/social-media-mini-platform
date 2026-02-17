import { forwardRef } from "react";
import { Button } from "@mui/material";

export const MetalButton = forwardRef(({ children, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="contained"
      sx={{
        background: "linear-gradient(145deg, #2c2c2e 0%, #1c1c1e 100%)",
        color: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.1)",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          background: "linear-gradient(145deg, #3c3c3e 0%, #2c2c2e 100%)",
          boxShadow: "0 6px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          transform: "translateY(-1px)"
        },
        "&:active": {
          transform: "translateY(0)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(0,0,0,0.2)"
        },
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Button>
  );
});

MetalButton.displayName = "MetalButton";