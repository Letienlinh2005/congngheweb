// ../js/UserPage_script.js

const API_BANDOC = "https://localhost:7151/api/bandoc";
const CURRENT_USER_KEY = "CURRENT_USER";
const TOKEN_KEY = "ACCESS_TOKEN";

document.addEventListener("DOMContentLoaded", () => {
  // Lấy object lưu trong localStorage
  const stored = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || "null");

  // Nếu đang dùng dạng { token, user: {...} } thì unwrap ra 1 object phẳng
  let current = stored;
  if (stored && !stored.maBanDoc && !stored.MaBanDoc && stored.user) {
    current = {
      ...stored.user,
      token:
        stored.token ||
        stored.accessToken ||
        localStorage.getItem(TOKEN_KEY) ||
        "",
    };
  }

  const tokenFromUser = current && current.token;
  const tokenFromStore = localStorage.getItem(TOKEN_KEY);
  const token = tokenFromUser || tokenFromStore || "";

  const maBanDoc = current?.maBanDoc || current?.MaBanDoc || null;

  // Chưa đăng nhập hoặc không có MaBanDoc -> đá về login
  if (!current || !maBanDoc) {
    window.location.href = "../html/DangNhap.html";
    return;
  }

  // Hiển thị email / username trên header
  const emailSpan = document.getElementById("up-email-display");
  if (emailSpan) {
    emailSpan.textContent =
      current.tenDangNhap || current.email || current.Email || "";
  }

  // Logout
  const logoutBtn = document.getElementById("up-logout-btn");
  if (logoutBtn) {
    logoutBtn.onclick = () => {
      localStorage.removeItem(CURRENT_USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "../html/DangNhap.html";
    };
  }

  // Load thông tin bạn đọc
  loadReader(maBanDoc, token);

  // Submit form
  const form = document.getElementById("up-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      saveReader(maBanDoc, token);
    });
  }
});

async function loadReader(maBanDoc, token) {
  const msg = document.getElementById("up-msg");
  try {
    const res = await authFetch(
      `${API_BANDOC}/${encodeURIComponent(maBanDoc)}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    );

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    let data = await res.json();
    if (data && data.data) data = data.data;

    // Fill form
    document.getElementById("up-hoTen").value =
      data.hoTen ?? data.HoTen ?? "";
    document.getElementById("up-email").value =
      data.email ?? data.Email ?? "";
    document.getElementById("up-dienThoai").value =
      data.dienThoai ?? data.DienThoai ?? "";
    document.getElementById("up-soThe").value =
      data.soThe ?? data.SoThe ?? "";
    document.getElementById("up-hanThe").value = toInputDate(
      data.hanThe ?? data.HanThe
    );
    document.getElementById("up-trangThaiThe").value =
      data.trangThaiThe ?? data.TrangThaiThe ?? "";
    document.getElementById("up-duNo").value = data.duNo ?? data.DuNo ?? 0;
  } catch (err) {
    console.error(err);
    if (msg) {
      msg.style.color = "red";
      msg.textContent = "Không tải được thông tin bạn đọc.";
    }
  }
}

async function saveReader(maBanDoc, token) {
  const msg = document.getElementById("up-msg");
  if (msg) {
    msg.style.color = "#333";
    msg.textContent = "Đang lưu...";
  }

  const payload = {
    MaBanDoc: maBanDoc,
    HoTen: document.getElementById("up-hoTen").value.trim(),
    Email: document.getElementById("up-email").value.trim(),
    DienThoai: document.getElementById("up-dienThoai").value.trim(),
  };

  try {
    const res = await authFetch(
      `${API_BANDOC}/update-info/${encodeURIComponent(maBanDoc)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await res.text();
    let obj;
    try {
      obj = JSON.parse(text);
    } catch {
      obj = null;
    }

    if (!res.ok || (obj && obj.success === false)) {
      if (msg) {
        msg.style.color = "red";
        msg.textContent =
          (obj && obj.message) || text || "Cập nhật thất bại.";
      }
      return;
    }

    if (msg) {
      msg.style.color = "green";
      msg.textContent = "Lưu thông tin thành công.";
    }
  } catch (err) {
    console.error(err);
    if (msg) {
      msg.style.color = "red";
      msg.textContent = "Lỗi kết nối API.";
    }
  }
}

function toInputDate(v) {
  if (!v) return "";
  const s = String(v);
  if (s.includes("T")) return s.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  if (s.includes("/")) {
    const [d, m, y] = s.split("/");
    if (d && m && y)
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return "";
}
