// ../js/SachTable.js
document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('sach-body');
  if (!tbody) return;

  // API sách
  const API_URL = 'https://localhost:7151/api/sach';
  // nếu đi qua gateway: const API_URL = 'http://localhost:7053/api/sach';

  const normalizeList = (payload) => {
    // API có thể trả thẳng mảng hoặc { data: [...] }
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    if (payload && Array.isArray(payload.items)) return payload.items;
    return payload ? [payload] : [];
  };

  const shortText = (txt, len = 40) => {
    if (!txt) return '';
    return txt.length > len ? txt.slice(0, len) + '...' : txt;
  };

  const render = (rows) => {
    if (!rows || !rows.length) {
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center">Không có dữ liệu</td></tr>';
      return;
    }

    const html = rows.map((x, i) => {
      const maSach     = x.maSach ?? x.MaSach ?? '';
      const tieuDe     = x.tieuDe ?? x.TieuDe ?? '';
      const tacGia     = x.tacGia ?? x.TacGia ?? '';
      const theLoai    = x.theLoai ?? x.TheLoai ?? '';
      const namXuatBan = x.namXuatBan ?? x.NamXuatBan ?? '';
      const ngonNgu    = x.ngonNgu ?? x.NgonNgu ?? '';
      const tomTat     = shortText(x.tomTat ?? x.TomTat ?? '');

      return `
        <tr data-id="${maSach}">
          <td>${i + 1}</td>
          <td>${maSach}</td>
          <td>${tieuDe}</td>
          <td>${tacGia}</td>
          <td>${theLoai}</td>
          <td>${namXuatBan}</td>
          <td>${ngonNgu ?? ''}</td>
          <td>${tomTat}</td>
          <td>
            <button class="btn-sm" data-act="edit" data-id="${maSach}">Sửa</button>
            <button class="btn-sm" data-act="delete" data-id="${maSach}">Xoá</button>
          </td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = html;
  };

  // tải dữ liệu
  fetch(API_URL)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(payload => render(normalizeList(payload)))
    .catch(err => {
      console.error(err);
      tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;color:#c00">Lỗi tải dữ liệu</td></tr>';
    });

  // bắt sự kiện Sửa / Xoá giống bạn đọc
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.dataset.id;

    if (btn.dataset.act === 'edit') {
      // lưu lại để trang FixSach đọc
      sessionStorage.setItem('editSach', id);
      // nếu bạn đang trong SPA:
      if (typeof loadPage === 'function') {
        loadPage('../html/FixSach.html', 'initFixSach');
      } else {
        // hoặc chuyển trang thẳng
        window.location.href = `../html/FixSach.html?id=${encodeURIComponent(id)}`;
      }
    }

    if (btn.dataset.act === 'delete') {
      // bạn có thể gọi API delete ở đây
      console.log('Delete', id);
      // ví dụ:
      // fetch(`${API_URL}/${encodeURIComponent(id)}`, { method: 'DELETE' })
      //   .then(() => location.reload());
    }
  });
});
