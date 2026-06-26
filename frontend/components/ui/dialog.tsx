import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> & {
  Content: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Header: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Title: React.FC<React.HTMLAttributes<HTMLHeadingElement>>;
  Description: React.FC<React.HTMLAttributes<HTMLParagraphElement>>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = ({ isOpen, onClose, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 text-slate-100 flex flex-col max-h-[85vh]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1.5 rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
            >
              <X size={18} />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Content: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`p-6 overflow-y-auto custom-scrollbar ${className}`} {...props}>
    {children}
  </div>
);

const Header: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`p-6 pb-2 ${className}`} {...props}>
    {children}
  </div>
);

const Title: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = "", ...props }) => (
  <h3 className={`text-lg font-semibold text-slate-100 ${className}`} {...props}>
    {children}
  </h3>
);

const Description: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = "", ...props }) => (
  <p className={`text-sm text-slate-400 mt-1.5 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

const Footer: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = "", ...props }) => (
  <div className={`p-6 pt-3 border-t border-slate-800/60 flex items-center justify-end gap-3 ${className}`} {...props}>
    {children}
  </div>
);

Dialog.Content = Content;
Dialog.Header = Header;
Dialog.Title = Title;
Dialog.Description = Description;
Dialog.Footer = Footer;

export default Dialog;
