import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutGrid, Sparkles, Activity, Library, Users, ListChecks, MessageCircle, Bot, Boxes,
  UserRound, ShieldCheck, Globe, Puzzle, ChevronDown, ChevronRight, Infinity as Inf, Info,
} from "lucide-react";

const sections = [
  { title: "Cấu hình", items: [
    { to: "/automation", label: "Automation", icon: Sparkles },
    { to: "/nhat-ky", label: "Nhật ký hoạt động", icon: Activity },
    { to: "/kho-noi-dung", label: "Kho nội dung", icon: Library },
    { to: "/kho-group", label: "Kho group FB", icon: Users },
    { to: "/duyet-noi-dung", label: "Duyệt nội dung", icon: ListChecks },
    { to: "/tin-nhan", label: "Tin nhắn", icon: MessageCircle },
  ]},
  { title: "AI Agents", items: [
    { to: "/tro-ly-ai", label: "Trợ lý AI", icon: Bot },
    { to: "/kien-thuc", label: "Kiến thức cho Agent", icon: Boxes },
  ]},
  { title: "Quản lý", items: [
    { to: "/tai-khoan", label: "Tài khoản", icon: UserRound },
    { to: "/gioi-han", label: "Giới hạn nick", icon: ShieldCheck },
    { to: "/proxy", label: "Proxy", icon: Globe },
    { to: "/tien-ich", label: "Tiện ích", icon: Puzzle },
  ]},
] as const;

const linkCls = "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] text-secondary-foreground hover:bg-muted transition";
const activeCls = "!bg-gradient-primary !text-primary-foreground shadow-primary font-semibold";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<Record<string, boolean>>({ "Cấu hình": true, "AI Agents": true, "Quản lý": true });
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 h-screen w-[210px] shrink-0 overflow-y-auto border-r bg-sidebar px-3 py-5">
        <Link to="/" className="mb-6 flex flex-col items-center gap-1">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-primary"><Inf className="h-6 w-6" /></div>
          <span className="text-sm font-bold">NOVA <span className="text-primary">Agents</span></span>
        </Link>
        <Link to="/" className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>
          <LayoutGrid className="h-4 w-4" /> Tổng quan
        </Link>
        {sections.map((s) => (
          <div key={s.title} className="mt-4">
            <button onClick={() => setOpen((o) => ({ ...o, [s.title]: !o[s.title] }))} className="mb-1 flex items-center gap-1 px-2 text-[11px] font-bold uppercase tracking-wide text-foreground">
              {open[s.title] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}{s.title}
            </button>
            {open[s.title] && s.items.map((i) => (
              <Link key={i.to} to={i.to} className={linkCls} activeProps={{ className: activeCls }}>
                <i.icon className="h-4 w-4" />{i.label}
              </Link>
            ))}
          </div>
        ))}
        <div className="mt-4 flex items-center gap-1 px-2 text-[11px] font-bold uppercase text-foreground"><Info className="h-3 w-3" /> Thông tin</div>
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

export function PageHeader({ icon: Icon, title, right, children }: { icon?: any; title: string; right?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b bg-card px-6 py-3">
      <div className="flex items-center gap-4">
        <h1 className="flex items-center gap-2 text-base font-semibold">{Icon && <Icon className="h-4 w-4 text-primary" />}{title}</h1>
        {children}
      </div>
      {right}
    </div>
  );
}

export function Modal({ title, onClose, children, footer }: { title: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4" onClick={onClose}>
      <div className="card-base flex max-h-[90vh] w-full max-w-lg flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="font-semibold">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <div className="overflow-y-auto px-5 pb-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t px-5 py-3">{footer}</div>}
      </div>
    </div>
  );
}
