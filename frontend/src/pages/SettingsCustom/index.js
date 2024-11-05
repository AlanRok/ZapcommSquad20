import React, { useState, useEffect } from "react";
import { makeStyles, Paper, Tabs, Tab, Button, TextField, MenuItem, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import EditIcon from '@material-ui/icons/Edit';
import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import TabPanel from "../../components/TabPanel";
import CompaniesManager from "../../components/CompaniesManager";
import Options from "../../components/Settings/Options";
import { i18n } from "../../translate/i18n.js";
import { toast } from "react-toastify";
import useCompanies from "../../hooks/useCompanies";
import useAuth from "../../hooks/useAuth.js";
import useSettings from "../../hooks/useSettings";
import pencilicon from '../../assets/pencilicon.png'
import SearchIcon from "@material-ui/icons/Search";
import ScheduleModal from "../../components/ScheduleModal";
import InputAdornment from "@material-ui/core/InputAdornment";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Checkbox from '@material-ui/core/Checkbox';
import ExpandMore from "@material-ui/icons/ExpandMore";
import HelpsManager from "../../components/HelpsManager";
import ConfirmationModal from "../../components/ConfirmationModal";



const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "row",
    height: "100vh",
    backgroundColor: "#EBEFFF",
  },
  sidebar: {
    width: 240,
    backgroundColor: "#FFFFFF",
    padding: theme.spacing(2),
    borderRight: "1px solid #E0E0E0",
  },
  sidebarItem: {
    fontSize: '16px',
    padding: theme.spacing(1),
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#E0E0E0",
      fontWeight: 'bold',
    },
  },
  active: {
    backgroundColor: "#E0E0E0",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  filterContainer: {
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    justifyContent: 'center',
  },
  filterField: {
    flex: '1',
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
  tableContainer: {
    marginTop: theme.spacing(0),
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  tableCellCheckboxImage: {
    alignItems: 'center',
  },
  TableCell: {
    border: '2px solid rgba(0, 0, 0, 0.25)',
    borderCollapse: 'collapse',
    borderRadius: '2px',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid rgba(0, 0, 0, 0.25)',
    borderTop: 'none',
    align: 'center',
    textAlign: 'center',
  },
  whiteBox: {
    backgroundColor: '#FFFFFF',
    padding: theme.spacing(3),
    borderRadius: 8,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #E0E0E0',
    height: 'auto',
  },
  filterContainer: {
    marginBottom: theme.spacing(2),
  },
  buttomContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  table: {
    minWidth: 650,
    backgroundColor: '#FFFFFF',
    border: '2px solid rgba(0, 0, 0, 0.25)',
  },
  inputEmpresas: {
    backgroundColor: '#F8F8F9',
    border: '0px solid rgba(0, 0, 0, 0.25)',
    borderRadius: 5,
    width: '100%',
  },
  TableCellHelp: {
    borderBottom: '2px solid rgba(0, 0, 0, 0.25)',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    borderRadius: '2px',
  },
  tableCellLink: {
    color: "#1A73E8",
    wordBreak: "break-all",
  },
  tableCellCheckbox: {
    padding: theme.spacing(1),

  },
  actionCell: {
    align: 'center',
    textAlign: 'Center',
    borderBottom: '2px solid rgba(0, 0, 0, 0.25)',
    borderLeft: 'none',
    borderRight: 'none',
    borderTop: 'none',
    borderRadius: '2px',
    margin: '0 4px',
  },
  actionIcon: {
    cursor: "pointer",
    width: 20,
    height: 20,
  },

}));

