namespace backend.DTOs;

public class HabitDayStatusResponse
{
    public DateOnly Date { get; set; }
    public bool Completed { get; set; }
    public bool IsFuture { get; set; }
}