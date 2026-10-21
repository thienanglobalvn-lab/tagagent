import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Play, Square, Trash2, AlertTriangle, Shuffle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/AppShell";
import { setState, useStore, type Profile } from "@/lib/store";

export const Route = createFileRoute("/tai-khoan")({
  head: () => ({ meta: [
    { title: "Tài khoản — NOVA Agents" },
    { name: "description", content: "Quản lý profile trình duyệt riêng biệt cho từng tài khoản." },
    { property: "og:title", content: "Tài khoản — NOVA Agents" },
    { property: "og:description", content: "Quản lý profile anti-detect." },
  ]}),
  component: Accounts,
});

function Accounts() {
  const profiles = useStore((s) => s.profiles);
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("");
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState<number[]>([]);
  const list = profiles.filter((p) => (p.name + p.tags.join(" ")).toLowerCase().includes(q.toLowerCase()) && (!country || p.country === country));
  const toggle = (p: Profile) => setState((s) => ({ profiles: s.profiles.map((x) => x.id === p.id ? { ...x, status: x.status === "Ready" ? "Running" : "Ready", lastUsed: "Vừa xong" } : x) }));
  return (
    <div>
      <div className="flex items-center gap-3 border-b bg-card px-6 py-3">
        <h1 className="font-semibold">Profiles <span className="ml-1 rounded bg-muted px-1.5 text-xs">{profiles.length}</span></h1>
        <div className="relative w-72"><Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" /><input className="input-base pl-8" placeholder="Tìm theo tên, tag, ghi chú..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input-base !w-40" value={country} onChange={(e) => setCountry(e.target.value)}><option value="">Mọi quốc gia</option><option>VN</option><option>US</option></select>
        <div className="ml-auto flex gap-2">
          {sel.length > 0 && <button className="btn-outline text-destructive" onClick={() => { setState((s) => ({ profiles: s.profiles.filter((p) => !sel.includes(p.id)) })); setSel([]); toast.success("Đã xoá"); }}><Trash2 className="h-4 w-4" />Xoá {sel.length}</button>}
          <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />Profile mới</button>
        </div>
      </div>
      <div className="p-6">
        <label className="mb-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={sel.length === list.length && list.length > 0} onChange={() => setSel(sel.length === list.length ? [] : list.map((p) => p.id))} />Chọn tất cả {list.length} profile đang hiện</label>
        <div className="card-base overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b text-left text-[11px] uppercase text-muted-foreground"><tr>{["STT", "OS", "", "Tên", "Cấu hình máy", "Tags", "Proxy", "Lần dùng", ""].map((h, i) => <th key={i} className="px-3 py-2 font-medium">{h}</th>)}</tr></thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="px-3 py-3 text-muted-foreground">{p.id}</td>
                  <td className="px-3">{p.os === "Windows" ? "⊞" : ""}</td>
                  <td className="px-3"><input type="checkbox" checked={sel.includes(p.id)} onChange={() => setSel((s) => s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id])} /></td>
                  <td className="px-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">{p.country} · <span className={p.status === "Running" ? "text-primary" : "text-success"}>● {p.status}</span></div>
                    {p.platform && <span className="mt-1 inline-block rounded border border-primary/30 bg-primary-soft px-1.5 text-[10px] text-primary">{p.platform}</span>}
                  </td>
                  <td className="px-3 text-xs"><div>{p.cpu}c · {p.ram}GB · {p.resolution}</div><div className="text-muted-foreground">{p.chrome}</div></td>
                  <td className="px-3">{p.tags.length ? p.tags.map((t) => <span key={t} className="mr-1 rounded bg-muted px-1.5 text-[10px]">{t}</span>) : "—"}</td>
                  <td className="px-3">{p.proxy ? <span className="text-xs">{p.proxy}</span> : <span className="inline-flex items-center gap-1 rounded border border-destructive/40 bg-destructive-soft px-1.5 py-0.5 text-[10px] text-destructive"><AlertTriangle className="h-3 w-3" />Chưa proxy — IP thật</span>}</td>
                  <td className="px-3 text-xs text-muted-foreground">{p.lastUsed ?? "Chưa dùng"}</td>
                  <td className="px-3 text-right"><button className="btn-primary !py-1 !text-xs" onClick={() => toggle(p)}>{p.status === "Running" ? <><Square className="h-3 w-3" />Dừng</> : <><Play className="h-3 w-3" />Khởi chạy</>}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {open && <NewProfile onClose={() => setOpen(false)} />}
    </div>
  );
}

