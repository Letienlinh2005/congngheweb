import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Row, Col, Card, Empty, Spin, Input, Select, Tag } from "antd";
import { BookOutlined, SearchOutlined, FilterOutlined,} from "@ant-design/icons";
import { getSachs } from "../../services/Admin_API/SachAPI"; 
import "../../css/SearchResult.css";

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
    <div className="search-result-page">

      {/* ── SEARCH HEADER BAR ── */}
      <div className="search-header-bar">
        <div className="search-header-info">
          <div className="search-header-eyebrow">
            Kết quả tìm kiếm
          </div>
          <h2 className="search-header-title">
            {query ? `"${query}"` : "Tất cả sách"}
          </h2>
          {!loading && (
            <div className="search-header-count">
              Tìm thấy{" "}
              <span>{results.length}</span>{" "}
              kết quả
            </div>
          )}
        </div>

        {/* Re-search input */}
        <div className="search-input-wrap">
          <Input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm khác..."
            className="search-input"
          />
          <button
            onClick={handleSearch}
            className="search-btn-search"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="search-toolbar">
        <div className="search-sort-wrap">
          <FilterOutlined className="search-sort-icon" />
          <span className="search-sort-label">Sắp xếp theo:</span>
          <Select
            value={sortBy}
            onChange={setSortBy}
            size="small"
            className="search-sort-select"
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
            className="search-tag-query"
          >
            {query}
          </Tag>
        )}
      </div>

      {/* ── RESULTS ── */}
      {loading ? (
        <div className="search-loading">
          <Spin size="large" />
          <div className="search-loading-text">
            Đang tải sách...
          </div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="search-empty">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="search-empty-text">
                Không tìm thấy sách phù hợp với <b>"{query}"</b>
              </span>
            }
          />
          <button
            onClick={() => { setSearchParams({}); setInputVal(""); }}
            className="search-empty-btn"
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
                className="search-card"
                cover={
                  b.anhBiaUrl ? (
                    <img
                      src={b.anhBiaUrl}
                      alt={b.tieuDe}
                      className="search-card-cover"
                    />
                  ) : (
                    <div
                      className="search-card-placeholder"
                      style={{ background: bgColors[i % bgColors.length] }}
                    >
                      <BookOutlined />
                    </div>
                  )
                }
              >
                <div className="search-card-title">
                  <HighlightText text={b.tieuDe} keyword={query} />
                </div>
                <div className="search-card-author">
                  <HighlightText text={b.tacGia} keyword={query} />
                </div>
                {b.namXuatBan && (
                  <div className="search-card-year">
                    NXB: {b.namXuatBan}
                  </div>
                )}
                {b.theLoai && (
                  <Tag className="search-card-category">
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
          <mark key={i} className="search-highlight">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}