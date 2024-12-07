using ApiCitaOdon.Models;
using System.Threading.Tasks;

namespace ApiCitaOdon.Services.Interfaces
{
    public interface IAppointmentService
    {
        Task<IEnumerable<Appointment>> GetUserAppointmentsAsync(int userId);
        Task<IEnumerable<Appointment>> GetDailyAppointmentsAsync(DateTime date);
        Task<Appointment> CreateAppointmentAsync(int userId, AppointmentDto model);
        Task<Appointment> UpdateAppointmentAsync(int userId, int appointmentId, AppointmentDto model);
        Task<bool> CancelAppointmentAsync(int userId, int appointmentId);
        Task<bool> IsTimeSlotAvailableAsync(DateTime dateTime, int? excludeAppointmentId = null);
        Task<Appointment> GetAppointmentByIdAsync(int userId, int appointmentId);
        Task<Appointment> UpdateStatusAsync(int appointmentId, string status);
        Task<IEnumerable<Appointment>> GetAllAppointmentsAsync();
    }
}
