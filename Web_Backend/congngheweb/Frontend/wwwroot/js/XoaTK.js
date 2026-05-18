// ../js/XoaTK.js
const API_TK = 'https://localhost:7151/api/taikhoan';

window.deleteTK = async function (id, onDone) {
  if (!id) return;
  if (!confirm('Xoá tài khoản ' + id + '?')) return;

  try {
    const res = await fetch(`${API_TK}/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (typeof onDone === 'function') onDone();
  } catch (err) {
    console.error(err);
    alert('Xoá thất bại');
  }
};
