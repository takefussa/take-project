import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
} from '@chakra-ui/react';

interface Task {
  id: number;
  name: string;
  status: 'In Progress' | 'Todo' | 'Done';
}

export default function ProjectDetail() {
  const router = useRouter();
  const [projectName, setProjectName] = useState<string>('Loading...');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState<string>('');
  const toast = useToast();

  useEffect(() => {
    if (router.query.name) {
      const name = router.query.name as string;
      setProjectName(name);

      const savedTasks = localStorage.getItem(`tasks-${name}`);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    }
  }, [router.query.name]);

  useEffect(() => {
    localStorage.setItem(`tasks-${projectName}`, JSON.stringify(tasks));
  }, [tasks, projectName]);

  const addTask = () => {
    if (!newTaskName.trim()) {
      toast({
        title: 'Error',
        description: 'Task name cannot be empty.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newTask: Task = {
      id: Date.now(),
      name: newTaskName.trim(),
      status: 'Todo',
    };
    setTasks([...tasks, newTask]);
    setNewTaskName('');
    toast({
      title: 'Success',
      description: `Task "${newTask.name}" added.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        {projectName}
      </Text>
      <HStack spacing={2} mb={4}>
        <Input
          placeholder="Enter task name"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
        />
        <Button colorScheme="teal" onClick={addTask}>
          Add Task
        </Button>
      </HStack>
      <List spacing={4}>
        {tasks.map((task) => (
          <ListItem key={task.id} p={4} bg="white" borderRadius="md" boxShadow="sm">
            {task.name}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
