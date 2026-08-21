namespace backend.DTOs;

public class HabitCardResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int Streak { get; set; }
    public List<HabitDayStatusResponse> Days { get; set; } = new();
}