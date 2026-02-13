import { useState } from 'react';

export default function TicketCard({ ticket }: { ticket: string }) {
  const [copied, setCopied] = useState(false);

  const copyTicket = async () => {
    if (!ticket) return;
    await navigator.clipboard.writeText(ticket);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      <p className="text-lg font-bold">你的 Ticket：</p>
      <pre className="w-full overflow-x-auto rounded-md border border-slate-300 bg-slate-100 px-4 py-3 font-mono text-sm text-slate-900">
        <code>{ticket || '暂无 ticket'}</code>
      </pre>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={copyTicket}
          disabled={!ticket}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        >
          点击复制
        </button>
        {copied ? <p className="text-sm text-green-600">复制成功！</p> : null}
      </div>
    </div>
  );
}
