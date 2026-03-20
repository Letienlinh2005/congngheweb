import { Table, Tag, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBanDocs } from "../../../services/Admin_API/BanDocAPI";

function ReaderList() {
    const [data, setData] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await getBanDocs()

            const mapped = res.data.data.map((item, index) => ({
                key: item.maBanDoc,
                tenBanDoc: item.hoTen,
                soThe: item.soThe,
                email: item.email,
                dienThoai: item.dienThoai,
                hanThe: item.hanThe,
                trangThaiThe: item.trangThaiThe,
                duNo: item.duNo
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const columns = [
        {
            title: "Tên bạn đọc",
            dataIndex: "tenBanDoc",
        },
        {
            title: "Số thẻ",
            dataIndex: "soThe",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Điện thoại",
            dataIndex: "dienThoai",
        },
        {
            title: "Hạn thẻ",
            dataIndex: "hanThe",
        },
        {
            title: "Trạng thái",
            dataIndex: "trangThaiThe",
            render: (text) => (
                <Tag color={text ? "green" : "red"}>
                    {text ? "Hoạt động" : "Hết hạn"}
                </Tag>
            ),
        },
        {
            title: "Dư nợ",
            dataIndex: "duNo",
            render: (value) => (
                <span style={{ color: value > 0 ? "red" : "green" }}>
                    {value}₫
                </span>
            ),
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <a>Sửa</a>
                    <a style={{ color: "red" }}>Xoá</a>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={data} />;
}

export default ReaderList;