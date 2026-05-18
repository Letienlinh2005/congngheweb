// ../js/TaiKhoanTable.js
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tk-body');
  if (!tbody) return;

  const API_URL = 'https://localhost:7151/api/taikhoan';

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return payload ? [payload] : [];
  };

  const render = (rows) => {
    if (!rows || !rows.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    const html = rows.map((x, i) => {
      const maTK       = x.maTaiKhoan ?? x.MaTaiKhoan ?? '';
      const tenDangNhap= x.tenDangNhap ?? x.TenDangNhap ?? '';
      const vaiTro     = x.vaiTro ?? x.VaiTro ?? '';
      const maBanDoc   = x.maBanDoc ?? x.MaBanDoc ?? '';

      return `
        <tr data-id="${maTK}">
          <td>${i + 1}</td>
          <td>${maTK}</td>
          <td>${tenDangNhap}</td>
          <td>${vaiTro}</td>
          <td>${maBanDoc}</td>
          <td>
            <button class="btn-sm" data-act="delete" data-id="${maTK}">Xoá</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = html;
  };

  fetch(API_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(payload => render(normalizeList(payload)))
    .catch(err => {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'delete') {
      if (!confirm('Xoá tài khoản ' + id + '?')) return;
      fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' })
        .then(r => {
          if (!r.ok) throw new Error('Xoá thất bại');
          return r.text();
        })
        .then(() => fetch(API_URL))
        .then(r => r.json())
        .then(payload => render(normalizeList(payload)))
        .catch(err => {
          console.error(err);
          alert('Xoá thất bại');
        });
    }
  });
});
