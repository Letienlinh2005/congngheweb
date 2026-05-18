// ../js/XoaBS.js

if (!window.API_BANSAO) {
  window.API_BANSAO = 'https://localhost:7151/api/BanSao';
}

(function initDeleteBS() {
  document.addEventListener('click', async function (e) {
    const btn = e.target.closest('[data-act="delete-bs"]');
    if (!btn) return;

    const id = btn.dataset.id;
    if (!id) return;

    if (!confirm(`Bạn có chắc muốn xoá bản sao "${id}" không?`)) return;

    try {
      const res = await authFetch(`${window.API_BANSAO}/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });

      const text = await res.text();
      if (!res.ok) {
        alert('Xoá thất bại: ' + text);
        return;
      }

      let obj;
      try { obj = JSON.parse(text); } catch (_) { obj = null; }
      if (obj && obj.success === false) {
        alert('Xoá thất bại: ' + (obj.message || ''));
        return;
      }

      alert('Xoá bản sao thành công!');
      if (typeof window.renderBanSao === 'function') {
        window.renderBanSao();
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi khi gọi API xoá');
    }
  });
})();
