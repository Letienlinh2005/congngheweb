// ../js/KeSach.js

// Cấu hình API kệ sách (dùng chung cho Add/Fix/Xoá)
if (!window.API_KESACH) {
  window.API_KESACH = 'https://localhost:7151/api/KeSach';
}

/* ================== HÀM GỌI API ================== */
async function fetchKeSach(params = {}) {
  const url = new URL(window.API_KESACH);

  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.append(k, v);
    }
  });

  const res = await authFetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ` + await res.text());
  }
  return res.json();
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return payload ? [payload] : [];
}

/* ================== RENDER BẢNG ================== */
window.renderKeSach = async function (params = {}) {
  const tbody =
    document.getElementById('ks-body') ||
    document.querySelector('#title-name tbody');

  if (!tbody) return;

  tbody.innerHTML =
    `<tr><td colspan="4" style="text-align:center">Đang tải...</td></tr>`;

  try {
    let data = await fetchKeSach(); // luôn load full rồi lọc client
    data = normalizeList(data);

    // lọc theo ô tìm kiếm nếu có params.q
    if (params.q) {
      const key = params.q.toLowerCase();
      data = data.filter(x => {
        const ma   = (x.MaKe  ?? x.maKe  ?? '').toString().toLowerCase();
        const vitri= (x.ViTri ?? x.viTri ?? '').toString().toLowerCase();
        return ma.includes(key) || vitri.includes(key);
      });
    }

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML =
        `<tr><td colspan="4" style="text-align:center">Không có dữ liệu</td></tr>`;
      return;
    }

    const html = data.map((x, i) => {
      const maKe  = x.MaKe  ?? x.maKe  ?? '';
      const viTri = x.ViTri ?? x.viTri ?? '';

      return `
        <tr data-id="${maKe}">
          <td>${i + 1}</td>
          <td>${maKe}</td>
          <td>${viTri}</td>
          <td>
            <a
              class="btn-sm"
              onclick="setEditKS('${maKe}'); loadPage('../html/FixKS.html','initFixKS')"
            >Sửa</a>
            <a
              class="btn-sm"
              data-act="delete-ks"
              data-id="${maKe}"
            >Xoá</a>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = html;
  } catch (err) {
    console.error(err);
    tbody.innerHTML =
      `<tr><td colspan="4" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>`;
  }
};

/* ================== INIT TRANG KỆ SÁCH ================== */
window.initKeSachPage = function () {
  // load lần đầu
  window.renderKeSach();

  const btnSearch = document.getElementById('en');
  const inpSearch = document.getElementById('search-bd');

  if (btnSearch && inpSearch) {
    btnSearch.onclick = () => {
      const q = inpSearch.value.trim();
      window.renderKeSach(q ? { q } : {});
    };
  }

  if (inpSearch) {
    inpSearch.onkeyup = (e) => {
      if (e.key === 'Enter') {
        const q = inpSearch.value.trim();
        window.renderKeSach(q ? { q } : {});
      }
    };
  }

  // mấy nút lọc (hiện tại Kệ chưa có trạng thái, để sẵn)
  const btnAll = document.getElementById('All');
  const btnActive = document.getElementById('Active');
  const btnNoActive = document.getElementById('No-active');

  if (btnAll)      btnAll.onclick      = () => window.renderKeSach();
  if (btnActive)   btnActive.onclick   = () => window.renderKeSach({ status: 'active' });
  if (btnNoActive) btnNoActive.onclick = () => window.renderKeSach({ status: 'inactive' });
};

// lưu mã kệ đang sửa trong sessionStorage
window.setEditKS = function (maKe) {
  sessionStorage.setItem('editKS', maKe);
};

// Nếu mở KeSach.html standalone, tự init
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('ks-body')) {
    window.initKeSachPage();
  }
});
