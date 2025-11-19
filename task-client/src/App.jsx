import { CheckCircle, Clock, Edit2, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000/api/tasks';

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let url = API_URL;
      if (filter !== 'Tất cả') {
        url = `${API_URL}/filter/${encodeURIComponent(filter)}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Lỗi khi tải tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskName.trim() || !dueDate) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taskName,
          dueDate: new Date(dueDate).toISOString()
        })
      });
      if (response.ok) {
        setTaskName('');
        setDueDate('');
        fetchTasks();
      }
    } catch (error) {
      console.error('Lỗi khi thêm task:', error);
    }
  };

  // Update task
  const handleUpdateTask = async (id) => {
    if (!editName.trim()) {
      alert('Tên task không được trống');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          dueDate: new Date(editDueDate).toISOString(),
          status: tasks.find(t => t.id === id)?.status || 'Đang làm'
        })
      });
      if (response.ok) {
        setEditingId(null);
        fetchTasks();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật task:', error);
    }
  };

  // Delete task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa task này?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Lỗi khi xóa task:', error);
    }
  };

  // Toggle status
  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Đang làm' ? 'Hoàn thành' : 'Đang làm';
    try {
      const response = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: task.name,
          dueDate: task.dueDate,
          status: newStatus
        })
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const filteredTasks = filter === 'Tất cả' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Quản Lý Task</h1>
          <p className="text-gray-600">Quản lý công việc cá nhân của bạn một cách hiệu quả</p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={handleAddTask} className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thêm Task Mới</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Tên task..."
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Thêm Task
          </button>
        </form>

        {/* Filter */}
        <div className="flex gap-2 mb-6">
          {['Tất cả', 'Đang làm', 'Hoàn thành'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Đang tải...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Không có task nào</div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                className={`bg-white rounded-lg shadow p-4 flex items-center gap-4 transition ${task.status === 'Hoàn thành' ? 'opacity-75' : ''
                  }`}
              >
                {/* Status Toggle */}
                <button
                  onClick={() => handleToggleStatus(task)}
                  className={`flex-shrink-0 transition ${task.status === 'Hoàn thành' ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'
                    }`}
                >
                  {task.status === 'Hoàn thành' ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Clock size={24} />
                  )}
                </button>

                {/* Task Info */}
                <div className="flex-grow">
                  {editingId === task.id ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={editDueDate.split('T')[0]}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="w-full px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ) : (
                    <>
                      <p className={`font-semibold ${task.status === 'Hoàn thành' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                        {task.name}
                      </p>
                      <p className="text-sm text-gray-500">Hạn: {formatDate(task.dueDate)}</p>
                    </>
                  )}
                </div>

                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${task.status === 'Hoàn thành'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {task.status}
                </span>

                {/* Actions */}
                <div className="flex gap-2">
                  {editingId === task.id ? (
                    <>
                      <button
                        onClick={() => handleUpdateTask(task.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(task.id);
                          setEditName(task.name);
                          setEditDueDate(task.dueDate);
                        }}
                        className="text-blue-500 hover:text-blue-700 transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;