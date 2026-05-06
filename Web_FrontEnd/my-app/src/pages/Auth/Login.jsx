// ================= LOGIN PAGE =================
import React from "react";
import { Button, Form, Input, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../services/Auth_API/login";
import { getBanDocById } from "../../services/Admin_API/BanDocAPI";
import { createBanDoc } from "../../services/Admin_API/BanDocAPI";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await loginAPI(values);

      const token =
        res.data?.token || res.data?.data?.token || res.data?.data?.accessToken;

      if (!token) {
        message.error("Không tìm thấy token");
        return;
      }

      localStorage.setItem("token", token);

      const user = res.data?.data?.user;

      if (!user) {
        message.error("Không lấy được thông tin user");
        return;
      }

      if (user.maBanDoc) {
        try {
          const bdRes = await getBanDocById(user.maBanDoc);
          user.hoTen = bdRes.data?.data?.hoTen ?? "";
        } catch {
          user.hoTen = "";
        }
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("maTaiKhoan", user.maTaiKhoan);

      message.success("Đăng nhập thành công");

      if (user.vaiTro === "Quản trị" || user.vaiTro === "Thủ thư") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      message.error("Sai tài khoản hoặc mật khẩu");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="Đăng nhập" style={{ width: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="tenDangNhap" label="Tài khoản" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>

          <div style={{ marginTop: 10, textAlign: "center" }}>
            Chưa có tài khoản? <a href="/register">Đăng ký</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

// ================= REGISTER PAGE =================


export const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      await createBanDoc(values);
      message.success("Đăng ký thành công");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại";
      message.error(msg);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <Card title="Đăng ký" style={{ width: 450 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="hoTen" label="Họ tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="dienThoai" label="Điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="tenDangNhap" label="Tên đăng nhập">
            <Input placeholder="Để trống sẽ dùng email" />
          </Form.Item>

          <Form.Item name="matKhau" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>

          <div style={{ marginTop: 10, textAlign: "center" }}>
            Đã có tài khoản? <a href="/login">Đăng nhập</a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;