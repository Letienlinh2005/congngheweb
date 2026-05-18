// ../js/TaiKhoan.js
const API_TK = 'https://localhost:7151/api/taikhoan';

window.initTaiKhoanPage = function () {
  const tbody     = document.getElementById('tk-body');
  const btnSearch = document.getElementById('en');
  const inpSearch = document.getElementById('search-bd');
  if (!tbody) return;

  let allAccounts = [];

  const normalize = (p) => {
    if (Array.isArray(p)) return p;
    if (p && Array.isArray(p.data)) return p.data;
    return p ? [p] : [];
  };

  const render = (rows) => {
    if (!rows || !rows.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map((x, i) => {
      const ma   = x.maTaiKhoan ?? x.MaTaiKhoan ?? '';
      const user = x.tenDangNhap ?? x.TenDangNhap ?? '';
      const role = x.vaiTro ?? x.VaiTro ?? '';
      const bd   = x.maBanDoc ?? x.MaBanDoc ?? '';

      return `
        <tr data-id="${ma}">
          <td>${i + 1}</td>
          <td>${ma}</td>
          <td>${user}</td>
          <td>${role}</td>
          <td>${bd}</td>
          <td>
            <button class="btn-sm" data-act="edit" data-id="${ma}">Sửa</button>
            <button class="btn-sm" data-act="delete" data-id="${ma}">Xoá</button>
          </td>
        </tr>
      `;
    }).join('');
  };

  const doSearch = () => {
    const key = (inpSearch?.value || '').trim().toLowerCase();
    if (!key) {
      render(allAccounts);
      return;
    }
    const filtered = allAccounts.filter(tk => {
      const ma   = (tk.maTaiKhoan ?? tk.MaTaiKhoan ?? '').toLowerCase();
      const user = (tk.tenDangNhap ?? tk.TenDangNhap ?? '').toLowerCase();
      const role = (tk.vaiTro ?? tk.VaiTro ?? '').toLowerCase();
      const bd   = (tk.maBanDoc ?? tk.MaBanDoc ?? '').toLowerCase();
      return ma.includes(key) || user.includes(key) || role.includes(key) || bd.includes(key);
    });
    render(filtered);
  };

  authFetch(API_TK)
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(p => {
      allAccounts = normalize(p);
      render(allAccounts);
    })
    .catch(err => {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  if (btnSearch) btnSearch.onclick = doSearch;
  if (inpSearch) inpSearch.onkeyup = (e) => { if (e.key === 'Enter') doSearch(); };

  tbody.onclick = (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'edit') {
      sessionStorage.setItem('editTK', id);
      if (typeof loadPage === 'function') {
        loadPage('../html/FixTK.html', 'initFixTK');
      }
    }

    if (btn.dataset.act === 'delete') {
      if (typeof window.deleteTK === 'function') {
        window.deleteTK(id, () => {
          authFetch(API_TK)
            .then(r => r.json())
            .then(p => {
              allAccounts = normalize(p);
              doSearch();
            });
        });
      }
    }
  };
};
