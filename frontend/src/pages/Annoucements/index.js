import React, { useState, useEffect, useReducer, useContext } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { styled } from '@mui/material/styles';
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import AnnouncementModal from "../../components/AnnouncementModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { Grid } from "@material-ui/core";
import { isArray } from "lodash";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";

const reducer = (state, action) => {
  if (action.type === "LOAD_ANNOUNCEMENTS") {
    const announcements = action.payload;
    const newAnnouncements = [];

    if (isArray(announcements)) {
      announcements.forEach((announcement) => {
        const announcementIndex = state.findIndex(
          (u) => u.id === announcement.id
        );
        if (announcementIndex !== -1) {
          state[announcementIndex] = announcement;
        } else {
          newAnnouncements.push(announcement);
        }
      });
    }

    return [...state, ...newAnnouncements];
  }

  if (action.type === "UPDATE_ANNOUNCEMENTS") {
    const announcement = action.payload;
    const announcementIndex = state.findIndex((u) => u.id === announcement.id);

    if (announcementIndex !== -1) {
      state[announcementIndex] = announcement;
      return [...state];
    } else {
      return [announcement, ...state];
    }
  }

  if (action.type === "DELETE_ANNOUNCEMENT") {
    const announcementId = action.payload;

    const announcementIndex = state.findIndex((u) => u.id === announcementId);
    if (announcementIndex !== -1) {
      state.splice(announcementIndex, 1);
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
    // padding: theme.spacing(1),
    padding: theme.padding,
    overflowY: "scroll",
    ...theme.scrollbarStyles,
  },
  announcementSearchbar:{
    
  },
  titleCell: {              //fonte de uma coluna linha principal do "grafico"
    fontSize: '15px',
    fontWeight: '350',
  },
  statusCell: {             //fonte de uma coluna linha principal do "grafico"
    fontSize: '15px',
    fontWeight: '350',
  },
  priorityCell: {           //fonte de uma coluna da linha principal do "grafico"
    fontSize: '15px',
    fontWeight: '350',
  },
  actionsCell: {            //fonte de uma coluna linha principal do "grafico"
    fontSize: '15px',
    fontWeight: '350',
  },
  contactsColuna: {            //fonte de uma coluna linha principal do "grafico"
    fontSize: '15px',
    fontWeight: '600',
  },
  statusColuna: {            //fonte de uma coluna linha principal do "grafico"
    fontSize: '15px',
    fontWeight: '350',
  },
  priorityColuna: {            //fonte de uma coluna linha principal do "grafico"
    fontSize: '15px',
    fontWeight: '350',
  },
  Title:{
    fontSize:'50px',
    fontWeight: '350'
  }
}));

const CustomTextField = styled(TextField)({
  
  backgroundColor: '#f0f0f0',
  borderRadius: '5px',
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'green', // Cor da borda
    },
    '&:hover fieldset': {
      borderColor: 'blue', // Cor da borda ao passar o mouse
    },
    '&.Mui-focused fieldset': {
      borderColor: 'red', // Cor da borda ao focar
    },
  },
});

function Form() {
  return (
    <CustomTextField
      label="Customizado"
      variant="outlined"
      placeholder="Texto customizado"
    />
  );
}

