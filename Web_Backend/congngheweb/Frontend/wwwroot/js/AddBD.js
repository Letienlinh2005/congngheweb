// ../js/AddBD.js

// dùng lại API từ file khác, nếu chưa có thì tạo
if (!window.API_BANDOC) {
  window.API_BANDOC = "https://localhost:7151/api/BanDoc";
}

window.initAddBD = function () {
  attachAddHandler();
};

function attachAddHandler() {
  const addBtn = document.getElementById("saveBtn");
  const goBackbtn = document.getElementById("goBackbtn");

  if (addBtn) {
    addBtn.onclick = addBD;
  }
  if (goBackbtn) {
    goBackbtn.onclick = function () {
      if (typeof window.loadPage === "function") {
        window.loadPage("../html/Readermanagement.html", "initReaderPage");
      } else {
        history.back();
      }
    };
  }
}

async function addBD() {
  const maBD = document.getElementById("MaBD").value.trim();
  const soThe = document.getElementById("Sothe").value.trim();
  const hoTen = document.getElementById("Hoten").value.trim();
  const email = document.getElementById("Email").value.trim();
  const sodt = document.getElementById("sodt").value.trim();
  const hanThe = document.getElementById("hanthe").value;
  const ttVal = document.getElementById("TrangThai").value;
  const duNo = document.getElementById("DuNo").value;

  // ====== validate đơn giản ======
  if (!maBD) {
    alert("Thiếu mã bạn đọc");
    return;
  }
  if (!soThe) {
    alert("Thiếu số thẻ");
    return;
  }

  // email
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Email không hợp lệ");
      return;
    }
  }

  // sđt 10 số bắt đầu bằng 0
  if (sodt) {
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(sodt)) {
      alert("Số điện thoại phải gồm 10 số và bắt đầu bằng 0");
      return;
    }
  }

  // ====== kiểm tra trùng ======
  try {
    // kiểm tra trùng mã
    const resMa = await fetch(
      `${window.API_BANDOC}?q=${encodeURIComponent(maBD)}`,
      { cache: "no-store" }
    );
    if (resMa.ok) {
      let list = await resMa.json();
      if (list && Array.isArray(list.data)) list = list.data;

      if (Array.isArray(list)) {
        const dup = list.find((x) => {
          const xMa = x.MaBanDoc ?? x.maBanDoc ?? x.ma ?? "";
          return xMa === maBD;
        });
        if (dup) {
          alert("Mã bạn đọc đã tồn tại");
          return;
        }
      }
    }

    // kiểm tra trùng số thẻ
    const resThe = await fetch(
      `${window.API_BANDOC}?q=${encodeURIComponent(soThe)}`,
      { cache: "no-store" }
    );
    if (resThe.ok) {
      let list2 = await resThe.json();
      if (list2 && Array.isArray(list2.data)) list2 = list2.data;

      if (Array.isArray(list2)) {
        const dupThe = list2.find((x) => {
          const xThe = x.SoThe ?? x.soThe ?? "";
          return xThe === soThe;
        });
        if (dupThe) {
          alert("Số thẻ đã tồn tại");
          return;
        }
      }
    }
  } catch (err) {
    console.warn("Không kiểm tra trùng được, vẫn tiếp tục lưu...", err);
  }

  // map trạng thái 1/0 -> chuỗi như DB
  let trangThaiStr = "";
  if (ttVal === "1") trangThaiStr = "Hoạt động";
  else if (ttVal === "0") trangThaiStr = "Không hoạt động";

  const payload = {
    MaBanDoc: maBD,
    SoThe: soThe,
    HoTen: hoTen,
    Email: email,
    DienThoai: sodt,
    HanThe: hanThe,
    TrangThaiThe: trangThaiStr,
    DuNo: Number(duNo) || 0,
  };

  console.log("📤 thêm bạn đọc:", payload);

  try {
    const res = await fetch(window.API_BANDOC, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("❌ Thêm lỗi", res.status, text);
      alert("Thêm thất bại: " + text);
      return;
    }

    let obj;
    try {
      obj = JSON.parse(text);
    } catch (_) {
      obj = null;
    }
    if (obj && obj.success === false) {
      alert("Thêm thất bại: " + (obj.message || ""));
      return;
    }

    alert("Thêm thành công!");
    if (typeof window.loadPage === "function") {
      window.loadPage("../html/Readermanagement.html", "initReaderPage");
    }
  } catch (err) {
    console.error(err);
    alert("Có lỗi khi gọi API");
  }
}