const SettingsCustom = () => {

  const classes = useStyles();
  const [tab, setTab] = useState("options");
  const [schedulesEnabled, setSchedulesEnabled] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [settings, setSettings] = useState({});
  const { getCurrentUserInfo } = useAuth();
  const { find } = useCompanies();
  const { getAll: getAllSettings } = useSettings();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [plano, setPlano] = useState('');
  const [status, setStatus] = useState('');
  const [campanhas, setCampanhas] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [recorrencia, setRecorrencia] = useState('');
  const [emailError, setEmailError] = useState('');
  const [telefoneError, setTelefoneError] = useState('');
  const [searchParam, setSearchParam] = useState("");
  const [tableData, setTableData] = useState([{
    nome: "Empresa 1",
    email: "-",
    telefone: "-",
    plano: "Plano1",
    campanhas: "Desabilitadas",
    status: "Sim",
    createdAt: "xx/xx/xxxx",
    vencimento: "xx/xx/xxxx",
  },
  {
    nome: "Empresa 2",
    email: "-",
    telefone: "-",
    plano: "Plano2",
    campanhas: "Habilitadas",
    status: "Não",
    createdAt: "xx/xx/xxxx",
    vencimento: "xx/xx/xxxx",
  },
  ]);;
  const [editingIndex, setEditingIndex] = useState(null);
  const imageArray = [];
  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const user = await getCurrentUserInfo();
        setCurrentUser(user);
      } catch (e) {
        toast.error(e);
      }
    }
    fetchData();
  }, [getCurrentUserInfo]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
  };

  const handleClear = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setPlano('');
    setStatus('');
    setCampanhas('');
    setVencimento('');
    setRecorrencia('');
    setEmailError('');
    setTelefoneError('');
    setEditingIndex(null);
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Formato de e-mail inválido');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validateTelefone = () => {
    const telefoneRegex = /^\d{10,11}$/;
    if (!telefoneRegex.test(telefone)) {
      setTelefoneError('Telefone inválido.');
      return false;
    }
    setTelefoneError('');
    return true;
  };
  const handleSave = () => {
    const isEmailValid = validateEmail();
    const isTelefoneValid = validateTelefone();

    if (isEmailValid && isTelefoneValid) {
      console.log('Salvando dados...');
      const newEntry = {
        nome,
        email,
        telefone,
        plano,
        status,
        campanhas,
        vencimento,
        recorrencia,
        createdAt: new Date().toLocaleDateString(),
      };
      if (editingIndex !== null) {
        setTableData((prevData) =>
          prevData.map((item, index) =>
            index === editingIndex ? newEntry : item
          )
        );
      } else {
        setTableData((prevData) => [...prevData, newEntry]);
      }

      handleClear();
    }
  };
  const handleEdit = (index) => {
    const selectedRow = tableData[index];
    setNome(selectedRow.nome);
    setEmail(selectedRow.email);
    setTelefone(selectedRow.telefone);
    setPlano(selectedRow.plano);
    setStatus(selectedRow.status);
    setCampanhas(selectedRow.campanhas);
    setVencimento(selectedRow.vencimento);
    setRecorrencia(selectedRow.recorrencia);
    setEditingIndex(index); 
  };
  const handleDelete = (index) => {
    setTableData((prevData) => prevData.filter((_, i) => i !== index));
    toast.success("Empresa excluída com sucesso!");
  };
  const [isHelpSubOptionsVisible, setHelpSubOptionsVisible] = useState(false);
  const [helpTab, setHelpTab] = useState("tutorials");
  const handleHelpSubOptionClick = (subTab) => {
    setHelpTab(subTab);
    setTab('helps');
  };


  const renderSidebarItem = (label, value) => (
    <div
      className={`${classes.sidebarItem} ${tab === value ? classes.active : ""}`}
      onClick={() => handleTabChange(value)}>
      {label}
    </div>
  )
  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <h3>Configurações</h3>
        {renderSidebarItem("Opções", "options")}
        {renderSidebarItem("Empresas", "companies")}
        {renderSidebarItem("Ajuda", "helps")}
      </div>
      <div className={classes.content}>
        {tab === "options" && (
          <div className={classes.whiteBox} style={{ height: 'auto' }}>
            <h2>{i18n.t("settings.title")}</h2>
            <Options
              settings={settings}
              scheduleTypeChanged={(value) =>
                setSchedulesEnabled(value === "company")
              }
            />
          </div>
        )}
        {tab === "helps" && (
          <div className={classes.whiteBox}>
            <h2>Ajuda</h2>
            <HelpsManager />
          </div>
        )}
        {tab == 'companies' && (
          <div className={classes.whiteBox}>
            <h2>Empresas</h2>


            <Grid container className={classes.filterContainer} spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField label="Nome" variant="outlined" fullWidth className={classes.inputEmpresas} value={nome}
                  onChange={(e) => setNome(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3} >
                <TextField label="E-mail" variant="outlined" fullWidth className={classes.inputEmpresas} value={email}
                  onChange={(e) => setEmail(e.target.value)} error={!!emailError}
                  helperText={emailError} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Telefone" variant="outlined" fullWidth className={classes.inputEmpresas} value={telefone}
                  onChange={(e) => setTelefone(e.target.value)} error={!!telefoneError}
                  helperText={telefoneError} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Plano" variant="outlined" fullWidth className={classes.inputEmpresas} value={plano}
                  onChange={(e) => setPlano(e.target.value)} />
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.filterContainer}>
              <Grid item xs={12} sm={3}>
                <TextField label="Status" variant="outlined" fullWidth select className={classes.inputEmpresas} value={status}
                  onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="inactive">Inativo</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Campanhas" variant="outlined" fullWidth className={classes.inputEmpresas} value={campanhas}
                  onChange={(e) => setCampanhas(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Vencimento" variant="outlined" fullWidth className={classes.inputEmpresas} value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField label="Recorrência" variant="outlined" fullWidth select className={classes.inputEmpresas} value={recorrencia}
                  onChange={(e) => setRecorrencia(e.target.value)}>
                  <MenuItem value="active">Ativo</MenuItem>
                  <MenuItem value="inactive">Inativo</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <div style={{ marginTop: '56px', marginBottom: '80px' }}></div>
            <div className={classes.buttonContainer}>
              <Button variant="outlined" style={{ backgroundColor: '#BFC8CE', color: '#030303', borderRadius: '7px' }} onClick={handleClear}>
                Limpar
              </Button>
              <Button variant="contained" color="primary" onClick={handleSave}>
                Salvar
              </Button>
            </div>
            <TableContainer component={Paper} style={{ marginTop: '84px' }}>
              <Table className={classes.table} style={{ borderCollapse: 'none' }}>
                <TableHead>
                  <TableRow style={{ fontWeight: 'bold' }}>
                    <TableCell className={classes.TableCell}>Nome</TableCell>
                    <TableCell className={classes.TableCell} style={{ textAlign: 'center' }}>E-mail</TableCell>
                    <TableCell className={classes.TableCell}>Telefone</TableCell>
                    <TableCell className={classes.TableCell}>Plano</TableCell>
                    <TableCell className={classes.TableCell}>Campanhas</TableCell>
                    <TableCell className={classes.TableCell}>Status</TableCell>
                    <TableCell className={classes.TableCell}>Criado Em</TableCell>
                    <TableCell className={classes.TableCell}>Vencimento</TableCell>
                    <TableCell className={classes.TableCell} align="center">Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.TableCell}>{row.nome}</TableCell>
                      <TableCell className={classes.TableCell}>{row.email || '-'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.telefone || '-'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.plano || 'Plano 1'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.campanhas || 'Desabilitadas'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.status || 'Sim'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.createdAt || 'xx/xx/xxxx'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.vencimento || 'xx/xx/xxxx'}</TableCell>
                      <TableCell className={classes.actionCell}>
                        <IconButton onClick={() => handleEdit(index)} size='small'>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(index)} size='small'>
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}
export default SettingsCustom;

