import { Table, Tag, Space } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

import { getTaiKhoans } from "../../../services/Admin_API/TaiKhoanAPI";

function AccountList() {
    const [data, setData] = useState([]);

    const fetchProducts = async () => {
        try {
            const res = await getTaiKhoans()

            const mapped = res.data.data.map((item, index) => ({
                key: item.maTaiKhoan,
                tenDangNhap: item.tenDangNhap,
                vaiTro: item.vaiTro
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
            title: "Tên đăng nhập",
            dataIndex: "tenDangNhap",
        },
        {
            title: "Vai trò",
            dataIndex: "vaiTro",
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

export default AccountList;