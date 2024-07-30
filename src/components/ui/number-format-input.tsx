import { cn } from "@/lib/utils";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { InputProps } from "./input";

export interface NumberFormatInputProps extends NumericFormatProps<InputProps> {
  className?: string;
  prefix: string;
}

const NumberFormatInput = ({
  className,
  prefix,
  ...props
}: NumberFormatInputProps) => {
  return (
    <div className="relative">
      <div className="absolute top-[50%] left-1 p-[4px] box-border border w-[1.5rem] h-[1.5rem] -translate-y-[50%] flex justify-center items-center rounded-md">
        {prefix}
      </div>
      <NumericFormat
        {...props}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-8 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
      />
    </div>
  );
};

NumberFormatInput.displayName = "NumberFormatInput";

export { NumberFormatInput };
