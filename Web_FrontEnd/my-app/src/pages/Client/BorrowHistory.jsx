import { useEffect, useState } from "react";
import { Table, Tag, Spin, Card, Row, Col, Input } from "antd";
import { SearchOutlined, BookOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { getAllPhieuMuons } from "../../services/Admin_API/PhieuMuonAPI"; // chỉnh path
import dayjs from "dayjs";

const STATUS_COLOR = {
  "Đang mượn":  { color: "blue",    icon: <ClockCircleOutlined /> },
  "Đã đóng":    { color: "green",   icon: <CheckCircleOutlined /> },
  "Quá hạn":    { color: "red",     icon: <ClockCircleOutlined /> },
  "Đã gia hạn": { color: "orange",  icon: <ClockCircleOutlined /> },
};

export default function BorrowHistoryPage() {
  const [data, setData]         = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res  = await getAllPhieuMuons();
        const list = res.data.data ?? res.data;
        const mapped = list.map((item, index) => ({
          key:           item.maPhieuMuon || index,
          maPhieuMuon:   item.maPhieuMuon,
          maBanSao:      item.maBanSao,
          maBanDoc:      item.maBanDoc,
          ngayMuon:      item.ngayMuon,
          hanTra:        item.hanTra,
          ngayTraThucTe: item.ngayTraThucTe,
          soLanGiaHan:   item.soLanGiaHan,
          trangThai:     item.trangThai,
        }));
        setData(mapped);
        setFiltered(mapped);
      } catch (err) {
        console.error("Lỗi lấy lịch sử:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Tìm kiếm theo mã phiếu hoặc mã bản sao
  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      data.filter(
        (d) =>
          d.maPhieuMuon?.toLowerCase().includes(val) ||
          d.maBanSao?.toLowerCase().includes(val) ||
          d.maBanDoc?.toLowerCase().includes(val)
      )
    );
  };

  // Thống kê nhanh
  const tongSo     = data.length;
  const dangMuon   = data.filter((d) => d.trangThai === "Đang mượn").length;
  const daDong     = data.filter((d) => d.trangThai === "Đã đóng").length;
  const quaHan     = data.filter((d) => d.trangThai === "Quá hạn").length;

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "maPhieuMuon",
      key: "maPhieuMuon",
      render: (val) => (
        <span style={{ fontWeight: 500, color: "#1a1a18" }}>{val}</span>
      ),
    },
    {
      title: "Mã bản sao",
      dataIndex: "maBanSao",
      key: "maBanSao",
      render: (val) => (
        <span style={{ color: "#666" }}>{val}</span>
      ),
    },
    {
      title: "Ngày mượn",
      dataIndex: "ngayMuon",
      key: "ngayMuon",
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.ngayMuon).unix() - dayjs(b.ngayMuon).unix(),
    },
    {
      title: "Hạn trả",
      dataIndex: "hanTra",
      key: "hanTra",
      render: (val) => dayjs(val).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày trả thực tế",
      dataIndex: "ngayTraThucTe",
      key: "ngayTraThucTe",
      render: (val) => val ? dayjs(val).format("DD/MM/YYYY") : (
        <span style={{ color: "#bbb" }}>Chưa trả</span>
      ),
    },
    {
      title: "Gia hạn",
      dataIndex: "soLanGiaHan",
      key: "soLanGiaHan",
      align: "center",
      render: (val) => (
        <span style={{ color: val > 0 ? "#BA7517" : "#bbb" }}>
          {val} lần
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (val) => {
        const s = STATUS_COLOR[val] ?? { color: "default", icon: null };
        return (
          <Tag
            color={s.color}
            icon={s.icon}
            style={{ borderRadius: 6, fontSize: 12 }}
          >
            {val}
          </Tag>
        );
      },
      filters: [
        { text: "Đang mượn",  value: "Đang mượn" },
        { text: "Đã đóng",    value: "Đã đóng" },
        { text: "Quá hạn",    value: "Quá hạn" },
        { text: "Đã gia hạn", value: "Đã gia hạn" },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* TIÊU ĐỀ */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontSize: 11, letterSpacing: "0.08em",
          color: "#aaa", textTransform: "uppercase", marginBottom: 8,
        }}>
          Tài khoản
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 28, fontWeight: 600, color: "#1a1a18", margin: 0,
        }}>
          Lịch sử mượn sách
        </h1>
      </div>

      {/* THỐNG KÊ NHANH */}
      <Row gutter={[14, 14]} style={{ marginBottom: 28 }}>
        {[
          { label: "Tổng phiếu",   value: tongSo,   bg: "#F5F4F0", color: "#1a1a18" },
          { label: "Đang mượn",    value: dangMuon,  bg: "#E6F1FB", color: "#0C447C" },
          { label: "Đã trả",       value: daDong,    bg: "#EAF3DE", color: "#27500A" },
          { label: "Quá hạn",      value: quaHan,    bg: "#FCEBEB", color: "#791F1F" },
        ].map((s) => (
          <Col span={6} key={s.label}>
            <div style={{
              background: s.bg, borderRadius: 10, padding: "16px 20px",
            }}>
              <div style={{
                fontSize: 26, fontWeight: 600,
                color: s.color, marginBottom: 3,
                fontFamily: "'Playfair Display', serif",
              }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#888" }}>{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* BẢNG */}
      <Card
        style={{ borderRadius: 16, border: "0.5px solid #EEECEA" }}
        bodyStyle={{ padding: "20px 24px" }}
      >
        {/* SEARCH */}
        <div style={{ marginBottom: 16 }}>
          <Input
            prefix={<SearchOutlined style={{ color: "#aaa", fontSize: 13 }} />}
            placeholder="Tìm theo mã phiếu, mã bản sao, mã bạn đọc..."
            value={search}
            onChange={handleSearch}
            style={{ width: 360, borderRadius: 8, fontSize: 13 }}
            variant="filled"
          />
        </div>

        <Table
          dataSource={filtered}
          columns={columns}
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total) => `${total} phiếu`,
          }}
          locale={{
            emptyText: (
              <div style={{ padding: 40, color: "#bbb" }}>
                <BookOutlined style={{ fontSize: 32, marginBottom: 8 }} />
                <div>Không có lịch sử mượn sách</div>
              </div>
            ),
          }}
          rowStyle={{ fontSize: 13 }}
          style={{ fontSize: 13 }}
        />
      </Card>

    </div>
  );
}