import { Typography, Space } from "antd";

const { Title } = Typography;

const PageHeader = ({ title, extra }) => {
  return (
    <Space
      style={{
        width: "100%",
        justifyContent: "space-between",
        marginBottom: 16,
      }}
    >
      <Title level={3} style={{ margin: 0 }}>
        {title}
      </Title>

      {extra}
    </Space>
  );
};

export default PageHeader;