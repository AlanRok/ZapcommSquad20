import React, { useEffect, useReducer, useState, useContext } from "react";
import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField,
  Box,
} from "@material-ui/core";
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit } from "@material-ui/icons";
import QueueModal from "../../components/QueueModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";
import { SocketContext } from "../../context/Socket/SocketContext";

import HelpIcon from '@material-ui/icons/Help';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(1),
    overflowY: "scroll",
    backgroundColor: "rgba(255, 255, 255, 0.80)",
    ...theme.scrollbarStyles,
  },
  customTableCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchField: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: theme.shape.borderRadius,
  },
}));

const reducer = (state, action) => {
  if (action.type === "LOAD_QUEUES") {
    const queues = action.payload;
    const newQueues = [];

    queues.forEach((queue) => {
      const queueIndex = state.findIndex((q) => q.id === queue.id);
      if (queueIndex !== -1) {
        state[queueIndex] = queue;
      } else {
        newQueues.push(queue);
      }
    });

    return [...state, ...newQueues];
  }

  if (action.type === "UPDATE_QUEUES") {
    const queue = action.payload;
    const queueIndex = state.findIndex((u) => u.id === queue.id);

    if (queueIndex !== -1) {
      state[queueIndex] = queue;
      return [...state];
    } else {
      return [queue, ...state];
    }
  }

  if (action.type === "DELETE_QUEUE") {
    const queueId = action.payload;
    const queueIndex = state.findIndex((q) => q.id === queueId);
    if (queueIndex !== -1) {
      state.splice(queueIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const Queues = () => {
  const classes = useStyles();

  const [queues, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [queueModalOpen, setQueueModalOpen] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/queue");
        dispatch({ type: "LOAD_QUEUES", payload: data });

        setLoading(false);
      } catch (err) {
        toastError(err);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-queue`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_QUEUES", payload: data.queue });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_QUEUE", payload: data.queueId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenQueueModal = () => {
    setQueueModalOpen(true);
    setSelectedQueue(null);
  };

  const handleCloseQueueModal = () => {
    setQueueModalOpen(false);
    setSelectedQueue(null);
  };

  const handleEditQueue = (queue) => {
    setSelectedQueue(queue);
    setQueueModalOpen(true);
  };

  const handleCloseConfirmationModal = () => {
    setConfirmModalOpen(false);
    setSelectedQueue(null);
  };

  const handleDeleteQueue = async (queueId) => {
    try {
      await api.delete(`/queue/${queueId}`);
      toast.success(i18n.t("Queue deleted successfully!"));
    } catch (err) {
      toastError(err);
    }
    setSelectedQueue(null);
  };

  // varivel com elementos do guia 
  const driverObj = driver({
    showProgress: true,
    steps: [
      { element: '#botaoNovo', 
        popover: { title: 'Botão Adicionar Fila', 
        description: 'Clique para adicionar uma nova fila.' 
        } 
      },
      { element: '#barraPesquisa', 
        popover: { title: 'Barra de Pesquisa', 
        description: 'Use para filtrar as filas pela palavra-chave.' } 
      },
      { element: '#tabela', 
        popover: { title: 'Tabela', 
        description: 'Aqui você encontra todas filas disponíveis.' 
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
    <MainContainer>
      <ConfirmationModal
        title={
          selectedQueue &&
          `${i18n.t("queues.confirmationModal.deleteTitle")} ${selectedQueue.name
          }?`
        }
        open={confirmModalOpen}
        onClose={handleCloseConfirmationModal}
        onConfirm={() => handleDeleteQueue(selectedQueue.id)}
      >
        {i18n.t("queues.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <QueueModal
        open={queueModalOpen}
        onClose={handleCloseQueueModal}
        queueId={selectedQueue?.id}
      />
      <MainHeader>
        <Title>{i18n.t("queues.title")}</Title>
        <MainHeaderButtonsWrapper>
          <Button
            variant="contained"
            id="botaoNovo"
            color="primary"
            onClick={handleOpenQueueModal}
          >
            {i18n.t("queues.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
        {/* BARRA DE PESQUISA  */}
        <TextField
          id="barraPesquisa"
          variant="outlined"
          label=""
          placeholder={i18n.t("queues.searchPlaceholder")}
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            style: {
              borderRadius: "3px",
              width: "100%",
              display: 'flex',
              alignSelf: 'center',
              backgroundColor: 'white',
              marginTop: "10px",
              marginBottom: "20px"
            }
          }}
        />

      <Paper className={classes.mainPaper} variant="outlined" id="tabela">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">{i18n.t("queues.table.id")}</TableCell>
              <TableCell align="center">{i18n.t("queues.table.name")}</TableCell>
              <TableCell align="center">
                {i18n.t("queues.table.color")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("queues.table.orderQueue")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("queues.table.greeting")}
              </TableCell>
              <TableCell align="center">
                {i18n.t("queues.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queues.length === 0 && !loading ? (
              <TableRow>
                <TableCell colSpan={6} align='center'>
                  Nenhum elemento foi encontrado
                </TableCell>
              </TableRow>
            ) : (
              <>
                {queues
                  .filter((queue) =>
                    queue.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((queue) => (
                    <TableRow key={queue.id}>
                      <TableCell align="center">{queue.id}</TableCell>
                      <TableCell align="center">{queue.name}</TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <span
                            style={{
                              backgroundColor: queue.color,
                              width: 60,
                              height: 20,
                              alignSelf: "center",
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <Typography
                            style={{ width: 300, align: "center" }}
                            noWrap
                            variant="body2"
                          >
                            {queue.orderQueue}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <div className={classes.customTableCell}>
                          <Typography
                            style={{ width: 300, align: "center" }}
                            noWrap
                            variant="body2"
                          >
                            {queue.greetingMessage}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          id="botaoEdit"
                          onClick={() => handleEditQueue(queue)}
                        >
                          <Edit />
                        </IconButton>

                        <IconButton
                          size="small"
                          id="botaoDel"
                          onClick={() => {
                            setSelectedQueue(queue);
                            setConfirmModalOpen(true);
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {loading && <TableRowSkeleton columns={4} />}
              </>
            )}
          </TableBody>
        </Table>
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
      </Paper>
    </MainContainer>
  );
};

export default Queues;