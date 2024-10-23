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
    container: {
      width: "100%",
      height: "100%",
      position: "relative",
      backgroundColor: "#EBEFFF",
    },
    topBar: {
      width: "1663px",
      height: "63px",
      position: "absolute",
      left: "65px",
      top: "0px",
      background: "#EBEFFF",
      flexShrink: 0,
    },
    logo: {
      width: "204px",
      height: "63px",
      position: "absolute",
      left: "13px",
      top: "0px",
    },
    contentBox: {
      width: "1367px",
      height: "597px",
      position: "absolute",
      left: "213px",
      top: "179px",
    },
    whiteBox: {
      backgroundColor: "white",
      borderRadius: "10px",
      position: "absolute",
    },
    nameLabel: {
      position: "absolute",
      left: "22px",
      top: "18px",
      color: "rgba(0, 0, 0, 0.33)",
      fontSize: "15px",
      fontFamily: "Inter",
      fontWeight: 500,
    },
    detailsLabel: {
      position: "absolute",
      left: "20px",
      top: "14px",
      color: "rgba(0, 0, 0, 0.33)",
      fontSize: "15px",
      fontFamily: "Inter",
      fontWeight: 500,
    },
    actionButton: {
      width: "125px",
      height: "49px",
      position: "absolute",
      background: "#20587C",
      borderRadius: "7px",
      color: "white",
      fontSize: "18px",
      fontFamily: "Inter",
      fontWeight: 700,
      textAlign: "center",
    },
    cancelButton: {
      width: "125px",
      height: "49px",
      position: "absolute",
      backgroundColor: "white",
      borderRadius: "7px",
      border: "2px solid #FF0000",
      textAlign: "center",
      fontSize: "18px",
      color: "#FF0000",
      fontWeight: 700,
    },
    fileList: {
      position: "absolute",
      left: "235px",
      top: "549px",
      color: "black",
      fontSize: "15px",
      fontFamily: "Inter",
      fontWeight: 500,
    },
  }));
  
  const FileLists = () => {
    const classes = useStyles();
  
    return (
      <div className={classes.container}>
        <div className={classes.topBar}>
          <img
            src="https://via.placeholder.com/204x63"
            alt="Logo"
            className={classes.logo}
          />
  
          {/* retângulo no topo ao lado da barra de rolagem */}
          <div style={{
            width: "300px",  
            height: "63px",  
            position: "absolute", 
            right: "20px",  
            top: "0px",  
            backgroundColor: "#FFF",  // Cor de fundo branca
            borderRadius: "10px",  // Bordas arredondadas
            display: "flex",  
            alignItems: "center", 
            justifyContent: "center",  
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)"  
          }}>
            {/* Texto dentro do retângulo */}
            <span style={{
              fontSize: "18px",  
              fontWeight: "bold",  
              color: "#000" 
            }}>
              Novo Retângulo
            </span>
          </div>
        </div>
  
        <div className={classes.contentBox}>
          {/* Restante do conteúdo */}
        </div>
      </div>
    );
  };
  
  
        <><div className={classes.contentBox}>
    <div className={`${classes.whiteBox}`} style={{ width: "1363px", height: "54px", top: "0px" }}></div>
    <div className={`${classes.whiteBox}`} style={{ width: "1363px", height: "54px", top: "543px" }}></div>

    {/* Novo retângulo com SVG e texto "Nome" */}
    <div style={{
        width: "1363px", 
        height: "54px", 
        flexShrink: 0, // Para evitar encolhimento
        backgroundColor: "white", 
        borderRadius: "10px", 
        position: "absolute", 
        left: "22px", 
        top: "70px" 
    }}>
        {/* SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="1363" height="54" viewBox="0 0 1363 54" fill="none">
            <path d="M0 10C0 4.47715 4.47715 0 10 0H1353C1358.52 0 1363 4.47715 1363 10V44C1363 49.5229 1358.52 54 1353 54H9.99997C4.47712 54 0 49.5229 0 44V10Z" fill="white" />
        </svg>

        {/* Texto "Nome" */}
        <div style={{
            color: "black", 
            textAlign: "center", 
            position: "relative", 
            top: "-30px", 
            fontSize: "16px", 
            fontWeight: "bold" 
        }}>
            Nome
        </div>
    </div>
    {/* Novo Retângulo com texto "Detalhes" */}
    <div style={{
        width: "1363px", 
        height: "260px",
        flexShrink: 0, 
        background: "#FFF",
        borderRadius: "10px", 
        position: "absolute", 
        left: "22px", 
        top: "130px" // Ajuste a posição vertical para ficar abaixo do retângulo "Nome"
    }}>
        {/* Texto "Detalhes" */}
        <div style={{
            color: "black", 
            textAlign: "center", 
            position: "relative", 
            top: "20px", 
            fontSize: "20px", 
            fontWeight: "bold" 
        }}>
            Detalhes
        </div>
    </div>
    {/* Texto "Lista de Arquivos" */}
    <div style={{
        color: "#000", 
        fontFamily: "Inter", 
        fontSize: "15px", 
        fontWeight: "500", 
        position: "absolute", 
        left: "22px", 
        top: "400px", 
        letterSpacing: "-0.702px", 
        wordWrap: "break-word" 
    }}>
        Lista de Arquivos
    </div>
    {/* Texto "Mensagem para enviar com o arquivo" */}
    <div style={{
        color: "black", 
        textAlign: "center", 
        position: "relative", 
        top: "20px", 
        fontSize: "20px", 
        fontWeight: "bold" 
    }}>
        Mensagem para enviar com o arquivo
    </div>
    <div className={classes.nameLabel}>Nome</div>
