using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MyWebAPI.BLL.Services
{
    public interface ITonKhoService
    {
        Task<ResponseDTO<List<TonKhoTheoTheLoaiDTO>>> GetTonKhoTheoTheLoaiAsync();
        Task<ResponseDTO<List<TonKhoTheoSachDTO>>> GetTonKhoTheoSachAsync();
    }

    public class TonKhoService : ITonKhoService
    {
        private readonly ITonKhoRepository _repo;

        public TonKhoService(ITonKhoRepository repo)
        {
            _repo = repo;
        }

        public async Task<ResponseDTO<List<TonKhoTheoTheLoaiDTO>>> GetTonKhoTheoTheLoaiAsync()
        {
            var res = new ResponseDTO<List<TonKhoTheoTheLoaiDTO>>();

            try
            {
                var data = await _repo.GetTonKhoTheoTheLoaiAsync();
                res.Success = true;
                res.Message = "Lấy báo cáo tồn kho theo thể loại thành công.";
                res.Data = data;
            }
            catch (Exception ex)
            {
                res.Success = false;
                res.Message = "Lỗi khi lấy báo cáo tồn kho theo thể loại: " + ex.Message;
                res.Data = new List<TonKhoTheoTheLoaiDTO>();
            }

            return res;
        }

        public async Task<ResponseDTO<List<TonKhoTheoSachDTO>>> GetTonKhoTheoSachAsync()
        {
            var res = new ResponseDTO<List<TonKhoTheoSachDTO>>();

            try
            {
                var data = await _repo.GetTonKhoTheoSachAsync();
                res.Success = true;
                res.Message = "Lấy báo cáo tồn kho theo sách thành công.";
                res.Data = data;
            }
            catch (Exception ex)
            {
                res.Success = false;
                res.Message = "Lỗi khi lấy báo cáo tồn kho theo sách: " + ex.Message;
                res.Data = new List<TonKhoTheoSachDTO>();
            }

            return res;
        }
    }
}
