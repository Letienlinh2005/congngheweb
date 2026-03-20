import React from "react";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // const items1 = [
  //   { key: "/admin", label: "Dashboard" },
  //   { key: "/admin/products", label: "Products" },
  //   { key: "/admin/accounts", label: "Accounts"}
  // ];

  const items2 = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: "Quản lý",
      children: [
        { key: "/admin", label: "Dashboard" },
        { key: "/admin/products", label: "Sản phẩm" },
        { key: "/admin/accounts", label: "Tài khoản" },
        { key: "/admin/categories", label: "Thể loại" },
        { key: "/admin/readers", label: "Bạn đọc" },
      ],
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* HEADER */}
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div style={{ color: "#fff", marginRight: 20 }}>ADMIN</div>
        <Menu
          theme="dark"
          mode="horizontal"
          // items={items1}
          // onClick={({ key }) => navigate(key)}
          // style={{ flex: 1 }}
        />
      </Header>

      <Layout>
        {/* SIDEBAR */}
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={["sub1"]}
            style={{ height: "100%" }}
            items={items2}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>

        {/* CONTENT */}
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={[{ title: "Admin" }, { title: "Dashboard" }]}
            style={{ margin: "16px 0" }}
          />

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
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
