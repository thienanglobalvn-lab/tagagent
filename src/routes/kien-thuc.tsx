import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Boxes, Plus, Package, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";
import { setState, uid, useStore, type Product } from "@/lib/store";

export const Route = createFileRoute("/kien-thuc")({
  head: () => ({ meta: [
    { title: "Kiến thức cho Agent — NOVA Agents" },
    { name: "description", content: "Thông tin sản phẩm, hỏi đáp và từ khoá để Agent trả lời khách." },
    { property: "og:title", content: "Kiến thức cho Agent — NOVA Agents" },
    { property: "og:description", content: "Kho kiến thức sản phẩm cho Agent." },
  ]}),
  component: Knowledge,
});

function Knowledge() {
  const products = useStore((s) => s.products);
  const [active, setActive] = useState(products[0]?.id);
  const [tab, setTab] = useState(1);
  const p = products.find((x) => x.id === active);
  const upd = (patch: Partial<Product>) => setState((s) => ({ products: s.products.map((x) => x.id === active ? { ...x, ...patch } : x) }));
  const add = () => { const n: Product = { id: uid(), name: "Sản phẩm mới", intro: "", description: "", cta: "", links: [], faqs: [], keywords: [] }; setState((s) => ({ products: [...s.products, n] })); setActive(n.id); };
  const tabs = ["Thông tin sản phẩm", `Hỏi đáp`, "Từ khoá"];
  return (
    <div>
      <PageHeader icon={Boxes} title="Kiến thức cho Agent" />
      <div className="flex">
        <div className="w-56 shrink-0 border-r p-3">
          <button className="btn-outline w-full justify-center" onClick={add}><Plus className="h-4 w-4" />Thêm sản phẩm</button>
          <div className="mt-4 mb-1 text-[11px] uppercase text-muted-foreground">Sản phẩm ({products.length})</div>
          {products.map((x) => (
            <button key={x.id} onClick={() => setActive(x.id)} className={`flex w-full gap-2 rounded-lg p-2 text-left ${x.id === active ? "bg-primary-soft" : "hover:bg-muted"}`}>
              <Package className="mt-0.5 h-4 w-4 text-primary" /><div><div className="text-sm font-medium">{x.name}</div><div className="text-[11px] text-success">● AI đang dùng</div><div className="text-[11px] text-muted-foreground">{x.faqs.length} hỏi đáp</div></div>
            </button>
          ))}
        </div>
        {p && (
          <div className="flex-1 p-6">
            <div className="flex items-center justify-between">
              <input className="bg-transparent text-xl font-bold outline-none" value={p.name} onChange={(e) => upd({ name: e.target.value })} />
              <button className="flex items-center gap-1 text-sm text-destructive" onClick={() => { setState((s) => ({ products: s.products.filter((x) => x.id !== p.id) })); setActive(products.find((x) => x.id !== p.id)?.id); toast.success("Đã xoá"); }}><Trash2 className="h-4 w-4" />Xoá</button>
            </div>
            <div className="mt-3 flex gap-4 border-b">
              {tabs.map((t, i) => <button key={t} onClick={() => setTab(i + 1)} className={`border-b-2 pb-2 text-sm ${tab === i + 1 ? "border-primary font-semibold" : "border-transparent text-muted-foreground"}`}>{i + 1}. {t}{i === 1 && ` ${p.faqs.length}`}</button>)}
            </div>
            {tab === 1 && (
              <div className="card-base mt-4 space-y-3 p-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Tên sản phẩm" v={p.name} on={(v) => upd({ name: v })} />
                  <Field label="Câu giới thiệu ngắn" v={p.intro} on={(v) => upd({ intro: v })} />
                </div>
                <label className="block text-xs font-medium">Mô tả<textarea rows={3} className="input-base mt-1" value={p.description} onChange={(e) => upd({ description: e.target.value })} /></label>
                <Field label="Kêu gọi hành động" v={p.cta} on={(v) => upd({ cta: v })} />
                <div className="flex justify-between text-xs font-medium">Link<button className="text-primary" onClick={() => upd({ links: [...p.links, { label: "", url: "" }] })}>+ Thêm dòng</button></div>
                {p.links.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <input className="input-base !w-48" placeholder="Nhãn" value={l.label} onChange={(e) => upd({ links: p.links.map((x, j) => j === i ? { ...x, label: e.target.value } : x) })} />
                    <input className="input-base" placeholder="https://" value={l.url} onChange={(e) => upd({ links: p.links.map((x, j) => j === i ? { ...x, url: e.target.value } : x) })} />
                    <button onClick={() => upd({ links: p.links.filter((_, j) => j !== i) })}><X className="h-4 w-4 text-muted-foreground" /></button>
                  </div>
                ))}
              </div>
            )}
            {tab === 2 && (
              <div className="mt-4 space-y-3">
                <button className="btn-outline" onClick={() => upd({ faqs: [...p.faqs, { q: "", a: "" }] })}><Plus className="h-4 w-4" />Thêm hỏi đáp</button>
                {p.faqs.map((f, i) => (
                  <div key={i} className="card-base space-y-2 p-3">
                    <input className="input-base font-medium" placeholder="Câu hỏi" value={f.q} onChange={(e) => upd({ faqs: p.faqs.map((x, j) => j === i ? { ...x, q: e.target.value } : x) })} />
                    <textarea className="input-base" placeholder="Trả lời" value={f.a} onChange={(e) => upd({ faqs: p.faqs.map((x, j) => j === i ? { ...x, a: e.target.value } : x) })} />
                    <button className="text-xs text-destructive" onClick={() => upd({ faqs: p.faqs.filter((_, j) => j !== i) })}>Xoá</button>
                  </div>
                ))}
              </div>
            )}
            {tab === 3 && (
              <div className="card-base mt-4 p-4">
                <p className="text-xs text-muted-foreground">Từ khoá dùng để quét group và bình luận nhóm đúng sản phẩm. Nhấn Enter để thêm.</p>
                <input className="input-base mt-2" placeholder="Nhập từ khoá..." onKeyDown={(e) => { const v = e.currentTarget.value.trim(); if (e.key === "Enter" && v) { upd({ keywords: [...p.keywords, v] }); e.currentTarget.value = ""; } }} />
                <div className="mt-3 flex flex-wrap gap-2">{p.keywords.map((k) => <span key={k} className="flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs text-accent-foreground">{k}<button onClick={() => upd({ keywords: p.keywords.filter((x) => x !== k) })}><X className="h-3 w-3" /></button></span>)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, v, on }: { label: string; v: string; on: (v: string) => void }) {
  return <label className="block text-xs font-medium"><span className={v ? "text-success" : "text-warning"}>● </span>{label}<input className="input-base mt-1" value={v} onChange={(e) => on(e.target.value)} /></label>;
}
