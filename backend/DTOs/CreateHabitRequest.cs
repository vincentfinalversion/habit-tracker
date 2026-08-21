using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateHabitRequest
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = null!;
}