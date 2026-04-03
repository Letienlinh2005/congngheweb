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
    getAllPhats,
    getPhatByMaBanDoc,
    thanhToanPhat
} from "../../services/Admin_API/PhatAPI";

function PhieuMuonList() {
    const [data, setData] = useState([]);

    const fetchPhat = async () => {
        try {
            const res = await getAllPhats();

            const mapped = res.data.data.map((item) => ({
                key: item.maPhat,
                maPhat: item.maPhat,
                hoTen: item.hoTen,
                tieuDe: item.tieuDe,
                soTien: item.soTien,
                lyDo: item.lyDo,
                ngayTinh: item.ngayTinh,
                trangThai: item.trangThai
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
            message.error("Lỗi load phạt");
        }
    };

    useEffect(() => {
        fetchPhat();
    }, []);

    const handlePay = async (record) => {
    try {
        await thanhToanPhat({
            maPhat: record.maPhat,
            maThanhToan: "TT" + Date.now(),
            hinhThuc: "Tiền mặt",
            ghiChu: "Thanh toán tại quầy"
        });

        message.success("Thanh toán thành công");
        fetchPhat();
    } catch (err) {
        console.log(err);
        message.error("Thanh toán thất bại");
    }
};

    const columns = [
    {
        title: "Mã phạt",
        dataIndex: "maPhat"
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
        title: "Số tiền",
        dataIndex: "soTien",
        render: (value) => value.toLocaleString() + " đ"
    },
    {
        title: "Lý do",
        dataIndex: "lyDo"
    },
    {
        title: "Ngày tính",
        dataIndex: "ngayTinh"
    },
    {
        title: "Trạng thái",
        dataIndex: "trangThai",
        render: (status) => (
            <Tag color={
                status === "Đã trả" ? "green" : "red"
            }>
                {status}
            </Tag>
        )
    },
    {
        title: "Hành động",
        render: (_, record) => (
            <Space>
                {record.trangThai !== "Đã trả" && (
                    <Popconfirm
                        title="Thanh toán khoản phạt này?"
                        onConfirm={() => handlePay(record)}
                    >
                        <a style={{ color: "blue" }}>Thanh toán</a>
                    </Popconfirm>
                )}
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