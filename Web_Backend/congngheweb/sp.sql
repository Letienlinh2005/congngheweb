-- Store Procedure Sach
CREATE PROCEDURE sp_GetAllSach
AS
BEGIN
    SELECT MaSach, TieuDe, TacGia, NamXuatBan, MaTheLoai
    FROM Sach;
END


CREATE PROCEDURE sp_GetSachById
    @MaSach NVARCHAR(20)
AS
BEGIN
    SELECT MaSach, TieuDe, TacGia, NamXuatBan, MaTheLoai
    FROM Sach
    WHERE MaSach = @MaSach;
END

CREATE PROCEDURE sp_InsertSach
    @MaSach NVARCHAR(20),
    @TieuDe NVARCHAR(255),
    @TacGia NVARCHAR(255),
    @NamXuatBan INT = NULL,
    @MaTheLoai NVARCHAR(20) = NULL
AS
BEGIN
    INSERT INTO Sach (MaSach, TieuDe, TacGia, NamXuatBan, MaTheLoai)
    VALUES (@MaSach, @TieuDe, @TacGia, @NamXuatBan, @MaTheLoai);
END


CREATE PROCEDURE sp_UpdateSach
    @MaSach NVARCHAR(20),
    @TieuDe NVARCHAR(255),
    @TacGia NVARCHAR(255),
    @NamXuatBan INT = NULL,
    @MaTheLoai NVARCHAR(20) = NULL
AS
BEGIN
    UPDATE Sach
    SET TieuDe = @TieuDe,
        TacGia = @TacGia,
        NamXuatBan = @NamXuatBan,
        MaTheLoai = @MaTheLoai
    WHERE MaSach = @MaSach;
END

CREATE PROCEDURE sp_DeleteSach
    @MaSach NVARCHAR(20)
AS
BEGIN
    DELETE FROM Sach
    WHERE MaSach = @MaSach;
END

-- SP TaiKhoan
CREATE PROCEDURE sp_GetAllTaiKhoan
AS 
BEGIN
	SELECT MaTaiKhoan, TenDangNhap, MatKhau, VaiTro
	FROM TaiKhoan
END

CREATE PROCEDURE sp_Register
	@MaTaiKhoan NVARCHAR(20),
	@TenDangNhap NVARCHAR(100),
	@MatKhau NVARCHAR(255),
	@VaiTro NVARCHAR(20)
AS
BEGIN
	INSERT INTO TaiKhoan(MaTaiKhoan, TenDangNhap, MatKhau, VaiTro)
	VALUES (@MaTaiKhoan, @TenDangNhap, @MatKhau, @VaiTro)
END

-- SP BanDoc
CREATE PROCEDURE sp_GetAllBanDoc
AS
BEGIN
	SELECT MaBanDoc, HoTen, SoThe, Email, DienThoai, HanThe, TrangThaiThe, DuNo
	FROM BanDoc
END

CREATE PROCEDURE sp_GetBanDocById
	@MaBanDoc NVARCHAR(20)
AS
BEGIN
	SELECT MaBanDoc, HoTen, SoThe, Email, DienThoai, HanThe, TrangThaiThe, DuNo
	FROM BanDoc
	WHERE MaBanDoc = @MaBanDoc
END

CREATE PROCEDURE sp_CreateBanDoc
	@MaBanDoc NVARCHAR(20),
	@SoThe NVARCHAR(10),
	@HoTen NVARCHAR(100),
	@Email NVARCHAR(100),
	@DienThoai NVARCHAR(10),
	@HanThe Date,
	@TrangThaiThe NVARCHAR(20),
	@DuNo DECIMAL(12, 2)
AS
BEGIN
	INSERT INTO BanDoc(MaBanDoc, SoThe, HoTen, Email, DienThoai, HanThe, TrangThaiThe, DuNo)
	VALUES(@MaBanDoc, @SoThe, @HoTen, @Email, @DienThoai, @HanThe, @TrangThaiThe, @DuNo)
END

CREATE PROCEDURE sp_UpdateBanDoc
	@MaBanDoc NVARCHAR(20),
	@HoTen NVARCHAR(100),
	@Email NVARCHAR(100),
	@DienThoai NVARCHAR(10),
	@HanThe Date,
	@TrangThaiThe NVARCHAR(20),
	@DuNo DECIMAL(12, 2)
