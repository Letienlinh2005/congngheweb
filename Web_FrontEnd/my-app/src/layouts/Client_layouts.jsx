import { Layout, Input, Menu, Dropdown, Space } from "antd";
import { UserOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import ProductListClient from "../pages/Client/Products";

const { Header, Content } = Layout;

function ClientLayout() {
  const navigate = useNavigate();

  const menuItems = [
    { key: "/", icon: <HomeOutlined />, label: "Trang chủ" },
    { key: "/books", icon: <BookOutlined />, label: "Sách" },
  ];

  const userItems = [
    { key: "profile", label: "Tài khoản" },
    { key: "logout", label: "Đăng xuất" },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          background: "#fff",
        }}
      >
        {/* LOGO */}
        <div
          style={{ fontWeight: "bold", fontSize: 20, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Library
        </div>

        
        
        {/* User và Search */}
        <div style={{ marginLeft: "auto" }}>
          <Input.Search placeholder="Tìm sách..." style={{ maxWidth: 200, marginRight: 30}} />
          <Dropdown menu={{ items: userItems }}>
            <Space style={{ cursor: "pointer" }}>
              <UserOutlined />
              User
            </Space>
          </Dropdown>
        </div>
      </Header>

      {/* NAVBAR */}
      <Menu
        style={{justifyContent: "center"}}
        mode="horizontal"
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />

      {/* CONTENT */}
      <Content style={{ padding: "24px 48px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default ClientLayout;
