const API_THE_LOAI = 'https://localhost:7151/api/TheLoai';

window.deleteTheLoai = async function (id, onDone) {
    if (!id) return;
    if (!confirm('Xoá thể loại ' + id + '?')) return;

    try {
        const res = await authFetch(`${API_THE_LOAI}/${encodeURIComponent(id)}`, { method: 'DELETE' });
        const text = await res.text();

        let msg = text;
        try { msg = JSON.parse(text).message || text; } catch {}

        if (res.ok) {
            alert('Xoá thể loại thành công!');
            if (typeof onDone === 'function') onDone();
        } else {
            alert('Xoá thất bại: ' + msg);
        }
    } catch (err) {
        console.error(err);
        alert('Lỗi kết nối API hoặc xoá thất bại');
    }
};
