import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command } from "cmdk";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../lib/utils";
import { Button } from "./button";

interface ComboboxProps {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  emptyText = "Nenhum resultado encontrado.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Improved selection logic using a direct ref-like map or just searching
  const onSelect = (selectedValue: string) => {
    // cmdk passes the 'value' prop of Command.Item
    // Find internal option
    const item = options.find(
      (o) =>
        o.value === selectedValue ||
        o.label.toLowerCase() === selectedValue.toLowerCase(),
    );
    if (item) {
      onChange(item.value);
    }
    setOpen(false);
  };

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between overflow-hidden text-left font-normal"
        >
          <span className="truncate">
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="p-0 z-[100] bg-white border rounded-md shadow-lg min-w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-hidden"
          align="start"
          sideOffset={4}
        >
          <Command
            className="flex flex-col w-full h-full"
            filter={(value, search) => {
              // Custom filtering to ensure we match label correctly
              const option = options.find((o) => o.value === value);
              if (option?.label.toLowerCase().includes(search.toLowerCase()))
                return 1;
              return 0;
            }}
          >
            <div className="flex items-center border-b px-3">
              <Command.Input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Buscar..."
                autoFocus
              />
            </div>
            <Command.List className="max-h-[250px] overflow-y-auto overflow-x-hidden p-1">
              <Command.Empty className="py-6 text-center text-sm">
                {emptyText}
              </Command.Empty>
              <Command.Group>
                {options.map((option) => (
                  <Command.Item
                    key={option.value}
                    value={option.value} // Use the actual ID as the value for reliability
                    onSelect={onSelect}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-accent-foreground hover:bg-slate-50 transition-colors"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {option.label}
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
