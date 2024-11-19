import { GetServerSideProps } from 'next';
import supabase from '../lib/supabase';

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;  
}

interface ProjectsProps {
  projects: Project[];
}

const Projects = ({ projects }: ProjectsProps) => {
  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <p><strong>Created At:</strong> {project.created_at}</p> {/* created_at の表示 */}
          </li>
        ))}
      </ul>
    </div>
  );
};

// サーバーサイドでSupabaseからプロジェクトを取得する
export const getServerSideProps: GetServerSideProps = async () => {
  const { data: projects, error } = await supabase.from('projects').select('*');
  if (error) {
    console.error(error);
    return { props: { projects: [] } };
  }
  return { props: { projects } };
};

export default Projects;
