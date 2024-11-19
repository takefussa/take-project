import { GetServerSideProps } from 'next';
import supabase from '../lib/supabase';


interface Task {
  id: number;
  project_id: number;
  title: string;
  status: string;
  priority: number;
  created_at: string;
}

interface TasksProps {
  tasks: Task[];
}

const Tasks = ({ tasks }: TasksProps) => {
  return (
    <div>
      <h1>Tasks</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h2>{task.title}</h2>
            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p> {/* priorityを表示 */}
            <p>Project ID: {task.project_id}</p>
            <p>Created at: {new Date(task.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

// サーバーサイドでSupabaseからタスクを取得する
export const getServerSideProps: GetServerSideProps = async () => {
  const { data: tasks, error } = await supabase.from('tasks').select('*');
  if (error) {
    console.error(error);
    return { props: { tasks: [] } };
  }
  return { props: { tasks } };
};

export default Tasks;
