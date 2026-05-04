import { Row, Col, Card } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  StarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const stats = [
  ["2018", "Năm thành lập"],
  ["1,240+", "Đầu sách"],
  ["50+", "Thể loại"],
  ["3,800+", "Thành viên"],
];

const features = [
  {
    icon: <BookOutlined />,
    title: "Kho sách phong phú",
    desc: "Hơn 1,200 đầu sách thuộc 50+ thể loại, cập nhật mỗi tuần từ các NXB uy tín trong và ngoài nước.",
    bg: "#E1F5EE",
    color: "#085041",
  },
  {
    icon: <ClockCircleOutlined />,
    title: "Mượn linh hoạt",
    desc: "Mượn tối đa 5 cuốn cùng lúc, thời hạn 14 ngày, gia hạn dễ dàng ngay trên ứng dụng.",
    bg: "#EEEDFE",
    color: "#3C3489",
  },
  {
    icon: <StarOutlined />,
    title: "Gợi ý thông minh",
    desc: "Hệ thống gợi ý sách dựa trên lịch sử đọc và sở thích cá nhân của từng thành viên.",
    bg: "#FAECE7",
    color: "#712B13",
  },
  {
    icon: <GlobalOutlined />,
    title: "Truy cập 24/7",
    desc: "Đọc sách và quản lý tài khoản mọi lúc, mọi nơi trên mọi thiết bị — điện thoại, máy tính bảng hay laptop.",
    bg: "#FAEEDA",
    color: "#633806",
  },
];

const team = [
  { name: "Nguyễn Minh Khoa", role: "Giám đốc thư viện", initials: "NK" },
  { name: "Trần Thị Lan Anh", role: "Quản lý bộ sưu tập", initials: "LA" },
  { name: "Phạm Quốc Huy", role: "Hỗ trợ kỹ thuật", initials: "QH" },
];

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>

      {/* HERO */}
      <div style={{
        background: "#1a1a18", borderRadius: 16, padding: "52px 52px",
        marginBottom: 40, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -30, top: -30,
          width: 260, height: 260, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }} />
        <div style={{
          position: "absolute", right: 60, top: 40,
          width: 160, height: 160, borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
        }} />
        <div style={{
          fontSize: 11, letterSpacing: "0.1em", color: "#888780",
          textTransform: "uppercase", marginBottom: 12,
        }}>
          Về chúng tôi
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 38, fontWeight: 600, color: "#F1EFE8",
          lineHeight: 1.25, maxWidth: 520, marginBottom: 16,
        }}>
          Nơi tri thức không có giới hạn
        </h1>
        <p style={{
          color: "#888780", fontSize: 14, maxWidth: 480,
          lineHeight: 1.75, margin: 0,
        }}>
          Được thành lập từ năm 2018, Library là thư viện trực tuyến tiên phong tại
          Việt Nam với sứ mệnh đưa sách đến gần hơn với mọi người. Chúng tôi tin rằng
          tri thức là quyền lợi của tất cả mọi người — không phân biệt hoàn cảnh.
        </p>
      </div>

      {/* STATS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 48 }}>
        {stats.map(([val, label]) => (
          <Col span={6} key={label}>
            <div style={{
              background: "#F5F4F0", borderRadius: 10,
              padding: "20px 22px", textAlign: "center",
            }}>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 30, fontWeight: 600, color: "#1a1a18", marginBottom: 4,
              }}>{val}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* SỨ MỆNH */}
      <Row gutter={40} style={{ marginBottom: 52 }} align="middle">
        <Col span={12}>
          <div style={{
            fontSize: 11, letterSpacing: "0.1em", color: "#888",
            textTransform: "uppercase", marginBottom: 12,
          }}>Sứ mệnh</div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26, fontWeight: 600, color: "#1a1a18",
            lineHeight: 1.35, marginBottom: 16,
          }}>
            Kết nối người đọc với những cuốn sách phù hợp
          </h2>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.8, marginBottom: 12 }}>
            Chúng tôi không chỉ là một thư viện — chúng tôi là cầu nối giữa người đọc
            và tri thức. Mỗi cuốn sách là một hành trình, và nhiệm vụ của chúng tôi là
            giúp bạn tìm đúng chuyến tàu cho mình.
          </p>
          <p style={{ fontSize: 13, color: "#666", lineHeight: 1.8 }}>
            Với đội ngũ biên tập viên và chuyên gia, chúng tôi liên tục tuyển chọn và
            cập nhật những đầu sách chất lượng, đảm bảo mỗi thành viên đều tìm được
            cuốn sách yêu thích của mình.
          </p>
        </Col>
        <Col span={12}>
          <div style={{
            background: "#F5F4F0", borderRadius: 14, padding: 28,
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12,
          }}>
            {[
              ["Sách văn học", "340+"],
              ["Sách khoa học", "220+"],
              ["Kinh tế & KD", "180+"],
              ["Thiếu nhi", "150+"],
              ["Lịch sử", "130+"],
              ["Tâm lý học", "110+"],
            ].map(([cat, count]) => (
              <div key={cat} style={{
                background: "#fff", borderRadius: 8, padding: "12px 14px",
                border: "0.5px solid #EEECEA",
              }}>
                <div style={{ fontSize: 18, fontWeight: 500, color: "#1a1a18" }}>{count}</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{cat}</div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* TÍNH NĂNG */}
      <div style={{ marginBottom: 52 }}>
        <div style={{
          fontSize: 11, letterSpacing: "0.1em", color: "#888",
          textTransform: "uppercase", marginBottom: 12,
        }}>Tính năng</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 24, fontWeight: 600, color: "#1a1a18", marginBottom: 24,
        }}>
          Tại sao chọn Library?
        </h2>
        <Row gutter={[16, 16]}>
          {features.map((f) => (
            <Col span={12} key={f.title}>
              <Card
                hoverable
                bodyStyle={{ padding: "20px 22px" }}
                style={{ border: "0.5px solid #EEECEA", borderRadius: 12 }}
              >
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: f.bg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: 18, color: f.color, flexShrink: 0,
                  }}>
                    {f.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 14, color: "#1a1a18", marginBottom: 6 }}>
                      {f.title}
                    </div>
                    <div style={{ fontSize: 13, color: "#777", lineHeight: 1.7 }}>
                      {f.desc}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ĐỘI NGŨ */}
      <div style={{ marginBottom: 12 }}>
        <div style={{
          fontSize: 11, letterSpacing: "0.1em", color: "#888",
          textTransform: "uppercase", marginBottom: 12,
        }}>Đội ngũ</div>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 24, fontWeight: 600, color: "#1a1a18", marginBottom: 24,
        }}>
          Những người đứng sau Library
        </h2>
        <Row gutter={[16, 16]}>
          {team.map((m) => (
            <Col span={8} key={m.name}>
              <Card
                bodyStyle={{ padding: "24px 20px", textAlign: "center" }}
                style={{ border: "0.5px solid #EEECEA", borderRadius: 12 }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "#2C2C2A", color: "#D3D1C7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 500, margin: "0 auto 14px",
                }}>
                  {m.initials}
                </div>
                <div style={{ fontWeight: 500, fontSize: 14, color: "#1a1a18", marginBottom: 4 }}>
                  {m.name}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{m.role}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

    </div>
  );
}