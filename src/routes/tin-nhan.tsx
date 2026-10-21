import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/tin-nhan")({
  head: () => ({ meta: [
    { title: "Tin nhắn — NOVA Agents" },
    { name: "description", content: "Hộp thư tin nhắn khách hàng Agent đang xử lý." },
    { property: "og:title", content: "Tin nhắn — NOVA Agents" },
    { property: "og:description", content: "Hộp thư tin nhắn." },
  ]}),
  component: () => (
    <div>
      <PageHeader icon={MessageCircle} title="Tin nhắn" />
      <div className="p-6"><div className="card-base p-10 text-center text-sm text-muted-foreground">Chưa có tin nhắn. Bật automation "Tự trả lời tin nhắn FB" để Agent bắt đầu trả lời khách.</div></div>
    </div>
  ),
});
