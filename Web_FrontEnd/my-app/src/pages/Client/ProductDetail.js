import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tag, Spin, message, Row, Col, Card, Rate, Input, Button, Avatar, Divider, Progress,} from "antd";
import { BookOutlined, UserOutlined, CalendarOutlined, TagOutlined, StarOutlined, SendOutlined,} from "@ant-design/icons";
import axiosClient from "../../services/axiosClient";
import { getSachById, getSachs } from "../../services/Admin_API/SachAPI";
import { parseJwt } from "../../ultilities/parseJwt";
import "../../css/ProductDetail.css";

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
    <div className="product-loading">
      <Spin size="large" />
    </div>
  );

  const coSan    = copies.filter((c) => c.trangThai === "Có sẵn").length;
  const dangMuon = copies.filter((c) => c.trangThai === "Đang mượn").length;
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <div className="product-detail-page">

      {/* ── THÔNG TIN CHÍNH ── */}
      <Card className="product-card product-card--main">
        <Row gutter={40}>

          {/* ẢNH BÌA */}
          <Col span={7}>
            {book.anhBiaUrl ? (
              <img
                src={book.anhBiaUrl}
                alt={book.tieuDe}
                className="product-cover"
              />
            ) : (
              <div className="product-cover-placeholder" style={{ background: bgColors[0] }}>
                <BookOutlined />
              </div>
            )}
          </Col>

          {/* THÔNG TIN */}
          <Col span={17}>
            <h1 className="product-title">
              {book.tieuDe}
            </h1>

            {/* RATING NHANH */}
            <div className="product-rating">
              <Rate disabled value={Math.round(avgRating)} style={{ fontSize: 14 }} />
              <span className="product-rating__text">
                {avgRating.toFixed(1)} ({reviews.length} đánh giá)
              </span>
            </div>

            {/* CHI TIẾT */}
            <div className="product-details">
              {[
                { icon: <UserOutlined />,     label: "Tác giả",      value: book.tacGia },
                { icon: <CalendarOutlined />, label: "Năm xuất bản", value: book.namXuatBan },
                { icon: <TagOutlined />,      label: "Thể loại",     value: book.theLoai || "Chưa phân loại" },
              ].map((row) => (
                <div key={row.label} className="product-detail-row">
                  <span className="product-detail-row__icon">{row.icon}</span>
                  <span className="product-detail-row__label">{row.label}</span>
                  <span className="product-detail-row__value">{row.value}</span>
                </div>
              ))}
            </div>

            {/* TÌNH TRẠNG BẢN SAO */}
            <div className="product-copies">
              <div>
                <div className="product-copy-stat__label">Có sẵn</div>
                <div className="product-copy-stat__value product-copy-stat__value--available">{coSan}</div>
              </div>
              <div>
                <div className="product-copy-stat__label">Đang mượn</div>
                <div className="product-copy-stat__value product-copy-stat__value--borrowed">{dangMuon}</div>
              </div>
              <div>
                <div className="product-copy-stat__label">Tổng bản sao</div>
                <div className="product-copy-stat__value product-copy-stat__value--total">{copies.length}</div>
              </div>
              <div className="product-copies-tags">
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
              className="product-btn-borrow"
            >
              {coSan > 0 ? "Mượn sách" : "Đặt chỗ trước"}
            </Button>
          </Col>

        </Row>
      </Card>

      {/* ── TÓM TẮT ── */}
      {book.tomTat && (
        <Card className="product-card product-card--summary">
          <div className="product-section-eyebrow">
            Tóm tắt nội dung
          </div>
          <p className="product-summary-text">
            {book.tomTat}
          </p>
        </Card>
      )}

      {/* ── ĐÁNH GIÁ ── */}
      <Card className="product-card product-card--reviews">
        <div className="product-section-eyebrow product-section-eyebrow--reviews">
          Đánh giá từ độc giả
        </div>

        <Row gutter={40}>
          {/* TỔNG QUAN RATING */}
          <Col span={6}>
            <div className="product-rating-overview">
              <div className="product-rating-overview__score">
                {avgRating.toFixed(1)}
              </div>
              <Rate disabled value={avgRating} style={{ fontSize: 14, margin: "8px 0" }} />
              <div className="product-rating-overview__count">{reviews.length} đánh giá</div>
            </div>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length;
              return (
                <div key={star} className="product-rating-bar">
                  <span className="product-rating-bar__star">{star}</span>
                  <StarOutlined className="product-rating-bar__icon" />
                  <Progress
                    percent={Math.round((count / reviews.length) * 100)}
                    showInfo={false}
                    strokeColor="#FFC53D"
                    trailColor="#F0EFEA"
                    style={{ flex: 1, margin: 0 }}
                    size="small"
                  />
                  <span className="product-rating-bar__count">{count}</span>
                </div>
              );
            })}
          </Col>

          {/* DANH SÁCH REVIEW */}
          <Col span={18}>
            {/* FORM GỬI ĐÁNH GIÁ */}
            <div className="product-review-form">
              <div className="product-review-form__title">
                Viết đánh giá của bạn
              </div>
              <Rate value={myRating} onChange={setMyRating} style={{ marginBottom: 10 }} />
              <div className="product-review-form__input-group">
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
                  className="product-review-form__btn"
                />
              </div>
            </div>

            {/* CÁC REVIEW */}
            {reviews.map((r, i) => (
              <div key={i}>
                <div className="product-review-item">
                  <Avatar className="product-review-item__avatar">
                    {r.name[0]}
                  </Avatar>
                  <div className="product-review-item__content">
                    <div className="product-review-item__header">
                      <span className="product-review-item__name">
                        {r.name}
                      </span>
                      <Rate disabled value={r.rating} style={{ fontSize: 11 }} />
                      <span className="product-review-item__date">
                        {r.date}
                      </span>
                    </div>
                    <p className="product-review-item__text">
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
        <div className="product-related">
          <div className="product-related-header">
            <h2 className="product-related-header__title">
              Sách liên quan
            </h2>
            <span
              onClick={() => navigate("/books")}
              className="product-related-header__link"
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
                  className="product-related-card"
                  cover={
                    b.anhBiaUrl ? (
                      <img
                        src={b.anhBiaUrl}
                        alt={b.tieuDe}
                        className="product-related-cover"
                      />
                    ) : (
                      <div
                        className="product-related-cover-placeholder"
                        style={{ background: bgColors[i % bgColors.length] }}
                      >
                        <BookOutlined />
                      </div>
                    )
                  }
                >
                  <div className="product-related-card__title">
                    {b.tieuDe}
                  </div>
                  <div className="product-related-card__author">{b.tacGia}</div>
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