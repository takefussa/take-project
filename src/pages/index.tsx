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
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import { FaHome, FaProjectDiagram } from 'react-icons/fa';

interface Project {
  id: number;
  name: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]); // プロジェクトリスト
  const [isProjectListVisible, setIsProjectListVisible] = useState(false); // Projectリストの表示制御
  const [newProjectName, setNewProjectName] = useState<string>(''); // 入力用
  const toast = useToast();

  const addProject = () => {
    if (!newProjectName.trim()) {
      toast({
        title: 'Error',
        description: 'Project name cannot be empty.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newProject: Project = {
      id: Date.now(),
      name: newProjectName.trim(),
    };
    setProjects([...projects, newProject]); // プロジェクトリストに追加
    setNewProjectName(''); // 入力欄をクリア
    toast({
      title: 'Success',
      description: `Project "${newProject.name}" added.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <HStack h="100vh" spacing={0} align="start">
      {/* 左メニュー */}
      <VStack
        bg="gray.200"
        w="240px"
        h="100%"
        spacing={4}
        align="stretch"
        p={4}
      >
        <Text fontSize="xl" fontWeight="bold">
          Task管理
        </Text>
        <List spacing={2}>
          {/* Home ボタン */}
          <ListItem
            bg="white"
            _hover={{ bg: 'gray.100' }}
            p={2}
            borderRadius="md"
            display="flex"
            alignItems="center"
            cursor="pointer"
          >
            <FaHome style={{ marginRight: '8px' }} />
            <Text>Home</Text>
          </ListItem>
          {/* Project ボタン */}
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
            {isProjectListVisible ? (
              <ChevronDownIcon ml="auto" />
            ) : (
              <ChevronRightIcon ml="auto" />
            )}
          </ListItem>
        </List>
        {isProjectListVisible && (
          <>
            <List spacing={2} pl={6}>
              {projects.map((project) => (
                <ListItem
                  key={project.id}
                  _hover={{ bg: 'pink.300' }}
                  p={2}
                  borderRadius="md"
                  cursor="pointer"
                >
                  {project.name}
                </ListItem>
              ))}
            </List>
            <Box mt={4} bg="white" p={2} borderRadius="md">
              <Input
                placeholder="プロジェクト名"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)} // 入力フィールド用
                mb={2}
                bg="white"
              />
              <Button
                colorScheme="teal"
                leftIcon={<AddIcon />}
                onClick={addProject} // リストに追加
              >
                Add Project
              </Button>
            </Box>
          </>
        )}
      </VStack>

      {/* 右コンテンツ */}
      <Box flex={1} p={4} bg="white">
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Home
          </Text>
        </Box>
        <Box mb={6}>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            Project
          </Text>
          <HStack spacing={2}>
            <Input
              placeholder="プロジェクト名"
              value={newProjectName} // 入力フィールド用
              onChange={(e) => setNewProjectName(e.target.value)}
              bg="white"
            />
            <Button
              colorScheme="teal"
              leftIcon={<AddIcon />}
              onClick={addProject} // リスト追加
            >
              Add Project
            </Button>
          </HStack>
        </Box>
        <List spacing={4}>
          {projects.map((project) => (
            <ListItem
              key={project.id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ bg: 'gray.200' }}
            >
              {project.name}
            </ListItem>
          ))}
        </List>
      </Box>
    </HStack>
  );
}


