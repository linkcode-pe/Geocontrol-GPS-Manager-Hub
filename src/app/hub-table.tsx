import type { ReactNode } from 'react';

type HubTableProps = {
  label: string;
  className: string;
  children: ReactNode;
};

export default function HubTable({ label, className, children }: HubTableProps) {
  return (
    <div className="hub-table-wrap">
      <p className="hub-table-hint">Desliza horizontalmente para ver todas las columnas →</p>
      <div className="hub-table-scroll" role="region" aria-label={label} tabIndex={0}>
        <table className={`hub-data-table ${className}`}>{children}</table>
      </div>
    </div>
  );
}
