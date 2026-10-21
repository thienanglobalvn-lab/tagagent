import { createFileRoute, Link } from "@tanstack/react-router";
import { PenLine, Layers, UserPlus, CalendarClock, ListChecks, Play, CheckCircle2, Loader, XCircle } from "lucide-react";
import hero from "@/assets/hero-agent.jpg";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Tổng quan — NOVA Agents" },
    { name: "description", content: "Bảng điều khiển AI Agent: tài khoản, lượt chạy và trạng thái tự động hoá." },
    { property: "og:title", content: "Tổng quan — NOVA Agents" },
    { property: "og:description", content: "Bảng điều khiển AI Agent đa nền tảng." },
  ]}),
  component: Dashboard,
});

function greeting() { const h = new Date().getHours(); return h < 11 ? "Chào buổi sáng" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối"; }

function Dashboard() {
  const profiles = useStore((s) => s.profiles);
  const runs = useStore((s) => s.runs);
  const contents = useStore((s) => s.contents);
  const week = runs.filter((r) => Date.now() - r.at < 7 * 864e5);
  const platforms = new Set(profiles.map((p) => p.platform).filter(Boolean)).size;
  const pending = contents.filter((c) => c.status === "pending").length;
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - 13 + i);
    const r = runs.filter((x) => x.at >= d.getTime() && x.at < d.getTime() + 864e5);
    return { ok: r.filter((x) => x.status === "success").length, err: r.filter((x) => x.status === "error").length };
  });
  const max = Math.max(1, ...days.map((d) => d.ok + d.err));
  const actions = [
    { to: "/kho-noi-dung", label: "Viết bài AI", icon: PenLine },
    { to: "/automation", label: "Chạy hàng loạt", icon: Layers },
    { to: "/tai-khoan", label: "Thêm tài khoản", icon: UserPlus },
    { to: "/nhat-ky", label: "Lịch hẹn", icon: CalendarClock },
    { to: "/duyet-noi-dung", label: "Duyệt nội dung", icon: ListChecks },
  ] as const;
  const stats = [
    { label: "Lượt chạy · 7 ngày", v: week.length, icon: Play, c: "text-foreground" },
    { label: "Thành công", v: week.filter((r) => r.status === "success").length, icon: CheckCircle2, c: "text-success" },
    { label: "Đang chạy", v: runs.filter((r) => r.status === "running").length, icon: Loader, c: "text-primary" },
    { label: "Lỗi", v: week.filter((r) => r.status === "error").length, icon: XCircle, c: "text-destructive" },
  ];
  return (
    <div className="mx-auto max-w-5xl px-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{greeting()}</h1>
          <p className="text-sm text-muted-foreground">Agent đang trông {profiles.length} tài khoản trên {platforms} nền tảng, viết và làm việc bằng AI.</p>
        </div>
        <span className="card-base flex items-center gap-2 rounded-full px-3 py-1 text-xs"><span className="h-2 w-2 rounded-full bg-success" />Agent đang trực · Telegram</span>
      </div>
      <div className="mt-5 grid grid-cols-5 gap-3">
        {actions.map((a, i) => (
          <Link key={a.label} to={a.to} className={i === 0 ? "flex items-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-primary" : "card-base flex items-center gap-2 px-4 py-3 text-sm font-medium hover:border-primary"}>
            <a.icon className="h-4 w-4" />{a.label}
          </Link>
        ))}
      </div>
      <div className="card-base relative mt-4 overflow-hidden">
        <img src={hero} alt="AI Agent kết nối các nền tảng mạng xã hội" width={1280} height={720} className="mx-auto h-[340px] w-full object-contain" />
        <div className="absolute bottom-4 left-5 flex items-end gap-2"><span className="text-3xl font-bold text-primary">{profiles.length}</span><span className="text-xs text-muted-foreground">tài khoản<br />trên {platforms} nền tảng</span></div>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 font-bold">NOVA Agent <span className="rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-success">● Sẵn sàng</span></div>
        <div className="absolute bottom-4 right-5 flex items-end gap-2 text-right"><span className="text-xs text-muted-foreground">AI sẵn sàng<br />trên 9 AI hỗ trợ</span><span className="text-3xl font-bold text-primary">2</span></div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="card-base flex items-center gap-3 p-4">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-muted"><s.icon className={`h-4 w-4 ${s.c}`} /></div>
            <div><div className="text-xs text-muted-foreground">{s.label}</div><div className={`text-2xl font-bold ${s.c}`}>{s.v}</div></div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="card-base col-span-2 p-4">
          <div className="flex justify-between text-sm"><span>Lượt chạy 14 ngày</span><span className="flex gap-3 text-xs"><span className="text-primary">● Thành công</span><span className="text-destructive">● Lỗi</span></span></div>
          <div className="mt-4 flex h-32 items-end gap-2">
            {days.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col justify-end gap-0.5">
                <div className="rounded-t bg-destructive" style={{ height: `${(d.err / max) * 110}px` }} />
                <div className="rounded-t bg-primary" style={{ height: `${(d.ok / max) * 110}px`, minHeight: 2 }} />
              </div>
            ))}
          </div>
        </div>
        <div className="card-base p-4 text-sm">
          <div className="font-semibold">Cần bạn xử lý</div>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li><Link to="/duyet-noi-dung" className="hover:text-primary">{pending} bài đang chờ duyệt →</Link></li>
            <li><Link to="/proxy" className="hover:text-primary">{profiles.filter((p) => !p.proxy).length} profile chưa có proxy →</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
