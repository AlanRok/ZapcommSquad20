import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/Socket/SocketContext";
import n8n from "../../assets/n8n.png";
import dialogflow from "../../assets/dialogflow.png";
import webhooks from "../../assets/webhook.png";
import typebot from "../../assets/typebot.jpg";

import { makeStyles } from "@material-ui/core/styles";

import {
  Avatar,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip
} from "@material-ui/core";

import {
  DeleteOutline,
  Edit
} from "@material-ui/icons";

import SearchIcon from "@material-ui/icons/Search";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import IntegrationModal from "../../components/QueueIntegrationModal";
import ConfirmationModal from "../../components/ConfirmationModal";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import usePlans from "../../hooks/usePlans";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const reducer = (state, action) => {
  if (action.type === "LOAD_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const newIntegrations = [];

    queueIntegration.forEach((integration) => {
      const integrationIndex = state.findIndex((u) => u.id === integration.id);
      if (integrationIndex !== -1) {
        state[integrationIndex] = integration;
      } else {
        newIntegrations.push(integration);
      }
    });

    return [...state, ...newIntegrations];
  }

  if (action.type === "UPDATE_INTEGRATIONS") {
    const queueIntegration = action.payload;
    const integrationIndex = state.findIndex((u) => u.id === queueIntegration.id);

    if (integrationIndex !== -1) {
      state[integrationIndex] = queueIntegration;
      return [...state];
    } else {
      return [queueIntegration, ...state];
    }
  }

  if (action.type === "DELETE_INTEGRATION") {
    const integrationId = action.payload;

    const integrationIndex = state.findIndex((u) => u.id === integrationId);
    if (integrationIndex !== -1) {
      state.splice(integrationIndex, 1);
    }
    return [...state];
  }

  if (action.type === "RESET") {
    return [];
  }
};

