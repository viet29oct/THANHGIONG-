import { useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";

const ZALO = "https://zalo.me/0123456789";
const HOTLINE = "tel:0123456789";

export function FloatingSupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="flex flex-col gap-2 rounded-xl border border-border bg-background p-2 shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200"
          role="menu"
        >
          <a
            href={ZALO}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
            role="menuitem"
          >
            <MessageCircle className="h-5 w-5 text-[#0068FF]" />
            Chat Zalo
          </a>
          <a
            href={HOTLINE}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium hover:bg-accent transition-colors"
            role="menuitem"
          >
            <Phone className="h-5 w-5 text-primary" />
            Hotline 0123456789
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Đóng hỗ trợ" : "Hỗ trợ"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-lg hover:bg-[#16a34a] hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {open ? <X className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
      </button>
    </div>
  );
}
