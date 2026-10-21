import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Library, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { setState, uid, useStore } from "@/lib/store";
import { platforms } from "@/lib/templates";

export const Route = createFileRoute("/kho-noi-dung")({
  head: () => ({ meta: [
    { title: "Kho nội dung — NOVA Agents" },
    { name: "description", content: "Viết bài bằng AI và lưu vào kho nội dung." },
    { property: "og:title", content: "Kho nội dung — NOVA Agents" },
    { property: "og:description", content: "Kho bài viết cho Agent." },
  ]}),
  component: ContentPage,
});

const st = { pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" };

function ContentPage() {
  const contents = useStore((s) => s.contents);
  const products = useStore((s) => s.products);
  const [f, setF] = useState({ title: "", body: "", platform: "Facebook" });
  const aiWrite = () => {
    const p = products[0];
    const hooks = ["🚀 Bạn đã biết chưa?", "💡 Mẹo hay hôm nay:", "🔥 Cơ hội không thể bỏ lỡ!"];
    setF((x) => ({ ...x, title: x.title || `Bài giới thiệu ${p?.name ?? "sản phẩm"}`, body: `${hooks[Math.floor(Math.random() * 3)]}\n\n${p?.description ?? ""}\n\n👉 ${p?.cta ?? ""}` }));
  };
  const save = () => {
    if (!f.body.trim()) return toast.error("Nội dung trống");
    setState((s) => ({ contents: [{ id: uid(), ...f, title: f.title || "Không tiêu đề", status: "pending", at: Date.now() }, ...s.contents] }));
    setF({ title: "", body: "", platform: f.platform }); toast.success("Đã lưu, chờ duyệt");
  };
  return (
    <div>
      <PageHeader icon={Library} title="Kho nội dung" />
      <div className="grid grid-cols-2 gap-4 p-6">
        <div className="card-base space-y-3 p-4">
          <div className="flex justify-between"><b className="text-sm">Viết bài mới</b><button className="btn-outline" onClick={aiWrite}><Sparkles className="h-4 w-4 text-primary" />Viết bằng AI</button></div>
          <input className="input-base" placeholder="Tiêu đề" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
          <select className="input-base" value={f.platform} onChange={(e) => setF({ ...f, platform: e.target.value })}>{platforms.map((p) => <option key={p}>{p}</option>)}</select>
          <textarea rows={8} className="input-base" placeholder="Nội dung bài viết..." value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
          <button className="btn-primary" onClick={save}>Lưu vào kho</button>
        </div>
        <div className="space-y-2">
          {contents.map((c) => (
            <div key={c.id} className="card-base p-3">
              <div className="flex justify-between text-sm"><b>{c.title}</b><span className="text-xs text-muted-foreground">{c.platform} · {st[c.status]}</span></div>
              <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs text-muted-foreground">{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