const useStyles = makeStyles((theme) => ({
  mainPaper: {
    flex: 1,
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  avatar: {
    width: "140px",
    height: "40px",
    borderRadius: 4
  },
}));

const QueueIntegration = () => {
  const classes = useStyles();

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [queueIntegration, dispatch] = useReducer(reducer, []);
  const { user } = useContext(AuthContext);
  const { getPlanCompany } = usePlans();
  const companyId = user.companyId;
  const history = useHistory();

  const socketManager = useContext(SocketContext);

  useEffect(() => {
    async function fetchData() {
      const planConfigs = await getPlanCompany(undefined, companyId);
      if (!planConfigs.plan.useIntegrations) {
        toast.error("Esta empresa não possui permissão para acessar essa página! Estamos lhe redirecionando.");
        setTimeout(() => {
          history.push(`/`)
        }, 1000);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setPageNumber(1);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    const delayDebounceFn = setTimeout(() => {
      const fetchIntegrations = async () => {
        try {
          const { data } = await api.get("/queueIntegration/", {
            params: { searchParam, pageNumber },
          });
          dispatch({ type: "LOAD_INTEGRATIONS", payload: data.queueIntegrations });
          setHasMore(data.hasMore);
          setLoading(false);
        } catch (err) {
          toastError(err);
        }
      };
      fetchIntegrations();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const socket = socketManager.getSocket(companyId);

    socket.on(`company-${companyId}-queueIntegration`, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_INTEGRATIONS", payload: data.queueIntegration });
      }

      if (data.action === "delete") {
        dispatch({ type: "DELETE_INTEGRATION", payload: +data.integrationId });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [socketManager]);

  const handleOpenUserModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(true);
  };

  const handleCloseIntegrationModal = () => {
    setSelectedIntegration(null);
    setUserModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditIntegration = (queueIntegration) => {
    setSelectedIntegration(queueIntegration);
    setUserModalOpen(true);
  };

  const handleDeleteIntegration = async (integrationId) => {
    try {
      await api.delete(`/queueIntegration/${integrationId}`);
      toast.success(i18n.t("queueIntegration.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingUser(null);
    setSearchParam("");
    setPageNumber(1);
  };

  const loadMore = () => {
    setPageNumber((prevState) => prevState + 1);
  };

  const handleScroll = (e) => {
    if (!hasMore || loading) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - (scrollTop + 100) < clientHeight) {
      loadMore();
    }
  };

  return (
    <MainContainer>
      <ConfirmationModal
        title={
          deletingUser &&
          `${i18n.t("queueIntegration.confirmationModal.deleteTitle")} ${deletingUser.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteIntegration(deletingUser.id)}
      >
        {i18n.t("queueIntegration.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <IntegrationModal
        open={userModalOpen}
        onClose={handleCloseIntegrationModal}
        aria-labelledby="form-dialog-title"
        integrationId={selectedIntegration && selectedIntegration.id}
      />
      <MainHeader>
        <Title>{i18n.t("queueIntegration.title")} ({queueIntegration.length})</Title>
        <MainHeaderButtonsWrapper>
          <TextField
            placeholder={i18n.t("queueIntegration.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="secondary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenUserModal}
          >
            {i18n.t("queueIntegration.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell align="center">{i18n.t("queueIntegration.table.id")}</TableCell>
              <TableCell align="center">{i18n.t("queueIntegration.table.name")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {queueIntegration.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell >
                    {integration.type === "dialogflow" && (<Avatar 
                      src={dialogflow} className={classes.avatar} />)}
                    {integration.type === "n8n" && (<Avatar
                      src={n8n} className={classes.avatar} />)}
                    {integration.type === "webhook" && (<Avatar
                      src={webhooks} className={classes.avatar} />)}
                    {integration.type === "typebot" && (<Avatar
                      src={typebot} className={classes.avatar} />)}
                  </TableCell>

                  <TableCell align="center">{integration.id}</TableCell>
                  <TableCell align="center">{integration.name}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditIntegration(integration)}
                    >
                      <Edit color="secondary" />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingUser(integration);
                      }}
                    >
                      <DeleteOutline color="secondary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={7} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer>
  );
};

//Minhas modificações

import React, { useState, useEffect, useReducer } from "react";
import ReactDOM from 'react-dom';
import {
  Paper, Table, TableBody, TableCell, TableHead, TableRow, IconButton
} from "@material-ui/core";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const api = {
  get: () => Promise.resolve({
    data: {
      queueIntegrations: [
        { id: 1, name: "Integração 1", type: "n8n" },
        { id: 2, name: "Integração 2", type: "dialogflow" },
      ],
    },
  }),
  delete: () => Promise.resolve(),
};
function reducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return action.payload;
    case "DELETE":
      return state.filter(integration => integration.id !== action.payload);
    default:
      return state;
  }
}

function QueueIntegration() {
  const [queueIntegration, dispatch] = useReducer(reducer, []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get().then(({ data }) => {
      dispatch({ type: "LOAD", payload: data.queueIntegrations });
      setLoading(false);
    });
  }, []);

  const handleDeleteIntegration = (id) => {
    api.delete().then(() => {
      dispatch({ type: "DELETE", payload: id });
      toast.success("Integração excluída com sucesso!");
    });
  };

  const rectangleStyle = {
    width: '679px',
    height: '68px',
    backgroundColor: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
    flexShrink: 0,
  };

  const textStyle = {
    fontSize: '24px',
    color: 'black',
  };

  return (
    <div style={{ width: '1728px', height: '1117px', background: '#f0f0f0', padding: '20px', position: 'relative', margin: '0 auto' }}>
      <ToastContainer />

      <div style={{
        position: 'absolute', width: '1663px', height: '63px', left: '65px', top: '0', background: 'white'
      }}>
        <img
          src="https://via.placeholder.com/204x63"
          alt="Logo"
          style={{ width: '204px', height: '63px', position: 'absolute', left: '13px', top: '0' }}
        />
      </div>

      <div style={{ position: 'absolute', left: '197px', top: '165px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={rectangleStyle}>
          <span style={textStyle}>Tipo</span>
        </div>
        <div style={rectangleStyle}>
          <span style={textStyle}>Nome</span>
        </div>
        <div style={rectangleStyle}>
          <span style={textStyle}>Nome do Projeto</span>
        </div>
        <div style={rectangleStyle}>
          <span style={textStyle}>Linguagem</span>
        </div>
      </div>

      <Paper style={{ borderRadius: 10, position: 'absolute', top: '450px', left: '197px', width: '1363px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queueIntegration.map(({ id, name }) => (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDeleteIntegration(id)}>
                    <span className="material-icons">delete</span>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {loading && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Carregando...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <QueueIntegration />
  </React.StrictMode>,
  document.getElementById('root')
);
import React from 'react';
import ReactDOM from 'react-dom';

function AddButton() {
  return (
    <div style={{
      width: '125px',
      height: '49px',
      background: '#20587C',
      borderRadius: '7px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer'
    }}>
      ADICIONAR
    </div>
  );
}

function CancelButton() {
  return (
    <div style={{
      width: '125px',
      height: '49px',
      borderRadius: '7px',
      border: '2px solid #FF0000',
      background: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#FF0000',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="125" height="49" viewBox="0 0 125 49" fill="none" style={{ position: 'absolute', top: 0, left: 0 }}>
        <path d="M1 7C1 3.68629 3.68629 1 7 1H118C121.314 1 124 3.68629 124 7V42C124 45.3137 121.314 48 118 48H7C3.68629 48 1 45.3137 1 42V7Z" fill="white" stroke="#FF0000" strokeWidth="2"/>
      </svg>
      CANCELAR
    </div>
  );
}

function App() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      gap: '20px' 
    }}>
      <AddButton />
      <CancelButton />
    </div>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';

//Imagem Zapcomm inicio da tela
function ImageComponent() {
  return (
    <div style={{
      width: '204px',
      height: '63px',
      background: 'lightgray',
      backgroundImage: 'url(https://via.placeholder.com/204x63)',
      backgroundPosition: '50%',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }}>
      <img 
        src="https://via.placeholder.com/204x63" 
        alt="Placeholder" 
        style={{ width: '100%', height: '100%', opacity: 0 }} 
      />
    </div>
  );
}
//Retângulo junto com a imagem
function Rectangle() {
  return (
    <div style={{
      width: '1663px',
      height: '63px',
      background: 'white',
      flexShrink: 0,
    }}>
    </div>
  );
}
function SmallBox() {
  return (
    <div style={{
      width: '33.32px',
      height: '33px',
      background: '#192F64',
      borderRadius: '2px',
      flexShrink: 0,
    }}>
    </div>
  );
}
function App() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '20px', 
      height: '100vh', 
      justifyContent: 'center' 
    }}>
      <ImageComponent />

      <Rectangle />

      <SmallBox />
    </div>
  );
}
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
export default QueueIntegration;