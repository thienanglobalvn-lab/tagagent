import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/proxy")({
  head: () => ({ meta: [
    { title: "Proxy — NOVA Agents" },
    { name: "description", content: "Quản lý danh sách proxy cho các profile." },
    { property: "og:title", content: "Proxy — NOVA Agents" },
    { property: "og:description", content: "Quản lý proxy." },
  ]}),
  component: Proxies,
});

function Proxies() {
  const proxies = useStore((s) => s.proxies);
  const [text, setText] = useState(""); const [type, setType] = useState("HTTP");
  const add = () => {
    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;
    setState((s) => ({ proxies: [...lines.map((value) => ({ id: uid(), value, type, status: "unknown" as const })), ...s.proxies] }));
    setText(""); toast.success(`Đã thêm ${lines.length} proxy`);
  };
  return (
    <div>
      <PageHeader icon={Globe} title="Proxy" />
      <div className="grid grid-cols-3 gap-4 p-6">
        <div className="card-base space-y-3 p-4">
          <b className="text-sm">Thêm proxy</b>
          <select className="input-base" value={type} onChange={(e) => setType(e.target.value)}><option>HTTP</option><option>SOCKS5</option></select>
          <textarea rows={6} className="input-base" placeholder={"host:port:user:pass\nmỗi dòng 1 proxy"} value={text} onChange={(e) => setText(e.target.value)} />
          <button className="btn-primary" onClick={add}>Thêm</button>
        </div>
        <div className="card-base col-span-2 overflow-hidden">
          {proxies.length === 0 ? <p className="p-10 text-center text-sm text-muted-foreground">Chưa có proxy.</p> : proxies.map((p) => (
            <div key={p.id} className="flex items-center gap-3 border-b px-4 py-2.5 text-sm last:border-0">
              <span className="rounded bg-muted px-1.5 text-xs">{p.type}</span><span className="font-mono text-xs">{p.value}</span>
              <span className={`ml-auto text-xs ${p.status === "live" ? "text-success" : "text-muted-foreground"}`}>{p.status === "live" ? "● Live" : "Chưa kiểm tra"}</span>
              <button className="text-xs text-primary" onClick={() => setState((s) => ({ proxies: s.proxies.map((x) => x.id === p.id ? { ...x, status: "live" } : x) }))}>Kiểm tra</button>
              <button className="text-xs text-destructive" onClick={() => setState((s) => ({ proxies: s.proxies.filter((x) => x.id !== p.id) }))}>Xoá</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
