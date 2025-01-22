import { useState } from 'react';
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

interface Task {
  id: number;
  name: string;
  status: 'Todo' | 'In Progress' | 'Done';
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

  // プロジェクト追加
  const addProject = () => {
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
    const newProject: Project = {
      id: Date.now(),
      name: newProjectName.trim(),
      tasks: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectName('');
    toast({
      title: 'Success',
      description: `プロジェクト「${newProject.name}」が追加されました。`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // プロジェクト削除
  const deleteProject = (projectId: number) => {
    setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
    if (selectedProjectId === projectId) setSelectedProjectId(null);
    toast({
      title: 'Deleted',
      description: 'プロジェクトが削除されました。',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  // タスク追加
  const addTask = () => {
    if (!newTaskName.trim() || selectedProjectId === null) {
      toast({
        title: 'Error',
        description: 'プロジェクトを選択し、タスク名を入力してください。',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === selectedProjectId
          ? {
              ...project,
              tasks: [
                ...project.tasks,
                { id: Date.now(), name: newTaskName.trim(), status: 'Todo' },
              ],
            }
          : project
      )
    );
    setNewTaskName('');
    toast({
      title: 'Task Added',
      description: 'タスクが追加されました。',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // タスク削除
  const deleteTask = (projectId: number, taskId: number) => {
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

  // タスク状態変更
  const moveTask = (projectId: number, taskId: number, newStatus: Task['status']) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, status: newStatus } : task
              ),
            }
          : project
      )
    );
  };

  // プロジェクトのタスク数をカウント
  const countTasksByStatus = (tasks: Task[], status: Task['status']) => {
    return tasks.filter((task) => task.status === status).length;
  };

  const selectedProject = projects.find((project) => project.id === selectedProjectId);

  // ホームページ描画
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
                  Todo: {countTasksByStatus(project.tasks, 'Todo')} | In Progress:{' '}
                  {countTasksByStatus(project.tasks, 'In Progress')} | Done:{' '}
                  {countTasksByStatus(project.tasks, 'Done')}
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

  // プロジェクトページ描画
  const renderProjectPage = () => (
    <Box>
      {selectedProject && (
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            {selectedProject.name}
          </Text>
          {/* タスク追加 */}
          <HStack spacing={2} mb={4}>
            <Input
              placeholder="タスク名"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              bg="white"
            />
            <Button colorScheme="teal" leftIcon={<AddIcon />} onClick={addTask}>
              Add Task
            </Button>
          </HStack>
          {/* タスク表示 */}
          <HStack spacing={8} align="start">
            {['Todo', 'In Progress', 'Done'].map((status) => (
              <Box key={status} w="33%">
                <Text fontSize="lg" fontWeight="bold" mb={4} textAlign="center">
                  {status}
                </Text>
                <List spacing={2}>
                  {selectedProject.tasks
                    .filter((task) => task.status === status)
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
                        onClick={() =>
                          moveTask(
                            selectedProject.id,
                            task.id,
                            status === 'Todo'
                              ? 'In Progress'
                              : status === 'In Progress'
                              ? 'Done'
                              : 'Todo'
                          )
                        }
                      >
                        <Text>{task.name}</Text>
                        <IconButton
                          aria-label="Delete Task"
                          icon={<CloseIcon />}
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTask(selectedProject.id, task.id);
                          }}
                        />
                      </ListItem>
                    ))}
                </List>
              </Box>
            ))}
          </HStack>
        </>
      )}
    </Box>
  );

  return (
    <HStack h="100vh" spacing={0} align="start">
      {/* 左メニュー */}
      <VStack bg="gray.200" w="240px" h="100%" spacing={4} align="stretch" p={4}>
        <Text fontSize="xl" fontWeight="bold">
          Task管理
        </Text>
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
                p={2}
                pl={8}
                bg="white"
                borderRadius="md"
                _hover={{ bg: 'pink.300' }}
                cursor="pointer"
                onClick={() => {
                  setSelectedPage('Project');
                  setSelectedProjectId(project.id);
                }}
              >
                {project.name}
              </ListItem>
            ))}
        </List>
        {/* プロジェクト追加 */}
        {isProjectListVisible && (
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
        )}
      </VStack>

      {/* メインコンテンツ */}
      <Box flex={1} p={4} bg="white">
        {selectedPage === 'Home' && renderHomePage()}
        {selectedPage === 'Project' && renderProjectPage()}
      </Box>
    </HStack>
  );
}
