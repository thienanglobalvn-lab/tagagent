import { useSyncExternalStore } from "react";

export type Profile = {
  id: number; name: string; os: "Windows" | "macOS"; country: string; folder: string;
  tags: string[]; platform: string; cpu: number; ram: number; resolution: string; chrome: string;
  proxy: string; lastUsed: string | null; status: "Ready" | "Running";
};
export type Run = { id: string; template: string; platform: string; profile: string; status: "running" | "success" | "error"; at: number };
export type Content = { id: string; title: string; body: string; platform: string; status: "pending" | "approved" | "rejected"; at: number };
export type Group = { id: string; name: string; url: string; members: string; approved: boolean };
export type Proxy = { id: string; value: string; type: string; status: "live" | "unknown" };
export type Product = {
  id: string; name: string; intro: string; description: string; cta: string;
  links: { label: string; url: string }[]; faqs: { q: string; a: string }[]; keywords: string[];
};
export type Message = { role: "user" | "assistant"; content: string };

type State = {
  profiles: Profile[]; runs: Run[]; contents: Content[]; groups: Group[]; proxies: Proxy[];
  products: Product[]; chat: Message[]; limits: Record<string, number>;
};

const KEY = "agents-app-v1";
const initial: State = {
  profiles: [
    { id: 14, name: "FB2", os: "Windows", country: "VN", folder: "Facebook", tags: [], platform: "Facebook", cpu: 8, ram: 4, resolution: "1536×864", chrome: "Chrome 146", proxy: "", lastUsed: "41 phút trước", status: "Ready" },
    { id: 13, name: "AI Studio 1", os: "macOS", country: "VN", folder: "AI", tags: [], platform: "Google Flow", cpu: 16, ram: 4, resolution: "2560×1440", chrome: "Chrome 146", proxy: "", lastUsed: "38 phút trước", status: "Ready" },
    { id: 12, name: "FB Ads VN 02", os: "Windows", country: "VN", folder: "Ads", tags: ["facebook", "shopee"], platform: "", cpu: 12, ram: 4, resolution: "1366×768", chrome: "Chrome 146", proxy: "", lastUsed: null, status: "Ready" },
    { id: 11, name: "FB Ads VN 01", os: "macOS", country: "VN", folder: "Ads", tags: ["facebook"], platform: "", cpu: 16, ram: 8, resolution: "3840×2160", chrome: "Chrome 146", proxy: "", lastUsed: null, status: "Ready" },
  ],
  runs: [], contents: [
    { id: "c1", title: "Giới thiệu sản phẩm mới", body: "Ra mắt công cụ tự động hoá đăng bài đa nền tảng, tiết kiệm 5 giờ mỗi ngày!", platform: "Facebook", status: "pending", at: Date.now() },
  ],
  groups: [
    { id: "g1", name: "Cộng đồng Marketing Online", url: "https://facebook.com/groups/mkt", members: "120K", approved: true },
    { id: "g2", name: "Hội bán hàng Shopee", url: "https://facebook.com/groups/shopee", members: "85K", approved: false },
  ],
  proxies: [],
  products: [{
    id: "p1", name: "Loha Page", intro: "", description: "Phần mềm cài trên máy tính giúp một người vận hành hàng nghìn Fanpage và tài khoản Instagram Business.",
    cta: "Tải về và xem demo trên website hoặc liên hệ hotline.",
    links: [{ label: "Website chính thức", url: "https://example.com" }, { label: "Trang demo", url: "https://example.com/demo" }],
    faqs: [{ q: "App chạy trên hệ điều hành nào?", a: "Windows và macOS." }], keywords: [],
  }],
  chat: [], limits: { "Đăng bài / ngày": 10, "Bình luận / ngày": 30, "Kết bạn / ngày": 20, "Tin nhắn / ngày": 50 },
};

let state: State = initial;
if (typeof window !== "undefined") {
  try { const s = localStorage.getItem(KEY); if (s) state = { ...initial, ...JSON.parse(s) }; } catch {}
}
const listeners = new Set<() => void>();
export function setState(fn: (s: State) => Partial<State>) {
  state = { ...state, ...fn(state) };
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => { listeners.add(l); return () => listeners.delete(l); },
    () => sel(state), () => sel(initial),
  );
}
export const uid = () => Math.random().toString(36).slice(2, 9);

export function startRuns(template: string, platform: string, profileNames: string[]) {
  const runs: Run[] = profileNames.map((p) => ({ id: uid(), template, platform, profile: p, status: "running", at: Date.now() }));
  setState((s) => ({ runs: [...runs, ...s.runs] }));
  runs.forEach((r, i) => setTimeout(() => {
    setState((s) => ({ runs: s.runs.map((x) => x.id === r.id ? { ...x, status: Math.random() < 0.85 ? "success" : "error" } : x) }));
  }, 2500 + i * 1200));
}
