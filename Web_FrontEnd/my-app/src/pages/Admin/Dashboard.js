import { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Statistic,
  Tag,
  Table,
  Select,
  Typography,
  Progress,
  Spin,
  Alert,
  Button,
  Space,
  Divider,
} from "antd";
import {
  BookOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  DollarOutlined,
  ArrowUpOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;

// ─── API ────────────────────────────────────────────────────────────────────
const BASE = "https://localhost:7159/api";
const getAllPhieuMuons = () => axios.get(`${BASE}/PhieuMuon/chi-tiet`);
const getBanSaos = () => axios.get(`${BASE}/BanSao`);
const getTheLoais = () => axios.get(`${BASE}/TheLoai`);
const getBanDocs = () => axios.get(`${BASE}/BanDoc`);
const getPhats = () => axios.get(`${BASE}/Phat`);

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MONTH_LABELS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];
const COLORS = {
  new: "#1677ff",
  onTime: "#52c41a",
  late: "#ff4d4f",
  returned: "#52c41a",
  active: "#1677ff",
  overdue: "#ff4d4f",
  extended: "#faad14",
};
const DONUT_COLORS = ["#52c41a", "#1677ff", "#ff4d4f", "#faad14"];

const fineStatusTag = (st) => {
  if (st === "DaNop" || st === 2) return <Tag color="success">Đã nộp</Tag>;
  if (st === "DangXuLy" || st === 1) return <Tag color="warning">Đang xử lý</Tag>;
  return <Tag color="error">Chưa nộp</Tag>;
};

const formatVND = (n) =>
  new Intl.NumberFormat("vi-VN").format(Math.round(n || 0)) + "đ";

