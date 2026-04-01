import {
    Table,
    Space,
    message,
    Popconfirm,
    Form,
    Modal,
    Input,
    Button,
    Select,
} from "antd";
import { useEffect, useState } from "react";
import PageHeader from "../../../components/PageHeader";

import {
    createTaiKhoan,
    deleteTaiKhoan,
    getTaiKhoans,
    updateTaiKhoan,
} from "../../../services/Admin_API/TaiKhoanAPI";

function AccountList() {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);

    const [form] = Form.useForm(); // edit
    const [createForm] = Form.useForm(); // create

    // fetch
    const fetchAccounts = async () => {
        try {
            const res = await getTaiKhoans();

            const mapped = res.data.data.map((item) => ({
                key: item.maTaiKhoan,
                tenDangNhap: item.tenDangNhap,
                vaiTro: item.vaiTro,
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    // CREATE
    const handleCreate = async (values) => {
        try {
            await createTaiKhoan({
                TenDangNhap: values.tenDangNhap,
                MatKhau: values.matKhau,
                VaiTro: values.vaiTro
            });

            message.success("Thêm tài khoản thành công");
            setIsCreateOpen(false);
            createForm.resetFields();
            fetchAccounts();
        } catch (err) {
            console.log("🔥 ERROR:", err.response?.data);
            message.error("Thêm tài khoản thất bại");
        }
    };

    // EDIT
    const handleEdit = (record) => {
        setEditingAccount(record);
        setIsModalOpen(true);

        form.setFieldsValue({
            tenDangNhap: record.tenDangNhap,
            vaiTro: record.vaiTro,
        });
    };

    const handleUpdate = async (values) => {
        try {
            await updateTaiKhoan(editingAccount.key, values);

            message.success("Cập nhật thành công");
            setIsModalOpen(false);
            fetchAccounts();
        } catch (err) {
            console.log(err);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        try {
            await deleteTaiKhoan(id);
            message.success("Xoá thành công");
            fetchAccounts();
        } catch (err) {
            console.log(err);
            message.error("Xoá thất bại");
        }
    };

    // TABLE
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
                    <a onClick={() => handleEdit(record)}>Sửa</a>

                    <Popconfirm
                        title="Bạn có chắc muốn xoá?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <a style={{ color: "red" }}>Xoá</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            {/* HEADER */}
            <PageHeader
                title="Quản lý tài khoản"
                extra={
                    <Button type="primary" onClick={() => setIsCreateOpen(true)}>
                        Thêm
                    </Button>
                }
            />

            <Table columns={columns} dataSource={data} />

            {/* CREATE */}
            <Modal
                title="Thêm tài khoản"
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
            >
                <Form form={createForm} onFinish={handleCreate} layout="vertical">
                    <Form.Item
                        name="tenDangNhap"
                        label="Tên đăng nhập"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="matKhau"
                        label="Mật khẩu"
                        rules={[{ required: true }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        name="vaiTro"
                        label="Vai trò"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: "Quản trị", label: "Quản trị" },
                                { value: "Thủ thư", label: "Thủ thư" },
                                { value: "Bạn đọc", label: "Bạn đọc" }
                            ]}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Thêm
                    </Button>
                </Form>
            </Modal>

            {/* EDIT */}
            <Modal
                title="Sửa tài khoản"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item
                        name="tenDangNhap"
                        label="Tên đăng nhập"
                        rules={[{ required: true }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="vaiTro"
                        label="Vai trò"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: "Quản trị", label: "Quản trị" },
                                { value: "Thủ thư", label: "Thủ thư" },
                                { value: "Bạn đọc", label: "Bạn đọc" }
                            ]}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form>
            </Modal>
        </>
    );
}

export default AccountList;