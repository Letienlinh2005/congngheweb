import { Table, Tag, Space, Modal, Form, Input, Button, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { createKeSach, deleteKeSach, getKeSachs, updateKeSach } from "../../services/Admin_API/KeSachAPI";

import PageHeader from "../../components/PageHeader";


function KeSachList() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [form] = Form.useForm();
    const [createForm] = Form.useForm();


    // fetch data
    const fetchKeSach = async () => {
        try {
            const res = await getKeSachs();

            const mapped = res.data.data.map((item, index) => ({
                key: item.maKe || index,
                maKe: item.maKe,
                viTri: item.viTri
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchKeSach();
    }, []);

    // handle create
    const handleCreate = async(values) => {
        try{
            await createKeSach(values);
            message.success("Thêm kệ thành công");
            setIsCreateOpen(false)
            createForm.resetFields();
            fetchKeSach();
        }
        catch(err){
            console.log(err);
            message.error("Không thể thêm kệ")
        }
    }

    // mở modal sửa
    const handleEdit = (record) => {
        setEditingProduct(record);
        setIsModalOpen(true);

        form.setFieldsValue({
            viTri: record.viTri,
        });
    };

    // update API
    const handleUpdate = async (values) => {
        try {
            await updateKeSach(editingProduct.key, values);

            setIsModalOpen(false);
            fetchKeSach();
        } catch (err) {
            console.log(err);
        }
    };

    // Delete API
    const handleDelete = async (id) => {
        try {
            await deleteKeSach(id);
            message.success("Xoá thành công!");

            fetchKeSach();
        }
        catch (err) {
            console.log(err);
            message.error("Xoá thất bại!")
        }
    }

    // columns
    const columns = [
        {
            title: "Mã kệ sách",
            dataIndex: "maKe",
        },
        {
            title: "Vị trí",
            dataIndex: "viTri",
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
            <PageHeader title="Quản lý kệ sách" extra={<Button type="primary" onClick={() => setIsCreateOpen(true)}>Thêm</Button>} />
            <Table columns={columns} dataSource={data} />

            {/* Modal Edit */}
            <Modal
                title="Sửa vị trí kệ"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item
                        name="viTri"
                        label="Vị trí kệ"
                        rules={[{ required: true, message: "Không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form>
            </Modal>

            {/* Modal Create */}
            <Modal title="Thêm kệ sách" open={isCreateOpen} onCancel={() => setIsCreateOpen(false)} footer={null}>
                <Form form={createForm} onFinish={handleCreate} layout="vertical">
                    <Form.Item name="viTri" label="Vị trí kệ sách" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Thêm
                    </Button>
                </Form>

            </Modal>
        </>
    );
}

export default KeSachList;