import {
    Table,
    Tag,
    Space,
    Modal,
    Form,
    Input,
    Button,
    message,
    Popconfirm,
    Select
} from "antd";
import { useEffect, useState } from "react";

import PageHeader from "../../components/PageHeader";

import {
    getBanSaos,
    createBanSao,
    updateBanSao,
    deleteBanSao
} from "../../services/Admin_API/BanSaoAPI";

import { getSachs } from "../../services/Admin_API/SachAPI";
import { getKeSachs } from "../../services/Admin_API/KeSachAPI";

function BanSaoList() {
    const [data, setData] = useState([]);
    const [sachs, setSachs] = useState([]);
    const [keSachs, setKeSachs] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editing, setEditing] = useState(null);

    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    const fetchBanSao = async () => {
        try {
            const res = await getBanSaos();

            const mapped = res.data.data.map((item) => ({
                key: item.maBanSao,
                maBanSao: item.maBanSao,
                maVach: item.maVach,
                tieuDe: item.tieuDe,
                viTri: item.viTri, 
                trangThai: item.trangThai
            }));
            console.log(mapped);

            setData(mapped);
        } catch (err) {
            console.log(err);
            message.error("Lỗi load bản sao");
        }
    };

    const fetchOptions = async () => {
        try {
            const sachRes = await getSachs();
            const keRes = await getKeSachs();

            setSachs(sachRes.data.data);
            setKeSachs(keRes.data.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchBanSao();
        fetchOptions();
    }, []);

    const handleCreate = async (values) => {
        console.log(values);
        try {
            await createBanSao(values);
            message.success("Thêm bản sao thành công");
            setIsCreateOpen(false);
            createForm.resetFields();
            fetchBanSao();
        } catch (err) {
            message.error("Thêm thất bại");
        }
    };

    const handleEdit = (record) => {
        setEditing(record);
        setIsModalOpen(true);

        form.setFieldsValue({
            maVach: record.maVach,
            trangThai: record.trangThai
        });
    };

    const handleUpdate = async (values) => {
        try {
            await updateBanSao(editing.key, values);
            message.success("Cập nhật thành công");
            setIsModalOpen(false);
            fetchBanSao();
        } catch (err) {
            message.error("Cập nhật thất bại");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteBanSao(id);
            message.success("Xoá thành công");
            fetchBanSao();
        } catch (err) {
            message.error("Không thể xoá");
        }
    };

    const columns = [
        {
            title: "Mã bản sao",
            dataIndex: "maBanSao"
        },
        {
            title: "Mã vạch",
            dataIndex: "maVach"
        },
        {
            title: "Sách",
            dataIndex: "tieuDe"
        },
        {
            title: "Vị trí",
            dataIndex: "viTri"
        },
        {
            title: "Trạng thái",
            dataIndex: "trangThai",
            render: (status) => (
                <Tag color={
                    status === "Có sẵn" ? "green" :
                    status === "Đang mượn" ? "blue" :
                    "red"
                }>
                    {status}
                </Tag>
            )
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Space>
                    <a onClick={() => handleEdit(record)}>Sửa</a>

                    <Popconfirm
                        title="Xoá bản sao?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <a style={{ color: "red" }}>Xoá</a>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <PageHeader
                title="Quản lý bản sao"
                extra={
                    <Button type="primary" onClick={() => setIsCreateOpen(true)}>
                        Thêm
                    </Button>
                }
            />

            <Table columns={columns} dataSource={data} />

            {/* EDIT */}
            <Modal
                title="Sửa bản sao"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item name="maVach" label="Mã vạch">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="trangThai"
                        label="Trạng thái"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: "Có sẵn", label: "Có sẵn" },
                                { value: "Đang mượn", label: "Đang mượn" },
                                { value: "Hư hỏng", label: "Hư hỏng" },
                                { value: "Mất", label: "Mất" }
                            ]}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form>
            </Modal>

            {/* CREATE */}
            <Modal
                title="Thêm bản sao"
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
            >
                <Form form={createForm} onFinish={handleCreate} layout="vertical">
                    
                    {/* SÁCH */}
                    <Form.Item
                        name="maSach"
                        label="Sách"
                        rules={[{ required: true }]}
                    >
                        <Select
                            placeholder="Chọn sách"
                            options={sachs.map(s => ({
                                value: s.maSach,
                                label: `${s.tieuDe} (${s.maSach})`
                            }))}
                        />
                    </Form.Item>

                    {/* KỆ */}
                    <Form.Item name="maKe" label="Kệ sách">
                        <Select
                            placeholder="Chọn kệ"
                            allowClear
                            options={keSachs.map(k => ({
                                value: k.maKe,
                                label: `${k.viTri} (${k.maKe})`
                            }))}
                        />
                    </Form.Item>

                    <Form.Item name="maVach" label="Mã vạch">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="trangThai"
                        label="Trạng thái"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { value: "Có sẵn", label: "Có sẵn" },
                                { value: "Đang mượn", label: "Đang mượn" }
                            ]}
                        />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Thêm
                    </Button>
                </Form>
            </Modal>
        </>
    );
}

export default BanSaoList;