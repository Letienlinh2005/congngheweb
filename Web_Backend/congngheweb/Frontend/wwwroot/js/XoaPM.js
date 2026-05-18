// ../js/XoaPM.js
const API_PHIEU_MUON = 'https://localhost:7151/api/phieumuon';

// hàm dùng chung, list sẽ gọi window.deletePM(...)
window.deletePM = async function (id, onDone) {
  if (!id) return;
  if (!confirm('Xoá phiếu mượn ' + id + '?')) return;

  try {
    const res = await fetch(`${API_PHIEU_MUON}/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    if (typeof onDone === 'function') onDone();
  } catch (err) {
    console.error(err);
    alert('Xoá thất bại');
  }
};
