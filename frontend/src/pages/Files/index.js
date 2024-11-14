import React, {
    useState,
    useEffect,
    useReducer,
    useCallback,
    useContext,
} from "react";
import { toast } from "react-toastify";

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
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import FileModal from "../../components/FileModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import toastError from "../../errors/toastError";
import { SocketContext } from "../../context/Socket/SocketContext";
import { AuthContext } from "../../context/Auth/AuthContext";

import HelpIcon from '@material-ui/icons/Help';
import { driver } from 'driver.js';
import "driver.js/dist/driver.css";

const reducer = (state, action) => {
    if (action.type === "LOAD_FILES") {
        const files = action.payload;
        const newFiles = [];

        files.forEach((fileList) => {
            const fileListIndex = state.findIndex((s) => s.id === fileList.id);
            if (fileListIndex !== -1) {
                state[fileListIndex] = fileList;
            } else {
                newFiles.push(fileList);
            }
        });

        return [...state, ...newFiles];
    }

    if (action.type === "UPDATE_FILES") {
        const fileList = action.payload;
        const fileListIndex = state.findIndex((s) => s.id === fileList.id);

        if (fileListIndex !== -1) {
            state[fileListIndex] = fileList;
            return [...state];
        } else {
            return [fileList, ...state];
        }
    }

    if (action.type === "DELETE_TAG") {
        const fileListId = action.payload;

        const fileListIndex = state.findIndex((s) => s.id === fileListId);
        if (fileListIndex !== -1) {
            state.splice(fileListIndex, 1);
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
        padding: theme.spacing(1),
        overflowY: "scroll",
        ...theme.scrollbarStyles,
    },

    pesquisa :{
        backgroundColor: "white",
        marginBottom: theme.spacing(1),
    },
}));

const FileLists = () => {
    const classes = useStyles();

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selectedFileList, setSelectedFileList] = useState(null);
    const [deletingFileList, setDeletingFileList] = useState(null);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [searchParam, setSearchParam] = useState("");
    const [files, dispatch] = useReducer(reducer, []);
    const [fileListModalOpen, setFileListModalOpen] = useState(false);

    const fetchFileLists = useCallback(async () => {
        try {
            const { data } = await api.get("/files/", {
                params: { searchParam, pageNumber },
            });
            dispatch({ type: "LOAD_FILES", payload: data.files });
            setHasMore(data.hasMore);
            setLoading(false);
        } catch (err) {
            toastError(err);
        }
    }, [searchParam, pageNumber]);

    const socketManager = useContext(SocketContext);

    useEffect(() => {
        dispatch({ type: "RESET" });
        setPageNumber(1);
    }, [searchParam]);

    useEffect(() => {
        setLoading(true);
        const delayDebounceFn = setTimeout(() => {
            fetchFileLists();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchParam, pageNumber, fetchFileLists]);

    useEffect(() => {
        const socket = socketManager.getSocket(user.companyId);

        socket.on(`company-${user.companyId}-file`, (data) => {
            if (data.action === "update" || data.action === "create") {
                dispatch({ type: "UPDATE_FILES", payload: data.files });
            }

            if (data.action === "delete") {
                dispatch({ type: "DELETE_USER", payload: +data.fileId });
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [socketManager, user]);

    const handleOpenFileListModal = () => {
        setSelectedFileList(null);
        setFileListModalOpen(true);
    };

    const handleCloseFileListModal = () => {
        setSelectedFileList(null);
        setFileListModalOpen(false);
    };

    const handleSearch = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleEditFileList = (fileList) => {
        setSelectedFileList(fileList);
        setFileListModalOpen(true);
    };

    const handleDeleteFileList = async (fileListId) => {
        try {
            await api.delete(`/files/${fileListId}`);
            toast.success(i18n.t("files.toasts.deleted"));
        } catch (err) {
            toastError(err);
        }
        setDeletingFileList(null);
        setSearchParam("");
        setPageNumber(1);

        dispatch({ type: "RESET" });
        setPageNumber(1);
        await fetchFileLists();
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
        popover: { title: 'Botão Adicionar', 
        description: 'Clique para adicionar um novo arquivo.' 
        } 
      },
      { element: '#barraPesquisa', 
        popover: { title: 'Barra de Pesquisa', 
        description: 'Use para filtrar arquivos pela palavra-chave.' } 
      },
      { element: '#tabela', 
        popover: { title: 'Tabela', 
        description: 'Aqui você encontra todos os arquivos disponíveis.' 
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
                title={deletingFileList && `${i18n.t("files.confirmationModal.deleteTitle")}`}
                open={confirmModalOpen}
                onClose={setConfirmModalOpen}
                onConfirm={() => handleDeleteFileList(deletingFileList.id)}
            >
                {i18n.t("files.confirmationModal.deleteMessage")}
            </ConfirmationModal>
            <FileModal
                open={fileListModalOpen}
                onClose={handleCloseFileListModal}
                reload={fetchFileLists}
                aria-labelledby="form-dialog-title"
                fileListId={selectedFileList && selectedFileList.id}
            />
            <MainHeader>
                <Title>{i18n.t("files.title")} ({files.length})</Title>
                <MainHeaderButtonsWrapper>
                    <Button
                        variant="contained"
                        id="botaoNovo"
                        color="primary"
                        onClick={handleOpenFileListModal}
                    >
                        {i18n.t("files.buttons.add")}
                    </Button>
                </MainHeaderButtonsWrapper>
            </MainHeader>
            {/* BARRA DE PESQUISA  */}
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
                marginBottom: "20px"
              }
            }}
          />
            <Paper
                className={classes.mainPaper}
                variant="outlined"
                onScroll={handleScroll}
                id="tabela"
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">{i18n.t("files.table.name")}</TableCell>
                            <TableCell align="center">
                                {i18n.t("files.table.actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                        {files.length === 0 && !loading ? (
                            <TableRow>
                            <TableCell colSpan={10} align="center">
                                Nenhum arquivo foi encontrado.    
                            </TableCell>
                            </TableRow>
                        ) : (
                            files.map((fileList) => (
                                <TableRow key={fileList.id}>
                                    <TableCell align="center">
                                        {fileList.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => handleEditFileList(fileList)} id="botaoEdit">
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            id="botaoDel"
                                            onClick={(e) => {
                                                setConfirmModalOpen(true);
                                                setDeletingFileList(fileList);
                                            }}
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                            {loading && <TableRowSkeleton columns={4} />}
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

export default FileLists;
