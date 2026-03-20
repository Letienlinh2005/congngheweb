import { Card, Typography, Tag } from "antd";

const { Title, Text } = Typography;

function AccountCard({ acc }) {
  return (
    <Card
      hoverable
      style={{ width: 260, borderRadius: 12 }}
      cover={
        <img
          alt={acc.maTaiKhoan}
          src={acc.anhBiaUrl}
          style={{ height: 300, objectFit: "cover" }}
        />
      }
    >
      <Title level={5} ellipsis>
        {acc.tieuDe}
      </Title>

      <Text strong>Tác giả:</Text> <Text>{acc.tacGia}</Text>
      <br />

      <Text strong>Năm:</Text> <Text>{acc.namXuatBan}</Text>
      <br />

      <Text strong>Ngôn ngữ:</Text> <Text>{acc.ngonNgu}</Text>
      <br />

      <div style={{ marginTop: 8 }}>
        <Tag color="blue">{acc.theLoai}</Tag>
      </div>
    </Card>
  );
}

export default AccountCard;