// ../js/XoaKS.js

// dùng lại API chung nếu đã có
if (!window.API_KESACH) {
  window.API_KESACH = 'https://localhost:7151/api/KeSach';
}

(function initDeleteKS() {
  // vì danh sách kệ load động nên bắt sự kiện trên document
  document.addEventListener('click', async function (e) {
    const btn = e.target.closest('[data-act="delete-ks"]');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (!confirm(`Bạn có chắc muốn xoá kệ mã "${id}" không?`)) return;

    try {
      const res = await fetch(`${window.API_KESACH}/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      const text = await res.text();

      if (!res.ok) {
        alert('Xoá kệ thất bại: ' + text);
        return;
      }

      let obj;
      try { obj = JSON.parse(text); } catch (_) { obj = null; }
      if (obj && obj.success === false) {
        alert('Xoá kệ thất bại: ' + (obj.message || ''));
        return;
      }

      alert('Xoá kệ sách thành công!');
      if (typeof window.renderKeSach === 'function') {
        window.renderKeSach();
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi gọi API xoá kệ');
    }
  });
})();
