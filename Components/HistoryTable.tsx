'use client'

export interface HistoryRow {
  id: number;
  date: string;
  entries: number;
  savedAt: string;
}

interface HistoryTableProps {
  data: HistoryRow[];
  loading?: boolean;
  sort?: 'asc' | 'desc';
  onSortChange?: (val: 'asc' | 'desc') => void;
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/5">
      {[40, 80, 48, 120].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded bg-white/5 animate-pulse"
            style={{ width: w }}
          />
        </td>
      ))}
    </tr>
  )
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={4}>
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-2xl text-gray-700">○</span>
          <p className="text-sm text-gray-600">No records found</p>
          <p className="text-xs text-gray-700">Try adjusting your filters</p>
        </div>
      </td>
    </tr>
  )
}

function EntriesBadge({ count }: { count: number }) {
  const isLow = count < 10
  return (
    <span
      className={[
        'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium',
        isLow
          ? 'bg-white/5 text-gray-500'
          : 'bg-[#4bcc17]/10 text-[#4bcc17]',
      ].join(' ')}
    >
      {count}
    </span>
  )
}

export default function HistoryTable({
  data,
  loading = false,
  sort,
  onSortChange,
}: HistoryTableProps) {
  const toggleSort = () => {
    if (!onSortChange) return
    onSortChange(sort === 'desc' ? 'asc' : 'desc')
  }

  return (
    <div className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden">

      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-400">Results</span>
          {!loading && (
            <span className="bg-[#4bcc17]/10 border border-[#4bcc17]/25 text-[#4bcc17] text-[11px] font-medium px-2.5 py-0.5 rounded-full">
              {data.length} {data.length === 1 ? 'record' : 'records'}
            </span>
          )}
        </div>
        {sort && onSortChange && (
          <span className="text-[11px] text-gray-600">
            sorted by date{' '}
            <button
              onClick={toggleSort}
              className="text-[#4bcc17] hover:underline cursor-pointer"
            >
              {sort === 'desc' ? '▼ desc' : '▲ asc'}
            </button>
          </span>
        )}
      </div>

      <div className="overflow-x-auto bg-white/10">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-[#1e1e1e]">
              {(['ID', 'DATE', 'ENTRIES', 'SAVED AT'] as const).map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-[11px] font-medium tracking-widest text-gray-600"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : data.length === 0 ? (
              <EmptyState />
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id}
                  className={[
                    'border-b border-[#161616] transition-colors duration-100 hover:bg-white/[0.02]',
                    i === data.length - 1 ? 'border-b-0' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-600">
                    #{String(row.id).padStart(3, '0')}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[12px] text-gray-400 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md px-2 py-0.5">
                      {row.date}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <EntriesBadge count={row.entries} />
                  </td>
                  <td className="px-4 py-3 font-mono text-[12px] text-gray-600">
                    {row.savedAt}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}