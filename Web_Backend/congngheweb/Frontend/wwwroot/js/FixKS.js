// ../js/FixKS.js

// Dùng lại API_KESACH nếu file khác đã set, nếu chưa thì set mặc định
if (!window.API_KESACH) {
  window.API_KESACH = 'https://localhost:7151/api/KeSach';
}

// Gọi sau khi FixKS.html được load vào admin
window.initFixKS = async function () {
  const id = sessionStorage.getItem('editKS');
  console.log('🔵 Đang sửa kệ:', id);
  if (!id) {
    alert('Không có mã kệ để sửa');
    return;
  }

  try {
    const res = await authFetch(`${window.API_KESACH}/${encodeURIComponent(id)}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      console.error('API lỗi', res.status);
      alert('Không tải được thông tin kệ sách');
      return;
    }

    let ks = await res.json();
    console.log('🟣 API trả về kệ:', ks);

    // nếu backend bọc trong .data
    if (ks && typeof ks === 'object' && ks.data) {
      ks = ks.data;
    }

    fillFixKSForm(ks);
    attachSaveHandlerKS();
    attachBackHandlerKS();
  } catch (err) {
    console.error(err);
    alert('Lỗi tải dữ liệu kệ sách');
  }
};

// nút quay lại -> về danh sách kệ
function attachBackHandlerKS() {
  const btnBack = document.getElementById('goBackbtn');
  if (!btnBack) return;

  btnBack.onclick = function () {
    if (typeof window.loadPage === 'function') {
      window.loadPage('../html/KeSach.html', 'initKeSachPage');
    } else {
      history.back();
    }
  };
}

// Đổ dữ liệu vào form
function fillFixKSForm(ks) {
  if (!ks) return;

  const maKS  = document.getElementById('MaKS');
  const viTri = document.getElementById('ViTri');

  if (maKS) {
    maKS.value = ks.MaKe ?? ks.maKe ?? '';
    maKS.disabled = true;
  }
  if (viTri) {
    viTri.value = ks.ViTri ?? ks.viTri ?? '';
  }
}

// Gắn sự kiện lưu
function attachSaveHandlerKS() {
  const btn = document.getElementById('saveBtn');
  if (!btn) {
    console.warn('⚠️ không tìm thấy nút saveBtn');
    return;
  }
  btn.onclick = saveFixKS;
}

// Gọi API PUT để lưu
async function saveFixKS() {
  const maKSInput  = document.getElementById('MaKS');
  const viTriInput = document.getElementById('ViTri');

  const maKe  = maKSInput ? (maKSInput.value || '').trim() : '';
  const viTri = viTriInput ? viTriInput.value.trim() : '';

  if (!maKe) {
    alert('Thiếu mã kệ');
    return;
  }

  if (!viTri) {
    if (!confirm('Vị trí đang trống. Bạn chắc chắn muốn lưu?')) {
      return;
    }
  }

  const payload = {
    maKe: maKe,
    viTri: viTri
  };

  console.log('📤 Gửi lên (kệ):', payload);

  try {
    const res = await fetch(`${window.API_KESACH}/${encodeURIComponent(maKe)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const text = await res.text();

    if (!res.ok) {
      console.error('❌ PUT lỗi:', res.status, text);
      alert('Lưu thất bại: ' + (text || `HTTP ${res.status}`));
      return;
    }

    alert('Lưu kệ sách thành công!');
    if (typeof window.loadPage === 'function') {
      window.loadPage('../html/KeSach.html', 'initKeSachPage');
    }
  } catch (err) {
    console.error(err);
    alert('Có lỗi khi gọi API kệ sách');
  }
}

// Nếu mở FixKS.html trực tiếp (không qua loadPage) thì tự init
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('Fix') && typeof window.initFixKS === 'function') {
    window.initFixKS();
  }
});
