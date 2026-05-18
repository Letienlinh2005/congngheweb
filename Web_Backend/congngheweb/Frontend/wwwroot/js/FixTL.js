// ../js/FixTL.js
const API_THE_LOAI = 'https://localhost:7151/api/theloai';

window.initFixTL = async function () {
  const form = document.getElementById('form-fix-tl');
  const msg  = document.getElementById('tl-fix-msg');
  const id   = sessionStorage.getItem('editTL');

  if (!id) {
    msg.textContent = 'Không có mã thể loại để sửa';
    msg.style.color = 'red';
    return;
  }

  try {
    const res  = await fetch(`${API_THE_LOAI}/${encodeURIComponent(id)}`);
    const data = await res.json();
    const tl   = data.data || data;

    document.getElementById('maTheLoai').value  = tl.maTheLoai || '';
    document.getElementById('tenTheLoai').value = tl.tenTheLoai || '';
    document.getElementById('moTa').value       = tl.moTa || '';
  } catch (err) {
    console.error(err);
    msg.textContent = 'Không tải được dữ liệu';
    msg.style.color = 'red';
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    msg.textContent = 'Đang cập nhật...';

    const body = {
      maTheLoai:  document.getElementById('maTheLoai').value.trim(),
      tenTheLoai: document.getElementById('tenTheLoai').value.trim(),
      moTa:       document.getElementById('moTa').value.trim() || null
    };

    try {
      const res = await fetch(`${API_THE_LOAI}/${encodeURIComponent(id)}`, {
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
        loadPage('../html/TheLoai.html', 'initTheLoaiPage');
      }, 500);
    } catch (err) {
      console.error(err);
      msg.style.color = 'red';
      msg.textContent = 'Lỗi kết nối API';
    }
  };
};
