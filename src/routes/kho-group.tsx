import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Plus } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { setState, uid, useStore } from "@/lib/store";

export const Route = createFileRoute("/kho-group")({
  head: () => ({ meta: [
    { title: "Kho group FB — NOVA Agents" },
    { name: "description", content: "Lưu và duyệt danh sách group Facebook cho Agent." },
    { property: "og:title", content: "Kho group FB — NOVA Agents" },
    { property: "og:description", content: "Kho group Facebook." },
  ]}),
  component: Groups,
});

function Groups() {
  const groups = useStore((s) => s.groups);
  const [url, setUrl] = useState("");
  return (
    <div>
      <PageHeader icon={Users} title="Kho group FB" />
      <div className="p-6">
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!url.trim()) return; setState((s) => ({ groups: [{ id: uid(), name: url.split("/").filter(Boolean).pop() ?? url, url, members: "—", approved: false }, ...s.groups] })); setUrl(""); }}>
          <input className="input-base" placeholder="Dán link group Facebook..." value={url} onChange={(e) => setUrl(e.target.value)} /><button className="btn-primary"><Plus className="h-4 w-4" />Thêm</button>
        </form>
        <div className="card-base mt-4 overflow-hidden">
          <table className="w-full text-sm"><thead className="border-b text-left text-[11px] uppercase text-muted-foreground"><tr><th className="p-3">Tên group</th><th>Thành viên</th><th>Trạng thái</th><th></th></tr></thead>
            <tbody>{groups.map((g) => (
              <tr key={g.id} className="border-b last:border-0">
                <td className="p-3"><div className="font-medium">{g.name}</div><div className="text-xs text-muted-foreground">{g.url}</div></td><td>{g.members}</td>
                <td><span className={`rounded-full px-2 py-0.5 text-xs ${g.approved ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`}>{g.approved ? "Đã duyệt" : "Chờ duyệt"}</span></td>
                <td className="pr-3 text-right"><button className="btn-outline !py-1 !text-xs" onClick={() => setState((s) => ({ groups: s.groups.map((x) => x.id === g.id ? { ...x, approved: !x.approved } : x) }))}>{g.approved ? "Bỏ duyệt" : "Duyệt"}</button> <button className="text-xs text-destructive" onClick={() => setState((s) => ({ groups: s.groups.filter((x) => x.id !== g.id) }))}>Xoá</button></td>
              </tr>
            ))}</tbody></table>
        </div>
      </div>
    </div>
  );
}
