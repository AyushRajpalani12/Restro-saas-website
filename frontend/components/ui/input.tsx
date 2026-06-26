import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={`w-full bg-slate-950 border ${
            error ? "border-red-500 focus:ring-red-500/25" : "border-slate-800 focus:ring-orange-500/20 focus:border-orange-500"
          } text-slate-200 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-4 placeholder-slate-600`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
