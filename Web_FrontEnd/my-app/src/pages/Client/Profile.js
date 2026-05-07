import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Tag,
  Spin,
  Divider,
  Button,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  IdcardOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { updateTaiKhoan } from "../../services/Admin_API/TaiKhoanAPI";

export default function ProfilePage() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setAccount(Object.keys(user).length ? user : null);
    setLoading(false);
  }, []);

  const handleEdit = () => {
    form.setFieldsValue({ tenDangNhap: account?.tenDangNhap });
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      const payload = { tenDangNhap: values.tenDangNhap };
      if (values.matKhauMoi) payload.matKhau = values.matKhauMoi;

      await updateTaiKhoan(account.maTaiKhoan, payload);

      const updated = { ...account, ...payload };
      localStorage.setItem("user", JSON.stringify(updated));
      setAccount(updated);

      message.success("Cập nhật tài khoản thành công!");
      setModalOpen(false);
    } catch (err) {
      message.error("Cập nhật thất bại, vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!account) {
    return (
      <div style={{ textAlign: "center", padding: 80, color: "#888" }}>
        Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* HEADER CARD */}
      <Card
        style={{
          borderRadius: 16,
          border: "0.5px solid #EEECEA",
          marginBottom: 20,
        }}
        bodyStyle={{ padding: "32px 36px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Avatar
            size={72}
            style={{
              background: "#2C2C2A",
              fontSize: 26,
              fontWeight: 500,
              flexShrink: 0,
            }}
          >
            {account.tenDangNhap?.[0]?.toUpperCase() ?? "U"}
          </Avatar>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 600,
                color: "#1a1a18",
                marginBottom: 6,
              }}
            >
              {account.tenDangNhap}
            </div>
            <Tag
              color={
                account.vaiTro === "Quản trị"
                  ? "volcano"
                  : account.vaiTro === "Thủ thư"
                    ? "blue"
                    : "green"
              }
              style={{ borderRadius: 6, fontSize: 12 }}
            >
              {account.vaiTro}
            </Tag>
          </div>
          <Button
            icon={<EditOutlined />}
            onClick={handleEdit}
            style={{
              borderRadius: 8,
              fontSize: 13,
              border: "0.5px solid #EEECEA",
            }}
          >
            Chỉnh sửa
          </Button>
        </div>
      </Card>

      {/* THÔNG TIN CHI TIẾT */}
      <Card
        style={{
          borderRadius: 16,
          border: "0.5px solid #EEECEA",
          marginBottom: 20,
        }}
        bodyStyle={{ padding: "24px 36px" }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "#aaa",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Thông tin tài khoản
        </div>

        {[
          {
            icon: <IdcardOutlined style={{ color: "#888" }} />,
            label: "Mã tài khoản",
            value: account.maTaiKhoan,
          },
          {
            icon: <MailOutlined style={{ color: "#888" }} />,
            label: "Tên đăng nhập",
            value: account.tenDangNhap,
          },
          {
            icon: <UserOutlined style={{ color: "#888" }} />,
            label: "Họ tên",
            value: account.hoTen ?? "Chưa cập nhật",
          },
          {
            icon: <UserOutlined style={{ color: "#888" }} />,
            label: "Vai trò",
            value: account.vaiTro,
          },
          {
            icon: <IdcardOutlined style={{ color: "#888" }} />,
            label: "Mã bạn đọc",
            value: account.maBanDoc ?? "Chưa liên kết",
          },
        ].map((row, i, arr) => (
          <div key={row.label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {row.icon}
                <span style={{ fontSize: 13, color: "#888" }}>{row.label}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>
                {row.value}
              </span>
            </div>
            {i < arr.length - 1 && (
              <Divider style={{ margin: 0, borderColor: "#F0EFEA" }} />
            )}
          </div>
        ))}
      </Card>

      {/* BẢO MẬT */}
      <Card
        style={{ borderRadius: 16, border: "0.5px solid #EEECEA" }}
        bodyStyle={{ padding: "24px 36px" }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.08em",
            color: "#aaa",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Bảo mật
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LockOutlined style={{ color: "#888" }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18" }}>
                Mật khẩu
              </div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>
                Cập nhật mật khẩu định kỳ để bảo mật tài khoản
              </div>
            </div>
          </div>
          <Button
            onClick={handleEdit}
            style={{
              borderRadius: 8,
              fontSize: 13,
              border: "0.5px solid #EEECEA",
            }}
          >
            Đổi mật khẩu
          </Button>
        </div>
      </Card>

      {/* MODAL CHỈNH SỬA */}
      <Modal
        title={
          <span
            style={{ fontFamily: "'Playfair Display', serif", fontSize: 18 }}
          >
            Chỉnh sửa tài khoản
          </span>
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Lưu thay đổi"
        cancelText="Huỷ"
        okButtonProps={{
          style: {
            background: "#2C2C2A",
            borderColor: "#2C2C2A",
            borderRadius: 8,
          },
        }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="tenDangNhap"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="matKhauMoi"
            label="Mật khẩu mới (để trống nếu không đổi)"
          >
            <Input.Password style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item
            name="xacNhanMatKhau"
            label="Xác nhận mật khẩu mới"
            dependencies={["matKhauMoi"]}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("matKhauMoi") === value)
                    return Promise.resolve();
                  return Promise.reject("Mật khẩu xác nhận không khớp!");
                },
              }),
            ]}
          >
            <Input.Password style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
