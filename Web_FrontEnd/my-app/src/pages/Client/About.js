import { Row, Col, Card } from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  StarOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "../../css/About.css";

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
  { name: "Lê Tiến Linh", role: "Giám đốc thư viện", initials: "LL" },
  { name: "Lê Hữu Tính", role: "Quản lý bộ sưu tập", initials: "LT" },
  { name: "Lê Bảo Long", role: "Hỗ trợ kỹ thuật", initials: "LL" },
];

export default function AboutPage() {
  return (
    <div className="about-page">

      {/* HERO */}
      <div className="about-hero">
        <div className="about-hero__circle-lg" />
        <div className="about-hero__circle-sm" />
        <div className="about-hero__eyebrow">
          Về chúng tôi
        </div>
        <h1 className="about-hero__title">
          Nơi tri thức không có giới hạn
        </h1>
        <p className="about-hero__desc">
          Được thành lập từ năm 2018, Library là thư viện trực tuyến tiên phong tại
          Việt Nam với sứ mệnh đưa sách đến gần hơn với mọi người. Chúng tôi tin rằng
          tri thức là quyền lợi của tất cả mọi người — không phân biệt hoàn cảnh.
        </p>
      </div>

      {/* STATS */}
      <Row gutter={[16, 16]} className="about-stats">
        {stats.map(([val, label]) => (
          <Col span={6} key={label}>
            <div className="about-stat-card">
              <div className="about-stat-card__value">{val}</div>
              <div className="about-stat-card__label">{label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* SỨ MỆNH */}
      <Row gutter={40} className="about-mission" align="middle">
        <Col span={12}>
          <div className="about-section__eyebrow">Sứ mệnh</div>
          <h2 className="about-section__title">
            Kết nối người đọc với những cuốn sách phù hợp
          </h2>
          <p className="about-mission__body">
            Chúng tôi không chỉ là một thư viện — chúng tôi là cầu nối giữa người đọc
            và tri thức. Mỗi cuốn sách là một hành trình, và nhiệm vụ của chúng tôi là
            giúp bạn tìm đúng chuyến tàu cho mình.
          </p>
          <p className="about-mission__body" style={{ marginBottom: 0 }}>
            Với đội ngũ biên tập viên và chuyên gia, chúng tôi liên tục tuyển chọn và
            cập nhật những đầu sách chất lượng, đảm bảo mỗi thành viên đều tìm được
            cuốn sách yêu thích của mình.
          </p>
        </Col>
        <Col span={12}>
          <div className="about-categories-grid">
            {[
              ["Sách văn học", "340+"],
              ["Sách khoa học", "220+"],
              ["Kinh tế & KD", "180+"],
              ["Thiếu nhi", "150+"],
              ["Lịch sử", "130+"],
              ["Tâm lý học", "110+"],
            ].map(([cat, count]) => (
              <div key={cat} className="about-category-item">
                <div className="about-category-item__count">{count}</div>
                <div className="about-category-item__name">{cat}</div>
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* TÍNH NĂNG */}
      <div className="about-features">
        <div className="about-section__eyebrow">Tính năng</div>
        <h2 className="about-features__title">
          Tại sao chọn Library?
        </h2>
        <Row gutter={[16, 16]}>
          {features.map((f) => (
            <Col span={12} key={f.title}>
              <Card
                hoverable
                className="about-feature-card"
              >
                <div className="about-feature-card__inner">
                  <div
                    className="about-feature-card__icon"
                    style={{ background: f.bg, color: f.color }}
                  >
                    {f.icon}
                  </div>
                  <div>
                    <div className="about-feature-card__title">
                      {f.title}
                    </div>
                    <div className="about-feature-card__desc">
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
      <div className="about-team">
        <div className="about-section__eyebrow">Đội ngũ</div>
        <h2 className="about-team__title">
          Những người đứng sau Library
        </h2>
        <Row gutter={[16, 16]}>
          {team.map((m) => (
            <Col span={8} key={m.name}>
              <Card className="about-team-card">
                <div className="about-team-card__avatar">
                  {m.initials}
                </div>
                <div className="about-team-card__name">
                  {m.name}
                </div>
                <div className="about-team-card__role">{m.role}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

    </div>
  );
}