import React from "react";

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div
    className={`bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl shadow-black/10 transition-all duration-300 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`p-6 border-b border-slate-800/60 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className = "", children, ...props }) => (
  <h3 className={`text-lg font-semibold text-slate-100 tracking-tight leading-none ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className = "", children, ...props }) => (
  <p className={`text-sm text-slate-400 mt-1.5 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => (
  <div className={`p-6 border-t border-slate-800/60 flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);
export default Card;
