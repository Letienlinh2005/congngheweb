import { useEffect, useState } from "react";
import { Layout, Input, Menu, Avatar, Dropdown, Card, Row, Col, Carousel,
} from "antd";
import {BookOutlined, SearchOutlined, DownOutlined, HomeOutlined, InfoCircleOutlined, PhoneOutlined, ArrowRightOutlined, UserOutlined,HistoryOutlined,LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getSachs } from "../services/Admin_API/SachAPI";
import Footer from "../components/Footer";
import "../css/Client_layouts.css";

const { Header, Content } = Layout;

const slides = [
  {
    tag: "Bộ sưu tập nổi bật",
    title: "Khám phá thế giới qua từng trang sách",
    sub: "Hơn 1,200 đầu sách đa dạng thể loại đang chờ bạn khám phá.",
    bg: "#1a1a18",
  },
  {
    tag: "Sách mới tháng 5",
    title: "Những tựa sách mới nhất vừa cập bến",
    sub: "Cập nhật liên tục từ các tác giả trong và ngoài nước.",
    bg: "#0F2A1E",
  },
  {
    tag: "Đặt sách trực tuyến",
    title: "Mượn sách dễ dàng mọi lúc, mọi nơi",
    sub: "Đăng ký miễn phí và mượn tối đa 5 cuốn sách cùng lúc.",
    bg: "#1a1218",
  },
];

const statsData = [
  ["1,240", "Đầu sách"],
  ["3,800+", "Thành viên"],
  ["98%", "Hài lòng"],
];

const bgColors = ["#E1F5EE", "#EEEDFE", "#FAECE7", "#FAEEDA"];

const menuItems = [
  { key: "/", icon: <HomeOutlined />, label: "Trang chủ" },
  { key: "/books", icon: <BookOutlined />, label: "Sách" },
  { key: "/about", icon: <InfoCircleOutlined />, label: "Giới thiệu" },
  { key: "/contact", icon: <PhoneOutlined />, label: "Liên hệ" },
];

