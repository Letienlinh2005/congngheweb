if (!window.API_THELOAI) {
    window.API_THELOAI = "https://localhost:7151/api/theloai";
}

window.initAddTL = function () {
    console.log("🔥 initAddTL() đã chạy");

    const btnSave = document.getElementById("saveBtn");
    const btnBack = document.getElementById("goBackbtn");
    const msg = document.getElementById("tl-add-msg");

    btnBack.onclick = () => {
        window.loadPage("../html/TheLoai.html", "initTheLoaiPage");
    };

    btnSave.onclick = async () => {
        const ma = document.getElementById("MaBD").value.trim();
        const ten = document.getElementById("Sothe").value.trim();

        if (!ma || !ten) {
            msg.style.color = "red";
            msg.textContent = "Mã và tên thể loại bắt buộc.";
            return;
        }

        const body = {
            maTheLoai: ma,
            tenTheLoai: ten,

        };

        msg.style.color = "black";
        msg.textContent = "Đang gửi dữ liệu...";

        try {
            const res = await authFetch(window.API_THELOAI, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const text = await res.text();
            console.log("Kết quả API:", text);

            if (!res.ok) {
                msg.style.color = "red";
                msg.textContent = "Thêm không thành công: " + text;
                return;
            }

            msg.style.color = "green";
            msg.textContent = "✔ Thêm thể loại thành công";

            setTimeout(() => {
                window.loadPage("../html/TheLoai.html", "initTheLoaiPage");
            }, 600);

        } catch (err) {
            msg.style.color = "red";
            msg.textContent = "❌ Lỗi kết nối API";
            console.error(err);
        }
    };
};
