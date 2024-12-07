using ApiCitaOdon.Services.Interfaces;
using ApiCitaOdon.Models;
using ApiCitaOdon.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using ApiCitaOdon.Models.DTOs;

namespace ApiCitaOdon.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AppointmentController : ControllerBase
{
    private readonly IAppointmentService _appointmentService;

    public AppointmentController(IAppointmentService appointmentService)
    {
        _appointmentService = appointmentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetMyAppointments()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var appointments = await _appointmentService.GetUserAppointmentsAsync(userId);
        return Ok(appointments);
    }

    [HttpGet("all")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAllAppointments()
    {
        var appointments = await _appointmentService.GetAllAppointmentsAsync();
        return Ok(appointments);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetAppointmentById(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var appointment = await _appointmentService.GetAppointmentByIdAsync(userId, id);

            if (appointment == null)
            {
                return NotFound("Cita no encontrada");
            }

            return Ok(appointment);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpGet("daily/{date}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetDailyAppointments(DateTime date)
    {
        var appointments = await _appointmentService.GetDailyAppointmentsAsync(date);
        return Ok(appointments);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAppointment(AppointmentDto model)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var appointment = await _appointmentService.CreateAppointmentAsync(userId, model);
            return CreatedAtAction(nameof(GetMyAppointments), new { id = appointment.Id }, appointment);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{id}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto model)
    {
        try
        {
            var appointment = await _appointmentService.UpdateStatusAsync(id, model.Status);
            return Ok(appointment);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Cita no encontrada");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAppointment(int id, AppointmentDto model)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var appointment = await _appointmentService.UpdateAppointmentAsync(userId, id, model);
            return Ok(appointment);
        }
        catch (KeyNotFoundException)
        {
            return NotFound("Cita no encontrada");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelAppointment(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var result = await _appointmentService.CancelAppointmentAsync(userId, id);

            if (!result)
            {
                return NotFound("Cita no encontrada");
            }

            return Ok("Cita cancelada exitosamente");
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("available")]
    public async Task<IActionResult> CheckAvailability([FromQuery] DateTime dateTime)
    {
        var isAvailable = await _appointmentService.IsTimeSlotAvailableAsync(dateTime);
        return Ok(new { IsAvailable = isAvailable });
    }
}