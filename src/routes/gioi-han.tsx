import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/gioi-han")({
  head: () => ({ meta: [
    { title: "Giới hạn nick — NOVA Agents" },
    { name: "description", content: "Đặt giới hạn hành động mỗi ngày cho từng nick." },
    { property: "og:title", content: "Giới hạn nick — NOVA Agents" },
    { property: "og:description", content: "Giới hạn hành động mỗi nick." },
  ]}),
  component: Limits,
});

function Limits() {
  const limits = useStore((s) => s.limits);
  return (
    <div>
      <PageHeader icon={ShieldCheck} title="Giới hạn nick" />
      <div className="mx-auto max-w-xl p-6"><div className="card-base space-y-4 p-5">
        {Object.entries(limits).map(([k, v]) => (
          <label key={k} className="flex items-center justify-between gap-4 text-sm">{k}
            <input type="number" min={0} className="input-base !w-28" value={v} onChange={(e) => setState((s) => ({ limits: { ...s.limits, [k]: +e.target.value } }))} />
          </label>
        ))}
      </div></div>
    </div>
  );
}