const resolutions = ["1920×1080", "1366×768", "1536×864", "2560×1440", "3840×2160"];
function NewProfile({ onClose }: { onClose: () => void }) {
  const proxies = useStore((s) => s.proxies);
  const [f, setF] = useState({ name: "", country: "VN", os: "Windows" as Profile["os"], folder: "", qty: 1, tags: "", proxy: "", chrome: "146.0.7680.177 (Latest)", resolution: "1920×1080" });
  const [adv, setAdv] = useState(false); const [hum, setHum] = useState(false);
  const set = (k: string, v: any) => setF((x) => ({ ...x, [k]: v }));
  const random = () => setF((x) => ({ ...x, os: Math.random() > 0.5 ? "Windows" : "macOS", resolution: resolutions[Math.floor(Math.random() * resolutions.length)] }));
  const create = () => {
    if (!f.name.trim()) return toast.error("Vui lòng nhập tên");
    setState((s) => {
      const base = Math.max(0, ...s.profiles.map((p) => p.id));
      const n: Profile[] = Array.from({ length: f.qty }, (_, i) => ({
        id: base + i + 1, name: f.qty > 1 ? `${f.name} ${i + 1}` : f.name, os: f.os, country: f.country, folder: f.folder,
        tags: f.tags.split(",").map((t) => t.trim()).filter(Boolean), platform: "", cpu: [8, 12, 16][i % 3], ram: [4, 8][i % 2],
        resolution: f.resolution, chrome: "Chrome 146", proxy: f.proxy, lastUsed: null, status: "Ready",
      }));
      return { profiles: [...n.reverse(), ...s.profiles] };
    });
    toast.success("Đã tạo profile"); onClose();
  };
  const L = "text-xs font-medium";
  return (
    <Modal title="Tạo profile mới" onClose={onClose} footer={<>
      <button className="btn-outline mr-auto" onClick={random}><Shuffle className="h-4 w-4" />Random</button>
      <button className="btn-outline" onClick={onClose}>Huỷ</button><button className="btn-primary" onClick={create}>Tạo profile</button>
    </>}>
      <div className="text-[11px] font-bold uppercase text-muted-foreground">Cơ bản</div>
      <label className={`${L} mt-2 block`}>Tên *<input className="input-base mt-1" placeholder="VD: FB Ads VN - Account 01" value={f.name} onChange={(e) => set("name", e.target.value)} /></label>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <label className={L}>Quốc gia<select className="input-base mt-1" value={f.country} onChange={(e) => set("country", e.target.value)}><option value="VN">Vietnam (VN)</option><option value="US">United States (US)</option></select></label>
        <label className={L}>OS Platform<select className="input-base mt-1" value={f.os} onChange={(e) => set("os", e.target.value)}><option>Windows</option><option>macOS</option></select></label>
        <label className={L}>Thư mục (optional)<input className="input-base mt-1" placeholder="Chọn hoặc gõ tên folder mới" value={f.folder} onChange={(e) => set("folder", e.target.value)} /></label>
        <label className={L}>Số lượng<input type="number" min={1} max={50} className="input-base mt-1" value={f.qty} onChange={(e) => set("qty", Math.max(1, +e.target.value))} /></label>
      </div>
      <label className={`${L} mt-3 block`}>Tag<input className="input-base mt-1" placeholder="Phân cách bằng dấu phẩy" value={f.tags} onChange={(e) => set("tags", e.target.value)} /></label>
      <div className="mt-4 rounded-xl border p-3">
        <div className="text-[11px] font-bold uppercase text-muted-foreground">Anti-detect quan trọng</div>
        <div className="mt-2 grid grid-cols-2 gap-3">
          <label className={L}>Proxy<select className="input-base mt-1" value={f.proxy} onChange={(e) => set("proxy", e.target.value)}><option value="">Không proxy (dùng IP máy)</option>{proxies.map((p) => <option key={p.id}>{p.value}</option>)}</select></label>
          <label className={L}>WebRTC<input disabled className="input-base mt-1 bg-muted" value="Chặn hoàn toàn (luôn bật)" /></label>
          <label className={L}>Chrome version<select className="input-base mt-1" value={f.chrome} onChange={(e) => set("chrome", e.target.value)}><option>146.0.7680.177 (Latest)</option><option>145.0.7632.110</option></select></label>
          <label className={L}>Screen resolution<select className="input-base mt-1" value={f.resolution} onChange={(e) => set("resolution", e.target.value)}>{resolutions.map((r) => <option key={r}>{r}</option>)}</select></label>
        </div>
      </div>
      {[{ t: "Tuỳ chọn nâng cao", d: "WebGL GPU, hardware, noise levels, fonts, UA override", o: adv, s: setAdv }, { t: "Hành vi humanize", d: "Mouse jitter, scroll curves, typing delay, DNT", o: hum, s: setHum }].map((x) => (
        <div key={x.t} className="mt-3 rounded-xl border p-3">
          <button className="flex w-full items-center gap-2 text-left" onClick={() => x.s(!x.o)}><ChevronRight className={`h-4 w-4 transition ${x.o ? "rotate-90" : ""}`} /><div><div className="text-sm font-medium">{x.t}</div><div className="text-xs text-muted-foreground">{x.d}</div></div></button>
          {x.o && <div className="mt-3 grid grid-cols-2 gap-2 text-xs">{x.d.split(", ").map((k) => <label key={k} className="flex items-center gap-2"><input type="checkbox" defaultChecked />{k}</label>)}</div>}
        </div>
      ))}
    </Modal>
  );
}
