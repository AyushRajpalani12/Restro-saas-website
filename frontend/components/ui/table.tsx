import React from "react";

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement>> = ({ className = "", children, ...props }) => (
  <div className="w-full overflow-auto custom-scrollbar">
    <table className={`w-full text-sm text-left text-slate-300 border-collapse ${className}`} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = "", children, ...props }) => (
  <thead className={`text-xs uppercase bg-slate-950/60 text-slate-400 border-b border-slate-800 ${className}`} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className = "", children, ...props }) => (
  <tbody className={`divide-y divide-slate-800/40 ${className}`} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className = "", children, ...props }) => (
  <tr className={`hover:bg-slate-800/30 transition-colors duration-200 ${className}`} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className = "", children, ...props }) => (
  <th className={`px-6 py-4 font-medium text-slate-300 tracking-wider ${className}`} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className = "", children, ...props }) => (
  <td className={`px-6 py-4 text-slate-300 align-middle ${className}`} {...props}>
    {children}
  </td>
);
export default Table;
