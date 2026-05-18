// ../js/FixTK.js
const API_TK = 'https://localhost:7151/api/taikhoan';

window.initFixTK = async function () {
  const form = document.getElementById('form-fix-tk');
  const msg  = document.getElementById('tk-fix-msg');
  const id   = sessionStorage.getItem('editTK');

  if (!id) {
    msg.textContent = 'Không có mã tài khoản để sửa';
    msg.style.color = 'red';
    return;
  }

  try {
    const res  = await authFetch(`${API_TK}/${encodeURIComponent(id)}`);
    const data = await res.json();
    const tk   = data.data || data;

    document.getElementById('maTaiKhoan').value  = tk.maTaiKhoan || '';
    document.getElementById('tenDangNhap').value = tk.tenDangNhap || '';
    document.getElementById('matKhau').value     = tk.matKhau || '';
    document.getElementById('vaiTro').value      = tk.vaiTro || '';
    document.getElementById('maBanDoc').value    = tk.maBanDoc || '';
  } catch (err) {
    console.error(err);
    msg.textContent = 'Không tải được dữ liệu';
    msg.style.color = 'red';
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    msg.textContent = 'Đang cập nhật...';

    const body = {
      maTaiKhoan:  document.getElementById('maTaiKhoan').value.trim(),
      tenDangNhap: document.getElementById('tenDangNhap').value.trim(),
      matKhau:     document.getElementById('matKhau').value.trim(),
      vaiTro:      document.getElementById('vaiTro').value.trim(),
      maBanDoc:    document.getElementById('maBanDoc').value.trim() || null
    };

    try {
      const res = await authFetch(`${API_TK}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        msg.style.color = 'red';
        msg.textContent = data.message || 'Cập nhật thất bại';
        return;
      }

      msg.style.color = 'green';
      msg.textContent = 'Cập nhật thành công';
      setTimeout(() => {
        loadPage('../html/TaiKhoan.html', 'initTaiKhoanPage');
      }, 500);
    } catch (err) {
      console.error(err);
      msg.style.color = 'red';
      msg.textContent = 'Lỗi kết nối API';
    }
  };
};
