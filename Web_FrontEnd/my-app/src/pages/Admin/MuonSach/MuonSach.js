import { Form, Select, DatePicker, Button, message } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { getBanDocs } from "../../../services/Admin_API/BanDocAPI";
import { getBanSaos } from "../../../services/Admin_API/BanSaoAPI";
import { createPhieuMuon } from "../../../services/Admin_API/PhieuMuonAPI";

const BorrowForm = () => {
  const [form] = Form.useForm();

  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchReaders();
    fetchBooks();
  }, []);

  const fetchReaders = async () => {
    const res = await getBanDocs();
    setReaders(res.data.data);
  };

  const fetchBooks = async () => {
    const res = await getBanSaos();
    setBooks(res.data.data);
  };

  const onFinish = async (values) => {
    try {
      const payload = {
        maBanDoc: values.maBanDoc,
        maBanSao: values.maBanSao,
        ngayMuon: dayjs().format("YYYY-MM-DD"),
        hanTra: values.hanTra.format("YYYY-MM-DD"),
      };

      await createPhieuMuon(payload);

      message.success("Mượn sách thành công");
      form.resetFields();
    } catch (err) {
      console.log(err);
      message.error("Mượn thất bại");
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Bạn đọc */}
      <Form.Item
        name="maBanDoc"
        label="Bạn đọc"
        rules={[{ required: true, message: "Chọn bạn đọc" }]}
      >
        <Select
          placeholder="Chọn bạn đọc"
          options={readers.map((r) => ({
            value: r.maBanDoc,
            label: `${r.hoTen} - ${r.soThe}`,
          }))}
        />
      </Form.Item>

      {/* Sách */}
      <Form.Item
        name="maBanSao"
        label="Sách"
        rules={[{ required: true, message: "Chọn sách" }]}
      >
        <Select
          placeholder="Chọn sách"
          options={books.map((b) => ({
            value: b.maBanSao,
            label: `${b.maSach} - ${b.trangThai}`,
          }))}
        />
      </Form.Item>

      {/* Hạn trả */}
      <Form.Item
        name="hanTra"
        label="Hạn trả"
        rules={[{ required: true, message: "Chọn hạn trả" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Button type="primary" htmlType="submit" block>
        Mượn sách
      </Button>
    </Form>
  );
};

export default BorrowForm;