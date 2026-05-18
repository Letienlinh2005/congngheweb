// ./js/XoaSach.js
if (!window.API_SACH) {
  window.API_SACH = 'https://localhost:7151/api/sach';
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-act="delete-sach"]');
  if (!btn) return;

  const id = btn.dataset.id;
  if (!id) return;

  if (!confirm(`Xoá sách mã "${id}" ?`)) return;

  const res = await fetch(`${window.API_SACH}/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    alert('Xoá thất bại');
    return;
  }
  alert('Xoá thành công!');
  if (typeof window.renderSach === 'function') {
    renderSach();
  }
});
