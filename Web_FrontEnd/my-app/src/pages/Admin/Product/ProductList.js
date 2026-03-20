import { Table, Tag, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getSachs } from "../../../services/Admin_API/SachAPI";

function ProductList() {
    const [data, setData] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await getSachs()

            const mapped = res.data.data.map((item, index) => ({
                key: item.maSach || index,
                tenSanPham: item.tieuDe,
                tacGia: item.tacGia,
                namXuatBan: item.namXuatBan,
                theLoai: item.maTheLoai,
                anhBiaUrl: item.anhBiaUrl
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
            title: "Tên sách",
            dataIndex: "tenSanPham",
        },
        {
            title: "Tác giả",
            dataIndex: "tacGia",
        },
        {
            title: "Năm",
            dataIndex: "namXuatBan",
        },
        {
            title: "Thể loại",
            dataIndex: "theLoai",
            render: (text) => <Tag color="blue">{text}</Tag>,
        },
        {
            title: "Ảnh",
            dataIndex: "anhBiaUrl",
            render: (url) => (
                <img src={url} alt="" style={{ width: 70 }} />
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

export default ProductList;