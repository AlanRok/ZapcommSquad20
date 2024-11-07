import React, { useState, useEffect } from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MainContainer from '../../components/MainContainer';
import Title from '../../components/Title';
import { TableRow } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontWeight: "normal",
    fontSize: "1.6em"
  },
  inputContainer: {
    display: 'flex',
    width: '100%',
    alignItems: "center",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  input: {
    flexGrow: 1,
    backgroundColor: "white",
    margin: 0,
  },
  listContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: "white",
    border: "solid, #E0E0E0, 1px",
    borderRadius: '5px',
  },
  list: {
    borderBottom: "1px solid #ddd",
  }
}));

const ToDoList = () => {
  const classes = useStyles();

  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const handleAddTask = () => {
    if (!task.trim()) {
      // Impede que o usuário crie uma tarefa sem texto
      return;
    }

    const now = new Date();
    if (editIndex >= 0) {
      // Editar tarefa existente
      const newTasks = [...tasks];
      newTasks[editIndex] = {text: task, updatedAt: now, createdAt: newTasks[editIndex].createdAt};
      setTasks(newTasks);
      setTask('');
      setEditIndex(-1);
    } else {
      // Adicionar nova tarefa
      setTasks([...tasks, {text: task, createdAt: now, updatedAt: now}]);
      setTask('');
    }
  };

  const handleEditTask = (index) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  return (
      <MainContainer className={classes.root}>
        <h1 className={classes.title}>Tarefas ({tasks.length})</h1>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.input}
            fullWidth
            margin="dense"
            label="Nova tarefa"
            value={task}
            onChange={handleTaskChange}
            variant="outlined"
          />
          <Button size="medium" variant="contained" color="primary" onClick={handleAddTask}>
            {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
          </Button>
        </div>
        <div className={classes.listContainer}>
          <List>
            {tasks.map((task, index) => (
              <ListItem key={index} className={classes.list}>
                <ListItemText primary={task.text} secondary={task.updatedAt.toLocaleString()} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleEditTask(index)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(index)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
    </MainContainer>
  );
};


export default ToDoList;
