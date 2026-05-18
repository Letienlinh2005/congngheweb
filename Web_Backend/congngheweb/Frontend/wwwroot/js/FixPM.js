// ../js/FixPM.js
const API_PHIEU_MUON = 'https://localhost:7151/api/phieumuon';

window.initFixPM = async function () {
  const form = document.getElementById('form-fix-pm');
  const msg  = document.getElementById('pm-fix-msg');
  const id   = sessionStorage.getItem('editPM');

  if (!id) {
    msg.textContent = 'Không tìm thấy mã phiếu mượn để sửa';
    msg.style.color = 'red';
    return;
  }

  // load dữ liệu
  try {
    const res  = await authFetch(`${API_PHIEU_MUON}/${encodeURIComponent(id)}`);
    const data = await res.json();
    const pm   = data.data || data;

    document.getElementById('maPhieuMuon').value = pm.maPhieuMuon || '';
    document.getElementById('maBanSao').value    = pm.maBanSao || '';
    document.getElementById('maBanDoc').value    = pm.maBanDoc || '';
    document.getElementById('ngayMuon').value    = pm.ngayMuon ? pm.ngayMuon.substring(0,10) : '';
    document.getElementById('hanTra').value      = pm.hanTra ? pm.hanTra.substring(0,10) : '';
    document.getElementById('ngayTraThucTe').value = pm.ngayTraThucTe ? pm.ngayTraThucTe.substring(0,10) : '';
    document.getElementById('soLanGiaHan').value = pm.soLanGiaHan ?? 0;
    document.getElementById('trangThai').value   = pm.trangThai || '';
  } catch (err) {
    console.error(err);
    msg.textContent = 'Không tải được dữ liệu';
    msg.style.color = 'red';
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    msg.textContent = 'Đang cập nhật...';

    const body = {
      maPhieuMuon: document.getElementById('maPhieuMuon').value.trim(),
      maBanSao:    document.getElementById('maBanSao').value.trim(),
      maBanDoc:    document.getElementById('maBanDoc').value.trim(),
      ngayMuon:    document.getElementById('ngayMuon').value || null,
      hanTra:      document.getElementById('hanTra').value || null,
      ngayTraThucTe: document.getElementById('ngayTraThucTe').value || null,
      soLanGiaHan: Number(document.getElementById('soLanGiaHan').value) || 0,
      trangThai:   document.getElementById('trangThai').value.trim() || 'Đang mượn'
    };

    try {
      const res = await fetch(`${API_PHIEU_MUON}/${encodeURIComponent(id)}`, {
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
        loadPage('../html/PhieuMuon.html', 'initPhieuMuonPage');
      }, 500);
    } catch (err) {
      console.error(err);
      msg.style.color = 'red';
      msg.textContent = 'Lỗi kết nối API';
    }
  };
};
