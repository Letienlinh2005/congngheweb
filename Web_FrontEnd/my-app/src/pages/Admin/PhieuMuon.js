import {
    Table, Space, Tag, message, Popconfirm, Button, Modal, DatePicker
} from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PageHeader from "../../components/PageHeader";
import { getAllPhieuMuons, returnPhieuMuon } from "../../services/Admin_API/PhieuMuonAPI";
import axiosClient from "../../services/axiosClient"; // chỉnh path nếu cần

const GIA_HAN_NGAY = 3; // số ngày gia hạn thêm, đổi tuỳ ý

function PhieuMuonList() {
    const [data, setData] = useState([]);

    const fetchPhieuMuon = async () => {
        try {
            const res = await getAllPhieuMuons();
            const mapped = res.data.data.map((item) => ({
                key:           item.maPhieuMuon,
                maPhieuMuon:   item.maPhieuMuon,
                ngayMuon:      item.ngayMuon,
                hoTen:         item.hoTen,
                tieuDe:        item.tieuDe,
                hanTra:        item.hanTra,
                ngayTraThucTe: item.ngayTraThucTe,
                soLanGiaHan:   item.soLanGiaHan,
                trangThai:     item.trangThai,
            }));
            setData(mapped);
        } catch (err) {
            console.log(err);
            message.error("Lỗi load phiếu mượn");
        }
    };

    useEffect(() => { fetchPhieuMuon(); }, []);

    // ── TRẢ SÁCH ──────────────────────────────────────────────
    const handleReturn = async (id) => {
        try {
            await returnPhieuMuon({
                maPhieuMuon:   id,
                ngayTraThucTe: new Date().toISOString(),
            });
            message.success("Trả sách thành công");
            fetchPhieuMuon();
        } catch (err) {
            message.error("Trả sách thất bại");
        }
    };

    // ── GIA HẠN ───────────────────────────────────────────────
    const handleGiaHan = async (record) => {
        try {
            const hanTraMoi = dayjs(record.hanTra)
                .add(GIA_HAN_NGAY, "day")
                .toISOString();

            await axiosClient.put(`/PhieuMuon/gia-han/${record.maPhieuMuon}`, {
                hanTra:      hanTraMoi,
                soLanGiaHan: (record.soLanGiaHan || 0) + 1,
            });

            message.success(`Gia hạn thêm ${GIA_HAN_NGAY} ngày thành công`);
            fetchPhieuMuon();
        } catch (err) {
            console.log(err);
            message.error(err.response?.data?.message || "Gia hạn thất bại");
        }
    };

    const columns = [
        {
            title: "Mã phiếu",
            dataIndex: "maPhieuMuon",
        },
        {
            title: "Bạn đọc",
            dataIndex: "hoTen",
        },
        {
            title: "Sách",
            dataIndex: "tieuDe",
        },
        {
            title: "Ngày mượn",
            dataIndex: "ngayMuon",
            render: (v) => dayjs(v).format("DD/MM/YYYY"),
        },
        {
            title: "Hạn trả",
            dataIndex: "hanTra",
            render: (v, record) => {
                const isQuaHan = dayjs(v).isBefore(dayjs()) && record.trangThai !== "Đã đóng";
                return (
                    <span style={{ color: isQuaHan ? "#cf1322" : "inherit", fontWeight: isQuaHan ? 500 : 400 }}>
                        {dayjs(v).format("DD/MM/YYYY")}
                        {isQuaHan && <Tag color="red" style={{ marginLeft: 6, fontSize: 11 }}>Quá hạn</Tag>}
                    </span>
                );
            },
        },
        {
            title: "Trả thực tế",
            dataIndex: "ngayTraThucTe",
            render: (v) => v ? dayjs(v).format("DD/MM/YYYY") : <span style={{ color: "#aaa" }}>Chưa trả</span>,
        },
        {
            title: "Gia hạn",
            dataIndex: "soLanGiaHan",
            align: "center",
            render: (v) => (
                <span style={{ color: v > 0 ? "#BA7517" : "#aaa" }}>{v} lần</span>
            ),
        },
        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            render: (status) => (
                <Tag color={
                    status === "Đang mở" ? "blue"  :
                    status === "Đã đóng" ? "green" : "red"
                }>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    {/* NÚT GIA HẠN */}
                    {record.trangThai !== "Đã đóng" && (
                        <Popconfirm
                            title={`Gia hạn thêm ${GIA_HAN_NGAY} ngày?`}
                            description={
                                <span>
                                    Hạn trả mới:{" "}
                                    <b>
                                        {dayjs(record.hanTra)
                                            .add(GIA_HAN_NGAY, "day")
                                            .format("DD/MM/YYYY")}
                                    </b>
                                </span>
                            }
                            onConfirm={() => handleGiaHan(record)}
                            okText="Gia hạn"
                            cancelText="Huỷ"
                        >
                            <a style={{ color: "#BA7517" }}>Gia hạn</a>
                        </Popconfirm>
                    )}

                    {/* NÚT TRẢ SÁCH */}
                    {record.trangThai !== "Đã đóng" && (
                        <Popconfirm
                            title="Xác nhận trả sách?"
                            onConfirm={() => handleReturn(record.key)}
                            okText="Trả"
                            cancelText="Huỷ"
                        >
                            <a style={{ color: "red" }}>Trả sách</a>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <>
            <PageHeader title="Quản lý phiếu mượn" />
            <Table columns={columns} dataSource={data} />
        </>
    );
}

export default PhieuMuonList;