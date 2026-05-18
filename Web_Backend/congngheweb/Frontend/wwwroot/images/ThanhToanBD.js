// ../js/ThanhToanBD.js

const PAY_BANDOC_KEY = 'PAY_BANDOC';
const API_PHAT = 'https://localhost:7151/api/phat';
const API_THANHTOAN = 'https://localhost:7151/api/thanhtoan/Phat';

// ========== KHỞI TẠO TRANG ==========
window.initThanhToanBD = function () {
  console.log('🚀 initThanhToanBD() được gọi');

  // Lấy dữ liệu từ sessionStorage
  const raw = sessionStorage.getItem(PAY_BANDOC_KEY);
  console.log('📦 Dữ liệu từ sessionStorage:', raw);

  if (!raw) {
    alert('Không tìm thấy thông tin bạn đọc. Vui lòng chọn lại trong danh sách.');
    goBackToReaderList();
    return;
  }

  let bd;
  try {
    bd = JSON.parse(raw);
    console.log('✅ Parse thành công:', bd);
  } catch (err) {
    console.error('❌ Lỗi parse JSON:', err);
    alert('Dữ liệu bạn đọc bị lỗi. Vui lòng thử lại.');
    goBackToReaderList();
    return;
  }

  fillReaderInfo(bd);
  attachBackButton();

  // Load danh sách phạt (nếu có API)
  loadUnpaidFineList(bd.maBanDoc);
};

// ========== HIỂN THỊ THÔNG TIN BẠN ĐỌC ==========
function fillReaderInfo(bd) {
  console.log('📝 Đang fill thông tin:', bd);

  const maBD = bd.maBanDoc || '';
  const hoTen = bd.hoTen || '';
  const email = bd.email || '';
  const sdt = bd.dienThoai || '';
  const soThe = bd.soThe || '';
  const duNo = Number(bd.duNo || 0);

  setText('info-maBD', maBD);
  setText('info-hoTen', hoTen);
  setText('info-email', email);
  setText('info-sdt', sdt);
  setText('info-soThe', soThe);
  setText('info-duNo', formatMoney(duNo) + ' ₫');
  setText('total-debt', formatMoney(duNo) + ' ₫');

  console.log('✅ Đã fill xong thông tin');
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value ?? '';
    console.log(`✅ Set ${id} = ${value}`);
  } else {
    console.warn(`⚠️ Không tìm thấy element: ${id}`);
  }
}

// ========== NÚT QUAY LẠI ==========
function attachBackButton() {
  const back = document.getElementById('btnBackBD');
  if (back) {
    back.onclick = goBackToReaderList;
    console.log('✅ Đã gắn nút quay lại');
  } else {
    console.warn('⚠️ Không tìm thấy nút btnBackBD');
  }
}

function goBackToReaderList() {
  if (typeof loadPage === 'function') {
    loadPage('../html/Readermanagement.html', 'initReaderPage');
  } else {
    window.history.back();
  }
}

// ========== LOAD DANH SÁCH PHẠT ==========
async function loadUnpaidFineList(maBanDoc) {
  const tbody = document.getElementById('phat-body');
  if (!tbody) {
    console.warn('⚠️ Không tìm thấy phat-body');
    return;
  }

  tbody.innerHTML = '<tr><td colspan="7">Đang tải danh sách phạt...</td></tr>';

  try {
    const res = await fetch(`${API_PHAT}/chua-thanh-toan/${encodeURIComponent(maBanDoc)}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.warn(`⚠️ API phạt trả về: ${res.status}`);
      tbody.innerHTML = '<tr><td colspan="7">(Chưa có API phạt hoặc không có phạt nào)</td></tr>';
      return;
    }

    let data = await res.json();
    if (data && Array.isArray(data.data)) data = data.data;

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">Không có khoản phạt nào chưa thanh toán.</td></tr>';
      return;
    }

    tbody.innerHTML = data.map((x, idx) => {
      const maPhat = x.MaPhat ?? x.maPhat ?? '';
      const lyDo = x.LyDo ?? x.lyDo ?? '';
      const soTien = x.SoTien ?? x.soTien ?? 0;
      const ngayTinh = x.NgayTinh ?? x.ngayTinh ?? '';
      const trangThai = x.TrangThai ?? x.trangThai ?? '';

      return `
        <tr>
          <td>${idx + 1}</td>
          <td>${maPhat}</td>
          <td>${lyDo}</td>
          <td>${formatMoney(soTien)} ₫</td>
          <td>${formatDate(ngayTinh)}</td>
          <td>${trangThai}</td>
          <td>
            <button class="btn-sm" onclick="payOneFine('${escapeQuotes(maPhat)}')">
              Thanh toán
            </button>
          </td>
        </tr>`;
    }).join('');

    console.log('✅ Đã load danh sách phạt');
  } catch (err) {
    console.error('❌ Lỗi kết nối API phạt:', err);
    tbody.innerHTML = '<tr><td colspan="7">(Chức năng phạt chưa khả dụng)</td></tr>';
  }
}

// ========== THANH TOÁN 1 KHOẢN PHẠT ==========
window.payOneFine = async function (maPhat) {
  const payMethod = document.getElementById('pay-method')?.value || 'Tiền mặt';
  const note = document.getElementById('pay-note')?.value || '';

  if (!confirm(`Xác nhận thanh toán mã phạt "${maPhat}" bằng ${payMethod}?`)) return;

  const payload = {
    MaPhat: maPhat,
    HinhThucThanhToan: payMethod,
    GhiChu: note
  };

  try {
    const res = await fetch(API_THANHTOAN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();
    let obj;
    try {
      obj = JSON.parse(text);
    } catch {
      obj = null;
    }

    if (!res.ok || (obj && obj.success === false)) {
      alert('Thanh toán thất bại: ' + (obj?.message || text || `HTTP ${res.status}`));
      return;
    }

    alert('Thanh toán thành công!');

    // Reload danh sách phạt
    const raw = sessionStorage.getItem(PAY_BANDOC_KEY);
    if (raw) {
      const bd = JSON.parse(raw);
      await loadUnpaidFineList(bd.maBanDoc);
    }
  } catch (err) {
    console.error('❌ Lỗi thanh toán:', err);
    alert('Lỗi kết nối API thanh toán.');
  }
};

// ========== HELPER FUNCTIONS ==========
function formatMoney(v) {
  const n = Number(v) || 0;
  return n.toLocaleString('vi-VN');
}

function formatDate(v) {
  if (!v) return '';
  const s = String(v);
  if (s.includes('T')) return s.slice(0, 10);
  return s;
}

function escapeQuotes(str) {
  return String(str).replace(/'/g, "\\'");
}