const Announcements = () => {
  const classes = useStyles();
  const history = useHistory();

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [deletingAnnouncement, setDeletingAnnouncement] = useState(null);
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [announcements, dispatch] = useReducer(reducer, []);

  const socketManager = useContext(SocketContext);

  // trava para nao acessar pagina que não pode  
  useEffect(() => {
    async function fetchData() {
      if (!user.super) {
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
      fetchAnnouncements();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParam, pageNumber]);

  useEffect(() => {
    const companyId = user.companyId;
    const socket = socketManager.getSocket(companyId);

    socket.on(companyId-announcements, (data) => {
      if (data.action === "update" || data.action === "create") {
        dispatch({ type: "UPDATE_ANNOUNCEMENTS", payload: data.record });
      }
      if (data.action === "delete") {
        dispatch({ type: "DELETE_ANNOUNCEMENT", payload: +data.id });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [socketManager, user.companyId]);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await api.get("/announcements/", {
        params: { searchParam, pageNumber },
      });
      dispatch({ type: "LOAD_ANNOUNCEMENTS", payload: data.records });
      setHasMore(data.hasMore);
      setLoading(false);
    } catch (err) {
      toastError(err);
    }
  };

  const handleOpenAnnouncementModal = () => {
    setSelectedAnnouncement(null);
    setAnnouncementModalOpen(true);
  };

  const handleCloseAnnouncementModal = () => {
    setSelectedAnnouncement(null);
    setAnnouncementModalOpen(false);
  };

  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };

  const handleEditAnnouncement = (announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementModalOpen(true);
  };

  const handleDeleteAnnouncement = async (announcement) => {
    try {
      if (announcement.mediaName)
      await api.delete(`/announcements/${announcement.id}/media-upload`);

      await api.delete(`/announcements/${announcement.id}`);
      
      toast.success(i18n.t("announcements.toasts.deleted"));
    } catch (err) {
      toastError(err);
    }
    setDeletingAnnouncement(null);
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

  const translatePriority = (val) => {
    if (val === 1) {
      return "Alta";
    }
    if (val === 2) {
      return "Média";
    }
    if (val === 3) {
      return "Baixa";
    }
  };

  return (
    <MainContainer >
      <ConfirmationModal
        title={
          deletingAnnouncement &&
          `${i18n.t("announcements.confirmationModal.deleteTitle")} ${deletingAnnouncement.name
          }?`
        }
        open={confirmModalOpen}
        onClose={setConfirmModalOpen}
        onConfirm={() => handleDeleteAnnouncement(deletingAnnouncement)}
      >
        {i18n.t("announcements.confirmationModal.deleteMessage")}
      </ConfirmationModal>
      <AnnouncementModal
        resetPagination={() => {
          setPageNumber(1);
          fetchAnnouncements();
        }}
        open={announcementModalOpen}
        onClose={handleCloseAnnouncementModal}
        aria-labelledby="form-dialog-title"
        announcementId={selectedAnnouncement && selectedAnnouncement.id}
      />
      <MainHeader>
      <Grid style={{ width: "99.6%" }} container>
        <Grid xs={12} sm={12} item style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px'}}>
          <Title >Informativos</Title>
          <Button
            variant="contained"
            onClick={handleOpenAnnouncementModal}
            color="primary"
          >
            {i18n.t("announcements.buttons.add")}
          </Button>
        </Grid>
          {/* Mantém os outros componentes como estão */}
  <Grid xs={12} sm={4} item>
    <Grid spacing={2} container>
      <Grid xs={6} sm={6} item style={{ marginBottom: '16px', width:'100%'}}> 
        <TextField
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                border: 'none',  // Remove a borda normal
              },
              '&:hover fieldset': {
               border: 'none',  // Remove o efeito de hover
              },
              '&.Mui-focused fieldset': {
                border: 'none',  // Remove a borda ao focar
              },
            },
          }}
          fullWidth
          placeholder={i18n.t("announcements.searchPlaceholder")}
          type="search"
          value={searchParam}
          onChange={handleSearch}
          InputProps={{
            style: {
              backgroundColor: '#FFFFFF',
              border: '2px solid #808080',
              borderRadius: '5px',
              width: '1238px',
              height: '42px',
              borderWidth: '0px'
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon style={{ color: "grey" }} />
              </InputAdornment>
            ),
          }}
        />
      </Grid>
    </Grid>
    <Grid xs={12} sm={15} item>
      <Title>
        {i18n.t("announcements.title")}({announcements.length})
      </Title>
    </Grid>
  </Grid>
</Grid>
      </MainHeader>
      <Paper
        className={classes.mainPaper}
        variant="outlined"
        onScroll={handleScroll}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center" className={classes.titleCell}>
                {i18n.t("announcements.table.title")}
              </TableCell>
              <TableCell align="center" className={classes.statusCell}>
                {i18n.t("announcements.table.status")}
              </TableCell>
              <TableCell align="center" className={classes.priorityCell}>
                {i18n.t("announcements.table.priority")}
              </TableCell>
              <TableCell align="center" className={classes.actionsCell}>
                {i18n.t("announcements.table.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell align="center" className={classes.contactsColuna}>
                    {announcement.title}
                  </TableCell>
                  <TableCell align="center" className={classes.statusColuna}>
                    {announcement.status ? i18n.t("announcements.active") : i18n.t("announcements.inactive")}
                  </TableCell>
                  <TableCell align="center" className={classes.priorityColuna}>
                    {translatePriority(announcement.priority)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleEditAnnouncement(announcement)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setConfirmModalOpen(true);
                        setDeletingAnnouncement(announcement);
                      }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {loading && <TableRowSkeleton columns={5} />}
            </>
          </TableBody>
        </Table>
      </Paper>
    </MainContainer >
  )
};

export default Announcements;