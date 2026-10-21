import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Sparkles, History, ArrowUp, ChevronRight } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/tro-ly-ai")({
  head: () => ({ meta: [
    { title: "Trợ lý AI — NOVA Agents" },
    { name: "description", content: "Hỏi trợ lý về tình hình app, nick, proxy và sự cố." },
    { property: "og:title", content: "Trợ lý AI — NOVA Agents" },
    { property: "og:description", content: "Trợ lý AI trong app." },
  ]}),
  component: Assistant,
});

function Assistant() {
  const chat = useStore((s) => s.chat);
  const st = useStore((s) => s);
  const [text, setText] = useState("");
  const [cfg, setCfg] = useState(false);
  const answer = (q: string) => {
    const l = q.toLowerCase();
    const run = st.runs.length, err = st.runs.filter((r) => r.status === "error").length;
    if (l.includes("làm được")) return "App giúp bạn: quản lý nhiều tài khoản trong môi trường riêng biệt, đăng bài / tương tác / trả lời bình luận và tin nhắn bằng AI trên Facebook, TikTok, YouTube, Threads, Instagram, X, Reddit, và chạy hàng loạt theo lịch.";
    if (l.includes("hàng loạt")) return "Vào **Automation** → chọn nền tảng → bấm **Chạy hàng loạt** ở mẫu bạn muốn → tick các tài khoản → **Bắt đầu chạy**.";
    if (l.includes("sự cố") || l.includes("lỗi")) return `Hiện có ${run} lượt chạy, ${err} lượt lỗi. ${st.profiles.filter((p) => !p.proxy).length} profile chưa gắn proxy — nên gắn proxy để an toàn hơn.`;
    if (l.includes("proxy")) return `Bạn có ${st.proxies.length} proxy. Thêm proxy tại mục **Proxy**.`;
    return `Bạn đang có ${st.profiles.length} tài khoản và ${st.contents.filter((c) => c.status === "pending").length} bài chờ duyệt. Hãy hỏi cụ thể hơn về nick, proxy hoặc automation nhé.`;
  };
  const send = (q: string) => {
    if (!q.trim()) return;
    setState((s) => ({ chat: [...s.chat, { role: "user", content: q }, { role: "assistant", content: answer(q) }] }));
    setText("");
  };
  return (
    <div>
      <PageHeader icon={Bot} title="Trợ lý AI" />
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <div className="card-base flex items-center gap-3 p-5">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><Sparkles className="h-4 w-4" /></div>
          <div><div className="text-sm font-semibold">Trợ lý AI đã sẵn sàng</div><div className="text-xs text-success">● Đang dùng: Gemini</div></div>
        </div>
        <div className="card-base">
          <div className="flex justify-between border-b px-4 py-2.5 text-sm font-medium"><span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Trợ lý AI</span><button onClick={() => setState(() => ({ chat: [] }))} className="flex items-center gap-1 text-xs text-muted-foreground"><History className="h-3.5 w-3.5" />Xoá lịch sử</button></div>
          <div className="h-80 space-y-3 overflow-y-auto p-4">
            {chat.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary-soft text-primary"><Sparkles className="h-4 w-4" /></div>
                <p className="text-sm text-muted-foreground">Hỏi trợ lý bất cứ điều gì về app của bạn.</p>
                <div className="flex flex-wrap justify-center gap-2">{["App này làm được gì?", "Làm sao đăng bài hàng loạt?", "App có sự cố gì không?"].map((s) => <button key={s} onClick={() => send(s)} className="rounded-full border px-3 py-1 text-xs hover:border-primary">{s}</button>)}</div>
              </div>
            ) : chat.map((m, i) => (
              <div key={i} className={m.role === "user" ? "ml-auto max-w-[80%] rounded-2xl bg-gradient-primary px-3 py-2 text-sm text-primary-foreground" : "max-w-[85%] text-sm"} dangerouslySetInnerHTML={{ __html: m.content.replace(/[<>]/g, "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }} />
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2 border-t p-3">
            <input autoFocus className="input-base" placeholder="Hỏi trợ lý về tình hình app, nick, proxy, sự cố..." value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn-primary !px-2.5"><ArrowUp className="h-4 w-4" /></button>
          </form>
        </div>
        <div className="card-base p-4">
          <button onClick={() => setCfg(!cfg)} className="flex items-center gap-2 text-sm"><ChevronRight className={`h-4 w-4 transition ${cfg ? "rotate-90" : ""}`} /><b>Cài đặt AI</b><span className="text-xs text-muted-foreground">· API key hoặc endpoint — cần ít nhất 1 nguồn để dùng AI.</span></button>
          {cfg && <div className="mt-3 grid gap-2">{["Gemini", "Groq", "OpenAI"].map((p) => <label key={p} className="text-xs font-medium">{p} API key<input type="password" className="input-base mt-1" placeholder="Dán API key..." /></label>)}</div>}
        </div>
      </div>
    </div>
  );
}
