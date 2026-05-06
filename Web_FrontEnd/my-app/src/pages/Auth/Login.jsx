import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../services/Auth_API/login";
import { getBanDocById } from "../../services/Admin_API/BanDocAPI";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const res = await loginAPI(values);

      console.log("RES.DATA FULL:", JSON.stringify(res.data, null, 2));

      console.log("RES.DATA:", res.data);

      const token =
        res.data?.token || res.data?.data?.token || res.data?.data?.accessToken;

      if (!token) {
        console.log("Không tìm thấy token!");
        return;
      }

      const user = res.data.data.user;
      if (user.maBanDoc) {
        try {
          const bdRes = await getBanDocById(user.maBanDoc); 
          user.hoTen = bdRes.data?.data?.hoTen ?? "";
        } catch {
          user.hoTen = "";
        }
      }
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("maTaiKhoan", user.maTaiKhoan);

      if (user.vaiTro === "Quản trị" || user.vaiTro === "Thủ thư") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("ERROR:", error);
      alert("Sai tài khoản hoặc mật khẩu");
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Tài khoản"
        name="tenDangNhap"
        rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="matKhau"
        rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="remember" valuePropName="checked">
        <Checkbox>Ghi nhớ</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
