// ../js/AddTK.js

// ====== CẤU HÌNH API ======
if (!window.API_TAIKHOAN) {
  window.API_TAIKHOAN = "https://localhost:7151/api/TaiKhoan";
}

// ====== KHỞI TẠO TRANG ======
window.initAddTK = function () {
  attachAddTKHandler();
};

// ====== GẮN SỰ KIỆN ======
function attachAddTKHandler() {
  const addBtn = document.getElementById("saveBtn");
  const goBackbtn = document.getElementById("goBackbtn");

  if (addBtn) addBtn.onclick = addTK;

  if (goBackbtn) {
    goBackbtn.onclick = function () {
      if (typeof window.loadPage === "function") {
        window.loadPage("../html/TaiKhoan.html", "initTaiKhoanPage");
      } else {
        history.back();
      }
    };
  }
}

// ====== XỬ LÝ THÊM TÀI KHOẢN ======
async function addTK() {
  const maTK = document.getElementById("MaTK").value.trim();
  const tenDN = document.getElementById("TenDN").value.trim();
  const matKhau = document.getElementById("MatKhau").value.trim();
  const vaiTro = document.getElementById("VaiTro").value;

  // ==== VALIDATE ====
  if (!maTK) {
    alert("Thiếu mã tài khoản!");
    return;
  }
  if (!tenDN) {
    alert("Thiếu tên đăng nhập!");
    return;
  }
  if (!matKhau) {
    alert("Thiếu mật khẩu!");
    return;
  }
  if (vaiTro === "") {
    alert("Hãy chọn vai trò!");
    return;
  }

  // ==== KIỂM TRA TRÙNG ====
  try {
    const res = await fetch(
      `${window.API_TAIKHOAN}?q=${encodeURIComponent(maTK)}`,
      {
        cache: "no-store",
      }
    );
    if (res.ok) {
      let list = await res.json();
      if (list && Array.isArray(list.data)) list = list.data;

      if (Array.isArray(list)) {
        const dup = list.find((x) => {
          const xMa = x.MaTaiKhoan ?? x.maTaiKhoan ?? "";
          return xMa === maTK;
        });
        if (dup) {
          alert("Mã tài khoản đã tồn tại!");
          return;
        }
      }
    }
  } catch (err) {
    console.warn("Không kiểm tra trùng được, vẫn tiếp tục lưu...", err);
  }
  // ==== TẠO PAYLOAD ====

  const payload = {
    MaTaiKhoan: maTK,
    TenDangNhap: tenDN,
    MatKhau: matKhau,
    VaiTro: "Thủ thư",
    MaBanDoc: null
  };

  console.log("📤 Thêm tài khoản:", payload);

  // ==== GỬI LÊN API ====
  try {
    const res = await fetch(window.API_TAIKHOAN, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error(" Thêm lỗi", res.status, text);
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

    alert("Thêm tài khoản thành công!");
    if (typeof window.loadPage === "function") {
      window.loadPage("../html/TaiKhoan.html", "initTaiKhoanPage");
    }
  } catch (err) {
    console.error(err);
    alert("Có lỗi khi gọi API!");
  }
}
