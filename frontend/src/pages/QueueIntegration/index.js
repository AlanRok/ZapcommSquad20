import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { SocketContext } from "../../context/Socket/SocketContext";
import n8n from "../../assets/n8n.png";
import dialogflow from "../../assets/dialogflow.png";
import webhooks from "../../assets/webhook.png";
import typebot from "../../assets/typebot.jpg";

import { makeStyles } from "@material-ui/core/styles";

import HelpIcon from '@material-ui/icons/Help';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";

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
  Box,
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
    // padding: theme.spacing(2),
    // margin: theme.spacing(1),
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  avatar: {
    width: "140px",
    height: "40px",
    borderRadius: 4
  },
  searchField: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: theme.shape.borderRadius,
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

  // varivel com elementos do guia 
  const driverObj = driver({
    showProgress: true,
    steps: [
      { element: '#botaoNovo', 
        popover: { title: 'Botão Adicionar Projeto', 
        description: 'Clique para adicionar uma nova integração.' 
        } 
      },
      { element: '#barraPesquisa', 
        popover: { title: 'Barra de Pesquisa', 
        description: 'Use para filtrar integrações pela palavra-chave.' } 
      },
      { element: '#tabela', 
        popover: { title: 'Tabela', 
        description: 'Aqui você encontra todas integrações disponíveis.' 
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
          <Button
            id="botaoNovo"
            variant="contained"
            color="primary"
            onClick={handleOpenUserModal}
          >
            {i18n.t("queueIntegration.buttons.add")}
          </Button>
        </MainHeaderButtonsWrapper>
      </MainHeader>

      <TextField
          id="barraPesquisa" label="" variant="outlined"
            size="small"
            placeholder={i18n.t("queueIntegration.searchPlaceholder")}
            type="search"
            value={searchParam}
            onChange={handleSearch}
            InputProps={{
              style: {
                borderRadius: "3px",
                width: "100%",
                display: 'flex',
                alignSelf: 'center',
                backgroundColor: 'white',
                marginTop: "10px",
                marginBottom: "15px"
              }
            }}
          />
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        id="tabela"
        onScroll={handleScroll}
        style={{
          width: "100%"
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell align="center">{i18n.t("queueIntegration.table.id")}</TableCell>
              <TableCell align="center">{i18n.t("queueIntegration.table.name")}</TableCell>
              <TableCell align="center">{i18n.t("queueIntegration.table.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {queueIntegration.map((integration) => (
                <TableRow key={integration.id}>
                  <TableCell>
                    {integration.type === "dialogflow" && (
                      <Avatar src={dialogflow} className={classes.avatar} />
                    )}
                    {integration.type === "n8n" && (
                      <Avatar src={n8n} className={classes.avatar} />
                    )}
                    {integration.type === "webhook" && (
                      <Avatar src={webhooks} className={classes.avatar} />
                    )}
                    {integration.type === "typebot" && (
                      <Avatar src={typebot} className={classes.avatar} />
                    )}
                  </TableCell>

                  <TableCell align="center">{integration.id}</TableCell>
                  <TableCell align="center">{integration.name}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      id="botaoEdit"
                      onClick={() => handleEditIntegration(integration)}
                    >
                      <Edit color="#000" />
                    </IconButton>

                    <IconButton
                      size="small"
                      id="botaoDel"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingUser(integration);
                      }}
                    >
                      <DeleteOutline color="#000" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={7} />}
            </>
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

export default QueueIntegration;