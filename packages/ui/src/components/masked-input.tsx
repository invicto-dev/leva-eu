import * as React from "react";
import { Input } from "./input";

export interface MaskedInputProps extends React.ComponentPropsWithoutRef<
  typeof Input
> {
  mask: "cpf" | "phone";
}

export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ mask, onChange, ...props }, ref) => {
    const applyMask = (value: string) => {
      let v = value.replace(/\D/g, "");
      if (mask === "cpf") {
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
      } else if (mask === "phone") {
        if (v.length > 11) v = v.slice(0, 11);
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
        v = v.replace(/(\d)(\d{4})$/, "$1-$2");
      }
      return v;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const maskedValue = applyMask(e.target.value);
      // Update the value directly to ensure visibility
      e.target.value = maskedValue;
      if (onChange) {
        onChange(e);
      }
    };

    return <Input {...props} ref={ref} onChange={handleChange} />;
  },
);
MaskedInput.displayName = "MaskedInput";
