using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class HabitCompletion
    {
        public int Id { get; set; }

        public int HabitId { get; set; }

        [ForeignKey(nameof(HabitId))]
        public Habit Habit { get; set; } = null!;

        public DateOnly Date { get; set; }
    }
}