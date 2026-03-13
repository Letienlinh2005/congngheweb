import { useState } from "react"

function BanDocForm({ onSubmit }) {

    const [form, setForm] = useState({
        hoTen: "",
        email: "",
        dienThoai: ""
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const now = new Date()
        const hanThe = new Date(now.setDate(now.getDate() + 7))

        onSubmit({
            HoTen: form.hoTen,
            SoThe: Date.now().toString(),
            Email: form.email,
            DienThoai: form.dienThoai,
            HanThe: hanThe.toISOString(),
            TrangThaiThe: "Hoạt động",
            DuNo: 0
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input name="hoTen" placeholder="Họ tên" onChange={handleChange} />
            <input name="email" placeholder="Email" onChange={handleChange} />
            <input name="dienThoai" placeholder="Điện thoại" onChange={handleChange} />

            <button type="submit">Thêm bạn đọc</button>
        </form>
    )
}

export default BanDocForm