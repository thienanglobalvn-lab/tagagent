import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Check, X } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { setState, useStore, type Content } from "@/lib/store";

export const Route = createFileRoute("/duyet-noi-dung")({
  head: () => ({ meta: [
    { title: "Duyệt nội dung — NOVA Agents" },
    { name: "description", content: "Duyệt bài AI viết trước khi Agent đăng." },
    { property: "og:title", content: "Duyệt nội dung — NOVA Agents" },
    { property: "og:description", content: "Duyệt bài trước khi đăng." },
  ]}),
  component: Review,
});

function Review() {
  const contents = useStore((s) => s.contents);
  const [tab, setTab] = useState<Content["status"]>("pending");
  const set = (id: string, status: Content["status"]) => setState((s) => ({ contents: s.contents.map((c) => c.id === id ? { ...c, status } : c) }));
  const list = contents.filter((c) => c.status === tab);
  return (
    <div>
      <PageHeader icon={ListChecks} title="Duyệt nội dung">
        {(["pending", "approved", "rejected"] as const).map((t) => <button key={t} onClick={() => setTab(t)} className={`text-sm ${tab === t ? "font-semibold text-primary" : "text-muted-foreground"}`}>{{ pending: "Chờ duyệt", approved: "Đã duyệt", rejected: "Từ chối" }[t]} ({contents.filter((c) => c.status === t).length})</button>)}
      </PageHeader>
      <div className="grid grid-cols-2 gap-3 p-6">
        {list.length === 0 && <p className="col-span-2 py-10 text-center text-sm text-muted-foreground">Không có bài nào.</p>}
        {list.map((c) => (
          <div key={c.id} className="card-base p-4">
            <div className="flex justify-between text-sm"><b>{c.title}</b><span className="text-xs text-muted-foreground">{c.platform}</span></div>
            <p className="mt-2 whitespace-pre-line text-sm">{c.body}</p>
            {tab === "pending" && <div className="mt-3 flex justify-end gap-2"><button className="btn-outline" onClick={() => set(c.id, "rejected")}><X className="h-4 w-4" />Từ chối</button><button className="btn-primary" onClick={() => set(c.id, "approved")}><Check className="h-4 w-4" />Duyệt</button></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
