import { Row, Col, Divider } from "antd";
import {
  MailOutlined, PhoneOutlined, EnvironmentOutlined,
  ClockCircleOutlined, FacebookOutlined, YoutubeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      background: "#1a1a18",
      color: "#888780",
      padding: "52px 48px 0",
      marginTop: "auto",
    }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row gutter={[48, 40]}>

          {/* CỘT 1 — THƯƠNG HIỆU */}
          <Col span={8}>
            <div style={{
              display: "flex", alignItems: "center",
              gap: 8, marginBottom: 16,
            }}>
              <div style={{
                width: 30, height: 30, background: "#F1EFE8",
                borderRadius: 7, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 14 }}>📚</span>
              </div>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20, fontWeight: 600, color: "#F1EFE8",
              }}>
                Library
              </span>
            </div>
            <p style={{
              fontSize: 13, lineHeight: 1.8,
              marginBottom: 20, maxWidth: 260,
            }}>
              Thư viện trực tuyến tiên phong tại Việt Nam — nơi tri thức
              không có giới hạn. Hơn 1,200 đầu sách đang chờ bạn khám phá.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: <FacebookOutlined />, label: "Facebook" },
                { icon: <YoutubeOutlined />,  label: "YouTube" },
                { icon: <MailOutlined />,     label: "Email" },
              ].map((s) => (
                <div key={s.label} style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer",
                  color: "#888780", fontSize: 15,
                }}>
                  {s.icon}
                </div>
              ))}
            </div>
          </Col>

          {/* CỘT 2 — LIÊN KẾT NHANH */}
          <Col span={5}>
            <div style={{
              fontSize: 11, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#F1EFE8",
              marginBottom: 20, fontWeight: 500,
            }}>
              Khám phá
            </div>
            {[
              { label: "Trang chủ",      path: "/" },
              { label: "Danh sách sách", path: "/books" },
              { label: "Giới thiệu",     path: "/about" },
              { label: "Liên hệ",        path: "/contact" },
              { label: "Tài khoản",      path: "/profile" },
              { label: "Lịch sử mượn",   path: "/history" },
            ].map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  fontSize: 13, marginBottom: 10,
                  cursor: "pointer", color: "#888780",
                }}
              >
                {item.label}
              </div>
            ))}
          </Col>

          {/* CỘT 3 — THÔNG TIN LIÊN HỆ */}
          <Col span={6}>
            <div style={{
              fontSize: 11, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#F1EFE8",
              marginBottom: 20, fontWeight: 500,
            }}>
              Liên hệ
            </div>
            {[
              { icon: <EnvironmentOutlined />, text: "123 Nguyễn Văn Linh, Đà Nẵng" },
              { icon: <PhoneOutlined />,       text: "0236 123 456" },
              { icon: <MailOutlined />,        text: "thuvien@library.vn" },
              { icon: <ClockCircleOutlined />, text: "Thứ 2 – Thứ 7, 8:00 – 20:00" },
            ].map((c, i) => (
              <div key={i} style={{
                display: "flex", gap: 10,
                alignItems: "flex-start", marginBottom: 12,
              }}>
                <span style={{ marginTop: 2, flexShrink: 0 }}>{c.icon}</span>
                <span style={{ fontSize: 13, lineHeight: 1.6 }}>{c.text}</span>
              </div>
            ))}
          </Col>

          {/* CỘT 4 — BẢN ĐỒ */}
          <Col span={5}>
            <div style={{
              fontSize: 11, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#F1EFE8",
              marginBottom: 20, fontWeight: 500,
            }}>
              Vị trí
            </div>
            <div style={{ borderRadius: 10, overflow: "hidden", height: 150 }}>
              <iframe
                title="Bản đồ thư viện"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3834.2604932105!2d108.21200731483!3d16.06010888886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c792252a13%3A0x834f5a2cd2b4e3d6!2zTmd1eeG7hW4gVsSDbiBMaW5oLCDEkMOgIE7hurVuZw!5e0!3m2!1svi!2svn!4v1620000000000!5m2!1svi!2svn"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </Col>

        </Row>

        <Divider style={{ borderColor: "rgba(255,255,255,0.08)", margin: "36px 0 20px" }} />

        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: 24, fontSize: 12,
        }}>
          <span>© 2026 Library. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Chính sách bảo mật", "Điều khoản sử dụng"].map((t) => (
              <span key={t} style={{ cursor: "pointer" }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}