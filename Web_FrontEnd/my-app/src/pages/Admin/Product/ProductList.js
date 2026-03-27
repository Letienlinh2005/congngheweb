import { Table, Tag, Space, Modal, Form, Input, Button, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { deleteSach, getSachs, updateSach } from "../../../services/Admin_API/SachAPI";

function ProductList() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();

    // fetch data
    const fetchProducts = async () => {
        try {
            const res = await getSachs();

            const mapped = res.data.data.map((item, index) => ({
                key: item.maSach || index,
                tenSanPham: item.tieuDe,
                tacGia: item.tacGia,
                namXuatBan: item.namXuatBan,
                theLoai: item.maTheLoai,
                anhBiaUrl: item.anhBiaUrl,
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // mở modal sửa
    const handleEdit = (record) => {
        setEditingProduct(record);
        setIsModalOpen(true);

        form.setFieldsValue({
            tieuDe: record.tenSanPham,
            tacGia: record.tacGia,
            namXuatBan: record.namXuatBan,
            maTheLoai: record.theLoai,
            anhBiaUrl: record.anhBiaUrl,
        });
    };

    // update API
    const handleUpdate = async (values) => {
        try {
            await updateSach(editingProduct.key, values);

            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            console.log(err);
        }
    };

    // Delete API
    const handleDelete = async (id) => {
        try {
            await deleteSach(id);
            message.success("Xoá thành công!");

            fetchProducts();
        }
        catch (err) {
            console.log(err);
            message.error("Xoá thất bại :(")
        }
    }

    // columns
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
                <img src={url} alt="" style={{ width: 70, borderRadius: 6 }} />
            ),
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <a onClick={() => handleEdit(record)}>Sửa</a>

                    <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => handleDelete(record.key)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <a style={{ color: "red" }}>Xoá</a>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} />

            {/* Modal Edit */}
            <Modal
                title="Sửa sản phẩm"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item
                        name="tieuDe"
                        label="Tên sách"
                        rules={[{ required: true, message: "Không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="tacGia"
                        label="Tác giả"
                        rules={[{ required: true, message: "Không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="namXuatBan"
                        label="Năm xuất bản"
                        rules={[{ required: true, message: "Không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="maTheLoai" label="Thể loại">
                        <Input />
                    </Form.Item>

                    <Form.Item name="anhBiaUrl" label="Ảnh URL">
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form>
            </Modal>
        </>
    );
}

export default ProductList;