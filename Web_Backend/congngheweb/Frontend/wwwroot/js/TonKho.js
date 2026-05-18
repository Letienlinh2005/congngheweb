// ../js/TonKho.js

// Nếu gọi qua API Gateway 7151:
const API_TONKHO_THELOAI = "https://localhost:7151/api/tonkho/the-loai";
const API_TONKHO_SACH    = "https://localhost:7151/api/tonkho/sach";

// Nếu muốn gọi thẳng WebAPI (bỏ gateway), sửa thành 7159:
// const API_TONKHO_THELOAI = "https://localhost:7159/api/TonKho/the-loai";
// const API_TONKHO_SACH    = "https://localhost:7159/api/TonKho/sach";

function normalize(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.Data)) return payload.Data;
  return [];
}

function setMsg(text, isError = false) {
  const el = document.getElementById('bc-msg');
  if (!el) return;
  el.textContent = text || '';
  el.classList.remove('success');
  el.style.color = isError ? '#b30000' : '#555';
  if (!isError && text) {
    el.classList.add('success');
    el.style.color = '#0a7b00';
  }
}

/**
 * Gọi API tồn kho theo thể loại và render vào bảng
 */
async function loadTonKhoTheoTheLoai() {
  const tbody = document.getElementById('bc-theloai-body');
  if (!tbody) return;

  tbody.innerHTML =
    '<tr><td colspan="8" style="text-align:center">Đang tải dữ liệu...</td></tr>';
  setMsg("Đang tải tồn kho theo thể loại...", false);

  try {
    const res = await authFetch(API_TONKHO_THELOAI, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Nếu có token:
        // 'Authorization': 'Bearer ' + localStorage.getItem('ADMIN_TOKEN')
      }
    });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (!res.ok || !json || json.success === false || json.Success === false) {
      const msg = (json && (json.message || json.Message)) ||
        ('Lỗi tải tồn kho theo thể loại: HTTP ' + res.status);
      setMsg(msg, true);
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
      return;
    }

    const data = normalize(json);
    if (!data.length) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center">Không có dữ liệu</td></tr>';
      setMsg("Không có dữ liệu tồn kho theo thể loại.", false);
      return;
    }

    tbody.innerHTML = data.map((x, i) => {
      const maTL   = x.maTheLoai   ?? x.MaTheLoai   ?? '';
      const tenTL  = x.tenTheLoai  ?? x.TenTheLoai  ?? '';
      const soTua  = x.soTuaSach   ?? x.SoTuaSach   ?? 0;
      const tong   = x.tongSoBan   ?? x.TongSoBan   ?? 0;
      const conKho = x.conTrongKho ?? x.ConTrongKho ?? 0;
      const muon   = x.dangMuon    ?? x.DangMuon    ?? 0;
      const hu     = x.huHong      ?? x.HuHong      ?? 0;

      return `
        <tr>
          <td>${i + 1}</td>
          <td>${maTL}</td>
          <td>${tenTL}</td>
          <td>${soTua}</td>
          <td>${tong}</td>
          <td>${conKho}</td>
          <td>${muon}</td>
          <td>${hu}</td>
        </tr>
      `;
    }).join('');

    setMsg("Đã tải tồn kho theo thể loại.", false);
  } catch (err) {
    console.error(err);
    setMsg("Lỗi kết nối server khi tải tồn kho theo thể loại.", true);
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;color:#c00">Lỗi kết nối</td></tr>';
  }
}

/**
 * Gọi API tồn kho theo sách và render vào bảng
 */
