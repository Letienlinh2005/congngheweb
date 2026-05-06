import { Table, Tag, Space, Modal, Form, Input, Button, Popconfirm, message, Select } from "antd";
import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader";
import { getBanDocs, createBanDoc, updateBanDoc, deleteBanDoc } from "../../services/Admin_API/BanDocAPI";

function ReaderList() {
    const [data, setData] = useState([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReader, setEditingReader] = useState(null);

    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    // fetch
    const fetchReaders = async () => {
        try {
            const res = await getBanDocs();

            const mapped = res.data.data.map((item) => ({
                key: item.maBanDoc,
                tenBanDoc: item.hoTen,
                soThe: item.soThe,
                email: item.email,
                dienThoai: item.dienThoai,
                hanThe: item.hanThe,
                trangThaiThe: item.trangThaiThe,
                duNo: item.duNo,
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchReaders();
    }, []);

    //handle create
    // handle create — sửa setIsCreateOpen
    const handleCreate = async (values) => {
        try {
            await createBanDoc(values);
            message.success("Thêm bạn đọc thành công");
            setIsCreateOpen(false);
            createForm.resetFields();
            fetchReaders();
        } catch (err) {
            const msg = err.response?.data?.message || "Thêm bạn đọc thất bại";
            message.error(msg);
            console.log(err.response?.data);
        }
    };
    // mở modal
    const handleEdit = (record) => {
        setEditingReader(record);
        setIsModalOpen(true);

        form.setFieldsValue({
            hoTen: record.tenBanDoc,
            soThe: record.soThe,
            email: record.email,
            dienThoai: record.dienThoai,
        });
    };

    // update
    const handleUpdate = async (values) => {
        try {
            await updateBanDoc(editingReader.key, values);

            message.success("Cập nhật thành công");

            setIsModalOpen(false);
            fetchReaders();
        } catch (err) {
            console.log(err);
            message.error("Cập nhật thất bại");
        }
    };

    // delete
    const handleDelete = async (id) => {
        try {
            await deleteBanDoc(id);

            message.success("Xoá thành công");

            fetchReaders();
        } catch (err) {
            console.log(err);
            message.error("Xoá thất bại");
        }
    };

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
            render: (date) =>
                new Date(date).toLocaleDateString("vi-VN"),
        },
        {
            title: "Trạng thái",
            dataIndex: "trangThaiThe",
            render: (text) => (
                <Tag color={text === "Hoạt động" ? "green" : "red"}>
                    {text}
                </Tag>
            ),
        },
        {
            title: "Dư nợ",
            dataIndex: "duNo",
            render: (value) => (
                <span style={{ color: value > 0 ? "red" : "green" }}>
                    {value.toLocaleString("vi-VN")} ₫
                </span>
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
        },
    ];

    return (
        <>
            <PageHeader title="Thêm bạn đọc" extra={<Button onClick={() => setIsCreateOpen(true)}>Thêm</Button>} />
            <Table columns={columns} dataSource={data} />
            {/* Modal create */}
            {/* Modal Create — bỏ soThe, thêm matKhau */}
            <Modal title="Thêm bạn đọc" open={isCreateOpen} onCancel={() => setIsCreateOpen(false)} footer={null}>
                <Form form={createForm} onFinish={handleCreate} layout="vertical">
                    <Form.Item name="hoTen" label="Tên bạn đọc"
                        rules={[{ required: true, message: "Không được để trống" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email"
                        rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="dienThoai" label="Điện thoại"
                        rules={[{ required: true, message: "Không được để trống" }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="matKhau" label="Mật khẩu"
                        rules={[{ required: true, message: "Không được để trống" }]}>
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="tenDangNhap" label="Tên đăng nhập (để trống dùng Email)">
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>Thêm</Button>
                </Form>
            </Modal>
            {/* MODAL EDIT */}
            <Modal
                title="Sửa bạn đọc"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item
                        name="hoTen"
                        label="Tên bạn đọc"
                        rules={[{ required: true, message: "Không được để trống" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="soThe" label="Số thẻ">
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input />
                    </Form.Item>

                    <Form.Item name="dienThoai" label="Điện thoại">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="trangThaiThe"
                        label="Trạng thái thẻ"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: "Hoạt động", label: "Hoạt động" },
                                { value: "Hết hạn", label: "Hết hạn" }
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

export default ReaderList;