// ../js/AddPM.js
const API_PHIEU_MUON = 'https://localhost:7151/api/phieumuon';

window.initAddPM = function () {
  const form = document.getElementById('form-add-pm');
  const msg  = document.getElementById('pm-add-msg');
  if (!form) return;

  form.onsubmit = async (e) => {
    e.preventDefault();
    msg.textContent = 'Đang lưu...';

    const body = {
      maPhieuMuon: document.getElementById('maPhieuMuon').value.trim(),
      maBanSao:    document.getElementById('maBanSao').value.trim(),
      maBanDoc:    document.getElementById('maBanDoc').value.trim(),
      ngayMuon:    document.getElementById('ngayMuon').value || null,
      hanTra:      document.getElementById('hanTra').value || null,
      trangThai:   document.getElementById('trangThai').value.trim() || 'Đang mượn',
      soLanGiaHan: 0
    };

    try {
      const res = await fetch(API_PHIEU_MUON, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.success === false) {
        msg.style.color = 'red';
        msg.textContent = data.message || 'Thêm phiếu mượn thất bại';
        return;
      }

      msg.style.color = 'green';
      msg.textContent = 'Thêm thành công';
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
