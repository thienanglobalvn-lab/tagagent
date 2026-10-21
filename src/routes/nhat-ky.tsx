import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { setState, useStore } from "@/lib/store";

export const Route = createFileRoute("/nhat-ky")({
  head: () => ({ meta: [
    { title: "Nhật ký hoạt động — NOVA Agents" },
    { name: "description", content: "Lịch sử mọi lượt chạy tự động hoá." },
    { property: "og:title", content: "Nhật ký hoạt động — NOVA Agents" },
    { property: "og:description", content: "Lịch sử lượt chạy." },
  ]}),
  component: Logs,
});

const badge = { running: "bg-primary-soft text-primary", success: "bg-success-soft text-success", error: "bg-destructive-soft text-destructive" };
const label = { running: "Đang chạy", success: "Thành công", error: "Lỗi" };

function Logs() {
  const runs = useStore((s) => s.runs);
  return (
    <div>
      <PageHeader icon={Activity} title="Nhật ký hoạt động" right={runs.length > 0 && <button className="btn-outline" onClick={() => setState(() => ({ runs: [] }))}>Xoá nhật ký</button>} />
      <div className="p-6">
        <div className="card-base overflow-hidden">
          {runs.length === 0 ? <p className="p-10 text-center text-sm text-muted-foreground">Chưa có lượt chạy nào. Vào Automation để bắt đầu.</p> : (
            <table className="w-full text-sm">
              <thead className="border-b text-left text-[11px] uppercase text-muted-foreground"><tr><th className="p-3">Thời gian</th><th>Nền tảng</th><th>Automation</th><th>Tài khoản</th><th>Trạng thái</th></tr></thead>
              <tbody>{runs.map((r) => (
                <tr key={r.id} className="border-b last:border-0">
                  <td className="p-3 text-xs text-muted-foreground">{new Date(r.at).toLocaleString("vi-VN")}</td>
                  <td>{r.platform}</td><td className="max-w-xs truncate">{r.template}</td><td>{r.profile}</td>
                  <td><span className={`rounded-full px-2 py-0.5 text-xs ${badge[r.status]}`}>{label[r.status]}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
