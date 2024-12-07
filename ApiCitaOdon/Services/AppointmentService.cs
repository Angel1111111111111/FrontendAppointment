using ApiCitaOdon.Data;
using ApiCitaOdon.Models;
using ApiCitaOdon.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ApiCitaOdon.Services;

public class AppointmentService : IAppointmentService
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;

    public AppointmentService(ApplicationDbContext context, IEmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync()
    {
        return await _context.Appointments
            .Include(a => a.User)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetUserAppointmentsAsync(int userId)
    {
        return await _context.Appointments
            .Where(a => a.UserId == userId)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();
    }

    public async Task<IEnumerable<Appointment>> GetDailyAppointmentsAsync(DateTime date)
    {
        return await _context.Appointments
            .Where(a => a.AppointmentDate.Date == date.Date)
            .Include(a => a.User)
            .OrderBy(a => a.AppointmentDate)
            .ToListAsync();
    }

    public async Task<Appointment> CreateAppointmentAsync(int userId, AppointmentDto model)
    {
        if (!await IsTimeSlotAvailableAsync(model.AppointmentDate))
        {
            throw new InvalidOperationException("El horario seleccionado no está disponible");
        }

        if (model.AppointmentDate < DateTime.Now)
        {
            throw new InvalidOperationException("No se pueden crear citas en fechas pasadas");
        }

        var appointment = new Appointment
        {
            UserId = userId,
            AppointmentDate = model.AppointmentDate,
            TreatmentType = model.TreatmentType,
            Notes = model.Notes,
            Status = "Pendiente"
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        // Obtener información del usuario para el correo
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            await _emailService.SendAppointmentConfirmationAsync(
                user.Email,
                user.FirstName,
                appointment.AppointmentDate,
                appointment.TreatmentType);
        }

        return appointment;
    }

    public async Task<Appointment> UpdateAppointmentAsync(int userId, int appointmentId, AppointmentDto model)
    {
        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.UserId == userId);

        if (appointment == null)
        {
            throw new KeyNotFoundException("Cita no encontrada");
        }

        if (appointment.Status == "Cancelada")
        {
            throw new InvalidOperationException("No se puede modificar una cita cancelada");
        }

        if (!await IsTimeSlotAvailableAsync(model.AppointmentDate, appointmentId))
        {
            throw new InvalidOperationException("El horario seleccionado no está disponible");
        }

        appointment.AppointmentDate = model.AppointmentDate;
        appointment.TreatmentType = model.TreatmentType;
        appointment.Notes = model.Notes;

        await _context.SaveChangesAsync();
        return appointment;
    }

    public async Task<bool> CancelAppointmentAsync(int userId, int appointmentId)
    {
        var appointment = await _context.Appointments
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.UserId == userId);

        if (appointment == null)
        {
            return false;
        }

        if (appointment.Status == "Cancelada")
        {
            throw new InvalidOperationException("La cita ya está cancelada");
        }

        appointment.Status = "Cancelada";
        await _context.SaveChangesAsync();

        // Notificar al usuario por correo
        var user = await _context.Users.FindAsync(userId);
        if (user != null)
        {
            await _emailService.SendAppointmentCancellationAsync(
                user.Email,
                user.FirstName,
                appointment.AppointmentDate);
        }

        return true;
    }

    public async Task<Appointment> GetAppointmentByIdAsync(int userId, int appointmentId)
    {
        return await _context.Appointments
            .FirstOrDefaultAsync(a => a.Id == appointmentId && a.UserId == userId);
    }

    public async Task<Appointment> UpdateStatusAsync(int appointmentId, string status)
    {
        var appointment = await _context.Appointments
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == appointmentId);

        if (appointment == null)
        {
            throw new KeyNotFoundException("Cita no encontrada");
        }

        var validStatuses = new[] { "Pendiente", "En Proceso", "Completada", "Cancelada" };
        if (!validStatuses.Contains(status))
        {
            throw new InvalidOperationException("Estado no válido");
        }

        appointment.Status = status;
        await _context.SaveChangesAsync();

        // Notificar al paciente si la cita se cancela o completa
        if (status == "Cancelada")
        {
            await _emailService.SendAppointmentCancellationAsync(
                appointment.User.Email,
                appointment.User.FirstName,
                appointment.AppointmentDate);
        }

        return appointment;
    }

    public async Task<bool> IsTimeSlotAvailableAsync(DateTime dateTime, int? excludeAppointmentId = null)
    {
        // Verificar si hay citas en el mismo horario (considerando duración de 1 hora)
        var conflictingAppointment = await _context.Appointments
            .Where(a => a.Status != "Cancelada")
            .Where(a => a.Id != excludeAppointmentId)
            .Where(a => a.AppointmentDate <= dateTime &&
                       a.AppointmentDate.AddHours(1) > dateTime)
            .AnyAsync();

        return !conflictingAppointment;
    }
}