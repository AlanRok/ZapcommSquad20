import React, { useState } from "react";
import {
  Button,
  Paper,
  TextField,
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    backgroundColor: "#f0f4ff",
    height: "100vh",
  },
  sidebar: {
    width: "200px",
    backgroundColor: "#2d3e50",
    color: "#fff",
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },
  content: {
    marginLeft: "200px",
    width: "calc(100% - 200px)",
    padding: theme.spacing(4),
  },
  header: {
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: "1.25rem",
    color: "#333",
  },
  searchField: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  timeSlotContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    padding: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  timeSlotText: {
    fontSize: "1rem",
    fontWeight: 500,
  },
  addButton: {
    backgroundColor: "#1976d2",
    color: "#fff",
    marginTop: theme.spacing(3),
    fontWeight: 600,
    padding: theme.spacing(1, 4),
    borderRadius: "8px",
    textTransform: "none",
    alignSelf: "center",
  },
}));

const Queues = () => {
  const classes = useStyles();
  const [schedules, setSchedules] = useState([
    { day: "Segunda-feira", start: "08:00", end: "18:00" },
    { day: "Terça-feira", start: "08:00", end: "18:00" },
    { day: "Quarta-feira", start: "08:00", end: "18:00" },
    { day: "Quinta-feira", start: "08:00", end: "18:00" },
    { day: "Sexta-feira", start: "08:00", end: "18:00" },
    { day: "Sábado", start: "08:00", end: "12:00" },
  ]);

  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <Typography variant="h6">Zapcomm</Typography>
        <List>
          <ListItem button>
            <ListItemText primary="Filas & Chatbots" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Dados da Fila" />
          </ListItem>
          <ListItem button selected>
            <ListItemText primary="Horários de Atendimento" />
          </ListItem>
        </List>
      </div>
      <div className={classes.content}>
        <Typography variant="h5" className={classes.header}>
          Horários de atendimento
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Pesquisar layout"
          className={classes.searchField}
        />
        <Paper elevation={0}>
          {schedules.map((schedule, index) => (
            <div key={index} className={classes.timeSlotContainer}>
              <Typography className={classes.timeSlotText}>{schedule.day}</Typography>
              <Typography className={classes.timeSlotText}>{schedule.start}</Typography>
              <Typography className={classes.timeSlotText}>{schedule.end}</Typography>
            </div>
          ))}
        </Paper>
        <Button variant="contained" className={classes.addButton}>
          Adicionar
        </Button>
      </div>
    </div>
  );
};

export default Queues;