async function loadTonKhoTheoSach() {
  const tbody = document.getElementById('bc-sach-body');
  if (!tbody) return;

  tbody.innerHTML =
    '<tr><td colspan="8" style="text-align:center">Đang tải dữ liệu...</td></tr>';
  setMsg("Đang tải tồn kho theo sách...", false);

  try {
    const res = await authFetch(API_TONKHO_SACH, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Nếu có token:
        // 'Authorization': 'Bearer ' + localStorage.getItem('ADMIN_TOKEN')
      }
    });

    const text = await res.text();
    let json;
    try {
      json = JSON.parse(text);
    } catch {
      json = null;
    }

    if (!res.ok || !json || json.success === false || json.Success === false) {
      const msg = (json && (json.message || json.Message)) ||
        ('Lỗi tải tồn kho theo sách: HTTP ' + res.status);
      setMsg(msg, true);
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
      return;
    }

    const data = normalize(json);
    if (!data.length) {
      tbody.innerHTML =
        '<tr><td colspan="8" style="text-align:center">Không có dữ liệu</td></tr>';
      setMsg("Không có dữ liệu tồn kho theo sách.", false);
      return;
    }

    tbody.innerHTML = data.map((x, i) => {
      const ma    = x.maSach      ?? x.MaSach      ?? '';
      const ten   = x.tenSach     ?? x.TenSach     ?? '';
      const tl    = x.tenTheLoai  ?? x.TenTheLoai  ?? '';
      const tong  = x.tongSoBan   ?? x.TongSoBan   ?? 0;
      const con   = x.conTrongKho ?? x.ConTrongKho ?? 0;
      const muon  = x.dangMuon    ?? x.DangMuon    ?? 0;
      const hu    = x.huHong      ?? x.HuHong      ?? 0;

      return `
        <tr>
          <td>${i + 1}</td>
          <td>${ma}</td>
          <td>${ten}</td>
          <td>${tl}</td>
          <td>${tong}</td>
          <td>${con}</td>
          <td>${muon}</td>
          <td>${hu}</td>
        </tr>
      `;
    }).join('');

    setMsg("Đã tải tồn kho theo sách.", false);
  } catch (err) {
    console.error(err);
    setMsg("Lỗi kết nối server khi tải tồn kho theo sách.", true);
    tbody.innerHTML =
      '<tr><td colspan="8" style="text-align:center;color:#c00">Lỗi kết nối</td></tr>';
  }
}

/**
 * Chuyển tab hiển thị
 */
function switchTab(tab) {
  const btnTL = document.getElementById('tab-theloai');
  const btnS  = document.getElementById('tab-sach');
  const pTL   = document.getElementById('panel-theloai');
  const pS    = document.getElementById('panel-sach');

  if (!btnTL || !btnS || !pTL || !pS) return;

  if (tab === 'theloai') {
    btnTL.classList.add('active');
    btnS.classList.remove('active');
    pTL.classList.remove('hidden');
    pS.classList.add('hidden');
  } else {
    btnS.classList.add('active');
    btnTL.classList.remove('active');
    pS.classList.remove('hidden');
    pTL.classList.add('hidden');
  }
}

/**
 * Lấy tab hiện tại
 */
function getCurrentTab() {
  const btnTL = document.getElementById('tab-theloai');
  if (btnTL && btnTL.classList.contains('active')) return 'theloai';
  return 'sach';
}

/**
 * Hàm init cho trang – gọi từ loadPage('../html/TonKho.html', 'initTonKhoPage')
 */
window.initTonKhoPage = function () {
  const tabTL = document.getElementById('tab-theloai');
  const tabS  = document.getElementById('tab-sach');
  const btnR  = document.getElementById('btn-refresh');

  if (tabTL) {
    tabTL.onclick = () => {
      switchTab('theloai');
      loadTonKhoTheoTheLoai();
    };
  }

  if (tabS) {
    tabS.onclick = () => {
      switchTab('sach');
      loadTonKhoTheoSach();
    };
  }

  if (btnR) {
    btnR.onclick = () => {
      const current = getCurrentTab();
      if (current === 'theloai') loadTonKhoTheoTheLoai();
      else loadTonKhoTheoSach();
    };
  }

  // Mặc định: hiện tab theo thể loại + load luôn dữ liệu
  switchTab('theloai');
  loadTonKhoTheoTheLoai();
};
