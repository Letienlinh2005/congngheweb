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

import {
    createSach,
    deleteSach,
    getSachs,
    updateSach
} from "../../services/Admin_API/SachAPI";

import { getTheLoais } from "../../services/Admin_API/TheLoaiAPI";

import PageHeader from "../../components/PageHeader";

function ProductList() {
    const [data, setData] = useState([]);
    const [theLoaiOptions, setTheLoaiOptions] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [form] = Form.useForm();
    const [createForm] = Form.useForm();

    // ================= FETCH =================

    const fetchProducts = async () => {
        try {
            const res = await getSachs();

            const mapped = res.data.data.map((item) => ({
                key: item.maSach,
                maSach: item.maSach,
                tenSanPham: item.tieuDe,
                tacGia: item.tacGia,
                namXuatBan: item.namXuatBan,
                theLoai: item.theLoai,
                maTheLoai: item.maTheLoai,  
                anhBiaUrl: item.anhBiaUrl,
            }));

            setData(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    const fetchTheLoai = async () => {
        
        try {
            const res = await getTheLoais();
            console.log(res)

            const mapped = res.data.data.map(item => ({
                value: item.maTheLoai,
                label: item.theLoai
            }));

            setTheLoaiOptions(mapped);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchTheLoai();
    }, []);

    // ================= CREATE =================

    const handleCreate = async (values) => {
        try {
            await createSach(values);
            message.success("Thêm sách thành công");

            setIsCreateOpen(false);
            createForm.resetFields();
            fetchProducts();
        } catch (err) {
            console.log(err);
            message.error("Không thể thêm sách");
        }
    };

    // ================= EDIT =================

    const handleEdit = (record) => {
        setEditingProduct(record);
        setIsModalOpen(true);

        form.setFieldsValue({
            tieuDe: record.tenSanPham,
            tacGia: record.tacGia,
            namXuatBan: record.namXuatBan,
            maTheLoai: record.maTheLoai,
            anhBiaUrl: record.anhBiaUrl,
        });
    };

    const handleUpdate = async (values) => {
        try {
            await updateSach(editingProduct.maSach, values);

            message.success("Cập nhật thành công");
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            console.log(err);
            message.error("Cập nhật thất bại");
        }
    };

    // ================= DELETE =================

    const handleDelete = async (id) => {
        try {
            await deleteSach(id);
            message.success("Xoá thành công!");
            fetchProducts();
        } catch (err) {
            console.log(err);
            message.error("Xoá thất bại");
        }
    };

    // ================= TABLE =================

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
                        onConfirm={() => handleDelete(record.maSach)}
                    >
                        <a style={{ color: "red" }}>Xoá</a>
                    </Popconfirm>
                </Space>
            ),
        }
    ];

    return (
        <>
            <PageHeader
                title="Quản lý sách"
                extra={
                    <Button type="primary" onClick={() => setIsCreateOpen(true)}>
                        Thêm
                    </Button>
                }
            />

            <Table columns={columns} dataSource={data} />

            {/* ================= EDIT ================= */}
            <Modal
                title="Sửa sách"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleUpdate} layout="vertical">
                    <Form.Item name="tieuDe" label="Tên sách" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="tacGia" label="Tác giả" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="namXuatBan" label="Năm xuất bản" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="maTheLoai"
                        label="Thể loại"
                        rules={[{ required: true }]}
                    >
                        <Select options={theLoaiOptions} />
                    </Form.Item>

                    <Form.Item name="anhBiaUrl" label="Ảnh URL">
                        <Input />
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Cập nhật
                    </Button>
                </Form>
            </Modal>

            {/* ================= CREATE ================= */}
            <Modal
                title="Thêm sách"
                open={isCreateOpen}
                onCancel={() => setIsCreateOpen(false)}
                footer={null}
            >
                <Form form={createForm} onFinish={handleCreate} layout="vertical">
                    <Form.Item name="tieuDe" label="Tên sách" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="tacGia" label="Tác giả">
                        <Input />
                    </Form.Item>

                    <Form.Item name="namXuatBan" label="Năm">
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="maTheLoai"
                        label="Thể loại"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={theLoaiOptions}
                            placeholder="Chọn thể loại"
                            showSearch
                            optionFilterProp="label"
                        />
                    </Form.Item>

                    <Form.Item name="anhBiaUrl" label="Ảnh URL">
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

export default ProductList;