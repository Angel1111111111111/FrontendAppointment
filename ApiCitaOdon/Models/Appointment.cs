using System.ComponentModel.DataAnnotations;

namespace ApiCitaOdon.Models;

public class Appointment
{
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }
    public User User { get; set; }

    [Required]
    [DataType(DataType.DateTime)]
    public DateTime AppointmentDate { get; set; }

    [Required]
    [StringLength(100)]
    public string TreatmentType { get; set; }

    [StringLength(500)]
    public string? Notes { get; set; }

    [Required]
    public string Status { get; set; } = "Pendiente";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}