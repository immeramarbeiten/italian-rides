import type { SpecTable } from "@/lib/spec-tables";

export function SpecTableView({ table }: { table: SpecTable }) {
  return (
    <div className="border border-line bg-white">
      <div className="border-b border-line px-4 py-3">
        <p className="font-grotesk font-bold">{table.title}</p>
        <p className="mt-1 text-sm text-zinc-600">{table.note}</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-300 bg-zinc-100 text-left font-mono text-[11px] tracking-[0.1em] text-zinc-600">
            {table.columns.map((c) => (
              <th key={c} className="px-4 py-2 font-medium">
                {c.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-line tabular-nums last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-4 py-2 font-mono text-[11px] text-zinc-400">
        SRC — {table.source.toUpperCase()}
      </p>
    </div>
  );
}