AS
BEGIN
	UPDATE BanDoc
	SET HoTen = @HoTen,
		Email = @Email,
		DienThoai = @DienThoai,
		HanThe = @HanThe,
		TrangThaiThe = @TrangThaiThe,
		DuNo = @DuNo
	WHERE MaBanDoc = @MaBanDoc;
END

CREATE PROCEDURE sp_DeleteBanDoc
	@MaBanDoc NVARCHAR(20)
AS
BEGIN
	DELETE FROM BanDoc
	WHERE MaBanDoc = @MaBanDoc;
END

-- Đăng nhập
CREATE PROCEDURE sp_Login
  @TenDangNhap NVARCHAR(100)
AS
BEGIN
  SET NOCOUNT ON;
  SELECT TOP (1)
    MaTaiKhoan,
    TenDangNhap,
    VaiTro,
    MatKhau          
  FROM dbo.TaiKhoan
  WHERE TenDangNhap = @TenDangNhap;
END
GO
-- Bản sao
CREATE PROCEDURE sp_GetAllBanSao
AS
BEGIN
	SELECT MaBanSao, MaVach, MaSach, MaKe, TrangThai
	FROM BanSao
END

CREATE PROCEDURE sp_GetBanSaoById
	@MaBanSao NVARCHAR(20)
AS
BEGIN
	SELECT MaBanSao, MaVach, MaSach, MaKe, TrangThai
	FROM BanSao
	WHERE MaBanSao = @MaBanSao
END

CREATE PROCEDURE sp_InsertBanSao
	@MaBanSao NVARCHAR(20),
	@MaVach NVARCHAR(64),
	@MaSach NVARCHAR(20),
	@MaKe NVARCHAR(20),
	@TrangThai NVARCHAR(20)
AS
BEGIN
	INSERT INTO BanSao(MaBanSao, MaVach, MaSach, MaKe, TrangThai)
	VALUES(@MaBanSao,@MaVach, @MaSach, @MaKe, @TrangThai)
END

CREATE PROCEDURE sp_UpdateBanSao
	@MaBanSao NVARCHAR(20),
	@MaVach NVARCHAR(64),
	@MaSach NVARCHAR(20),
	@MaKe NVARCHAR(20),
	@TrangThai NVARCHAR(20)
AS
BEGIN
	UPDATE BanSao
	SET MaBanSao = @MaBanSao,
		MaVach = @MaVach,
		MaSach = @MaSach,
		MaKe = @MaKe,
		TrangThai = @TrangThai
	WHERE MaBanSao = @MaBanSao;
END

CREATE PROCEDURE sp_DeleteBanSao
	@MaBanSao NVARCHAR(20)
AS
BEGIN
	DELETE FROM BanSao
	WHERE MaBanSao = @MaBanSao;
END
-- KeSach
CREATE PROCEDURE sp_GetAllKeSach
AS
BEGIN
	SELECT MaKe, ViTri
	FROM KeSach
END
GO
CREATE PROCEDURE sp_GetKeSachById
	@MaKe NVARCHAR(20)
AS
BEGIN
	SELECT MaKe, ViTri
	FROM KeSach
	WHERE MaKe = @MaKe	
END
GO
CREATE PROCEDURE sp_CreateKeSach
	@MaKe NVARCHAR(20),
	@ViTri NVARCHAR(100)
	
AS
BEGIN
	INSERT INTO KeSach(MaKe, ViTri)
	VALUES(@MaKe, @ViTri)
END
GO
CREATE PROCEDURE sp_UpdateKeSach
	@MaKe NVARCHAR(20),
	@ViTri NVARCHAR(100)
AS
BEGIN
	UPDATE KeSach
	SET MaKe = @MaKe,
		ViTri = @ViTri
	WHERE MaKe = @MaKe;
END
GO
CREATE PROCEDURE sp_DeleteKeSach
	@MaKe NVARCHAR(20)
AS
BEGIN
	DELETE FROM KeSach
	WHERE MaKe = @MaKe;
