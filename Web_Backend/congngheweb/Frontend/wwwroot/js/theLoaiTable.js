// ../js/TheLoaiTable.js
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('tl-body');
  if (!tbody) return;

  const API_URL = 'https://localhost:7151/api/theloai';

  const normalizeList = (payload) => {
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return payload ? [payload] : [];
  };

  const render = (rows) => {
    if (!rows || !rows.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    const html = rows.map((x, i) => {
      const maTheLoai  = x.maTheLoai ?? x.MaTheLoai ?? '';
      const tenTheLoai = x.tenTheLoai ?? x.TenTheLoai ?? '';
      const moTa       = x.moTa ?? x.MoTa ?? '';

      return `
        <tr data-id="${maTheLoai}">
          <td>${i + 1}</td>
          <td>${maTheLoai}</td>
          <td>${tenTheLoai}</td>
          <td>${moTa}</td>
          <td>
            <button class="btn-sm" data-act="edit" data-id="${maTheLoai}">Sửa</button>
            <button class="btn-sm" data-act="delete" data-id="${maTheLoai}">Xoá</button>
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
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'edit') {
      sessionStorage.setItem('editTL', id);
      if (typeof loadPage === 'function') {
        loadPage('../html/FixTL.html', 'initFixTL');
      } else {
        window.location.href = `../html/FixTL.html?id=${encodeURIComponent(id)}`;
      }
    }

    if (btn.dataset.act === 'delete') {
      if (!confirm('Xoá thể loại ' + id + '?')) return;
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
