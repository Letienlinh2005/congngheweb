import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tag, Spin, message } from "antd";
import axiosClient from "../../services/axiosClient";
import { getSachById } from "../../services/Admin_API/SachAPI";
import { parseJwt } from "../../ultilities/parseJwt";
import "../../css/ProductDetail.css";

function BookDetail() {
    const { id } = useParams();

    const [book, setBook] = useState(null);
    const [copies, setCopies] = useState([]);
    const [loadingBorrow, setLoadingBorrow] = useState(false);

    // 🔹 Lấy sách
    const fetchBook = async () => {
        try {
            const res = await getSachById(id);
            setBook(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    //  Lấy bản sao
    const fetchCopies = async () => {
        try {
            const res = await axiosClient.get(`/BanSao/by-sach/${id}`);
            setCopies(res.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBook();
        fetchCopies();
    }, [id]);

    //  MƯỢN SÁCH
    const handleBorrow = async () => {
        try {
            setLoadingBorrow(true);

            const token = localStorage.getItem("token");
            const user = parseJwt(token);

            console.log("User:", user);
            console.log("Copies:", copies);

            const maBanDoc = user?.maBanDoc || user?.MaBanDoc;

            if (!maBanDoc) {
                message.error("Không xác định được người dùng");
                return;
            }

            const available = copies.find(
                x => x.trangThai?.toLowerCase().trim() === "có sẵn"
            );

            if (!available) {
                const confirmReserve = window.confirm("Hết sách, đặt chỗ?");
                if (confirmReserve) {
                    await axiosClient.post("/PhieuMuon/dat-cho", {
                        maSach: id,
                        maBanDoc
                    });
                    message.success("Đặt chỗ thành công");
                }
                return;
            }

            await axiosClient.post("/PhieuMuon", {
                maBanDoc,
                maBanSao: available.maBanSao,
                ngayMuon: new Date(),
                hanTra: new Date(Date.now() + 7 * 86400000)
            });

            message.success("Mượn sách thành công");
            fetchCopies();
        } catch (err) {
            console.log("ERROR:", err.response);
            message.error(err.response?.data?.message || "Lỗi mượn sách");
        } finally {
            setLoadingBorrow(false);
        }
    };

    if (!book) return <Spin />;

    return (
        <div className="product-detail">
            <div className="container">
                <div className="left">
                    <img src={book.anhBiaUrl} alt={book.tieuDe} />
                </div>

                <div className="right">
                    <h1>{book.tieuDe}</h1>
                    <p><b>Tác giả: </b>{book.tacGia}</p>
                    <p><b>Năm xuất bản: </b>{book.namXuatBan}</p>
                    <p><b>Thể loại: </b>{book.theLoai}</p>
                    <p><b>Tóm tắt: </b>{book.tomTat || "Chưa có tóm tắt"}</p>

                    {/* TRẠNG THÁI BẢN SAO */}
                    <div style={{ marginBottom: 10 }}>
                        <b>Tình trạng: </b>
                        {copies.length === 0 && <span>Không có dữ liệu</span>}
                        {copies.map(c => (
                            <Tag key={c.maBanSao} color={
                                c.trangThai === "Có sẵn" ? "green" :
                                    c.trangThai === "Đang mượn" ? "orange" : "red"
                            }>
                                {c.trangThai}
                            </Tag>
                        ))}
                    </div>

                    <button
                        className="btn"
                        onClick={handleBorrow}
                        disabled={loadingBorrow}
                    >
                        {loadingBorrow ? "Đang xử lý..." : "Mượn sách"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookDetail;