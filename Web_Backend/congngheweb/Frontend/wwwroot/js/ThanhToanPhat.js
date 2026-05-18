// ../js/ThanhToanPhat.js

// === CẤU HÌNH API ===
const API_TRA_SACH         = 'https://localhost:7151/api/PhieuMuon/tra-sach-va-tinh-phat';
const API_THANH_TOAN_PHAT  = 'https://localhost:7151/api/ThanhToan/Phat';

let currentPhieu = null;
let currentMaPhat = null;

// ==== AUTO INIT KHI TRANG LOAD (kể cả mở trực tiếp file) ====
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌐 DOMContentLoaded - chuẩn bị gọi initThanhToanPhatPage');
  if (typeof window.initThanhToanPhatPage === 'function') {
    window.initThanhToanPhatPage();
  } else {
    console.error('❌ Không tìm thấy hàm initThanhToanPhatPage');
  }
});

/**
 * Khởi tạo trang
 */
window.initThanhToanPhatPage = function () {
  console.log('🚀 initThanhToanPhatPage() chạy');

  const btnTinhPhat   = document.getElementById('btnTinhPhat');
  const btnThanhToan  = document.getElementById('btnThanhToan');
  const btnReset      = document.getElementById('btnReset');

  if (btnTinhPhat)  btnTinhPhat.onclick  = onTinhPhatClick;
  if (btnThanhToan) btnThanhToan.onclick = onThanhToanClick;
  if (btnReset)     btnReset.onclick     = onResetClick;

  prefillFromSession();   // lấy dữ liệu từ TRA_SACH_PM / PAY_PHAT

  console.log('✅ Đã gắn event & prefill dữ liệu');
};

/**
 * Prefill từ sessionStorage:
 *  - TRA_SACH_PM: khi đi từ trang Phiếu mượn (trả sách & tính phạt)
 *  - PAY_PHAT   : khi đi từ trang Quản lý phạt (thanh toán phạt có sẵn)
 */
function prefillFromSession() {
  try {
    const rawPM   = sessionStorage.getItem('TRA_SACH_PM');
    const rawPhat = sessionStorage.getItem('PAY_PHAT');

    console.log('🔍 TRA_SACH_PM raw =', rawPM);
    console.log('🔍 PAY_PHAT raw   =', rawPhat);

    // ƯU TIÊN TRẢ SÁCH (đi từ trang Phiếu mượn sang)
    if (rawPM) {
      const pm = JSON.parse(rawPM);
      console.log('📦 Phiếu mượn nhận từ TRA_SACH_PM:', pm);

      const maPM      = pm.maPhieuMuon || pm.MaPhieuMuon || '';
      const ngayMuon  = pm.ngayMuon    || pm.NgayMuon    || '';
      const hanTra    = pm.hanTra      || pm.HanTra      || '';
      const trangThai = pm.trangThai   || pm.TrangThai   || '';

      // điền mã phiếu mượn
      const inpMa = document.getElementById('pm-ma');
      if (inpMa) {
        inpMa.value = maPM;
        console.log('📝 Set pm-ma =', maPM);
      } else {
        console.warn('⚠️ Không tìm thấy input #pm-ma');
      }

      // ngày trả thực tế = hôm nay (nếu ô trống)
      const inpNgayTra = document.getElementById('pm-ngay-tra');
      if (inpNgayTra && !inpNgayTra.value) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm   = String(today.getMonth() + 1).padStart(2, '0');
        const dd   = String(today.getDate()).padStart(2, '0');
        inpNgayTra.value = `${yyyy}-${mm}-${dd}`; // yyyy-MM-dd
        console.log('📝 Set pm-ngay-tra =', inpNgayTra.value);
      }

      // hiển thị info bên trên
      setText('pm-ngay-muon',  formatDisplayDate(ngayMuon));
      setText('pm-han-tra',    formatDisplayDate(hanTra));
      setText('pm-trang-thai', trangThai || '-');
      return;
    }

    // NẾU KHÔNG CÓ TRA_SACH_PM → ĐỌC PAY_PHAT (đi từ trang Quản lý phạt sang)
    if (rawPhat) {
      const ph = JSON.parse(rawPhat);
      console.log('📦 Bản ghi phạt nhận từ PAY_PHAT:', ph);

      const maPhat    = ph.maPhat      || ph.MaPhat      || '';
      const maPM      = ph.maPhieuMuon || ph.MaPhieuMuon || '';
      const soTien    = ph.soTien      || ph.SoTien      || 0;
      const lyDo      = ph.lyDo        || ph.LyDo        || '';
      const trangThai = ph.trangThai   || ph.TrangThai   || '';

      // điền mã phiếu mượn (nếu có)
      const inpMaPM = document.getElementById('pm-ma');
      if (inpMaPM && maPM) inpMaPM.value = maPM;

      // điền MÃ PHẠT vào ô phần 2
      const inpMaPhat = document.getElementById('tt-ma-phat');
      if (inpMaPhat) {
        inpMaPhat.value = maPhat;
        console.log('📝 Set tt-ma-phat =', maPhat);
      } else {
        console.warn('⚠️ Không tìm thấy input #tt-ma-phat');
      }

      // hiển thị thông tin cho đẹp (không bắt buộc)
      setText('pm-ngay-muon',  '-');
      setText('pm-han-tra',    '-');
      setText('pm-trang-thai', trangThai || 'Trễ hạn');
      setText('pm-tien-phat',  formatMoney(soTien) + ' ₫');
      setText('pm-ma-phat',    maPhat || '-');
      return;
    }

    console.log('ℹ Không có TRA_SACH_PM hoặc PAY_PHAT trong sessionStorage, form sẽ trống.');
  } catch (e) {
    console.error('❌ Lỗi prefillFromSession:', e);
  }
}


function formatDisplayDate(v) {
  if (!v) return '-';
  const d = new Date(v);
  if (isNaN(d)) return '-';
  return d.toLocaleDateString('vi-VN');
}

/**
 * Bấm nút "Trả sách & tính phạt"
 */
async function onTinhPhatClick() {
  clearMsg();

  const maPM  = document.getElementById('pm-ma').value.trim();
  const ngayT = document.getElementById('pm-ngay-tra').value;

  if (!maPM) {
    setMsg('pm-msg', 'Vui lòng nhập mã phiếu mượn.');
    return;
  }
  if (!ngayT) {
    setMsg('pm-msg', 'Vui lòng chọn ngày trả thực tế.');
    return;
  }

  try {
    setMsg('pm-msg', 'Đang xử lý...', false);

    const body = {
      maPhieuMuon: maPM,
      ngayTraThucTe: ngayT
    };

    const res = await authFetch(API_TRA_SACH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const jsonText = await res.text();
    let data;
    try {
      data = JSON.parse(jsonText);
    } catch {
      data = null;
    }
    console.log('📥 Kết quả tra sách:', res.status, data || jsonText);

    if (!res.ok || (data && data.success === false)) {
      setMsg('pm-msg',
        (data && data.message) || `Lỗi API: HTTP ${res.status}`, true);
      return;
    }

    const payload = data && data.data ? data.data : data;
    currentPhieu  = payload.phieuMuon || null;
    currentMaPhat = payload.maPhat || payload.MaPhat || null;

    setText('pm-ngay-muon',   formatDate(payload.ngayMuon  || payload.NgayMuon));
    setText('pm-han-tra',     formatDate(payload.hanTra    || payload.HanTra));
    setText('pm-trang-thai',  payload.trangThai || payload.TrangThai || '');
    setText('pm-so-ngay-tre', (payload.soNgayTre ?? payload.SoNgayTre ?? 0));
    const tien = Number(payload.tienPhat ?? payload.TienPhat ?? 0);
    setText('pm-tien-phat',   formatMoney(tien) + ' ₫');

    if (currentMaPhat) {
      setText('pm-ma-phat', currentMaPhat);
      const maInput = document.getElementById('tt-ma-phat');
      if (maInput) maInput.value = currentMaPhat;
    } else {
      setText('pm-ma-phat', '-');
    }

    setMsg('pm-msg', 'Đã trả sách và tính phạt thành công.', false, true);
  } catch (err) {
    console.error(err);
    setMsg('pm-msg', 'Lỗi kết nối server khi trả sách / tính phạt.', true);
  }
}

/**
 * Bấm "Thanh toán phạt"
 */
async function onThanhToanClick() {
  clearMsg();

  const maPhat   = document.getElementById('tt-ma-phat').value.trim();
  const hinhThuc = document.getElementById('tt-hinh-thuc').value;
  const ghiChu   = document.getElementById('tt-ghi-chu').value.trim();

  if (!maPhat) {
    setMsg('tt-msg', 'Vui lòng nhập / chọn mã phạt.', true);
    return;
  }

  if (!confirm(`Xác nhận thanh toán cho mã phạt ${maPhat}?`)) return;

  const payload = {
    MaPhat: maPhat,
    MaThanhToan: genMaThanhToan(),
    HinhThuc: hinhThuc,
    GhiChu: ghiChu
  };

  try {
    setMsg('tt-msg', 'Đang thanh toán...', false);

    const res = await authFetch(API_THANH_TOAN_PHAT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    console.log('📥 Kết quả thanh toán phạt:', res.status, data || text);

    if (!res.ok || (data && data.success === false)) {
      setMsg('tt-msg',
        (data && data.message) || `Thanh toán thất bại: HTTP ${res.status}`, true);
      return;
    }

    setMsg('tt-msg', (data && data.message) || 'Thanh toán phạt thành công!', false, true);
  } catch (err) {
    console.error(err);
    setMsg('tt-msg', 'Lỗi kết nối server khi thanh toán phạt.', true);
  }
}

/**
 * Làm mới form
 */
function onResetClick() {
  document.getElementById('pm-ma').value = '';
  document.getElementById('pm-ngay-tra').value = '';

  setText('pm-ngay-muon', '-');
  setText('pm-han-tra', '-');
  setText('pm-trang-thai', '-');
  setText('pm-so-ngay-tre', '0');
  setText('pm-tien-phat', '0 ₫');
  setText('pm-ma-phat', '-');

  document.getElementById('tt-ma-phat').value = '';
  document.getElementById('tt-ghi-chu').value = '';
  document.getElementById('tt-hinh-thuc').value = 'Tiền mặt';

  currentPhieu = null;
  currentMaPhat = null;
  clearMsg();
}

// ==== helper chung ====

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function setMsg(id, message, isError = false, isSuccess = false) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('success');
  el.style.color = isError ? '#b30000' : '#555';
  if (isSuccess) {
    el.classList.add('success');
    el.style.color = '#0a7b00';
  }
}

function clearMsg() {
  setMsg('pm-msg', '');
  setMsg('tt-msg', '');
}

function formatDate(v) {
  if (!v) return '-';
  const s = String(v);
  if (s.includes('T')) return s.substring(0, 10);
  return s;
}

function formatMoney(v) {
  return (Number(v) || 0).toLocaleString('vi-VN');
}

// MaThanhToan tạm thời: TTyyyyMMddHHmmss
function genMaThanhToan() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const y = d.getFullYear();
  const M = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const h = pad(d.getHours());
  const m = pad(d.getMinutes());
  const s = pad(d.getSeconds());
  return `TT${y}${M}${day}${h}${m}${s}`;
}