// ─── HOME CONTENT ─────────────────────────────────────────────────────────────
function HomeContent() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await getSachs();
        const mapped = res.data.data.slice(0, 8).map((item, index) => ({
          key: item.maSach || index,
          tieuDe: item.tieuDe,
          tacGia: item.tacGia,
          namXuatBan: item.namXuatBan,
          anhBiaUrl: item.anhBiaUrl,
        }));
        setBooks(mapped);
      } catch (err) {
        console.error("Lỗi lấy sách:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  
  return (
    <>
      {/* SLIDER */}
      <div className="client-home-slider-wrap">
        <Carousel autoplay autoplaySpeed={4000} effect="fade">
          {slides.map((s, i) => (
            <div key={i}>
              <div
                className="client-home-slide-content"
                style={{ background: s.bg }}
              >
                <div>
                  <div className="client-home-slide-tag">
                    {s.tag}
                  </div>
                  <h1 className="client-home-slide-title">
                    {s.title}
                  </h1>
                  <p className="client-home-slide-sub">
                    {s.sub}
                  </p>
                  <button className="client-home-slide-btn">
                    Xem ngay <ArrowRightOutlined />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* NỘI DUNG BÊN DƯỚI SLIDER */}
      <div className="client-home-content-wrap">
        {/* STATS */}
        <Row gutter={[16, 16]} className="client-home-stats-row">
          {statsData.map(([val, label]) => (
            <Col span={8} key={label}>
              <div className="client-home-stat-item">
                <div className="client-home-stat-val">
                  {val}
                </div>
                <div className="client-home-stat-label">{label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* TIÊU ĐỀ SÁCH NỔI BẬT */}
        <div className="client-home-books-header">
          <h2 className="client-home-books-title">
            Sách nổi bật
          </h2>
          <span
            onClick={() => navigate("/books")}
            className="client-home-books-link"
          >
            Xem tất cả →
          </span>
        </div>

        {/* DANH SÁCH SÁCH */}
        <Row gutter={[16, 16]}>
          {loading
            ? [...Array(8)].map((_, i) => (
                <Col span={6} key={i}>
                  <Card loading className="client-home-book-card" />
                </Col>
              ))
            : books.map((b, i) => (
                <Col span={6} key={b.key}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/books/${b.key}`)}
                    className="client-home-book-card"
                    cover={
                      b.anhBiaUrl ? (
                        <img
                          src={b.anhBiaUrl}
                          alt={b.tieuDe}
                          className="client-home-book-cover"
                        />
                      ) : (
                        <div
                          className="client-home-book-placeholder"
                          style={{ background: bgColors[i % bgColors.length] }}
                        >
                          <BookOutlined />
                        </div>
                      )
                    }
                  >
                    <div className="client-home-book-title">
                      {b.tieuDe}
                    </div>
                    <div className="client-home-book-author">
                      {b.tacGia}
                    </div>
                    {b.namXuatBan && (
                      <div className="client-home-book-year">
                        NXB: {b.namXuatBan}
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
        </Row>

        {/* BANNER ĐĂNG KÝ */}
        <div className="client-home-banner">
          <div>
            <h3 className="client-home-banner-title">
              Trở thành thành viên miễn phí
            </h3>
            <p className="client-home-banner-sub">
              Đăng ký ngay để mượn sách, đánh giá và nhận gợi ý cá nhân hoá.
            </p>
          </div>
          <button
            onClick={() => navigate("/register")}
            className="client-home-banner-btn"
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </>
  );
}

// ─── CLIENT LAYOUT ────────────────────────────────────────────────────────────
function ClientLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";

  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null"),
  );
  const isLoggedIn = !!user;

  useEffect(() => {
    const handleStorage = () =>
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Tài khoản của tôi" },
    { key: "history", icon: <HistoryOutlined />, label: "Lịch sử mượn sách" },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  return (
    <Layout className="client-layout-root">
      {/* HEADER */}
      <Header className="client-header">
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          className="client-logo-wrap"
        >
          <div className="client-logo-icon-wrap">
            <BookOutlined style={{ color: "#fff", fontSize: 14 }} />
          </div>
          <span className="client-logo-text">
            Library
          </span>
        </div>

        <div className="client-header-spacer" />

        {/* SEARCH */}
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined style={{ color: "#aaa", fontSize: 13 }} />}
          suffix={
            searchInput && (
              <SearchOutlined
                onClick={handleSearch}
                style={{ color: "#888", fontSize: 13, cursor: "pointer" }}
              />
            )
          }
          placeholder="Tìm kiếm sách..."
          variant="filled"
          className="client-search-input"
        />

        {isLoggedIn ? (
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: ({ key }) => {
                if (key === "logout") {
                  handleLogout();
                } else {
                  navigate(`/${key}`);
                }
              },
            }}
            trigger={["click"]}
          >
            <div className="client-user-dropdown">
              <Avatar
                size={26}
                className="client-user-avatar"
              >
                {user?.hoTen?.slice(0, 2).toUpperCase() || "?"}
              </Avatar>
              <span className="client-user-name">
                {user?.hoTen || "Người dùng"}
              </span>
              <DownOutlined style={{ fontSize: 10, color: "#aaa" }} />
            </div>
          </Dropdown>
        ) : (
          <div className="client-header-actions">
            <button
              onClick={() => navigate("/login")}
              className="client-btn-login"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              className="client-btn-register"
            >
              Đăng ký
            </button>
          </div>
        )}
      </Header>

      {/* NAVBAR */}
      <div className="client-navbar-wrap">
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          className="client-navbar-menu"
        />
      </div>

      {/* CONTENT */}
      {isHome ? (
        <Content className="client-content-home">
          <HomeContent />
        </Content>
      ) : (
        <Content className="client-content-page">
          <Outlet />
        </Content>
      )}

      <Footer />
    </Layout>
  );
}

export default ClientLayout;
