namespace TaskApi.Models
{
    public class TaskItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; } // "Đang làm" hoặc "Hoàn thành"
        public DateTime CreatedDate { get; set; }
    }

    public class CreateTaskDto
    {
        public string Name { get; set; }
        public DateTime DueDate { get; set; }
    }

    public class UpdateTaskDto
    {
        public string Name { get; set; }
        public DateTime DueDate { get; set; }
        public string Status { get; set; }
    }
}
