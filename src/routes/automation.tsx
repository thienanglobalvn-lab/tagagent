import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Layers, Plus, Search, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, Modal } from "@/components/AppShell";
import { platforms, templates, type Template } from "@/lib/templates";
import { startRuns, useStore } from "@/lib/store";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [
    { title: "Automation — NOVA Agents" },
    { name: "description", content: "Chọn mẫu tự động hoá cho Facebook, TikTok, YouTube, Threads, Instagram, X, Reddit." },
    { property: "og:title", content: "Automation — NOVA Agents" },
    { property: "og:description", content: "Mẫu tự động hoá đa nền tảng." },
  ]}),
  component: Automation,
});

function Automation() {
  const [tab, setTab] = useState<string>("Facebook");
  const [group, setGroup] = useState("Tất cả");
  const [q, setQ] = useState("");
  const [runT, setRunT] = useState<Template | null>(null);
  const list = templates[tab].filter((t) => (group === "Tất cả" || t.group === group) && t.name.toLowerCase().includes(q.toLowerCase()));
  const groups = [...new Set(templates[tab].map((t) => t.group))];
  return (
    <div>
      <PageHeader icon={Sparkles} title="Automation" right={<button className="btn-primary" onClick={() => setRunT(templates[tab][0])}><Plus className="h-4 w-4" />Chạy hàng loạt</button>}>
        <span className="border-b-2 border-primary pb-1 text-sm font-medium">Chọn mẫu</span>
      </PageHeader>
      <div className="flex items-center justify-between border-b bg-card px-6">
        <div className="flex gap-1">
          {platforms.map((p) => (
            <button key={p} onClick={() => { setTab(p); setGroup("Tất cả"); }} className={`border-b-2 px-3 py-2.5 text-sm ${tab === p ? "border-primary font-semibold" : "border-transparent text-muted-foreground"}`}>
              {p} <span className="text-xs text-muted-foreground">{templates[p].length}</span>
            </button>
          ))}
        </div>
        <div className="relative w-56"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><input className="input-base pl-8" placeholder="Tìm automation..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>
      <div className="p-6">
        <div className="flex gap-2">
          {["Tất cả", ...groups].map((g) => (
            <button key={g} onClick={() => setGroup(g)} className={`rounded-full border px-3 py-1 text-xs ${group === g ? "border-primary bg-primary-soft text-accent-foreground" : "bg-card"}`}>{g} {g !== "Tất cả" && templates[tab].filter((t) => t.group === g).length}</button>
          ))}
        </div>
        {groups.map((g) => {
          const items = list.filter((t) => t.group === g);
          if (!items.length) return null;
          return (
            <section key={g} className="mt-5">
              <h3 className="mb-2 flex items-center gap-1 text-xs font-bold uppercase text-muted-foreground"><ChevronDown className="h-3 w-3" />{g} ({items.length})</h3>
              <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-5">
                {items.map((t) => (
                  <div key={t.name} className="card-base flex flex-col p-4">
                    <div className="flex gap-3">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">{tab[0]}</div>
                      <div><div className="text-[13px] font-semibold leading-snug">{t.name}</div><div className="mt-1 line-clamp-1 text-xs text-muted-foreground">{t.desc}</div></div>
                    </div>
                    <div className="mt-auto flex justify-end border-t pt-3 mt-3"><button className="btn-primary !py-1 !text-xs" onClick={() => setRunT(t)}><Layers className="h-3.5 w-3.5" />Chạy hàng loạt</button></div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {runT && <RunModal t={runT} platform={tab} onClose={() => setRunT(null)} />}
    </div>
  );
}

function RunModal({ t, platform, onClose }: { t: Template; platform: string; onClose: () => void }) {
  const profiles = useStore((s) => s.profiles);
  const [sel, setSel] = useState<number[]>([]);
  const [delay, setDelay] = useState(30);
  return (
    <Modal title="Chạy hàng loạt" onClose={onClose} footer={<>
      <button className="btn-outline" onClick={onClose}>Huỷ</button>
      <button className="btn-primary" disabled={!sel.length} onClick={() => {
        startRuns(t.name, platform, profiles.filter((p) => sel.includes(p.id)).map((p) => p.name));
        toast.success(`Đã bắt đầu ${sel.length} lượt chạy`); onClose();
      }}>Bắt đầu chạy ({sel.length})</button>
    </>}>
      <div className="rounded-lg bg-muted p-3 text-sm"><b>{t.name}</b><p className="mt-1 text-xs text-muted-foreground">{t.desc}</p></div>
      <div className="mt-4 mb-2 flex justify-between text-xs font-semibold uppercase text-muted-foreground">Chọn tài khoản <button className="text-primary" onClick={() => setSel(sel.length === profiles.length ? [] : profiles.map((p) => p.id))}>Chọn tất cả</button></div>
      <div className="space-y-1">
        {profiles.map((p) => (
          <label key={p.id} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm">
            <input type="checkbox" checked={sel.includes(p.id)} onChange={() => setSel((s) => s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id])} />
            {p.name}<span className="ml-auto text-xs text-muted-foreground">{p.os}</span>
          </label>
        ))}
      </div>
      <label className="mt-4 block text-xs font-medium">Giãn cách giữa các nick (giây)<input type="number" className="input-base mt-1" value={delay} onChange={(e) => setDelay(+e.target.value)} /></label>
    </Modal>
  );
}
