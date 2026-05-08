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
import { getBanDocById } from "../../services/Admin_API/BanDocAPI";
import "../../css/Profile.css";

export default function ProfilePage() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!Object.keys(user).length) {
        setAccount(null);
        setLoading(false);
        return;
      }

      // Nếu user có maBanDoc thì gọi thêm API lấy duNo
      if (user.maBanDoc) {
        try {
          const res = await getBanDocById(user.maBanDoc);
          const banDoc = res.data.data;
          user.duNo = banDoc.duNo;
        } catch (err) {
          console.log("Không lấy được thông tin bạn đọc:", err);
        }
      }

      setAccount(user);
      setLoading(false);
    };

    fetchProfile();
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
      <div className="profile-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="profile-error">
        Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* HEADER CARD */}
      <Card className="profile-card profile-card--header">
        <div className="profile-header-wrap">
          <Avatar size={72} className="profile-avatar">
            {account.tenDangNhap?.[0]?.toUpperCase() ?? "U"}
          </Avatar>
          <div className="profile-info">
            <div className="profile-name">{account.tenDangNhap}</div>
            <Tag
              color={
                account.vaiTro === "Quản trị"
                  ? "volcano"
                  : account.vaiTro === "Thủ thư"
                  ? "blue"
                  : "green"
              }
              className="profile-role-tag"
            >
              {account.vaiTro}
            </Tag>
          </div>
          <Button
            icon={<EditOutlined />}
            onClick={handleEdit}
            className="profile-btn-edit"
          >
            Chỉnh sửa
          </Button>
        </div>
      </Card>

      {/* THÔNG TIN CHI TIẾT */}
      <Card className="profile-card profile-card--detail">
        <div className="profile-section-eyebrow">Thông tin tài khoản</div>

        {[
          {
            icon: <IdcardOutlined className="profile-detail-icon" />,
            label: "Mã tài khoản",
            value: account.maTaiKhoan,
          },
          {
            icon: <MailOutlined className="profile-detail-icon" />,
            label: "Tên đăng nhập",
            value: account.tenDangNhap,
          },
          {
            icon: <UserOutlined className="profile-detail-icon" />,
            label: "Họ tên",
            value: account.hoTen ?? "Chưa cập nhật",
          },
          {
            icon: <UserOutlined className="profile-detail-icon" />,
            label: "Vai trò",
            value: account.vaiTro,
          },
          {
            icon: <IdcardOutlined className="profile-detail-icon" />,
            label: "Mã bạn đọc",
            value: account.maBanDoc ?? "Chưa liên kết",
          },
          {
            icon: <IdcardOutlined className="profile-detail-icon" />,
            label: "Dư nợ",
            value:
              account.duNo != null
                ? `${account.duNo.toLocaleString("vi-VN")} ₫`
                : account.maBanDoc
                ? "Đang tải..."
                : "Không có",
          },
        ].map((row, i, arr) => (
          <div key={row.label}>
            <div className="profile-detail-row">
              <div className="profile-detail-label-wrap">
                {row.icon}
                <span className="profile-detail-label">{row.label}</span>
              </div>
              <span className="profile-detail-value">{row.value}</span>
            </div>
            {i < arr.length - 1 && (
              <Divider style={{ margin: 0, borderColor: "#F0EFEA" }} />
            )}
          </div>
        ))}
      </Card>

      {/* BẢO MẬT */}
      <Card className="profile-card profile-card--security">
        <div className="profile-section-eyebrow profile-section-eyebrow--security">
          Bảo mật
        </div>
        <div className="profile-security-wrap">
          <div className="profile-security-info">
            <LockOutlined className="profile-detail-icon" />
            <div>
              <div className="profile-security-title">Mật khẩu</div>
              <div className="profile-security-desc">
                Cập nhật mật khẩu định kỳ để bảo mật tài khoản
              </div>
            </div>
          </div>
          <Button onClick={handleEdit} className="profile-btn-edit">
            Đổi mật khẩu
          </Button>
        </div>
      </Card>

      {/* MODAL CHỈNH SỬA */}
      <Modal
        title={
          <span className="profile-modal-title">Chỉnh sửa tài khoản</span>
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
          className="profile-modal-form"
        >
          <Form.Item
            name="tenDangNhap"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập" }]}
          >
            <Input className="profile-input" />
          </Form.Item>
          <Form.Item
            name="matKhauMoi"
            label="Mật khẩu mới (để trống nếu không đổi)"
          >
            <Input.Password className="profile-input" />
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
            <Input.Password className="profile-input" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}