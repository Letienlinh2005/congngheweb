import { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Menu,
  Avatar,
  Dropdown,
  Card,
  Row,
  Col,
  Carousel,
} from "antd";
import {
  BookOutlined,
  SearchOutlined,
  DownOutlined,
  HomeOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
  ArrowRightOutlined,
  UserOutlined,
  HistoryOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { getSachs } from "../services/Admin_API/SachAPI";
import Footer from "../components/Footer";

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
      <div style={{ width: "100%", borderBottom: "1px solid #EEECEA" }}>
        <Carousel autoplay autoplaySpeed={4000} effect="fade">
          {slides.map((s, i) => (
            <div key={i}>
              <div
                style={{
                  background: s.bg,
                  height: 320,
                  padding: "0 64px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.1em",
                      color: "#888780",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    {s.tag}
                  </div>
                  <h1
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 36,
                      fontWeight: 600,
                      color: "#F1EFE8",
                      maxWidth: 500,
                      lineHeight: 1.25,
                      margin: "0 0 10px",
                    }}
                  >
                    {s.title}
                  </h1>
                  <p
                    style={{
                      color: "#888780",
                      fontSize: 14,
                      maxWidth: 400,
                      lineHeight: 1.7,
                      margin: "0 0 24px",
                    }}
                  >
                    {s.sub}
                  </p>
                  <button
                    style={{
                      background: "#F1EFE8",
                      color: "#1a1a18",
                      border: "none",
                      padding: "9px 22px",
                      borderRadius: 8,
                      fontWeight: 500,
                      fontSize: 13,
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    Xem ngay <ArrowRightOutlined />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* NỘI DUNG BÊN DƯỚI SLIDER */}
      <div
        style={{
          padding: "36px 48px",
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {/* STATS */}
        <Row gutter={[16, 16]} style={{ marginBottom: 44 }}>
          {statsData.map(([val, label]) => (
            <Col span={8} key={label}>
              <div
                style={{
                  background: "#F5F4F0",
                  borderRadius: 10,
                  padding: "18px 22px",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 28,
                    fontWeight: 600,
                    color: "#1a1a18",
                    marginBottom: 3,
                  }}
                >
                  {val}
                </div>
                <div style={{ fontSize: 12, color: "#888" }}>{label}</div>
              </div>
            </Col>
          ))}
        </Row>

        {/* TIÊU ĐỀ SÁCH NỔI BẬT */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 600,
              color: "#1a1a18",
              margin: 0,
            }}
          >
            Sách nổi bật
          </h2>
          <span
            onClick={() => navigate("/books")}
            style={{ fontSize: 12, color: "#888", cursor: "pointer" }}
          >
            Xem tất cả →
          </span>
        </div>

        {/* DANH SÁCH SÁCH */}
        <Row gutter={[16, 16]}>
          {loading
            ? [...Array(8)].map((_, i) => (
                <Col span={6} key={i}>
                  <Card
                    loading
                    style={{ borderRadius: 12, border: "0.5px solid #EEECEA" }}
                  />
                </Col>
              ))
            : books.map((b, i) => (
                <Col span={6} key={b.key}>
                  <Card
                    hoverable
                    onClick={() => navigate(`/books/${b.key}`)}
                    bodyStyle={{ padding: "12px 14px" }}
                    style={{
                      border: "0.5px solid #EEECEA",
                      borderRadius: 12,
                      cursor: "pointer",
                    }}
                    cover={
                      b.anhBiaUrl ? (
                        <img
                          src={b.anhBiaUrl}
                          alt={b.tieuDe}
                          style={{
                            height: 160,
                            width: "100%",
                            objectFit: "cover",
                            borderRadius: "12px 12px 0 0",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            height: 160,
                            background: bgColors[i % bgColors.length],
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "12px 12px 0 0",
                          }}
                        >
                          <BookOutlined
                            style={{ fontSize: 38, opacity: 0.35 }}
                          />
                        </div>
                      )
                    }
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: 13,
                        color: "#1a1a18",
                        marginBottom: 3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {b.tieuDe}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "#999", marginBottom: 2 }}
                    >
                      {b.tacGia}
                    </div>
                    {b.namXuatBan && (
                      <div style={{ fontSize: 11, color: "#bbb" }}>
                        NXB: {b.namXuatBan}
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
        </Row>

        {/* BANNER ĐĂNG KÝ */}
        <div
          style={{
            marginTop: 48,
            background: "#1a1a18",
            borderRadius: 14,
            padding: "36px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                color: "#F1EFE8",
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Trở thành thành viên miễn phí
            </h3>
            <p style={{ color: "#888780", fontSize: 13, margin: 0 }}>
              Đăng ký ngay để mượn sách, đánh giá và nhận gợi ý cá nhân hoá.
            </p>
          </div>
          <button
            onClick={() => navigate("/register")}
            style={{
              background: "#F1EFE8",
              color: "#1a1a18",
              border: "none",
              padding: "10px 28px",
              borderRadius: 8,
              fontWeight: 500,
              fontSize: 13,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
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
    <Layout style={{ minHeight: "100vh", background: "#F7F6F2" }}>
      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "#fff",
          borderBottom: "1px solid #EEECEA",
          height: 64,
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* LOGO */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              background: "#2C2C2A",
              borderRadius: 7,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOutlined style={{ color: "#fff", fontSize: 14 }} />
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: 20,
              color: "#1a1a18",
              letterSpacing: "-0.3px",
            }}
          >
            Library
          </span>
        </div>

        <div style={{ flex: 1 }} />

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
          style={{
            width: 220,
            borderRadius: 8,
            fontSize: 13,
            background: "#F5F4F0",
            border: "1px solid #EEECEA",
          }}
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                padding: "5px 10px",
                borderRadius: 8,
                border: "1px solid #EEECEA",
                background: "#fff",
              }}
            >
              <Avatar
                size={26}
                style={{ background: "#444441", fontSize: 11, fontWeight: 500 }}
              >
                {user?.hoTen?.slice(0, 2).toUpperCase() || "?"}
              </Avatar>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>
                {user?.hoTen || "Người dùng"}
              </span>
              <DownOutlined style={{ fontSize: 10, color: "#aaa" }} />
            </div>
          </Dropdown>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#fff",
                color: "#1a1a18",
                border: "1px solid #EEECEA",
                padding: "6px 16px",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/register")}
              style={{
                background: "#1a1a18",
                color: "#F1EFE8",
                border: "none",
                padding: "6px 16px",
                borderRadius: 8,
                fontWeight: 500,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Đăng ký
            </button>
          </div>
        )}
      </Header>

      {/* NAVBAR */}
      <div style={{ background: "#fff", borderBottom: "1px solid #EEECEA" }}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            padding: "0 24px",
            borderBottom: "none",
            fontSize: 13,
            fontWeight: 500,
          }}
        />
      </div>

      {/* CONTENT */}
      {isHome ? (
        <Content style={{ padding: 0, background: "#fff" }}>
          <HomeContent />
        </Content>
      ) : (
        <Content
          style={{
            padding: "32px 48px",
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <Outlet />
        </Content>
      )}

      <Footer />
    </Layout>
  );
}

export default ClientLayout;