</div><div className={classes.fileList}>Lista de Arquivos</div><div className={classes.actionButton} style={{ left: "213px", top: "806px" }}>
        SALVAR
    </div><div className={classes.cancelButton} style={{ left: "354px", top: "806px" }}>
        Cancelar
    </div></>

function FileLists() {
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
                fileListId={selectedFileList && selectedFileList.id} />
            <MainHeader>
                <Title>{i18n.t("files.title")} ({files.length})</Title>
                <MainHeaderButtonsWrapper>
    <TextField
        placeholder={i18n.t("contacts.searchPlaceholder")}
        type="search"
        value={searchParam}
        onChange={handleSearch}
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <SearchIcon style={{ color: "gray" }} />
                </InputAdornment>
            ),
        }}
    />
    <Button
        variant="contained"
        color="primary"
        onClick={handleOpenFileListModal}
    >
        {i18n.t("files.buttons.add")}
    </Button>

    {/* Adicionando o retângulo de "Adicionar Arquivo" com ícone de "+" */}
    <div style={{
        width: "1363px",  
        height: "54px",   
        flexShrink: 0,    
        borderRadius: "10px",  
        backgroundColor: "#FFF",  
        marginTop: "20px",  
        display: "flex",  // Para organizar o conteúdo dentro do retângulo
        alignItems: "center",  
        justifyContent: "center" 
    }}>
        {/* Texto "Adicionar Arquivo" */}
        <div style={{
            color: "rgba(0, 0, 0, 0.33)", 
            fontSize: "15px", 
            fontFamily: "Inter", 
            fontWeight: 500, 
            wordWrap: "break-word", 
            marginRight: "10px" 
        }}>
            Adicionar Arquivo
        </div>

        {/* Ícone de "+" */}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none" style={{
            flexShrink: 0, // Evita que o ícone encolha
            fill: "rgba(0, 0, 0, 0.33)" 
        }}>
            <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="black" fill-opacity="0.33"/>
        </svg>
    </div>
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
                            <TableCell align="center">{i18n.t("files.table.name")}</TableCell>
                            <TableCell align="center">
                                {i18n.t("files.table.actions")}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <>
                            {files.map((fileList) => (
                                <TableRow key={fileList.id}>
                                    <TableCell align="center">
                                        {fileList.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton size="small" onClick={() => handleEditFileList(fileList)}>
                                            <EditIcon />
                                        </IconButton>

                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                setConfirmModalOpen(true);
                                                setDeletingFileList(fileList);
                                            } }
                                        >
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {loading && <TableRowSkeleton columns={4} />}
                        </>
                    </TableBody>
                </Table>
            </Paper>
        </MainContainer>
    );
}

export default FileLists;