const fmtShort = (n) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return Math.round(n / 1_000) + "K";
  return String(n);
};

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ThongKeThuvien() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterStatus, setFilterStatus] = useState("all");

  // Raw data
  const [phieus, setPhieus] = useState([]);
  const [banSaos, setBanSaos] = useState([]);
  const [theLoais, setTheLoais] = useState([]);
  const [banDocs, setBanDocs] = useState([]);
  const [phats, setPhats] = useState([]);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, bs, tl, bd, ph] = await Promise.all([
        getAllPhieuMuons(),
        getBanSaos(),
        getTheLoais(),
        getBanDocs(),
        getPhats(),
      ]);
      setPhieus(p.data || []);
      setBanSaos(bs.data || []);
      setTheLoais(tl.data || []);
      setBanDocs(bd.data || []);
      setPhats(ph.data || []);
    } catch (e) {
      setError("Không thể kết nối đến máy chủ. Kiểm tra lại API và CORS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // ─── Derived stats ──────────────────────────────────────────────────────────
  const filteredPhieus = phieus.filter((p) => {
    const d = new Date(p.ngayMuon || p.NgayMuon);
    const matchYear = isNaN(d) || d.getFullYear() === filterYear;
    const st = p.trangThai;
    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && (st === "DangMuon" || st === 1)) ||
      (filterStatus === "overdue" && (st === "QuaHan" || st === 2)) ||
      (filterStatus === "returned" && (st === "DaTra" || st === 0));
    return matchYear && matchStatus;
  });

  const total = filteredPhieus.length;
  const activeCount = filteredPhieus.filter((p) => p.trangThai === "DangMuon" || p.trangThai === 1).length;
  const overdueCount = filteredPhieus.filter((p) => p.trangThai === "QuaHan" || p.trangThai === 2).length;
  const returnedCount = filteredPhieus.filter((p) => p.trangThai === "DaTra" || p.trangThai === 0).length;
  const extendedCount = filteredPhieus.filter((p) => (p.soLanGiaHan || p.SoLanGiaHan || 0) > 0).length;

  const totalFine = phats.reduce((s, p) => s + (p.soTien || p.SoTien || 0), 0);
  const unpaidFine = phats
    .filter((p) => p.trangThai !== "DaNop" && p.trangThai !== 2)
    .reduce((s, p) => s + (p.soTien || p.SoTien || 0), 0);

  // Monthly chart data
  const monthlyData = MONTH_LABELS.map((label, i) => {
    const monthPhieus = filteredPhieus.filter((p) => {
      const d = new Date(p.ngayMuon || p.NgayMuon);
      return !isNaN(d) && d.getMonth() === i;
    });
    const newCount = monthPhieus.length;
    let onTime = 0, late = 0;
    monthPhieus.forEach((p) => {
      if (p.trangThai === "DaTra" || p.trangThai === 0) {
        const han = new Date(p.hanTra || p.HanTra);
        const thucTe = new Date(p.ngayTraThucTe || p.NgayTraThucTe);
        if (!isNaN(han) && !isNaN(thucTe)) {
          thucTe <= han ? onTime++ : late++;
        } else { onTime++; }
      }
    });
    return { label, "Mượn mới": newCount, "Trả đúng hạn": onTime, "Trả trễ": late };
  });

  // Donut data
  const donutData = [
    { name: `Đã trả (${total ? Math.round(returnedCount/total*100) : 0}%)`, value: returnedCount },
    { name: `Đang mượn (${total ? Math.round(activeCount/total*100) : 0}%)`, value: activeCount },
    { name: `Quá hạn (${total ? Math.round(overdueCount/total*100) : 0}%)`, value: overdueCount },
    { name: `Gia hạn (${total ? Math.round(extendedCount/total*100) : 0}%)`, value: extendedCount },
  ];

  // Genre borrowing rate
  const genreStats = (() => {
    const map = {};
    theLoais.forEach((tl) => {
      const key = tl.maTheLoai || tl.MaTheLoai;
      map[key] = { name: tl.tenTheLoai || tl.TenTheLoai, total: 0, active: 0 };
    });
    banSaos.forEach((bs) => {
      const key = bs.maTheLoai || bs.MaTheLoai;
      if (key && map[key]) {
        map[key].total++;
        if (bs.trangThai === "DangMuon" || bs.trangThai === 1) map[key].active++;
      }
    });
    return Object.values(map)
      .filter((g) => g.total > 0)
      .sort((a, b) => b.active / b.total - a.active / a.total)
      .slice(0, 6);
  })();

  // Fine table
  const docMap = {};
  banDocs.forEach((d) => { docMap[d.maBanDoc || d.MaBanDoc] = d.hoTen || d.HoTen || "Không rõ"; });

  const unpaidList = phats
    .filter((p) => p.trangThai !== "DaNop" && p.trangThai !== 2)
    .slice(0, 8)
    .map((p) => ({
      key: p.maPhat || p.MaPhat,
      hoTen: docMap[p.maBanDoc || p.MaBanDoc] || "Bạn đọc",
      soPhieu: p.maPhieuMuon || p.MaPhieuMuon || "—",
      soTien: p.soTien || p.SoTien || 0,
      trangThai: p.trangThai,
    }));

  const fineColumns = [
    { title: "Họ tên", dataIndex: "hoTen", key: "hoTen", render: (t) => <Text strong>{t}</Text> },
    { title: "Số phiếu", dataIndex: "soPhieu", key: "soPhieu", render: (t) => <Text type="secondary">{t}</Text> },
    { title: "Số tiền", dataIndex: "soTien", key: "soTien", render: (v) => <Text strong style={{ color: "#ff4d4f" }}>{formatVND(v)}</Text> },
    { title: "Trạng thái", dataIndex: "trangThai", key: "trangThai", render: fineStatusTag },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <Alert
        type="error"
        message="Lỗi kết nối API"
        description={error}
        action={<Button size="small" onClick={fetchAll} icon={<ReloadOutlined />}>Thử lại</Button>}
        style={{ margin: 24 }}
      />
    );
  }

  return (
    <div style={{ padding: "24px", background: "#f5f5f0", minHeight: "100vh" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 20 }}>
        <Col>
          <Title level={4} style={{ margin: 0 }}>Tổng quan thư viện</Title>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN")}
          </Text>
        </Col>
        <Col>
          <Space>
            <Select value={filterStatus} onChange={setFilterStatus} style={{ width: 130 }}>
              <Option value="all">Tất cả</Option>
              <Option value="active">Đang mượn</Option>
              <Option value="overdue">Quá hạn</Option>
              <Option value="returned">Đã trả</Option>
            </Select>
            <Select value={filterYear} onChange={setFilterYear} style={{ width: 90 }}>
              {[2024, 2025, 2026].map((y) => <Option key={y} value={y}>{y}</Option>)}
            </Select>
            <Button icon={<ReloadOutlined />} onClick={fetchAll} loading={loading}>
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>

      <Spin spinning={loading}>
        {/* KPI Cards */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Tổng phiếu mượn"
                value={total}
                prefix={<BookOutlined style={{ color: "#1677ff" }} />}
                suffix={<Text type="success" style={{ fontSize: 12 }}><ArrowUpOutlined /> 12%</Text>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Đang mượn"
                value={activeCount}
                prefix={<ClockCircleOutlined style={{ color: "#faad14" }} />}
                suffix={<Text type="secondary" style={{ fontSize: 12 }}>{total ? Math.round(activeCount/total*100) : 0}%</Text>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Quá hạn chưa trả"
                value={overdueCount}
                valueStyle={{ color: "#ff4d4f" }}
                prefix={<ExclamationCircleOutlined style={{ color: "#ff4d4f" }} />}
                suffix={<Text type="danger" style={{ fontSize: 12 }}>{total ? (overdueCount/total*100).toFixed(1) : 0}%</Text>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            <Card>
              <Statistic
                title="Tổng tiền phạt"
                value={fmtShort(totalFine)}
                prefix={<DollarOutlined style={{ color: "#ff4d4f" }} />}
                suffix={<Text type="danger" style={{ fontSize: 12 }}>Nợ: {fmtShort(unpaidFine)}</Text>}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
          <Col xs={24} md={14}>
            <Card
              title="Hoạt động mượn – trả theo tháng"
              extra={<Text type="secondary" style={{ fontSize: 12 }}>Năm {filterYear}</Text>}
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Mượn mới" fill={COLORS.new} radius={[3,3,0,0]} />
                  <Bar dataKey="Trả đúng hạn" fill={COLORS.onTime} radius={[3,3,0,0]} />
                  <Bar dataKey="Trả trễ" fill={COLORS.late} radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Col>
          <Col xs={24} md={10}>
            <Card title="Tỉ lệ trạng thái phiếu mượn">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent*100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {donutData.map((_, i) => (
                      <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, name) => [v, name]} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>

        {/* Genre + Fine */}
        <Row gutter={[12, 12]}>
          <Col xs={24} md={10}>
            <Card title="Tỉ lệ cho mượn theo thể loại" extra={<Text type="secondary" style={{ fontSize: 12 }}>Bản sao đang lưu hành</Text>}>
              {genreStats.length === 0 ? (
                <Text type="secondary">Không có dữ liệu</Text>
              ) : (
                genreStats.map((g) => {
                  const pct = Math.round((g.active / g.total) * 100);
                  return (
                    <div key={g.name} style={{ marginBottom: 12 }}>
                      <Row justify="space-between" style={{ marginBottom: 4 }}>
                        <Text style={{ fontSize: 13 }}>{g.name}</Text>
                        <Text strong style={{ fontSize: 13 }}>{pct}%</Text>
                      </Row>
                      <Progress
                        percent={pct}
                        showInfo={false}
                        strokeColor="#1677ff"
                        trailColor="#f0f0f0"
                        size={["100%", 8]}
                      />
                    </div>
                  );
                })
              )}
            </Card>
          </Col>
          <Col xs={24} md={14}>
            <Card
              title="Phạt chưa thanh toán"
              extra={<Text type="secondary" style={{ fontSize: 12 }}>Độc giả còn nợ phạt</Text>}
            >
              <Table
                columns={fineColumns}
                dataSource={unpaidList}
                pagination={false}
                size="small"
                locale={{ emptyText: "Không có khoản phạt nào" }}
              />
              {unpaidList.length > 0 && (
                <>
                  <Divider style={{ margin: "10px 0" }} />
                  <Row justify="space-between" align="middle">
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Tổng chưa nộp: <Text strong style={{ color: "#ff4d4f" }}>{formatVND(unpaidFine)}</Text>
                    </Text>
                    <Button size="small" type="link">Xem tất cả →</Button>
                  </Row>
                </>
              )}
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
}