// ../js/FixBS.js

// ====== CONFIG API ======
if (!window.API_BANSAO) window.API_BANSAO = 'https://localhost:7151/api/BanSao';
if (!window.API_SACH)   window.API_SACH   = 'https://localhost:7151/api/Sach';
if (!window.API_KE)     window.API_KE     = 'https://localhost:7151/api/KeSach';

// Chuẩn hoá list trả về
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return payload ? [payload] : [];
}

// ====== LOAD COMBOBOX SÁCH (cho trang SỬA) ======
async function loadSachOptionsFix(selectedMaSach) {
  const sel = document.getElementById('MaSach');
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Đang tải sách... --</option>`;

  try {
    const res = await authFetch(window.API_SACH, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    let data = await res.json();
    data = normalizeList(data);

    sel.innerHTML =
      `<option value="">-- Chọn sách --</option>` +
      data.map(s => {
        const ma  = s.maSach ?? s.MaSach ?? '';
        const ten = s.tieuDe ?? s.TieuDe ?? ma;
        return `<option value="${ma}">${ma} - ${ten}</option>`;
      }).join('');

    if (selectedMaSach) {
      sel.value = selectedMaSach;
    }
  } catch (err) {
    console.error('Lỗi load sách (FixBS):', err);
    sel.innerHTML = `<option value="">-- Lỗi tải sách --</option>`;
  }
}

// ====== LOAD COMBOBOX KỆ (cho trang SỬA) ======
async function loadKeOptionsFix(selectedMaKe) {
  const sel = document.getElementById('MaKe');
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Đang tải kệ... --</option>`;

  try {
    const res = await authFetch(window.API_KE, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    let data = await res.json();
    data = normalizeList(data);

    sel.innerHTML =
      `<option value="">-- Chọn kệ --</option>` +
      data.map(k => {
        const ma  = k.maKe ?? k.MaKe ?? '';
        const ten = k.tenKe ?? k.TenKe ?? ma;
        return `<option value="${ma}">${ma} - ${ten}</option>`;
      }).join('');

    if (selectedMaKe) {
      sel.value = selectedMaKe;
    }
  } catch (err) {
    console.error('Lỗi load kệ (FixBS):', err);
    sel.innerHTML = `<option value="">-- Lỗi tải kệ --</option>`;
  }
}

// ====== INIT TRANG SỬA BẢN SAO ======
window.initFixBS = async function () {
  const id  = sessionStorage.getItem('editBS');
  const msg = document.getElementById('bs-fix-msg');

  if (!id) {
    alert('Không có mã bản sao để sửa');
    return;
  }

  try {
    const res = await authFetch(`${window.API_BANSAO}/${encodeURIComponent(id)}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('API lỗi', res.status);
      alert('Không tải được bản sao');
      return;
    }

    let bs = await res.json();
    if (bs && typeof bs === 'object' && bs.data) bs = bs.data;

    console.log('🔵 Dữ liệu bản sao cần sửa:', bs);

    const maSach = bs.MaSach ?? bs.maSach ?? '';
    const maKe   = bs.MaKe   ?? bs.maKe   ?? '';

    // load combobox Sách + Kệ, chọn đúng giá trị hiện tại
    await Promise.all([
      loadSachOptionsFix(maSach),
      loadKeOptionsFix(maKe)
    ]);

    // đổ các field còn lại
    fillFixBSForm(bs);
    attachFixBSHandlers();
  } catch (err) {
    console.error(err);
    alert('Lỗi tải dữ liệu bản sao');
  }
};

// Đổ dữ liệu vào form
function fillFixBSForm(bs) {
  if (!bs) return;
  const maBS   = document.getElementById('MaBS');
  const maVach = document.getElementById('MaVach');
  const tt     = document.getElementById('TrangThai');
  const maSach = document.getElementById('MaSach');
  const maKe   = document.getElementById('MaKe');
  const soLuongInput = document.getElementById('Soluong'); 
  if (maBS)   maBS.value   = bs.MaBanSao  ?? bs.maBanSao  ?? '';
  if (maVach) maVach.value = bs.MaVach    ?? bs.maVach    ?? '';
  // MaSach & MaKe đã được set trong loadSachOptionsFix / loadKeOptionsFix
  if (maSach && !maSach.value) maSach.value = bs.MaSach ?? bs.maSach ?? '';
  if (maKe   && !maKe.value)   maKe.value   = bs.MaKe   ?? bs.maKe   ?? '';

  const trangThai = bs.TrangThai ?? bs.trangThai ?? '';
  if (tt) tt.value = trangThai;  // "Có sẵn" / "Đang mượn" / "Hư hỏng"
   if (soLuongInput) soLuongInput.value = bs.SoLuong ?? bs.soLuong ?? 1;
}

// Gắn sự kiện Save / Back
function attachFixBSHandlers() {
  const btnSave = document.getElementById('saveBtn');
  const btnBack = document.getElementById('goBackbtn');
  const msg     = document.getElementById('bs-fix-msg');

  if (btnBack) {
    btnBack.onclick = () => {
      if (typeof loadPage === 'function') {
        loadPage('../html/BanSao.html', 'initBanSaoPage');
      } else {
        history.back();
      }
    };
  }

  if (btnSave) {
    btnSave.onclick = async () => {
      const maBS    = document.getElementById('MaBS').value.trim();
      const maVach  = document.getElementById('MaVach').value.trim();
      const maSach  = document.getElementById('MaSach').value.trim();
      const maKe    = document.getElementById('MaKe').value.trim();
      const tt      = document.getElementById('TrangThai').value.trim();
      const soLuong = document.getElementById('Soluong').value.trim();

      if (!maBS) { alert('Thiếu mã bản sao'); return; }

      if (!soLuong || isNaN(soLuong) || parseInt(soLuong, 10) <= 0) {
        alert('Số lượng phải là số nguyên > 0');
        return;
      }

      const payload = {
        MaBanSao:  maBS,
        MaVach:    maVach,
        MaSach:    maSach,
        MaKe:      maKe,
        SoLuong:   parseInt(soLuong, 10),
        TrangThai: tt
      };

      console.log('📤 PUT bản sao:', payload);

      try {
        const res = await authFetch(`${window.API_BANSAO}/${encodeURIComponent(maBS)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const text = await res.text();
        if (!res.ok) {
          console.error('PUT lỗi:', res.status, text);
          if (msg) {
            msg.style.color = 'red';
            msg.textContent = 'Lưu thất bại: ' + text;
          } else {
            alert('Lưu thất bại: ' + text);
          }
          return;
        }

        if (msg) {
          msg.style.color = 'green';
          msg.textContent = 'Lưu bản sao thành công';
        }

        setTimeout(() => {
          if (typeof loadPage === 'function') {
            loadPage('../html/BanSao.html', 'initBanSaoPage');
          }
        }, 500);
      } catch (err) {
        console.error(err);
        if (msg) {
          msg.style.color = 'red';
          msg.textContent = 'Lỗi gọi API';
        } else {
          alert('Lỗi gọi API');
        }
      }
    };
  }
}

// fallback nếu mở standalone
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('Fix') && typeof window.initFixBS === 'function') {
    window.initFixBS();
  }
});
