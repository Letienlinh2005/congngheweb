// ../js/BanDoc.js

const API_BANDOC = 'https://localhost:7151/api/bandoc';

window.initReaderPage = function () {
  console.log('🚀 Khởi tạo trang quản lý bạn đọc');
  attachSearchButton();
  attachFilterButtons();
  loadAllReaders();
};

// ========== TÌM KIẾM ==========
function attachSearchButton() {
  const searchBtn = document.getElementById('en');
  const searchInput = document.getElementById('search-bd');
  
  if (searchBtn) {
    searchBtn.onclick = () => {
      const keyword = searchInput?.value?.trim() || '';
      searchReaders(keyword);
    };
  }

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const keyword = searchInput.value.trim();
        searchReaders(keyword);
      }
    });
  }
}

async function searchReaders(keyword) {
  const tbody = document.getElementById('bd-body');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="10">Đang tìm kiếm...</td></tr>';

  try {
    const url = keyword 
      ? `${API_BANDOC}?q=${encodeURIComponent(keyword)}`
      : API_BANDOC;

    const res = await authFetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    let data = await res.json();
    if (data && Array.isArray(data.data)) data = data.data;

    displayReaders(data);
  } catch (err) {
    console.error('❌ Lỗi tìm kiếm:', err);
    tbody.innerHTML = '<tr><td colspan="10">Lỗi kết nối API</td></tr>';
  }
}

// ========== LỌC THEO TRẠNG THÁI ==========
function attachFilterButtons() {
  const btnAll = document.getElementById('All');
  const btnActive = document.getElementById('Active');
  const btnNoActive = document.getElementById('No-active');

  if (btnAll) btnAll.onclick = () => filterByStatus('all');
  if (btnActive) btnActive.onclick = () => filterByStatus('active');
  if (btnNoActive) btnNoActive.onclick = () => filterByStatus('no-active');
}

async function filterByStatus(status) {
  const tbody = document.getElementById('bd-body');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="10">Đang lọc...</td></tr>';

  try {
    const res = await authFetch(API_BANDOC, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    let data = await res.json();
    if (data && Array.isArray(data.data)) data = data.data;

    if (status === 'all') {
      displayReaders(data);
    } else if (status === 'active') {
      const filtered = data.filter(r => {
        const tt = (r.TrangThai || r.trangThai || '').toLowerCase();
        return tt === 'hoạt động' || tt === 'active';
      });
      displayReaders(filtered);
    } else if (status === 'no-active') {
      const filtered = data.filter(r => {
        const tt = (r.TrangThai || r.trangThai || '').toLowerCase();
        return tt === 'không hoạt động' || tt === 'inactive';
      });
      displayReaders(filtered);
    }
  } catch (err) {
    console.error('❌ Lỗi lọc:', err);
    tbody.innerHTML = '<tr><td colspan="10">Lỗi kết nối API</td></tr>';
  }
}

// ========== LOAD TẤT CẢ BẠN ĐỌC ==========
async function loadAllReaders() {
  const tbody = document.getElementById('bd-body');
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="10">Đang tải...</td></tr>';

  try {
    const res = await authFetch(API_BANDOC, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    let data = await res.json();
    if (data && Array.isArray(data.data)) data = data.data;

    displayReaders(data);
  } catch (err) {
    console.error('❌ Lỗi load bạn đọc:', err);
    tbody.innerHTML = '<tr><td colspan="10">Lỗi kết nối API</td></tr>';
  }
}

// ========== HIỂN THỊ DANH SÁCH ==========
function displayReaders(list) {
  const tbody = document.getElementById('bd-body');
  if (!tbody) return;

  if (!Array.isArray(list) || list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10">Không có bạn đọc nào</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((r, idx) => {
    const maBD = r.MaBanDoc || r.maBanDoc || '';
    const soThe = r.SoThe || r.soThe || '';
    const hoTen = r.HoTen || r.hoTen || '';
    const email = r.Email || r.email || '';
    const dienThoai = r.DienThoai || r.dienThoai || '';
    const hanThe = formatDate(r.HanThe || r.hanThe || '');
    const trangThai = r.TrangThai || r.trangThai || '';
    const duNo = Number(r.DuNo || r.duNo || 0);

    return `
      <tr>
        <td>${idx + 1}</td>
        <td>${maBD}</td>
        <td>${soThe}</td>
        <td>${hoTen}</td>
        <td>${email}</td>
        <td>${dienThoai}</td>
        <td>${hanThe}</td>
        <td>${trangThai}</td>
        <td>
          <button class="btn-action btn-edit" onclick="editReader('${maBD}')">Sửa</button>
          <button class="btn-action btn-delete" onclick="deleteReader('${maBD}')">Xóa</button>
          <button class="btn-action btn-pay" onclick="goToPayment('${maBD}')">Thanh toán</button>
        </td>
      </tr>
    `;
  }).join('');
}

// ========== CHUYỂN ĐẾN TRANG THANH TOÁN ==========
window.goToPayment = async function (maBD) {
  console.log('💳 Chuyển đến thanh toán cho:', maBD);

  try {
    const res = await authFetch(`${API_BANDOC}/${encodeURIComponent(maBD)}`, {
      cache: 'no-store'
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    let reader = await res.json();
    if (reader && reader.data) reader = reader.data;

    console.log('✅ Lấy thông tin bạn đọc:', reader);

    const payData = {
      maBanDoc: reader.MaBanDoc || reader.maBanDoc || maBD,
      hoTen: reader.HoTen || reader.hoTen || '',
      email: reader.Email || reader.email || '',
      dienThoai: reader.DienThoai || reader.dienThoai || '',
      soThe: reader.SoThe || reader.soThe || ''
    };

    sessionStorage.setItem('PAY_BANDOC', JSON.stringify(payData));
    console.log('✅ Đã lưu vào sessionStorage:', payData);

    window.location.href = '../html/ThanhToanPhat.html';
  } catch (err) {
    console.error('❌ Lỗi lấy thông tin bạn đọc:', err);
    alert('Không thể lấy thông tin bạn đọc. Vui lòng thử lại!');
  }
};

// ========== SỬA BẠN ĐỌC ==========
window.editReader = function(maBD) {
  sessionStorage.setItem('EDIT_BANDOC', maBD);
  if (typeof loadPage === 'function') {
    loadPage('../html/EditBD.html', 'initEditBD');
  } else {
    window.location.href = '../html/EditBD.html';
  }
};

// ========== XÓA BẠN ĐỌC ==========
window.deleteReader = async function(maBD) {
  if (!confirm(`Xác nhận xóa bạn đọc "${maBD}"?`)) return;

  try {
    const res = await authFetch(`${API_BANDOC}/${encodeURIComponent(maBD)}`, {
      method: 'DELETE'
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }

    alert('Xóa bạn đọc thành công!');
    loadAllReaders();
  } catch (err) {
    console.error('❌ Lỗi xóa:', err);
    alert('Xóa thất bại: ' + err.message);
  }
};

// ========== HELPER FUNCTIONS ==========
function formatDate(dateStr) {
  if (!dateStr) return '';
  const s = String(dateStr);
  if (s.includes('T')) return s.split('T')[0];
  return s;
}

function formatMoney(value) {
  const num = Number(value) || 0;
  return num.toLocaleString('vi-VN');
}