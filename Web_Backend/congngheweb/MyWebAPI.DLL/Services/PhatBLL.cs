
﻿using Microsoft.Data.SqlClient;
using MyWebAPI.DAL.Repositories;
using MyWebAPI.DTO;
using static MyWebAPI.DAL.Repositories.PhatDAL;
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace MyWebAPI.BLL.Services
{
    public class PhatBLL
    {
        public interface IPhatService
        {
            Task<ResponseDTO<List<GetAllPhatDTO>>> GetAllAsync();
            Task<ResponseDTO<List<GetPhatByMaBanDocDTO>>> GetPhatByMaBanDocAsync(string maBanDoc);
            Task<TraSachResultDTO> TraSachVaTinhPhatAsync(TraSachDTO dto);
            Task<ResponseDTO<bool>> ThanhToanAsync(ThanhToanRequest dto);
        }

        public class PhatService : IPhatService
        {
            private readonly IPhatRepository _repo;
            public PhatService(IPhatRepository repo) => _repo = repo;

            public async Task<ResponseDTO<List<GetAllPhatDTO>>> GetAllAsync()
            {
                try
                {
                    var data = await _repo.GetAllAsync();

                    return new ResponseDTO<List<GetAllPhatDTO>>
                    {
                        Success = true,
                        Message = "Lấy danh sách phạt thành công",
                        Data = data
                    };
                }
                catch (Exception ex)
                {
                    return new ResponseDTO<List<GetAllPhatDTO>>
                    {
                        Success = false,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            public async Task<ResponseDTO<List<GetPhatByMaBanDocDTO>>> GetPhatByMaBanDocAsync(string maBanDoc)
            {
                try
                {
                    var data = await _repo.GetPhatByMaBanDocAsync(maBanDoc);

                    return new ResponseDTO<List<GetPhatByMaBanDocDTO>>
                    {
                        Success = true,
                        Message = "Lấy danh sách phạt thành công",
                        Data = data
                    };
                }
                catch (Exception ex)
                {
                    return new ResponseDTO<List<GetPhatByMaBanDocDTO>>
                    {
                        Success = false,
                        Message = ex.Message,
                        Data = null
                    };
                }
            }

            public async Task<TraSachResultDTO> TraSachVaTinhPhatAsync(TraSachDTO dto)
            {
                var (soNgayTre, tienPhat, maPhat) = await _repo.TraSachVaTinhPhatAsync(dto);
                return new TraSachResultDTO
                {
                    MaPhieuMuon = dto.MaPhieuMuon,
                    SoNgayTre = soNgayTre,
                    TienPhat = tienPhat,
                    MaPhat = maPhat
                };
            }
            public async Task<ResponseDTO<bool>> ThanhToanAsync(ThanhToanRequest dto)
            {
                try
                {
                    var result = await _repo.ThanhToanAsync(dto);

                    return new ResponseDTO<bool>
                    {
                        Success = result,
                        Message = result ? "Thanh toán thành công" : "Thanh toán thất bại",
                        Data = result
                    };
                }
                catch (Exception ex)
                {
                    return new ResponseDTO<bool>
                    {
                        Success = false,
                        Message = ex.Message,
                        Data = false
                    };
                }
            }
        }
    }
}
