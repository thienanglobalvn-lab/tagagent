export type Template = { name: string; desc: string; group: string };
export const platforms = ["Facebook", "TikTok", "YouTube", "Threads", "Instagram", "X", "Reddit"] as const;

export const templates: Record<string, Template[]> = {
  Facebook: [
    { group: "Đăng bài", name: "Đăng bài AI đã duyệt vào nhóm FB (theo sản phẩm)", desc: "Mỗi lượt: nick lấy bài ĐÃ DUYỆT của sản phẩm và đăng vào nhóm." },
    { group: "Đăng bài", name: "Đăng status Facebook theo folder", desc: "Đăng status FB lên timeline cá nhân — mỗi lượt 1 bài từ folder." },
    { group: "Đăng bài", name: "Đăng bài trong nhóm FB (theo link)", desc: "Đăng bài (chữ + ảnh/video) vào các nhóm theo danh sách link." },
    { group: "Đăng bài", name: "Đăng bài AI đã duyệt lên tường FB (theo sản phẩm)", desc: "Mỗi lượt: nick lấy bài ĐÃ DUYỆT của sản phẩm và đăng lên tường." },
    { group: "Tương tác", name: "Tương tác bài viết FB (thích, cảm xúc, bình luận, chia sẻ)", desc: "Tương tác bài viết FB (bản ổn định). Hỗ trợ nhiều link." },
    { group: "Tương tác", name: "Nuôi nick Facebook (lướt bảng tin)", desc: "Mỗi lượt lướt bảng tin trang chủ Facebook như người thật." },
    { group: "Tương tác", name: "Bình luận nhóm FB theo sản phẩm (AI + duyệt)", desc: "Mỗi lượt: nick nhận ĐÚNG 1 group của sản phẩm và bình luận." },
    { group: "Tương tác", name: "Bình luận nhóm FB theo link (AI)", desc: "Dán link group → app lưu các group vào kho và bình luận." },
    { group: "Tương tác", name: "Tự trả lời bình luận FB (AI + Kiến thức cho Agent)", desc: "Mỗi lượt: đọc thông báo của nick → mở bình luận và trả lời." },
    { group: "Tương tác", name: "Tự trả lời tin nhắn FB (AI + Kiến thức cho Agent)", desc: "Mỗi lượt: đọc đoạn chat + tin nhắn đang chờ và trả lời." },
    { group: "Tương tác", name: "Tương tác bài app đã đăng trong group (AI bình luận)", desc: "Nick tương tác của group (phân công đều)." },
    { group: "Kết bạn & nhắn tin", name: "Nhắn tin Messenger (danh sách người nhận)", desc: "Gửi 1 tin nhắn Messenger cho DANH SÁCH người nhận." },
    { group: "Kết bạn & nhắn tin", name: "Tham gia group theo sản phẩm (AI trả lời câu hỏi)", desc: "Mỗi group ĐÃ DUYỆT trong Kho group của sản phẩm." },
  ],
  TikTok: [
    { group: "Đăng bài", name: "Đăng video TikTok từ folder", desc: "Mỗi lượt đăng 1 video kèm caption AI." },
    { group: "Tương tác", name: "Nuôi nick TikTok (lướt For You)", desc: "Xem, thích, lưu video như người thật." },
    { group: "Tương tác", name: "Thích · bình luận · lưu video", desc: "Tương tác theo danh sách link video." },
    { group: "Tương tác", name: "Bình luận LIVE", desc: "Gửi bình luận vào phiên LIVE theo link." },
    { group: "Tương tác", name: "Tự trả lời bình luận TikTok (AI)", desc: "Đọc bình luận mới và trả lời bằng AI." },
  ],
  YouTube: [{ group: "Đăng bài", name: "Upload video YouTube từ folder (hẹn giờ)", desc: "Upload nhiều kênh cùng lúc theo lịch." }],
  Threads: [
    { group: "Đăng bài", name: "Đăng bài Threads", desc: "Đăng bài chữ/ảnh lên Threads." },
    { group: "Đăng bài", name: "Đăng bài AI viết lên Threads", desc: "AI viết bài theo sản phẩm rồi đăng." },
    { group: "Tương tác", name: "Thích · trả lời · repost", desc: "Tương tác theo từ khoá." },
    { group: "Tương tác", name: "Tự trả lời bình luận Threads", desc: "Trả lời bình luận bằng AI." },
    { group: "Tương tác", name: "Nuôi nick Threads", desc: "Lướt bảng tin như người thật." },
    { group: "Tương tác", name: "Theo dõi theo danh sách", desc: "Follow danh sách tài khoản." },
    { group: "Tương tác", name: "Quét người dùng ra CSV", desc: "Thu thập danh sách người dùng theo từ khoá." },
  ],
  Instagram: [
    { group: "Đăng bài", name: "Đăng ảnh Instagram", desc: "Đăng ảnh kèm caption AI." },
    { group: "Đăng bài", name: "Đăng Reels", desc: "Đăng Reels từ folder video." },
    { group: "Tương tác", name: "Thích · bình luận · follow", desc: "Tương tác theo hashtag." },
    { group: "Tương tác", name: "Tự trả lời bình luận IG", desc: "Trả lời bình luận bằng AI." },
    { group: "Tương tác", name: "Nuôi nick Instagram", desc: "Lướt feed và stories." },
    { group: "Kết bạn & nhắn tin", name: "Nhắn tin DM theo danh sách", desc: "Gửi DM cho danh sách người nhận." },
  ],
  X: [
    { group: "Đăng bài", name: "Đăng tweet & thread", desc: "Đăng bài hoặc chuỗi thread." },
    { group: "Đăng bài", name: "Ghim bài lên hồ sơ", desc: "Ghim bài viết mới nhất." },
    { group: "Tương tác", name: "AI trả lời theo từ khoá", desc: "Tìm tweet theo từ khoá và trả lời." },
    { group: "Tương tác", name: "Thích · repost", desc: "Tương tác theo danh sách link." },
    { group: "Tương tác", name: "Nuôi nick X", desc: "Lướt timeline như người thật." },
  ],
  Reddit: [
    { group: "Đăng bài", name: "Đăng bài vào subreddit", desc: "Đăng bài vào danh sách subreddit." },
    { group: "Tương tác", name: "AI bình luận bài mới", desc: "Bình luận bài mới theo subreddit." },
    { group: "Kết bạn & nhắn tin", name: "Tham gia sub theo danh sách", desc: "Join các subreddit từ danh sách." },
    { group: "Tương tác", name: "Nuôi nick Reddit", desc: "Lướt và upvote." },
  ],
};