END
GO

CREATE PROCEDURE sp_ThanhToan
  @MaPhieuMuon NVARCHAR(20),
  @NgayTraThucTe DATETIME = NULL,
  @PhiTreHanMoiNgay DECIMAL(12,2) 
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  BEGIN TRY
    BEGIN TRAN;


/* ====== INDEX cần có cho DatCho ====== */
IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'UX_DatCho_Pending' AND object_id = OBJECT_ID('dbo.DatCho')
)
BEGIN
  CREATE UNIQUE INDEX UX_DatCho_Pending
  ON dbo.DatCho (MaBanDoc, MaSach, TrangThai)
  WHERE TrangThai = N'Chờ hàng';
END
GO

IF NOT EXISTS (
  SELECT 1 FROM sys.indexes
  WHERE name = 'IX_DatCho_SachTrangThai' AND object_id = OBJECT_ID('dbo.DatCho')
)
BEGIN
  CREATE INDEX IX_DatCho_SachTrangThai
  ON dbo.DatCho (MaSach, TrangThai, NgayTao);
END
GO

/* ====== STORED PROCEDURES cho Storage ====== */

-- Thêm đặt chỗ (ID do ứng dụng phát sinh)
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_Insert
  @MaDatCho NVARCHAR(20),
  @MaSach    NVARCHAR(20),
  @MaBanDoc  NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  INSERT INTO dbo.DatCho(MaDatCho, MaSach, MaBanDoc, TrangThai)
  VALUES(@MaDatCho, @MaSach, @MaBanDoc, N'Chờ hàng');
END
GO

-- Lấy theo Id
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_GetById
  @MaDatCho NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  SELECT * FROM dbo.DatCho WHERE MaDatCho = @MaDatCho;
END
GO

-- Danh sách (lọc tuỳ chọn)
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_List
  @MaBanDoc  NVARCHAR(20) = NULL,
  @MaSach    NVARCHAR(20) = NULL,
  @TrangThai NVARCHAR(20) = NULL
AS
BEGIN
  SET NOCOUNT ON;
  SELECT *
  FROM dbo.DatCho
  WHERE (@MaBanDoc  IS NULL OR MaBanDoc  = @MaBanDoc)
    AND (@MaSach    IS NULL OR MaSach    = @MaSach)
    AND (@TrangThai IS NULL OR TrangThai = @TrangThai)
  ORDER BY NgayTao ASC; -- FIFO
END
GO

-- Hủy đặt chỗ ('Chờ hàng' hoặc 'Đang giữ')
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_Cancel
  @MaDatCho NVARCHAR(20)
AS
BEGIN
  SET NOCOUNT ON;
  UPDATE dbo.DatCho
  SET TrangThai = N'Đã hủy', GiuDen = NULL
  WHERE MaDatCho = @MaDatCho
    AND TrangThai IN (N'Chờ hàng', N'Đang giữ');
END
GO

-- Chuyển người đầu hàng của 1 cuốn sách sang 'Đang giữ' trong X giờ
-- Trả về MaDatCho được set ready, NULL nếu chưa ai chờ
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_SetReady
  @MaSach      NVARCHAR(20),
  @GiuTrongGio INT = 48
AS
BEGIN
  SET NOCOUNT ON;

  DECLARE @Id NVARCHAR(20);

  SELECT TOP 1 @Id = MaDatCho
  FROM dbo.DatCho WITH (UPDLOCK, ROWLOCK)
  WHERE MaSach = @MaSach AND TrangThai = N'Chờ hàng'
  ORDER BY NgayTao ASC;

  IF @Id IS NOT NULL
  BEGIN
    UPDATE dbo.DatCho
    SET TrangThai = N'Đang giữ',
        GiuDen    = DATEADD(HOUR, @GiuTrongGio, SYSUTCDATETIME())
    WHERE MaDatCho = @Id;

    SELECT @Id AS MaDatChoReady;
  END
  ELSE
    SELECT CAST(NULL AS NVARCHAR(20)) AS MaDatChoReady;
END
GO

