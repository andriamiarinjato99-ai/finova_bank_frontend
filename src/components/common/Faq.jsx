import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../../data/fallbackData';

export default function Faq({ items = FAQ_ITEMS }) {
  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
      {items.map((item) => (
        <details key={item.q} className="group p-4 sm:p-5">
          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {item.q}
            <ChevronDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
