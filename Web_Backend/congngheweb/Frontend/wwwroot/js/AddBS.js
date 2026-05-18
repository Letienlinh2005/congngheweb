// ../js/AddBS.js

// ===== CẤU HÌNH API =====
if (!window.API_BANSAO) window.API_BANSAO = 'https://localhost:7151/api/BanSao';
if (!window.API_SACH)   window.API_SACH   = 'https://localhost:7151/api/Sach';
// ĐÃ ĐỔI ĐÚNG THEO BẠN: KeSach
if (!window.API_KE)     window.API_KE     = 'https://localhost:7151/api/KeSach';

// chuẩn hoá list trả về
function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return payload ? [payload] : [];
}

// ===== load combobox SÁCH =====
async function loadSachOptions() {
  const sel = document.getElementById('MaSach');
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Đang tải sách... --</option>`;

  try {
    console.log("🔵 Gọi API_SACH:", window.API_SACH);
    const res = await authFetch(window.API_SACH, { cache: 'no-store' });
    console.log("🔵 Kết quả API_SACH status:", res.status);

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.error("❌ API_SACH lỗi:", res.status, txt);
      throw new Error('HTTP ' + res.status);
    }

    let data = await res.json().catch(err => {
      console.error("❌ Lỗi parse JSON Sách:", err);
      return [];
    });
    data = normalizeList(data);

    sel.innerHTML =
      `<option value="">-- Chọn sách --</option>` +
      data.map(s => {
        const ma  = s.maSach ?? s.MaSach ?? '';
        const ten = s.tieuDe ?? s.TieuDe ?? ma;
        return `<option value="${ma}">${ma} - ${ten}</option>`;
      }).join('');
  } catch (err) {
    console.error('Lỗi load sách:', err);
    sel.innerHTML = `<option value="">-- Lỗi tải sách --</option>`;
  }
}

// ===== load combobox KỆ =====
async function loadKeOptions() {
  const sel = document.getElementById('MaKe');
  if (!sel) return;

  sel.innerHTML = `<option value="">-- Đang tải kệ... --</option>`;

  try {
    console.log("🟣 Gọi API_KE:", window.API_KE);
    const res = await authFetch(window.API_KE, { cache: 'no-store' });
    console.log("🟣 Kết quả API_KE status:", res.status);

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.error("❌ API_KE lỗi:", res.status, txt);
      throw new Error('HTTP ' + res.status);
    }

    let data = await res.json().catch(err => {
      console.error("❌ Lỗi parse JSON Kệ:", err);
      return [];
    });
    console.log("🟣 Dữ liệu Kệ raw:", data);

    data = normalizeList(data);
    console.log("🟣 Dữ liệu Kệ sau normalize:", data);

    if (!data.length) {
      sel.innerHTML = `<option value="">-- Không có dữ liệu kệ --</option>`;
      return;
    }

    sel.innerHTML =
      `<option value="">-- Chọn kệ --</option>` +
      data.map(k => {
        const ma  = k.maKe ?? k.MaKe ?? '';
        const ten = k.tenKe ?? k.TenKe ?? ma;
        return `<option value="${ma}">${ma} - ${ten}</option>`;
      }).join('');
  } catch (err) {
    console.error('Lỗi load kệ:', err);
    sel.innerHTML = `<option value="">-- Lỗi tải kệ --</option>`;
  }
}

// ===== INIT TRANG THÊM BẢN SAO =====
window.initAddBS = async function () {
  const msg     = document.getElementById('add-bs-msg');
  const saveBtn = document.getElementById('saveBtn');
  const backBtn = document.getElementById('goBackbtn');

  // load dữ liệu combobox
  await loadSachOptions();
  await loadKeOptions();

  // nút quay lại
  if (backBtn) {
    backBtn.onclick = function () {
      if (typeof window.loadPage === 'function') {
        window.loadPage('../html/BanSao.html', 'initBanSaoPage');
      } else {
        window.history.back();
      }
    };
  }

  if (!saveBtn) return;

  saveBtn.onclick = async function () {
    const elMaBS    = document.getElementById('MaBS');
    const elMaVach  = document.getElementById('MaVach');
    const elMaSach  = document.getElementById('MaSach');
    const elMaKe    = document.getElementById('MaKe');
    const elTT      = document.getElementById('TrangThai');
    const elSoLuong = document.getElementById('Soluong');
    const maBS    = elMaBS?.value.trim()   || '';
    const maVach  = elMaVach?.value.trim() || '';
    const maSach  = elMaSach?.value.trim() || '';
    const maKe    = elMaKe?.value.trim()   || '';
    const tt      = elTT?.value.trim()     || '';
    const soLuong = elSoLuong?.value.trim() || '1';

    if (!maBS || !maVach || !maSach || !maKe || !tt) {
      if (msg) {
        msg.style.color = 'red';
        msg.textContent = 'Vui lòng nhập đầy đủ Mã bản sao, Mã vạch, Sách, Kệ, Trạng thái';
      } else {
        alert('Thiếu dữ liệu');
      }
      return;
    } 

    // gửi đúng kiểu string "1"/"0" cho an toàn, .NET tự convert được
    const body = {
    MaBanSao:  maBS,
    MaVach:    maVach,
    MaSach:    maSach,
    MaKe:      maKe,
    SoLuong:   parseInt(soLuong, 10) || 1,
    TrangThai: tt   // gửi số 0 / 1 / 2 lên DB
  };

    if (msg) {
      msg.style.color = 'black';
      msg.textContent = 'Đang lưu...';
    }

    try {
      const res = await authFetch(window.API_BANSAO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const text = await res.text();
      let obj;
      try { obj = JSON.parse(text); } catch { obj = null; }

      if (!res.ok || (obj && obj.success === false)) {
        const errMsg = (obj && obj.message) || text || 'Thêm bản sao thất bại';
        console.error('❌ Thêm bản sao lỗi:', errMsg);
        if (msg) {
          msg.style.color = 'red';
          msg.textContent = errMsg;
        } else {
          alert(errMsg);
        }
        return;
      }

      if (msg) {
        msg.style.color = 'green';
        msg.textContent = 'Thêm bản sao thành công';
      }

      setTimeout(() => {
        if (typeof window.loadPage === 'function') {
          window.loadPage('../html/BanSao.html', 'initBanSaoPage');
        }
      }, 500);
    } catch (err) {
      console.error('Lỗi gọi API thêm bản sao:', err);
      if (msg) {
        msg.style.color = 'red';
        msg.textContent = 'Lỗi kết nối API';
      } else {
        alert('Lỗi kết nối API');
      }
    }
  };
};
