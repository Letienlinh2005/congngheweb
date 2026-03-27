import {
    Table,
    Space,
    Modal,
    Form,
    Input,
    Button,
    Popconfirm,
    message,
} from "antd";
import { useEffect, useState } from "react";

import {
    getTheLoais,
    updateTheLoai,
    deleteTheLoai,
} from "../../../services/Admin_API/TheLoaiAPI";

function CategoryList() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const [form] = Form.useForm();

    // fetch
    const fetchCategories = async () => {
        try {
            const res = await getTheLoais();

            const mapped = res.data.data.map((item) => ({
                key: item.maTheLoai,
                tenTheLoai: item.tenTheLoai,
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // mở modal sửa
    const handleEdit = (record) => {
        setEditingCategory(record);
        setIsModalOpen(true);

        form.setFieldsValue({
            tenTheLoai: record.tenTheLoai,
        });
    };

    // update
    const handleUpdate = async (values) => {
        try {
            await updateTheLoai(editingCategory.key, values);

            message.success("Cập nhật thành công");

            setIsModalOpen(false);
            fetchCategories();
        } catch (err) {
            console.log(err);
            message.error("Cập nhật thất bại");
        }
    };

    // delete
    const handleDelete = async (id) => {
        try {
            await deleteTheLoai(id);

            message.success("Xoá thành công");

            fetchCategories();
        } catch (err) {
            console.log(err);
            message.error("Xoá thất bại");
        }
    };

    // columns
    const columns = [
        {
            title: "Tên thể loại",
            dataIndex: "tenTheLoai",
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
        },
    ];

    return (
        <>
            <Table columns={columns} dataSource={data} />

            {/* MODAL EDIT */}
            <Modal
                title="Sửa thể loại"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item
                        name="tenTheLoai"
                        label="Tên thể loại"
                        rules={[{ required: true, message: "Không được để trống" }]}
                    >
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

export default CategoryList;