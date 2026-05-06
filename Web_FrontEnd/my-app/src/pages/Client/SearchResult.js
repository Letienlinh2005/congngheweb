import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Empty, Spin, Input, Select, Tag } from "antd";
import {
  BookOutlined, SearchOutlined, FilterOutlined,
} from "@ant-design/icons";
import { getSachs } from "../../services/Admin_API/SachAPI"; 

const { Option } = Select;

const bgColors = ["#E1F5EE", "#EEEDFE", "#FAECE7", "#FAEEDA", "#E7F0FA", "#FAF0E7"];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [allBooks, setAllBooks]     = useState([]);
  const [results, setResults]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [sortBy, setSortBy]         = useState("default");
  const [inputVal, setInputVal]     = useState(query);

  // Fetch all books once
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getSachs();
        const mapped = res.data.data.map((item, index) => ({
          key:        item.maSach || index,
          tieuDe:     item.tieuDe || "",
          tacGia:     item.tacGia || "",
          namXuatBan: item.namXuatBan || "",
          theLoai:    item.theLoai || "",
          anhBiaUrl:  item.anhBiaUrl || "",
          moTa:       item.moTa || "",
        }));
        setAllBooks(mapped);
      } catch (err) {
        console.error("Lỗi lấy sách:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filter whenever query or allBooks changes
  useEffect(() => {
    if (!query.trim()) {
      setResults(allBooks);
      return;
    }
    const q = query.toLowerCase();
    const filtered = allBooks.filter(
      (b) =>
        b.tieuDe.toLowerCase().includes(q) ||
        b.tacGia.toLowerCase().includes(q) ||
        b.theLoai.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query, allBooks]);

  // Sort
  const sorted = [...results].sort((a, b) => {
    if (sortBy === "title_asc")  return a.tieuDe.localeCompare(b.tieuDe);
    if (sortBy === "title_desc") return b.tieuDe.localeCompare(a.tieuDe);
    if (sortBy === "year_desc")  return (b.namXuatBan || 0) - (a.namXuatBan || 0);
    if (sortBy === "year_asc")   return (a.namXuatBan || 0) - (b.namXuatBan || 0);
    return 0;
  });

  const handleSearch = () => {
    if (inputVal.trim()) {
      setSearchParams({ q: inputVal.trim() });
    }
  };

  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>

      {/* ── SEARCH HEADER BAR ── */}
      <div style={{
        background: "#1a1a18",
        borderRadius: 14,
        padding: "28px 32px",
        marginBottom: 32,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{
            fontSize: 11, letterSpacing: "0.12em",
            color: "#888780", textTransform: "uppercase", marginBottom: 6,
          }}>
            Kết quả tìm kiếm
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 22, fontWeight: 600, color: "#F1EFE8",
            margin: 0,
          }}>
            {query ? `"${query}"` : "Tất cả sách"}
          </h2>
          {!loading && (
            <div style={{ fontSize: 12, color: "#666664", marginTop: 4 }}>
              Tìm thấy{" "}
              <span style={{ color: "#aaa" }}>{results.length}</span>{" "}
              kết quả
            </div>
          )}
        </div>

        {/* Re-search input */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined style={{ color: "#888780", fontSize: 13 }} />}
            placeholder="Tìm kiếm khác..."
            style={{
              width: 220, borderRadius: 8, fontSize: 13,
              background: "#2C2C2A", border: "1px solid #3a3a38",
              color: "#F1EFE8",
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              background: "#F1EFE8", color: "#1a1a18",
              border: "none", padding: "7px 18px", borderRadius: 8,
              fontWeight: 500, fontSize: 13, cursor: "pointer",
            }}
          >
            Tìm
          </button>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 20, flexWrap: "wrap", gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FilterOutlined style={{ color: "#999", fontSize: 13 }} />
          <span style={{ fontSize: 12, color: "#999" }}>Sắp xếp theo:</span>
          <Select
            value={sortBy}
            onChange={setSortBy}
            size="small"
            style={{ width: 180, fontSize: 12 }}
            options={[
              { label: "Mặc định",          value: "default"    },
              { label: "Tên A → Z",         value: "title_asc"  },
              { label: "Tên Z → A",         value: "title_desc" },
              { label: "Năm mới nhất",      value: "year_desc"  },
              { label: "Năm cũ nhất",       value: "year_asc"   },
            ]}
          />
        </div>

        {query && (
          <Tag
            closable
            onClose={() => { setSearchParams({}); setInputVal(""); }}
            style={{
              borderRadius: 20, padding: "2px 10px",
              background: "#F5F4F0", border: "1px solid #EEECEA",
              fontSize: 12, color: "#555",
            }}
          >
            {query}
          </Tag>
        )}
      </div>

      {/* ── RESULTS ── */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16, color: "#999", fontSize: 13 }}>
            Đang tải sách...
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 0",
          background: "#fff", borderRadius: 12,
          border: "1px solid #EEECEA",
        }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span style={{ color: "#999", fontSize: 13 }}>
                Không tìm thấy sách phù hợp với <b>"{query}"</b>
              </span>
            }
          />
          <button
            onClick={() => { setSearchParams({}); setInputVal(""); }}
            style={{
              marginTop: 16, background: "#1a1a18", color: "#F1EFE8",
              border: "none", padding: "8px 22px", borderRadius: 8,
              fontWeight: 500, fontSize: 13, cursor: "pointer",
            }}
          >
            Xem tất cả sách
          </button>
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {sorted.map((b, i) => (
            <Col xs={12} sm={8} md={6} key={b.key}>
              <Card
                hoverable
                onClick={() => navigate(`/books/${b.key}`)}
                bodyStyle={{ padding: "12px 14px" }}
                style={{
                  border: "0.5px solid #EEECEA",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "box-shadow 0.2s",
                }}
                cover={
                  b.anhBiaUrl ? (
                    <img
                      src={b.anhBiaUrl}
                      alt={b.tieuDe}
                      style={{
                        height: 160, width: "100%",
                        objectFit: "cover",
                        borderRadius: "12px 12px 0 0",
                      }}
                    />
                  ) : (
                    <div style={{
                      height: 160,
                      background: bgColors[i % bgColors.length],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      borderRadius: "12px 12px 0 0",
                    }}>
                      <BookOutlined style={{ fontSize: 38, opacity: 0.35 }} />
                    </div>
                  )
                }
              >
                {/* Highlight matching text */}
                <div style={{
                  fontWeight: 500, fontSize: 13, color: "#1a1a18", marginBottom: 3,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}>
                  <HighlightText text={b.tieuDe} keyword={query} />
                </div>
                <div style={{ fontSize: 11, color: "#999", marginBottom: 2 }}>
                  <HighlightText text={b.tacGia} keyword={query} />
                </div>
                {b.namXuatBan && (
                  <div style={{ fontSize: 11, color: "#bbb" }}>
                    NXB: {b.namXuatBan}
                  </div>
                )}
                {b.theLoai && (
                  <Tag style={{
                    marginTop: 6, fontSize: 10, borderRadius: 20,
                    background: "#F5F4F0", border: "1px solid #EEECEA", color: "#888",
                  }}>
                    {b.theLoai}
                  </Tag>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

// ── Helper: highlight keyword in text ──
function HighlightText({ text, keyword }) {
  if (!keyword || !text) return <span>{text}</span>;
  const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts  = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} style={{
            background: "#FFF3CD", color: "#1a1a18",
            padding: "0 1px", borderRadius: 2,
          }}>
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}