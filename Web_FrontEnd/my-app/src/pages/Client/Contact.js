import { useState } from "react";
import { Row, Col, Input, Form, Button, message } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const contactInfo = [
  {
    icon: <MailOutlined />,
    label: "Email",
    value: "thuvien@library.vn",
    sub: "Phản hồi trong vòng 24 giờ",
    bg: "#E1F5EE",
    color: "#085041",
  },
  {
    icon: <PhoneOutlined />,
    label: "Điện thoại",
    value: "0236 123 456",
    sub: "Thứ 2 – Thứ 7, 8:00 – 20:00",
    bg: "#EEEDFE",
    color: "#3C3489",
  },
  {
    icon: <EnvironmentOutlined />,
    label: "Địa chỉ",
    value: "123 Nguyễn Văn Linh",
    sub: "Đà Nẵng, Việt Nam",
    bg: "#FAECE7",
    color: "#712B13",
  },
  {
    icon: <ClockCircleOutlined />,
    label: "Giờ mở cửa",
    value: "8:00 – 20:00",
    sub: "Thứ 2 đến Thứ 7 hàng tuần",
    bg: "#FAEEDA",
    color: "#633806",
  },
];

export default function ContactPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      form.resetFields();
      message.success("Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ lại sớm.");
    }, 1200);
  };

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }}>

      {/* HERO */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          fontSize: 11, letterSpacing: "0.1em", color: "#888",
          textTransform: "uppercase", marginBottom: 12,
        }}>Liên hệ</div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 36, fontWeight: 600, color: "#1a1a18",
          lineHeight: 1.2, marginBottom: 12,
        }}>
          Chúng tôi luôn sẵn sàng lắng nghe
        </h1>
        <p style={{ fontSize: 14, color: "#777", maxWidth: 480, lineHeight: 1.75 }}>
          Có câu hỏi về sách, tài khoản hoặc dịch vụ? Hãy để lại tin nhắn —
          đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <Row gutter={[14, 14]} style={{ marginBottom: 48 }}>
        {contactInfo.map((c) => (
          <Col span={6} key={c.label}>
            <div style={{
              background: "#fff", border: "0.5px solid #EEECEA",
              borderRadius: 12, padding: "18px 16px",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: c.bg, color: c.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, marginBottom: 12,
              }}>
                {c.icon}
              </div>
              <div style={{ fontSize: 11, color: "#999", marginBottom: 4 }}>{c.label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18", marginBottom: 3 }}>
                {c.value}
              </div>
              <div style={{ fontSize: 11, color: "#aaa" }}>{c.sub}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* FORM + MAP */}
      <Row gutter={32}>
        <Col span={14}>
          <div style={{
            background: "#fff", border: "0.5px solid #EEECEA",
            borderRadius: 14, padding: "32px 32px",
          }}>
            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20, fontWeight: 600, color: "#1a1a18", marginBottom: 24,
            }}>
              Gửi tin nhắn cho chúng tôi
            </h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              <Row gutter={14}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={<span style={{ fontSize: 12, color: "#888" }}>Họ và tên</span>}
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  >
                    <Input placeholder="Nguyễn Văn A" style={{ borderRadius: 8, fontSize: 13 }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label={<span style={{ fontSize: 12, color: "#888" }}>Email</span>}
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="email@example.com" style={{ borderRadius: 8, fontSize: 13 }} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="subject"
                label={<span style={{ fontSize: 12, color: "#888" }}>Tiêu đề</span>}
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input placeholder="Chủ đề bạn muốn hỏi..." style={{ borderRadius: 8, fontSize: 13 }} />
              </Form.Item>

              <Form.Item
                name="message"
                label={<span style={{ fontSize: 12, color: "#888" }}>Nội dung</span>}
                rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
              >
                <TextArea
                  rows={5}
                  placeholder="Nội dung tin nhắn của bạn..."
                  style={{ borderRadius: 8, fontSize: 13, resize: "none" }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  style={{
                    width: "100%", height: 42,
                    background: "#2C2C2A", color: "#F1EFE8",
                    border: "none", borderRadius: 8,
                    fontSize: 13, fontWeight: 500, cursor: "pointer",
                  }}
                >
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col span={10}>
          {/* FAQ */}
          <div style={{ marginBottom: 20 }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 18, fontWeight: 600, color: "#1a1a18", marginBottom: 16,
            }}>
              Câu hỏi thường gặp
            </h3>
            {[
              {
                q: "Làm sao để mượn sách?",
                a: "Đăng nhập tài khoản, tìm sách và nhấn 'Mượn sách'. Sách sẽ được chuẩn bị trong 1–2 giờ.",
              },
              {
                q: "Tôi có thể mượn bao nhiêu cuốn?",
                a: "Mỗi thành viên được mượn tối đa 5 cuốn sách cùng lúc, thời hạn 14 ngày.",
              },
              {
                q: "Nếu quá hạn thì sao?",
                a: "Bạn có thể gia hạn 1 lần thêm 7 ngày qua ứng dụng trước khi hết hạn.",
              },
              {
                q: "Thư viện có miễn phí không?",
                a: "Đăng ký thành viên và mượn sách hoàn toàn miễn phí với tài khoản cơ bản.",
              },
            ].map((faq, i) => (
              <div key={i} style={{
                padding: "14px 16px",
                borderBottom: "0.5px solid #EEECEA",
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#1a1a18", marginBottom: 5 }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.65 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
}