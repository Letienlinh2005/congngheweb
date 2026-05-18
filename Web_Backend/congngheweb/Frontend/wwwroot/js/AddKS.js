// ../js/AddKS.js

// dùng chung API_KESACH nếu đã set, nếu chưa thì set mặc định
if (!window.API_KESACH) {
  window.API_KESACH = 'https://localhost:7151/api/KeSach';
}

window.initAddKS = function () {
  const form    = document.getElementById('form-add-ks');
  const msg     = document.getElementById('ks-add-msg');
  const backBtn = document.getElementById('goBackbtn');

  if (!form) return;

  // nút quay lại -> về danh sách kệ sách
  if (backBtn) {
    backBtn.onclick = () => {
      if (typeof loadPage === 'function') {
        loadPage('../html/KeSach.html', 'initKeSachPage');
      } else {
        window.history.back();
      }
    };
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    if (msg) {
      msg.style.color = 'black';
      msg.textContent = 'Đang lưu...';
    }

    const maKe  = document.getElementById('MaKS').value.trim();
    const viTri = document.getElementById('ViTri').value.trim();

    if (!maKe) {
      if (msg) {
        msg.style.color = 'red';
        msg.textContent = 'Mã kệ không được để trống';
      }
      return;
    }

    const body = { maKe, viTri };

    try {
      const res = await fetch(window.API_KESACH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        if (msg) {
          msg.style.color = 'red';
          msg.textContent = data.message || 'Thêm kệ sách thất bại';
        }
        return;
      }

      if (msg) {
        msg.style.color = 'green';
        msg.textContent = 'Thêm kệ sách thành công';
      }

      // clear form
      document.getElementById('MaKS').value  = '';
      document.getElementById('ViTri').value = '';

      setTimeout(() => {
        if (typeof loadPage === 'function') {
          loadPage('../html/KeSach.html', 'initKeSachPage');
        }
      }, 500);
    } catch (err) {
      console.error(err);
      if (msg) {
        msg.style.color = 'red';
        msg.textContent = 'Lỗi kết nối API';
      }
    }
  };
};

// Nếu mở trực tiếp file AddKS.html
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('form-add-ks')) {
    window.initAddKS();
  }
});
