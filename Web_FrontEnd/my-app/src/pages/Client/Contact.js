import { useState } from "react";
import { Row, Col, Input, Form, Button, message } from "antd";
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined, SendOutlined,} from "@ant-design/icons";
import "../../css/Contact.css";

const { TextArea } = Input;

const contactInfo = [
  {
    icon: <MailOutlined />,
    label: "Email",
    value: "letienlinh2005@gmail.com",
    sub: "Phản hồi trong vòng 24 giờ",
    bg: "#E1F5EE",
    color: "#085041",
  },
  {
    icon: <PhoneOutlined />,
    label: "Điện thoại",
    value: "0338554177",
    sub: "Thứ 2 – Thứ 7, 8:00 – 20:00",
    bg: "#EEEDFE",
    color: "#3C3489",
  },
  {
    icon: <EnvironmentOutlined />,
    label: "Địa chỉ",
    value: "Ân Thi",
    sub: "Hưng Yên, Việt Nam",
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
    <div className="contact-page">

      {/* HERO */}
      <div className="contact-hero">
        <div className="contact-hero__eyebrow">Liên hệ</div>
        <h1 className="contact-hero__title">
          Chúng tôi luôn sẵn sàng lắng nghe
        </h1>
        <p className="contact-hero__desc">
          Có câu hỏi về sách, tài khoản hoặc dịch vụ? Hãy để lại tin nhắn —
          đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
        </p>
      </div>

      {/* CONTACT CARDS */}
      <Row gutter={[14, 14]} className="contact-cards">
        {contactInfo.map((c) => (
          <Col span={6} key={c.label}>
            <div className="contact-card">
              <div
                className="contact-card__icon-wrapper"
                style={{ background: c.bg, color: c.color }}
              >
                {c.icon}
              </div>
              <div className="contact-card__label">{c.label}</div>
              <div className="contact-card__value">
                {c.value}
              </div>
              <div className="contact-card__sub">{c.sub}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* FORM + MAP */}
      <Row gutter={32}>
        <Col span={14}>
          <div className="contact-form-container">
            <h2 className="contact-form-container__title">
              Gửi tin nhắn cho chúng tôi
            </h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              <Row gutter={14}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label={<span className="contact-form-label">Họ và tên</span>}
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  >
                    <Input placeholder="Nguyễn Văn A" className="contact-input" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label={<span className="contact-form-label">Email</span>}
                    rules={[
                      { required: true, message: "Vui lòng nhập email" },
                      { type: "email", message: "Email không hợp lệ" },
                    ]}
                  >
                    <Input placeholder="email@example.com" className="contact-input" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="subject"
                label={<span className="contact-form-label">Tiêu đề</span>}
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input placeholder="Chủ đề bạn muốn hỏi..." className="contact-input" />
              </Form.Item>

              <Form.Item
                name="message"
                label={<span className="contact-form-label">Nội dung</span>}
                rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
              >
                <TextArea
                  rows={5}
                  placeholder="Nội dung tin nhắn của bạn..."
                  className="contact-textarea"
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  className="contact-btn-submit"
                >
                  Gửi tin nhắn
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>

        <Col span={10}>
          {/* FAQ */}
          <div className="contact-faq-container">
            <h3 className="contact-faq-title">
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
              <div key={i} className="contact-faq-item">
                <div className="contact-faq-item__q">
                  {faq.q}
                </div>
                <div className="contact-faq-item__a">
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