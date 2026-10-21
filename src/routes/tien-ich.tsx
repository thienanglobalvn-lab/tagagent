import { createFileRoute } from "@tanstack/react-router";
import { Puzzle, Send, Image, FileSpreadsheet, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/tien-ich")({
  head: () => ({ meta: [
    { title: "Tiện ích — NOVA Agents" },
    { name: "description", content: "Kết nối Telegram, tạo ảnh AI, xuất dữ liệu và lịch hẹn." },
    { property: "og:title", content: "Tiện ích — NOVA Agents" },
    { property: "og:description", content: "Tiện ích mở rộng cho Agent." },
  ]}),
  component: () => (
    <div>
      <PageHeader icon={Puzzle} title="Tiện ích" />
      <div className="grid grid-cols-2 gap-3 p-6 lg:grid-cols-4">
        {[{ i: Send, t: "Kết nối Telegram", d: "Giao việc cho Agent qua Telegram" }, { i: Image, t: "Tạo ảnh AI", d: "Tạo ảnh cho bài đăng" }, { i: FileSpreadsheet, t: "Xuất CSV", d: "Xuất nhật ký và dữ liệu quét" }, { i: Clock, t: "Lịch hẹn", d: "Đặt giờ chạy tự động hằng ngày" }].map((x) => (
          <button key={x.t} onClick={() => toast.info(`${x.t}: sắp ra mắt`)} className="card-base p-4 text-left hover:border-primary">
            <x.i className="h-5 w-5 text-primary" /><div className="mt-2 text-sm font-semibold">{x.t}</div><div className="text-xs text-muted-foreground">{x.d}</div>
          </button>
        ))}
      </div>
    </div>
  ),
});
