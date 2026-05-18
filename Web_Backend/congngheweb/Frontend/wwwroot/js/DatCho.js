// ================= CẤU HÌNH API =================
if (!window.API_DATCHO) window.API_DATCHO = 'https://localhost:7151/api/DatCho';
if (!window.API_SACH) window.API_SACH     = 'https://localhost:715/api/Sach';
if (!window.API_BANDOC) window.API_BANDOC = 'https://localhost:7151/api/BanDoc';

// ================= CACHE =================
let _cacheSach = null;
let _cacheBanDoc = null;

// ================= HÀM FORMAT =================
function dcFmtDate(v) {
    if (!v) return '';
    const d = new Date(v);
    if (isNaN(d)) return v;
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

function dcFmtStatus(s) {
    if (s == null) return '';
    const raw = s.toString().trim().toUpperCase();
    if (raw.includes('WAIT') || raw.includes('CHO')) return 'Chờ hàng';
    if (raw.includes('HOLD') || raw.includes('GIU')) return 'Đang giữ';
    if (raw.includes('EXPIRED') || raw.includes('HET')) return 'Hết hạn';
    if (raw.includes('CANCEL') || raw.includes('HUY')) return 'Đã hủy';
    return s;
}

// ================= GỌI API =================
async function fetchDatCho() {
    const res = await authFetch(API_DATCHO, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ` + await res.text());
    return res.json();
}

async function loadSachList() {
    if (_cacheSach) return _cacheSach;
    const res = await authFetch(API_SACH, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ` + await res.text());
    let data = await res.json();
    _cacheSach = Array.isArray(data.data || data) ? (data.data || data) : [];
    return _cacheSach;
}

async function loadBanDocList() {
    if (_cacheBanDoc) return _cacheBanDoc;
    const res = await authFetch(API_BANDOC, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ` + await res.text());
    let data = await res.json();
    _cacheBanDoc = Array.isArray(data.data || data) ? (data.data || data) : [];
    return _cacheBanDoc;
}

// ================= RENDER VÀO tbody =================
async function renderDatCho(options = {}) {
    const tbody = document.getElementById('dc-body');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center">Đang tải...</td></tr>`;

    try {
        let [data, sachList, banDocList] = await Promise.all([
            fetchDatCho(),
            loadSachList(),
            loadBanDocList()
        ]);

        if (data && Array.isArray(data.data)) data = data.data;
        if (!Array.isArray(data)) data = data ? [data] : [];

        const now = new Date();

        // ===== LỌC THEO TRẠNG THÁI & TỰ CHUYỂN HẾT HẠN =====
        data.forEach(dc => {
            const giuDen = new Date(dc.giuDen ?? dc.ngayHetHan ?? dc.ngayGiuDen);
            if ((dc.trangThai ?? dc.status) === 'Đang giữ' && giuDen < now) {
                dc.trangThai = 'Hết hạn'; // chỉ thay đổi hiển thị
}
        });

        if (options.status) {
            const target = options.status.toUpperCase();
            data = data.filter(dc => {
                const st = (dc.trangThai ?? dc.status ?? '').toString().toUpperCase();
                if (!st) return false;
                if (target==='WAIT') return st.includes('WAIT')||st.includes('CHO');
                if (target==='HOLD') return st.includes('HOLD')||st.includes('GIU');
                if (target==='EXPIRED') return st.includes('EXPIRED')||st.includes('HET');
                if (target==='CANCELED') return st.includes('CANCEL')||st.includes('HUY');
                return true;
            });
        }

        if (options.q) {
            const key = options.q.toLowerCase();
            data = data.filter(dc => {
                const maDC   = (dc.maDatCho ?? dc.ma ?? dc.id ?? '').toString().toLowerCase();
                const maSach = (dc.maSach ?? dc.sachId ?? '').toString().toLowerCase();
                const maBD   = (dc.maBanDoc ?? dc.banDocId ?? '').toString().toLowerCase();
                const st     = (dc.trangThai ?? dc.status ?? '').toString().toLowerCase();
                return maDC.includes(key)||maSach.includes(key)||maBD.includes(key)||st.includes(key);
            });
        }

        if (!data.length) {
            tbody.innerHTML = `<tr><td colspan="8" style="text-align:center">Không có dữ liệu</td></tr>`;
            return;
        }

        const rows = data.map((dc, idx) => {
            const maDC   = dc.maDatCho ?? dc.ma ?? dc.id ?? '';
            const maSach = dc.maSach ?? dc.sachId ?? '';
            const maBD   = dc.maBanDoc ?? dc.banDocId ?? '';
            const ngayMuon = dc.ngayTao ?? dc.ngayDat ?? dc.createdAt;
            const hanTra   = dc.giuDen ?? dc.ngayHetHan ?? dc.ngayGiuDen;
            const status   = dcFmtStatus(dc.trangThai ?? dc.status);

            const sach = sachList.find(s => (s.MaSach ?? s.maSach) === maSach);
            const banDoc = banDocList.find(b => (b.MaBanDoc ?? b.maBanDoc) === maBD);
            const tenSach = sach ? (sach.TieuDe ?? sach.tieuDe ?? maSach) : maSach;
            const tenBD   = banDoc ? (banDoc.HoTen ?? banDoc.Ten ?? banDoc.ten ?? maBD) : maBD;

            return `
                <tr>
                    <td>${idx + 1}</td>
                    <td>${maDC}</td>
                    <td>${tenSach}</td>
                    <td>${tenBD}</td>
                    <td>${dcFmtDate(ngayMuon)}</td>
                    <td>${status}</td>
                    <td>${dcFmtDate(hanTra)}</td>

                </tr>
            `;
        }).join('');
        tbody.innerHTML = rows;

    } catch (err) {
        console.error('Lỗi renderDatCho:', err);
        tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:red">Lỗi tải dữ liệu</td></tr>`;
    }
}

// ================= HỦY ĐẶT CHỖ =================
async function cancelDatCho(maDC) {
if (!maDC) return;
    if (!confirm('Bạn có chắc muốn hủy đặt chỗ này?')) return;

    try {
        const res = await authFetch(`${API_DATCHO}/${encodeURIComponent(maDC)}/cancel`, { method:'POST' });
        if (!res.ok) { alert('Hủy thất bại'); return; }
        alert('Đã hủy đặt chỗ');
        renderDatCho();
    } catch (e) { console.error(e); alert('Lỗi khi hủy đặt chỗ'); }
}

// ================= KHỞI TẠO TRANG =================
window.initDatChoPage = function() {
    renderDatCho();

    const btnSearch = document.getElementById('en');
    const inpSearch = document.getElementById('search-bd');
    if (btnSearch && inpSearch) btnSearch.onclick = ()=>renderDatCho(inpSearch.value.trim()?{q:inpSearch.value.trim()}:{});
    if (inpSearch) inpSearch.onkeyup = (e)=>{if(e.key==='Enter') renderDatCho(inpSearch.value.trim()?{q:inpSearch.value.trim()}:{});};

    const btnAll      = document.getElementById('All');
    const btnWait     = document.getElementById('Wait');
    const btnHold     = document.getElementById('Hold');
    const btnExpired  = document.getElementById('Expired');
    const btnCanceled = document.getElementById('Canceled');
    if(btnAll) btnAll.onclick = ()=>renderDatCho();
    if(btnWait) btnWait.onclick = ()=>renderDatCho({status:'WAIT'});
    if(btnHold) btnHold.onclick = ()=>renderDatCho({status:'HOLD'});
    if(btnExpired) btnExpired.onclick = ()=>renderDatCho({status:'EXPIRED'});
    if(btnCanceled) btnCanceled.onclick = ()=>renderDatCho({status:'CANCELED'});
};

// Khi mở trực tiếp DatCho.html
document.addEventListener('DOMContentLoaded', ()=>{
    if(document.getElementById('dc-body')) initDatChoPage();
});


