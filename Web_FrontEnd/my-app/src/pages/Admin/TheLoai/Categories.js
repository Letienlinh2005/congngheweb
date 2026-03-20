import { Table, Tag, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getTheLoais } from "../../../services/Admin_API/TheLoaiAPI";

function CategoryList() {
    const [data, setData] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await getTheLoais()

            const mapped = res.data.data.map((item, index) => ({
                key: item.maTheLoai,
                tenTheLoai: item.tenTheLoai,
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
            title: "Tên thể loại",
            dataIndex: "tenTheLoai",
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

export default CategoryList;