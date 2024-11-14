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
import HelpIcon from '@material-ui/icons/Help';

import { driver } from 'driver.js';
import "driver.js/dist/driver.css";

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

  texto: {
    flexGrow: 1,
    flexWrap: "wrap",
    marginRight: "7em", 
    overflow: "hidden",
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

  // varivel com elementos do guia 
  const driverObj = driver({
    showProgress: true,
    steps: [
      { element: '#barraPesquisa', 
        popover: { title: 'Barra de Pesquisa', 
        description: 'Use para filtrar tarefas pela palavra-chave.' } 
      },
      { element: '#botaoNovo', 
        popover: { title: 'Botão Adicionar', 
        description: 'Clique para adicionar uma nova tarefa.' 
        } 
      },
      { element: '#tabela', 
        popover: { title: 'Tabela', 
        description: 'Aqui você encontra todas as tarefas disponíveis.' 
        } 
      },
      { element: '#botaoEdit',
        popover: {title: 'Botão de Editar',
        description: 'Clique aqui para fazer alterações .'
        }
      },
      { element: '#botaoDel',
        popover: {title: 'Botão de Deletar',
        description: 'Clique aqui para apagar .'
        }
      }
    ],
  });
    
      // Função para iniciar o guia 
  function inciaGuia() {
    driverObj.drive();
  }


  return (
      <MainContainer className={classes.root}>
        <h1 className={classes.title}>Tarefas ({tasks.length})</h1>
        <div className={classes.inputContainer}>
          <TextField
            className={classes.input}
            id='barraPesquisa'
            fullWidth
            margin="dense"
            label="Nova tarefa"
            value={task}
            onChange={handleTaskChange}
            variant="outlined"
          />
          <Button size="medium" variant="contained" color="primary" onClick={handleAddTask} id='botaoNovo'>
            {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
          </Button>
        </div>
        <div className={classes.listContainer} id='tabela'>
          <List>
            {tasks.map((task, index) => (
              <ListItem key={index} className={classes.list}>
                <ListItemText className={classes.texto} primary={task.text} secondary={task.updatedAt.toLocaleString()} />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleEditTask(index)} id='botaoEdit'>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteTask(index)} id='botaoDel'>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          {/* BOTAO QUE RETORNA O DRIVEJS */}
				<IconButton color="primary" onClick={inciaGuia}
				style={{
					position: "fixed",
					bottom: 16,
					right: 16,
				  }}
				>
				<HelpIcon />
				</IconButton>
        </div>
    </MainContainer>
  );
};


export default ToDoList;
