import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  List,
  ListItem,
  Input,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon, AddIcon, CloseIcon } from '@chakra-ui/icons';
import { FaHome, FaProjectDiagram } from 'react-icons/fa';
import supabase from '../libs/supabase'; // Supabase クライアントをインポート

interface Task {
  id: number;
  name: string;
  status: 'Todo' | 'In Progress' | 'Done';
  project_id: number;
}

interface Project {
  id: number;
  name: string;
  tasks: Task[];
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectListVisible, setIsProjectListVisible] = useState(false);
  const [selectedPage, setSelectedPage] = useState<'Home' | 'Project' | null>('Home');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newTaskName, setNewTaskName] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    const fetchProjectsAndTasks = async () => {
      const { data: projectsData, error: projectsError } = await supabase.from('projects').select('*');
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        toast({
          title: 'Error',
          description: 'プロジェクトの取得に失敗しました。',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const { data: tasksData, error: tasksError } = await supabase.from('tasks').select('*');
      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
        toast({
          title: 'Error',
          description: 'タスクの取得に失敗しました。',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const projectsWithTasks = projectsData.map((project: Project) => ({
        ...project,
        tasks: tasksData.filter((task: Task) => task.project_id === project.id) || [],
      }));

      setProjects(projectsWithTasks);
    };

    fetchProjectsAndTasks();
  }, []);

  const updateTaskStatus = async (taskId: number, currentStatus: 'Todo' | 'In Progress' | 'Done', projectId: number) => {
    const nextStatus = currentStatus === 'Todo' ? 'In Progress' : currentStatus === 'In Progress' ? 'Done' : 'Todo';

    const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', taskId);
    if (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: 'タスクのステータス更新に失敗しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status: nextStatus } : task
              ),
            }
          : project
      )
    );

    toast({
      title: 'Updated',
      description: `タスクのステータスが「${nextStatus}」に更新されました。`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const addProject = async () => {
    if (!newProjectName.trim()) {
      toast({
        title: 'Error',
        description: 'プロジェクト名を入力してください。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{ name: newProjectName.trim() }])
      .select();

    if (error) {
      console.error('Error adding project:', error);
      toast({
        title: 'Error',
        description: 'プロジェクトの追加に失敗しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects([...projects, ...data.map((project: Project) => ({ ...project, tasks: [] }))]);
    setNewProjectName('');
    toast({
      title: 'Success',
      description: `プロジェクト「${newProjectName}」が追加されました。`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteProject = async (projectId: number) => {
    const { error: tasksError } = await supabase.from('tasks').delete().eq('project_id', projectId);
    if (tasksError) {
      console.error('Error deleting tasks:', tasksError);
      toast({
        title: 'Error',
        description: 'タスクの削除に失敗しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { error: projectError } = await supabase.from('projects').delete().eq('id', projectId);
    if (projectError) {
      console.error('Error deleting project:', projectError);
      toast({
        title: 'Error',
        description: 'プロジェクトの削除に失敗しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    if (selectedProjectId === projectId) setSelectedProjectId(null);
    toast({
      title: 'Deleted',
      description: 'プロジェクトとそのタスクが削除されました。',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const addTask = async (taskName: string, projectId: number) => {
    if (!taskName.trim()) {
      toast({
        title: 'Error',
        description: 'タスク名を入力してください。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ name: taskName.trim(), project_id: projectId, status: 'Todo' }])
      .select();

    if (error) {
      console.error('Error adding task:', error);
      toast({
        title: 'Error',
        description: 'タスクの追加に失敗しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: [...(project.tasks || []), ...data] }
          : project
      )
    );
    setNewTaskName('');
    toast({
      title: 'Success',
      description: 'タスクが追加されました。',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const deleteTask = async (taskId: number, projectId: number) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'タスクの削除に失敗しました。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            }
          : project
      )
    );

    toast({
      title: 'Deleted',
      description: 'タスクが削除されました。',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const renderHomePage = () => (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Home
      </Text>
      <List spacing={4}>
        {projects.map((project) => (
          <ListItem
            key={project.id}
            p={4}
            bg="gray.100"
            borderRadius="md"
            boxShadow="sm"
            onClick={() => {
              setSelectedPage('Project');
              setSelectedProjectId(project.id);
            }}
            cursor="pointer"
          >
            <HStack justify="space-between">
              <Box>
                <Text fontWeight="bold">{project.name}</Text>
                <Text>
                  Todo: {project.tasks?.filter((task) => task.status === 'Todo').length || 0} | In Progress:{' '}
                  {project.tasks?.filter((task) => task.status === 'In Progress').length || 0} | Done:{' '}
                  {project.tasks?.filter((task) => task.status === 'Done').length || 0}
                </Text>
              </Box>
              <IconButton
                aria-label="Delete Project"
                icon={<CloseIcon />}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
              />
            </HStack>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderProjectPage = () => (
    <Box>
      {projects
        .filter((project) => project.id === selectedProjectId)
        .map((project) => (
          <Box key={project.id}>
            <Text fontSize="2xl" fontWeight="bold" mb={4}>
              {project.name}
            </Text>
            <HStack spacing={2} mb={4}>
              <Input
                placeholder="タスク名"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                bg="white"
              />
              <Button
                colorScheme="teal"
                leftIcon={<AddIcon />}
                onClick={() => addTask(newTaskName, project.id)}
              >
                Add Task
              </Button>
            </HStack>
            <HStack spacing={8} align="start">
              {['Todo', 'In Progress', 'Done'].map((status) => (
                <Box key={status} w="33%">
                  <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
                    {status}
                  </Text>
                  <List spacing={2}>
                    {project.tasks
                      ?.filter((task) => task.status === status)
                      .map((task) => (
                        <ListItem
                          key={task.id}
                          p={4}
                          bg="gray.100"
                          borderRadius="md"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          cursor="pointer"
                          boxShadow="sm"
                          onClick={() => updateTaskStatus(task.id, task.status, project.id)}
                        >
                          <Text>{task.name}</Text>
                          <IconButton
                            aria-label="Delete Task"
                            icon={<CloseIcon />}
                            size="xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTask(task.id, project.id);
                            }}
                          />
                        </ListItem>
                      ))}
                  </List>
                </Box>
              ))}
            </HStack>
          </Box>
        ))}
    </Box>
  );

  return (
    <HStack h="100vh" spacing={0} align="start">
      <VStack bg="gray.200" w="240px" h="100%" spacing={4} align="stretch" p={4}>
        <Text fontSize="xl" fontWeight="bold">Task管理</Text>
        <List spacing={2}>
          <ListItem
            bg="white"
            _hover={{ bg: 'gray.100' }}
            p={2}
            borderRadius="md"
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => {
              setSelectedPage('Home');
              setSelectedProjectId(null);
            }}
          >
            <FaHome style={{ marginRight: '8px' }} />
            <Text>Home</Text>
          </ListItem>
          <ListItem
            bg="white"
            _hover={{ bg: 'gray.100' }}
            p={2}
            borderRadius="md"
            display="flex"
            alignItems="center"
            cursor="pointer"
            onClick={() => setIsProjectListVisible(!isProjectListVisible)}
          >
            <FaProjectDiagram style={{ marginRight: '8px' }} />
            <Text>Project</Text>
            {isProjectListVisible ? <ChevronDownIcon ml="auto" /> : <ChevronRightIcon ml="auto" />}
          </ListItem>
          {isProjectListVisible &&
            projects.map((project) => (
              <ListItem
                key={project.id}
                bg={selectedProjectId === project.id ? 'pink.100' : 'white'}
                _hover={{ bg: 'gray.100' }}
                p={2}
                borderRadius="md"
                display="flex"
                alignItems="center"
                cursor="pointer"
                onClick={() => {
                  setSelectedPage('Project');
                  setSelectedProjectId(project.id);
                }}
              >
                <Text>{project.name}</Text>
              </ListItem>
            ))}
        </List>
        <Box mt={4} bg="white" p={2} borderRadius="md">
          <Input
            placeholder="プロジェクト名"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            mb={2}
            bg="white"
          />
          <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={addProject}>
            Add Project
          </Button>
        </Box>
      </VStack>
      <Box flex={1} p={4} bg="white">
        {selectedPage === 'Home' && renderHomePage()}
        {selectedPage === 'Project' && renderProjectPage()}
      </Box>
    </HStack>
  );
}


