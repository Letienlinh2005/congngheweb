// Lấy token đã lưu sau khi login
function getToken() {
  // nếu sau này bạn đổi key, chỉ sửa 1 chỗ này
  return localStorage.getItem("ACCESS_TOKEN") || "";
}

// Kiểm tra token, nếu không có thì đá về trang login
function ensureToken() {
  const t = getToken();
  if (!t) {
    alert("Phiên đăng nhập đã hết hoặc chưa đăng nhập. Vui lòng đăng nhập lại.");
    // chỉnh lại đường dẫn login đúng dự án của bạn
    window.location.href = "../html/DangNhap.html";
    return null;
  }
  return t;
}

// fetch kèm header Authorization: Bearer <token>
async function authFetch(url, options = {}) {
  const token = ensureToken();
  if (!token) {
    return Promise.reject("No token");
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: "Bearer " + token,
  };

  // tự set Content-Type cho POST/PUT nếu chưa có
  const method = (options.method || "GET").toUpperCase();
  if ((method === "POST" || method === "PUT") && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const finalOptions = { ...options, headers };

  const res = await fetch(url, finalOptions);

  // Token hết hạn / sai => 401
  if (res.status === 401) {
    alert("Phiên đăng nhập không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("CURRENT_USER");
    window.location.href = "../html/DangNhap.html";
    throw new Error("401 Unauthorized");
  }

  return res;
}
