import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-slate-950 border ${
            error ? "border-red-500 focus:ring-red-500/25" : "border-slate-800 focus:ring-orange-500/20 focus:border-orange-500"
          } text-slate-200 rounded-lg px-3.5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-4 placeholder-slate-600 min-h-[100px] resize-y ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 mt-0.5">{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
