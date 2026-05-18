// ../js/XoaBD.js

// dùng lại API chung nếu đã có
if (!window.API_BANDOC) {
  window.API_BANDOC = 'https://localhost:7151/api/BanDoc';
}

(function initDeleteBD() {
  // vì danh sách được load động nên ta bắt sự kiện trên tbody
  document.addEventListener('click', async function (e) {
    const btn = e.target.closest('[data-act="delete"]');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (!confirm(`Bạn có chắc muốn xoá bạn đọc mã "${id}" không?`)) return;

    try {
      const res = await fetch(`${window.API_BANDOC}/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      const text = await res.text();

      if (!res.ok) {
        alert('Xoá thất bại: ' + text);
        return;
      }

      // nếu API kiểu {success:false,...}
      let obj;
      try { obj = JSON.parse(text); } catch (_) { obj = null; }
      if (obj && obj.success === false) {
        alert('Xoá thất bại: ' + (obj.message || ''));
        return;
      }

      alert('Xoá thành công!');
      // reload lại bảng nếu hàm có tồn tại
      if (typeof window.renderBanDoc === 'function') {
        window.renderBanDoc();
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi gọi API xoá');
    }
  });
})();
