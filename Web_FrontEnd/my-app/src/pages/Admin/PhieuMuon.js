import {
    Table,
    Space,
    Tag,
    message,
    Popconfirm,
    Button
} from "antd";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";

import {
    getAllPhieuMuons,
    returnPhieuMuon 
} from "../../services/Admin_API/PhieuMuonAPI";

function PhieuMuonList() {
    const [data, setData] = useState([]);

    const fetchPhieuMuon = async () => {
        try {
            const res = await getAllPhieuMuons();

            const mapped = res.data.data.map((item) => ({
                key: item.maPhieuMuon,
                maPhieuMuon: item.maPhieuMuon,
                ngayMuon: item.ngayMuon,
                hoTen: item.hoTen,
                tieuDe: item.tieuDe,
                hanTra: item.hanTra,
                ngayTraThucTe: item.ngayTraThucTe,
                soLanGiaHan: item.soLanGiaHan,
                trangThai: item.trangThai
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
            message.error("Lỗi load phiếu mượn");
        }
    };

    useEffect(() => {
        fetchPhieuMuon();
    }, []);

    const handleReturn = async (id) => {
        console.log(id);
        try {
            await returnPhieuMuon({
                maPhieuMuon: id,
                ngayTraThucTe: new Date().toISOString()
            });
            message.success("Trả sách thành công");
            fetchPhieuMuon();
        } catch (err) {
            message.error("Trả sách thất bại");
        }
    };

    const columns = [
        {
            title: "Mã phiếu",
            dataIndex: "maPhieuMuon"
        },
        {
            title: "Bạn đọc",
            dataIndex: "hoTen"
        },
        {
            title: "Sách",
            dataIndex: "tieuDe"
        },
        {
            title: "Ngày mượn",
            dataIndex: "ngayMuon"
        },
        {
            title: "Hạn trả",
            dataIndex: "hanTra"
        },
        {
            title: "Trả thực tế",
            dataIndex: "ngayTraThucTe",
            render: (value) => value || "Chưa trả"
        },
        {
            title: "Gia hạn",
            dataIndex: "soLanGiaHan"
        },
        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            render: (status) => (
                <Tag color={
                    status === "Đang mở" ? "blue" :
                    status === "Đã trả" ? "green" : "red"
                }>
                    {status}
                </Tag>
            )
         }
        ,
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Trả sách?"
                        onConfirm={() => handleReturn(record.key)}
                    >
                        <a style={{ color: "red" }}>Trả sách</a>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <PageHeader title="Quản lý phiếu mượn" />

            <Table columns={columns} dataSource={data} />
        </>
    );
}

export default PhieuMuonList;