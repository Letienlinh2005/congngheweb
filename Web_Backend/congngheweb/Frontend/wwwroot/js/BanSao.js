// ../js/banSao.js

const API_BANSAO = 'https://localhost:7151/api/BanSao';

async function fetchBanSao(params = {}) {
  const url = new URL(API_BANSAO);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      url.searchParams.append(k, v);
    }
  });

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ` + await res.text());
  return res.json();
}

function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.items)) return payload.items;
  return payload ? [payload] : [];
}

window.renderBanSao = async function (params = {}) {
  const tbody = document.getElementById('bs-body') 
            || document.querySelector('#title-name tbody');
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="7" style="text-align:center">Đang tải...</td></tr>`;

  try {
    let data = await fetchBanSao();
    data = normalizeList(data);

    if (params.q) {
      const key = params.q.toLowerCase();
      data = data.filter(x => {
        const maBS   = (x.MaBanSao ?? x.maBanSao ?? '').toString().toLowerCase();
        const maVach = (x.MaVach   ?? x.maVach   ?? '').toString().toLowerCase();
        const maSach = (x.MaSach   ?? x.maSach   ?? '').toString().toLowerCase();
        const maKe   = (x.MaKe     ?? x.maKe     ?? '').toString().toLowerCase();
        const tt     = (x.TrangThai?? x.trangThai?? '').toString().toLowerCase();
        return maBS.includes(key) || maVach.includes(key) || maSach.includes(key) || maKe.includes(key) || tt.includes(key);
      });
    }

    if (!data.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center">Không có dữ liệu</td></tr>`;
      return;
    }

    const rows = data.map((x, i) => {
      const maBS   = x.MaBanSao ?? x.maBanSao ?? '';
      const maVach = x.MaVach   ?? x.maVach   ?? '';
      const maKe   = x.MaKe     ?? x.maKe     ?? '';
      const maSach = x.MaSach   ?? x.maSach   ?? '';
      const tt     = x.TrangThai?? x.trangThai?? '';

      return `
        <tr data-id="${maBS}">
          <td>${i + 1}</td>
          <td>${maBS}</td>
          <td>${maVach}</td>
          <td>${maKe}</td>
          <td>${maSach}</td>
          <td>${tt}</td>
          <td>
            <a class="btn-sm" onclick="setEditBS('${maBS}'); loadPage('../html/FixBS.html','initFixBS')">Sửa</a>
            <a class="btn-sm" data-act="delete-bs" data-id="${maBS}">Xoá</a>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rows;
  } catch (err) {
    console.error(err);
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>`;
  }
};

window.initBanSaoPage = function () {
  renderBanSao();

  const btnSearch = document.getElementById('en');
  const inpSearch = document.getElementById('search-bd');
  const btnAll      = document.getElementById('All');
  const btnActive   = document.getElementById('Active');
  const btnNoActive = document.getElementById('No-active');

  if (btnSearch && inpSearch) {
    btnSearch.onclick = () => {
      const q = inpSearch.value.trim();
      renderBanSao(q ? { q } : {});
    };
  }

  if (inpSearch) {
    inpSearch.onkeyup = (e) => {
      if (e.key === 'Enter') {
        const q = inpSearch.value.trim();
        renderBanSao(q ? { q } : {});
      }
    };
  }

  // tạm thời 3 nút lọc chỉ gọi lại render, ông có thể gắn logic sau
  if (btnAll)      btnAll.onclick      = () => renderBanSao();
  if (btnActive)   btnActive.onclick   = () => renderBanSao(); // TODO: lọc 'Có sẵn'
  if (btnNoActive) btnNoActive.onclick = () => renderBanSao(); // TODO: lọc khác
};

window.setEditBS = function (maBS) {
  sessionStorage.setItem('editBS', maBS);
};
