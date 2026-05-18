// ../js/trangChu.js

// ====== CONFIG API ======
const API_GATEWAY = 'https://localhost:7151';
const API_SACH    = API_GATEWAY + '/api/sach';

// nếu FE login đã dùng key khác thì chỉnh ở đây cho khớp
const TOKEN_KEY      = 'ACCESS_TOKEN';
const CURRENT_USER_KEY = 'CURRENT_USER';

let allBooks = [];

// ====== ĐỌC USER TỪ localStorage ======
function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ====== SETUP NAV KHI ĐĂNG NHẬP / CHƯA ĐĂNG NHẬP ======
function setupAuthUI() {
  const authBox = document.querySelector('.auth-buttons');
  if (!authBox) return;

  const user = getCurrentUser();

  if (!user) {
    // chưa đăng nhập
    authBox.innerHTML = `
      <a href="../html/DangNhap.html" class="login-btn">Đăng nhập</a>
      <a href="#" class="help-link">Trợ giúp</a>
    `;
    return;
  }

  const displayName =
    user.tenDangNhap ||
    user.HoTen ||
    user.tenDangNhap ||
    user.TenDangNhap ||
    user.email ||
    user.Email ||
    'Tài khoản';

  authBox.innerHTML = `
    <div class="user-menu">
      <button class="user-name-btn" id="btnUserMenu">${displayName}</button>
      <div class="user-dropdown" id="userDropdown">
        <a href="javascript:void(0)" id="btnProfile">Thông tin cá nhân</a>
        <button type="button" id="btnLogout">Đăng xuất</button>
      </div>
    </div>
  `;

  const btnUserMenu = document.getElementById('btnUserMenu');
  const dropdown    = document.getElementById('userDropdown');
  const btnLogout   = document.getElementById('btnLogout');
  const btnProfile  = document.getElementById('btnProfile');

  if (btnUserMenu && dropdown) {
    btnUserMenu.onclick = () => {
      dropdown.classList.toggle('open');
    };

    // click ngoài thì đóng dropdown
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !btnUserMenu.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  if (btnLogout) {
    btnLogout.onclick = () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(CURRENT_USER_KEY);
      // reload trang chủ
      location.href = '../html/trangChu.html';
    };
  }

  if (btnProfile) {
    btnProfile.onclick = () => {
      const u = getCurrentUser();
      if (u) {
        // lưu MaBanDoc để trang profile dùng
        const maBD = u.maBanDoc || u.MaBanDoc || null;
        if (maBD) {
          sessionStorage.setItem('currentMaBanDoc', maBD);
        }
      }
      // TODO: chỉnh lại đường dẫn nếu tên file khác
      location.href = '../html/UserPage.html';
    };
  }
}

// ====== GỌI API LẤY SÁCH ======
async function fetchBooks() {
  const res = await fetch(API_SACH, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  let data = await res.json();

  // nếu backend bọc trong { data: [...] }
  if (data && Array.isArray(data.data)) data = data.data;

  if (!Array.isArray(data)) return [];
  return data;
}

// ====== RENDER SÁCH Ở MỤC "Sách Được Thuê Nhiều" ======
function renderBooks(list) {
  const container = document.querySelector('.books .book-list');
  if (!container) return;

  if (!list || list.length === 0) {
    container.innerHTML = `<p style="padding:10px 0;">Chưa có sách nào.</p>`;
    return;
  }

  // lấy tối đa 8 cuốn
  const top = list.slice(0, 8);

  const html = top.map(b => {
    const title = b.tieuDe || b.TieuDe || 'Không có tiêu đề';
    const tacGia = b.tacGia || b.TacGia || '';
    const img =
      b.lienKetAnh ||
      b.LienKetAnh ||
      'https://via.placeholder.com/160x220?text=No+Image';

    return `
      <div class="book">
        <img src="${img}" alt="${title.replace(/"/g, '&quot;')}" />
        <p class="book-title">${title}</p>
        ${tacGia ? `<p class="book-author">${tacGia}</p>` : ''}
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

// ====== SEARCH TRONG DANH SÁCH SÁCH ======
function setupSearch() {
  const input = document.querySelector('.search-container input');
  const icon  = document.querySelector('.search-icon');

  if (!input) return;

  const doSearch = () => {
    const key = input.value.trim().toLowerCase();
    if (!key) {
      renderBooks(allBooks);
      return;
    }

    const filtered = allBooks.filter(b => {
      const title = (b.tieuDe || b.TieuDe || '').toLowerCase();
      const author = (b.tacGia || b.TacGia || '').toLowerCase();
      return title.includes(key) || author.includes(key);
    });

    renderBooks(filtered);
  };

  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  });

  if (icon) {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', doSearch);
  }
}

// ====== INIT TRANG CHỦ ======
document.addEventListener('DOMContentLoaded', async () => {
  setupAuthUI();

  setupSearch();

  const bookListEl = document.querySelector('.books .book-list');
  if (bookListEl) {
    bookListEl.innerHTML = '<p style="padding:10px 0;">Đang tải sách...</p>';
  }

  try {
    allBooks = await fetchBooks();
    renderBooks(allBooks);
  } catch (err) {
    console.error(err);
    if (bookListEl) {
      bookListEl.innerHTML = '<p style="color:red;padding:10px 0;">Lỗi tải danh sách sách.</p>';
    }
  }
});
