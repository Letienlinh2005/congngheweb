import React, { useEffect } from "react";
import { LaptopOutlined, UserOutlined, BookOutlined, TagsOutlined, TeamOutlined,} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Button, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import "../css/Admin_layouts.css";

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("maTaiKhoan");

    navigate("/login");
  };

  const items2 = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Quản lý",
      children: [
        {
          key: "/admin",
          label: "Dashboard",
          icon: <LaptopOutlined />,
        },
        {
          key: "/admin/products",
          label: "Sản phẩm",
          icon: <BookOutlined />,
        },
        {
          key: "/admin/accounts",
          label: "Tài khoản",
          icon: <UserOutlined />,
        },
        {
          key: "/admin/categories",
          label: "Thể loại",
          icon: <TagsOutlined />,
        },
        {
          key: "/admin/readers",
          label: "Bạn đọc",
          icon: <TeamOutlined />,
        },
        {
          key: "/admin/phieumuon",
          label: "Phiếu mượn",
          icon: <TeamOutlined />,
        },
        {
          key: "/admin/phat",
          label: "Phạt",
          icon: <TeamOutlined />,
        },
        {
          key: "/admin/kesach",
          label: "Kệ sách",
          icon: <TeamOutlined />,
        },
        {
          key: "/admin/bansao",
          label: "Bản sao",
          icon: <TeamOutlined />,
        },
      ],
    },
  ];

  return (
    <Layout className="admin-layout-container">
      {/* HEADER */}
      <Header className="admin-layout-header">
        <div className="admin-layout-logo">ADMIN</div>

        <Button type="primary" danger onClick={handleLogout}>
          Đăng xuất
        </Button>
      </Header>

      <Layout>
        {/* SIDEBAR */}
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={["sub1"]}
            className="admin-layout-menu"
            items={items2}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>

        {/* CONTENT */}
        <Layout className="admin-layout-content-wrapper">
          <Breadcrumb
            items={[{ title: "Admin" }, { title: "Dashboard" }]}
            className="admin-layout-breadcrumb"
          />

          <Content
            className="admin-layout-content"
            style={{
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
