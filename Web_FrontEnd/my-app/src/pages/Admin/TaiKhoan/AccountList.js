import { Table, Tag, Space, message, Popconfirm, Form, Modal, Input, Button } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";


import { deleteTaiKhoan, getTaiKhoans, updateTaiKhoan } from "../../../services/Admin_API/TaiKhoanAPI";

function AccountList() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState(null);
    const [data, setData] = useState([]);

    const [form] = Form.useForm()

    const fetchAccounts = async () => {
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
        fetchAccounts();
    }, []);

    // handle Edit
    const handleEdit = (record) => {
        setEditingAccount(record);
        setIsModalOpen(true);
        form.setFieldsValue({
            tenDangNhap: record.tenDangNhap,
            vaiTro: record.vaiTro
        });
    }

    // handleUpdate
    const handleUpdate = async (values) => {
        try {
            await updateTaiKhoan(editingAccount.key, values);

            setIsModalOpen(false);
            fetchAccounts()
        } catch (err) {
            console.log(err)
        }
    }

    // handle delete
    const handleDelete = async (id) => {
        try {
            await deleteTaiKhoan(id);
            message.success("Xoá thành công");
            fetchAccounts();
        } catch (err) {
            console.log(err);
            message.error("Xoá không thành công")
        }
    }

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

      {/*  MODAL EDIT */}
      <Modal
        title="Sửa thông tin khách hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="tenDangNhap"
            label="Tên đăng nhập"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="vaiTro"
            label="Vai trò"
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
    )
}

export default AccountList;