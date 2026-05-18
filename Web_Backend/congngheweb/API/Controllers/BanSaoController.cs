using Microsoft.AspNetCore.Authorization;
﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MyWebAPI.BLL.Services;
using MyWebAPI.DTO;
using System.Data;
using System.Reflection;

namespace MyWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BanSaoController : ControllerBase
    {
        private readonly IBanSaoService _banSaoService;

        public BanSaoController(IBanSaoService banSaoService)
        {
            _banSaoService = banSaoService;
        }

        // GET api/bansao
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var response = await _banSaoService.GetAllAsync();

            if (response.Success)
                return Ok(response);

            return StatusCode(500, response);
        }

        // GET api/bansao/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var response = await _banSaoService.GetByIdAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // POST api/bansao
        //[Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBanSaoRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _banSaoService.CreateAsync(request);

            if (response.Success)
                return Ok(response);

            return BadRequest(response);
        }

        // PUT api/bansao/{id}
        //[Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] UpdateBanSaoRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _banSaoService.UpdateAsync(id, request);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        // DELETE api/bansao/{id}
        //[Authorize(Roles = "Quản trị, Thủ thư")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var response = await _banSaoService.DeleteAsync(id);

            if (response.Success)
                return Ok(response);

            return NotFound(response);
        }

        [HttpGet("by-sach/{maSach}")]
        public async Task<IActionResult> GetByMaSach(string maSach)
        {
            var list = await _banSaoService.GetByMaSachAsync(maSach);
            return Ok(list);
        }
    }
}


