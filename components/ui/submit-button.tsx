"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  loadingText?: string;
}

export function SubmitButton({ children, loadingText = "Cargando...", ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? loadingText : children}
    </Button>
  );
}
