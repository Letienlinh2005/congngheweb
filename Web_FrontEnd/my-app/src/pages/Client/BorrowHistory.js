import { useEffect, useState } from "react";
import { Table, Tag, Spin, Card, Row, Col, Input, Empty } from "antd";
import {
  SearchOutlined,
  BookOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { getPhieuMuonByUser } from "../../services/Admin_API/PhieuMuonAPI";
import dayjs from "dayjs";
import "../../css/BorrowHistory.css";

const STATUS_COLOR = {
  "Đang mượn": { color: "blue", icon: <ClockCircleOutlined /> },
  "Đã đóng": { color: "green", icon: <CheckCircleOutlined /> },
  "Quá hạn": { color: "red", icon: <ClockCircleOutlined /> },
  "Đã gia hạn": { color: "orange", icon: <ClockCircleOutlined /> },
};

export default function BorrowHistoryPage() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ── Lấy maBanDoc của user đang đăng nhập ──────────────────────────────────
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const maBanDoc = user?.maBanDoc ?? null;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (!maBanDoc) {
          setLoading(false);
          return;
        }

        const res = await getPhieuMuonByUser(maBanDoc);

        console.log("API response:", res.data);

        const list = res.data?.data ?? [];

        const mapped = list.map((item, index) => ({
          key: item.maPhieuMuon || index,
          maPhieuMuon: item.maPhieuMuon,
          maBanSao: item.maBanSao,
          tieuDe: item.tieuDe,
          maBanDoc: item.maBanDoc,
          ngayMuon: item.ngayMuon,
          hanTra: item.hanTra,
          ngayTraThucTe: item.ngayTraThucTe,
          soLanGiaHan: item.soLanGiaHan,
          trangThai: item.trangThai,
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
  }, [maBanDoc]);

  // ── Tìm kiếm ──────────────────────────────────────────────────────────────
  const handleSearch = (e) => {
    const val = e.target.value.toLowerCase();
    setSearch(val);
    setFiltered(
      data.filter(
        (d) =>
          d.maPhieuMuon?.toString().toLowerCase().includes(val) ||
          d.maBanSao?.toString().toLowerCase().includes(val),
      ),
    );
  };

  // ── Thống kê ──────────────────────────────────────────────────────────────
  const tongSo = data.length;
  const dangMuon = data.filter((d) => d.trangThai === "Đang mở").length;
  const daDong = data.filter((d) => d.trangThai === "Đã đóng").length;
  const quaHan = data.filter((d) => d.trangThai === "Quá hạn").length;

  const columns = [
    {
      title: "Mã phiếu",
      dataIndex: "maPhieuMuon",
      key: "maPhieuMuon",
      render: (val) => (
        <span className="borrow-cell--primary">{val}</span>
      ),
    },
    {
      title: "Mã bản sao",
      dataIndex: "maBanSao",
      key: "maBanSao",
      render: (val) => <span className="borrow-cell--secondary">{val}</span>,
    },
    {
      title: "Tên sách",
      dataIndex: "tieuDe",
      key: "tieuDe",
      render: (val) => <span className="borrow-cell--primary">{val}</span>,
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
      render: (val) =>
        val ? (
          dayjs(val).format("DD/MM/YYYY")
        ) : (
          <span className="borrow-cell--muted">Chưa trả</span>
        ),
    },
    {
      title: "Gia hạn",
      dataIndex: "soLanGiaHan",
      key: "soLanGiaHan",
      align: "center",
      render: (val) => (
        <span className={val > 0 ? "borrow-cell--extended" : "borrow-cell--muted"}>{val} lần</span>
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
            className="borrow-status-tag"
          >
            {val}
          </Tag>
        );
      },
      filters: [
        { text: "Đang mượn", value: "Đang mượn" },
        { text: "Đã đóng", value: "Đã đóng" },
        { text: "Quá hạn", value: "Quá hạn" },
        { text: "Đã gia hạn", value: "Đã gia hạn" },
      ],
      onFilter: (value, record) => record.trangThai === value,
    },
  ];

  // ── Không có maBanDoc → chưa liên kết ─────────────────────────────────────
  if (!loading && !maBanDoc) {
    return (
      <div className="borrow-page">
        <HeaderTitle />
        <div className="borrow-not-linked">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="borrow-not-linked__desc">
                Tài khoản chưa được liên kết với mã bạn đọc.
                <br />
                Vui lòng liên hệ thủ thư để được hỗ trợ.
              </span>
            }
          />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="borrow-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="borrow-page">
      <HeaderTitle maBanDoc={maBanDoc} />

      {/* THỐNG KÊ NHANH */}
      <Row gutter={[14, 14]} className="borrow-stats">
        {[
          {
            label: "Tổng phiếu",
            value: tongSo,
            bg: "#F5F4F0",
            color: "#1a1a18",
          },
          {
            label: "Đang mượn",
            value: dangMuon,
            bg: "#E6F1FB",
            color: "#0C447C",
          },
          { label: "Đã trả", value: daDong, bg: "#EAF3DE", color: "#27500A" },
          { label: "Quá hạn", value: quaHan, bg: "#FCEBEB", color: "#791F1F" },
        ].map((s) => (
          <Col span={6} key={s.label}>
            <div
              className="borrow-stat-card"
              style={{ background: s.bg }}
            >
              <div
                className="borrow-stat-card__value"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="borrow-stat-card__label">{s.label}</div>
            </div>
          </Col>
        ))}
      </Row>

      {/* BẢNG */}
      <Card className="borrow-table-card">
        <div className="borrow-table-card__search">
          <Input
            prefix={<SearchOutlined style={{ color: "#aaa", fontSize: 13 }} />}
            placeholder="Tìm theo mã phiếu, mã bản sao..."
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
              <div className="borrow-empty">
                <BookOutlined className="borrow-empty__icon" />
                <div>Không có lịch sử mượn sách</div>
              </div>
            ),
          }}
          style={{ fontSize: 13 }}
        />
      </Card>
    </div>
  );
}

// ── Sub-component tiêu đề ─────────────────────────────────────────────────────
function HeaderTitle({ maBanDoc }) {
  return (
    <div className="borrow-header">
      <div className="borrow-header__eyebrow">Tài khoản</div>
      <h1 className="borrow-header__title">Lịch sử mượn sách</h1>
      {maBanDoc && (
        <div className="borrow-header__sub">
          Mã bạn đọc: <span>{maBanDoc}</span>
        </div>
      )}
    </div>
  );
}