-- Chuyển tất cả 'Đang giữ' quá hạn -> 'Hết hạn'
CREATE OR ALTER PROCEDURE dbo.sp_DatCho_ExpireReady
AS
BEGIN
  SET NOCOUNT ON;

  UPDATE dbo.DatCho
  SET TrangThai = N'Hết hạn',
      GiuDen    = NULL
  WHERE TrangThai = N'Đang giữ'
    AND GiuDen IS NOT NULL
    AND GiuDen < SYSUTCDATETIME();

  SELECT @@ROWCOUNT AS SoDongCapNhat;
END
GO


USE QuanLyThuVien;

-- Xem có sách/bạn đọc chưa
SELECT TOP 20 MaSach, TieuDe FROM dbo.Sach ORDER BY MaSach;        -- phải thấy ít nhất 1 mã
SELECT TOP 20 MaBanDoc, HoTen FROM dbo.BanDoc ORDER BY MaBanDoc;    -- phải thấy ít nhất 1 mã

-- Thể loại (Sach.MaTheLoai FK -> TheLoai.MaTheLoai)
IF NOT EXISTS (SELECT 1 FROM TheLoai WHERE MaTheLoai='TL01')
  INSERT INTO TheLoai(MaTheLoai, TenTheLoai) VALUES('TL01', N'Sách tham khảo');

-- Sách
IF NOT EXISTS (SELECT 1 FROM Sach WHERE MaSach='S001')
  INSERT INTO Sach(MaSach, TieuDe, TacGia, MaTheLoai, NamXuatBan, NgonNgu, TomTat)
  VALUES('S001', N'Lập trình C# cơ bản', N'Nguyễn Văn A', 'TL01', 2024, N'vi', N'Sách mẫu');

-- Bạn đọc (chú ý SoThe UNIQUE 10 ký tự, TrangThaiThe theo CHECK)
IF NOT EXISTS (SELECT 1 FROM BanDoc WHERE MaBanDoc='BD05')
  INSERT INTO BanDoc(MaBanDoc, SoThe, HoTen, Email, DienThoai, HanThe, TrangThaiThe, DuNo)
  VALUES('BD05','ST00000005',N'Phạm B','b@example.com','0900000005','2026-12-31',N'Hoạt động',0);

    DECLARE @MaBanDoc NVARCHAR(20),
            @MaSach NVARCHAR(20),
            @HanTra DATETIME,
            @NgayTra DATETIME,
            @DaysLate INT,
            @SoTien DECIMAL(12,2);

    SELECT @MaBanDoc = MaBanDoc,
           @MaSach   = MaSach,
           @HanTra   = HanTra
    FROM PhieuMuon WITH (UPDLOCK, ROWLOCK)
    WHERE MaPhieuMuon = @MaPhieuMuon;


    IF @MaBanDoc IS NULL
      THROW 50001, N'Không tìm thấy phiếu mượn.', 1;

    SET @NgayTra = ISNULL(@NgayTraThucTe, SYSUTCDATETIME());

    UPDATE PhieuMuon
    SET NgayTraThucTe = @NgayTra,
        TrangThai     = N'Đã trả'
    WHERE MaPhieuMuon = @MaPhieuMuon;

    -- Quy tắc đếm ngày trễ: tính theo mốc nửa đêm (floor). Nếu muốn "trễ 1 giờ cũng tính 1 ngày", xem Cách 1B bên dưới.
    SET @DaysLate = DATEDIFF(DAY, @HanTra, @NgayTra);
    IF @DaysLate < 0 SET @DaysLate = 0;

    IF @DaysLate > 0
    BEGIN
      SET @SoTien = @DaysLate * @PhiTreHanMoiNgay;

      INSERT INTO Phat(MaPhat, MaPhieuMuon, SoTien, LyDo, NgayTinh, TrangThai, MaThanhToan)
      VALUES(CONCAT('PP', FORMAT(SYSUTCDATETIME(), 'yyyyMMddHHmmssfff')),
            @MaPhieuMuon, @SoTien, N'Trễ hạn', SYSUTCDATETIME(), N'Chưa trả', NULL);
    END

    COMMIT;
  END TRY
  BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK;
    THROW;
  END CATCH
END
GO



EXEC sp_Login letienlinh2005

	



SELECT * FROM TaiKhoan