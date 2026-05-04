import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Tag, Spin, message, Row, Col, Card,
  Rate, Input, Button, Avatar, Divider, Progress,
} from "antd";
import {
  BookOutlined, UserOutlined, CalendarOutlined, TagOutlined,
  StarOutlined, SendOutlined,
} from "@ant-design/icons";
import axiosClient from "../../services/axiosClient";
import { getSachById, getSachs } from "../../services/Admin_API/SachAPI";
import { parseJwt } from "../../ultilities/parseJwt";

const bgColors = ["#E1F5EE", "#EEEDFE", "#FAECE7", "#FAEEDA"];

const sampleReviews = [
  { name: "Nguyễn Minh A", rating: 5, comment: "Sách rất hay, nội dung phong phú và dễ đọc!", date: "12/04/2026" },
  { name: "Trần Thị B",    rating: 4, comment: "Nội dung tốt, phù hợp với người mới bắt đầu.",  date: "08/04/2026" },
  { name: "Lê Văn C",      rating: 5, comment: "Một trong những cuốn sách hay nhất tôi từng đọc.", date: "01/04/2026" },
];

function BookDetail() {
  const { id }     = useParams();
  const navigate   = useNavigate();

  const [book, setBook]           = useState(null);
  const [copies, setCopies]       = useState([]);
  const [related, setRelated]     = useState([]);
  const [loadingBorrow, setLoadingBorrow] = useState(false);
  const [reviews, setReviews]     = useState(sampleReviews);
  const [myRating, setMyRating]   = useState(0);
  const [myComment, setMyComment] = useState("");

  const fetchBook = async () => {
    try {
      const res = await getSachById(id);
      setBook(res.data.data);
    } catch (err) { console.log(err); }
  };

  const fetchCopies = async () => {
    try {
      const res = await axiosClient.get(`/BanSao/by-sach/${id}`);
      setCopies(res.data.data);
    } catch (err) { console.log(err); }
  };

  const fetchRelated = async () => {
    try {
      const res = await getSachs();
      const all = res.data.data;
      setRelated(all.filter((s) => s.maSach !== id).slice(0, 4));
    } catch (err) { console.log(err); }
  };

  useEffect(() => {
    fetchBook();
    fetchCopies();
    fetchRelated();
  }, [id]);

  const handleBorrow = async () => {
    try {
      setLoadingBorrow(true);
      const token    = localStorage.getItem("token");
      const user     = parseJwt(token);
      const maBanDoc = user?.maBanDoc || user?.MaBanDoc;

      if (!maBanDoc) { message.error("Không xác định được người dùng"); return; }

      const available = copies.find(
        (x) => x.trangThai?.toLowerCase().trim() === "có sẵn"
      );

      if (!available) {
        const confirmReserve = window.confirm("Hết sách, bạn có muốn đặt chỗ không?");
        if (confirmReserve) {
          await axiosClient.post("/PhieuMuon/dat-cho", { maSach: id, maBanDoc });
          message.success("Đặt chỗ thành công");
        }
        return;
      }

      await axiosClient.post("/PhieuMuon", {
        maBanDoc,
        maBanSao: available.maBanSao,
        ngayMuon: new Date(),
        hanTra:   new Date(Date.now() + 7 * 86400000),
      });
      message.success("Mượn sách thành công!");
      fetchCopies();
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi mượn sách");
    } finally {
      setLoadingBorrow(false);
    }
  };

  const handleSubmitReview = () => {
    if (!myRating)        { message.warning("Vui lòng chọn số sao"); return; }
    if (!myComment.trim()) { message.warning("Vui lòng nhập nhận xét"); return; }
    setReviews([{
      name:    "Bạn",
      rating:  myRating,
      comment: myComment,
      date:    new Date().toLocaleDateString("vi-VN"),
    }, ...reviews]);
    setMyRating(0);
    setMyComment("");
    message.success("Đã gửi đánh giá!");
  };

  if (!book) return (
    <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
      <Spin size="large" />
    </div>
  );

  const coSan    = copies.filter((c) => c.trangThai === "Có sẵn").length;
  const dangMuon = copies.filter((c) => c.trangThai === "Đang mượn").length;
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── THÔNG TIN CHÍNH ── */}
      <Card
        style={{ borderRadius: 16, border: "0.5px solid #EEECEA", marginBottom: 24 }}
        bodyStyle={{ padding: "36px 40px" }}
      >
        <Row gutter={40}>

          {/* ẢNH BÌA */}
          <Col span={7}>
            {book.anhBiaUrl ? (
              <img
                src={book.anhBiaUrl}
                alt={book.tieuDe}
                style={{
                  width: "100%", borderRadius: 12,
                  objectFit: "cover", maxHeight: 340,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                }}
              />
            ) : (
              <div style={{
                height: 300, background: bgColors[0], borderRadius: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BookOutlined style={{ fontSize: 52, opacity: 0.3 }} />
              </div>
            )}
          </Col>

          {/* THÔNG TIN */}
          <Col span={17}>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 28, fontWeight: 600,
              color: "#1a1a18", marginBottom: 6, lineHeight: 1.3,
            }}>
              {book.tieuDe}
            </h1>

            {/* RATING NHANH */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <Rate disabled value={Math.round(avgRating)} style={{ fontSize: 14 }} />
              <span style={{ fontSize: 13, color: "#888" }}>
                {avgRating.toFixed(1)} ({reviews.length} đánh giá)
              </span>
            </div>

            {/* CHI TIẾT */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 22 }}>
              {[
                { icon: <UserOutlined />,     label: "Tác giả",      value: book.tacGia },
                { icon: <CalendarOutlined />, label: "Năm xuất bản", value: book.namXuatBan },
                { icon: <TagOutlined />,      label: "Thể loại",     value: book.theLoai || "Chưa phân loại" },
              ].map((row) => (
                <div key={row.label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span style={{ color: "#aaa", width: 16 }}>{row.icon}</span>
                  <span style={{ fontSize: 13, color: "#888", width: 110 }}>{row.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* TÌNH TRẠNG BẢN SAO */}
            <div style={{
              background: "#F5F4F0", borderRadius: 10,
              padding: "14px 20px", marginBottom: 22,
              display: "flex", gap: 32, alignItems: "center",
            }}>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Có sẵn</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#27500A" }}>{coSan}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Đang mượn</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#BA7517" }}>{dangMuon}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", marginBottom: 4 }}>Tổng bản sao</div>
                <div style={{ fontSize: 22, fontWeight: 600, color: "#1a1a18" }}>{copies.length}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", flexWrap: "wrap", gap: 4, maxWidth: 200 }}>
                {copies.map((c) => (
                  <Tag
                    key={c.maBanSao}
                    color={
                      c.trangThai === "Có sẵn"    ? "green"  :
                      c.trangThai === "Đang mượn" ? "orange" : "red"
                    }
                    style={{ borderRadius: 6 }}
                  >
                    {c.maBanSao} — {c.trangThai}
                  </Tag>
                ))}
              </div>
            </div>

            {/* NÚT MƯỢN */}
            <Button
              onClick={handleBorrow}
              loading={loadingBorrow}
              style={{
                height: 44, padding: "0 36px",
                background: "#2C2C2A", color: "#F1EFE8",
                border: "none", borderRadius: 10,
                fontWeight: 500, fontSize: 14,
              }}
            >
              {coSan > 0 ? "Mượn sách" : "Đặt chỗ trước"}
            </Button>
          </Col>

        </Row>
      </Card>

      {/* ── TÓM TẮT ── */}
      {book.tomTat && (
        <Card
          style={{ borderRadius: 16, border: "0.5px solid #EEECEA", marginBottom: 24 }}
          bodyStyle={{ padding: "28px 36px" }}
        >
          <div style={{
            fontSize: 11, letterSpacing: "0.08em", color: "#aaa",
            textTransform: "uppercase", marginBottom: 14,
          }}>
            Tóm tắt nội dung
          </div>
          <p style={{ fontSize: 14, color: "#444", lineHeight: 1.85, margin: 0 }}>
            {book.tomTat}
          </p>
        </Card>
      )}

      {/* ── ĐÁNH GIÁ ── */}
      <Card
        style={{ borderRadius: 16, border: "0.5px solid #EEECEA", marginBottom: 24 }}
        bodyStyle={{ padding: "28px 36px" }}
      >
        <div style={{
          fontSize: 11, letterSpacing: "0.08em", color: "#aaa",
          textTransform: "uppercase", marginBottom: 24,
        }}>
          Đánh giá từ độc giả
        </div>

        <Row gutter={40}>
          {/* TỔNG QUAN RATING */}
          <Col span={6}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 52, fontWeight: 600,
                color: "#1a1a18", lineHeight: 1,
              }}>
                {avgRating.toFixed(1)}
              </div>
              <Rate disabled value={avgRating} style={{ fontSize: 14, margin: "8px 0" }} />
              <div style={{ fontSize: 12, color: "#888" }}>{reviews.length} đánh giá</div>
            </div>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              return (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "#888", width: 10 }}>{star}</span>
                  <StarOutlined style={{ fontSize: 11, color: "#FFC53D" }} />
                  <Progress
                    percent={Math.round((count / reviews.length) * 100)}
                    showInfo={false}
                    strokeColor="#FFC53D"
                    trailColor="#F0EFEA"
                    style={{ flex: 1, margin: 0 }}
                    size="small"
                  />
                  <span style={{ fontSize: 11, color: "#aaa", width: 14 }}>{count}</span>
                </div>
              );
            })}
          </Col>

          {/* DANH SÁCH REVIEW */}
          <Col span={18}>
            {/* FORM GỬI ĐÁNH GIÁ */}
            <div style={{
              background: "#F5F4F0", borderRadius: 12,
              padding: "16px 20px", marginBottom: 20,
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18", marginBottom: 10 }}>
                Viết đánh giá của bạn
              </div>
              <Rate value={myRating} onChange={setMyRating} style={{ marginBottom: 10 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <Input.TextArea
                  rows={2}
                  placeholder="Chia sẻ cảm nhận của bạn về cuốn sách..."
                  value={myComment}
                  onChange={(e) => setMyComment(e.target.value)}
                  style={{ borderRadius: 8, fontSize: 13, resize: "none" }}
                />
                <Button
                  icon={<SendOutlined />}
                  onClick={handleSubmitReview}
                  style={{
                    background: "#2C2C2A", color: "#F1EFE8",
                    border: "none", borderRadius: 8,
                    height: "auto", alignSelf: "stretch",
                  }}
                />
              </div>
            </div>

            {/* CÁC REVIEW */}
            {reviews.map((r, i) => (
              <div key={i}>
                <div style={{ display: "flex", gap: 12, padding: "14px 0" }}>
                  <Avatar style={{ background: "#444441", flexShrink: 0 }}>
                    {r.name[0]}
                  </Avatar>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: "flex", alignItems: "center",
                      gap: 8, marginBottom: 4,
                    }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>
                        {r.name}
                      </span>
                      <Rate disabled value={r.rating} style={{ fontSize: 11 }} />
                      <span style={{ fontSize: 11, color: "#aaa", marginLeft: "auto" }}>
                        {r.date}
                      </span>
                    </div>
                    <p style={{ fontSize: 13, color: "#555", margin: 0, lineHeight: 1.65 }}>
                      {r.comment}
                    </p>
                  </div>
                </div>
                {i < reviews.length - 1 && (
                  <Divider style={{ margin: 0, borderColor: "#F0EFEA" }} />
                )}
              </div>
            ))}
          </Col>
        </Row>
      </Card>

      {/* ── SÁCH LIÊN QUAN ── */}
      {related.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{
            display: "flex", alignItems: "baseline",
            justifyContent: "space-between", marginBottom: 16,
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20, fontWeight: 600, color: "#1a1a18", margin: 0,
            }}>
              Sách liên quan
            </h2>
            <span
              onClick={() => navigate("/books")}
              style={{ fontSize: 12, color: "#888", cursor: "pointer" }}
            >
              Xem tất cả →
            </span>
          </div>
          <Row gutter={[16, 16]}>
            {related.map((b, i) => (
              <Col span={6} key={b.maSach}>
                <Card
                  hoverable
                  onClick={() => navigate(`/books/${b.maSach}`)}
                  bodyStyle={{ padding: "12px 14px" }}
                  style={{ border: "0.5px solid #EEECEA", borderRadius: 12, cursor: "pointer" }}
                  cover={
                    b.anhBiaUrl ? (
                      <img
                        src={b.anhBiaUrl}
                        alt={b.tieuDe}
                        style={{
                          height: 140, width: "100%",
                          objectFit: "cover",
                          borderRadius: "12px 12px 0 0",
                        }}
                      />
                    ) : (
                      <div style={{
                        height: 140,
                        background: bgColors[i % bgColors.length],
                        display: "flex", alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "12px 12px 0 0",
                      }}>
                        <BookOutlined style={{ fontSize: 32, opacity: 0.3 }} />
                      </div>
                    )
                  }
                >
                  <div style={{
                    fontWeight: 500, fontSize: 13, color: "#1a1a18", marginBottom: 2,
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                  }}>
                    {b.tieuDe}
                  </div>
                  <div style={{ fontSize: 11, color: "#999" }}>{b.tacGia}</div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

    </div>
  );
}

export default BookDetail;