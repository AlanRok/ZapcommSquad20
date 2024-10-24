import React, { useState, useEffect } from "react";
import { makeStyles, Paper, Tabs, Tab, Button, TextField, MenuItem, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
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
import homem1 from '../../assets/homem1.png';
import mulher2 from '../../assets/mulher2.png';
import mulher4 from '../../assets/mulher4.png';
import homem5 from '../../assets/homem5.png';
import ExpandMore from "@material-ui/icons/ExpandMore";



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
      fontWright: 'bold',
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
  },
  tableCellCheckboxImage: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: theme.spacing(1),
  },
  TableCell: {
    border: '2px solid rgba(0, 0, 0, 0.25)',
    borderRadius: '2px',
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
    backgroundColor: '#FFFFFF'
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
    paddingRight: theme.spacing(4),
    textAlign: 'Center'
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
  const imageArray = [
    homem1,
    mulher2,
    mulher4,
    homem5,
  ];


  const handleSearch = (event) => {
    setSearchParam(event.target.value.toLowerCase());
  };
  const [tableData, setTableData] = useState([]);
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
      setTableData((prevData) => [...prevData, newEntry]);
      handleClear();
    }
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
      onClick={() => {
        if (value === "helps") {
          setHelpSubOptionsVisible(!isHelpSubOptionsVisible);
          setHelpTab("");
        } else {
          handleTabChange(value);
        }
      }}
    >
      {label}
    </div>
  );
  const renderHelpTab = () => {
    if (helpTab == 'tutorials') {
      return (

        <div>
          <MainHeader>
            <TextField
              id="outlined-basic"
              label=""
              variant="outlined"
              size="small"
              placeholder={i18n.t("contacts.searchPlaceholder")}
              type="search"
              value={searchParam}
              onChange={handleSearch}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "gray" }} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: "5px",
                  display: 'flex',
                  backgroundColor: 'white',
                  marginTop: '68px',
                },
              }}
            />
          </MainHeader>
          <div style={{ marginTop: '27px', color: "#192F64", fontSize: "10px", textDecoration: 'underline' }}>
            <h2>Todos os Links</h2>
          </div>
          <div fullWidth>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCellCheckbox}>
                      <Checkbox />
                      Vídeo
                    </TableCell>
                    <TableCell align='center'>Link</TableCell>
                    <TableCell align="center" className={classes.actionCell}>Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {["Vídeo 1", "Vídeo 2", "Vídeo 3", "Vídeo 4"].map(
                    (video, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.tableCellCheckbox}>
                          <Checkbox />
                          {video}
                        </TableCell>
                        <TableCell className={classes.tableCellLink} align="center">
                          <a
                            href={`https://docs.google.com/document/d/1lwbwMPhTGQfGFOf3D9MjxriNZg2iYF5eLz4DRgXPkac/edit#${index}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            https://docs.google.com/document/d/1lwbwMPhTGQfGFOf3D9MjxriNZg2iYF5eLz4DRgXPkac/edit
                          </a>
                        </TableCell>
                        <TableCell align="center" className={classes.actionCell}>
                          <img
                            src={pencilicon}
                            alt="edit"
                            className={classes.actionIcon}
                          />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      );
    }
    if (helpTab == 'administration') {
      return (
        <div>
          <MainHeader>
            <TextField
              id="outlined-basic"
              label=""
              variant="outlined"
              size="small"
              placeholder={i18n.t("contacts.searchPlaceholder")}
              type="search"
              value={searchParam}
              onChange={handleSearch}
              fullWidth

              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon style={{ color: "gray" }} />
                  </InputAdornment>
                ),
                style: {
                  borderRadius: "5px",
                  display: 'flex',
                  backgroundColor: 'white',
                  marginTop: '68px',
                },
              }}
            />
          </MainHeader>

          <div style={{ color: "#192F64", fontSize: "10px", textDecoration: 'underline' }}>
            <h2>Todos os Links</h2>
          </div>
          <div >
            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.tableCellCheckboxImage}> <Checkbox />Contato</TableCell>
                    <TableCell align="center">Link</TableCell>
                    <TableCell align="center" className={classes.actionCell}>Ação</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {["Trevor C. Lemon", "Sheila M. Dooley", "Marcela S. Ferrais", "Marcos C. Pinheiro"].map(
                    (contato, index) => (
                      <TableRow key={index}>
                        <TableCell className={classes.tableCellCheckboxImage}>
                          <Checkbox />
                          <img src={imageArray[index]} alt={`Imagem de ${contato}`} className={classes.imageIcon} />
                          {contato}
                        </TableCell>
                        <TableCell className={classes.tableCellLink} align="center">
                          <a
                            href={`https://docs.google.com/document/d/1lwbwMPhTGQfGFOf3D9MjxriNZg2iYF5eLz4DRgXPkac/edit#${index}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            https://docs.google.com/document/d/1lwbwMPhTGQfGFOf3D9MjxriNZg2iYF5eLz4DRgXPkac/edit
                          </a>
                        </TableCell>
                        <TableCell align="center" className={classes.actionCell}>
                          <img src={pencilicon} alt="edit" className={classes.actionIcon} />
                        </TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>

      );
    }
    return null;
  };
  return (
    <div className={classes.root}>
      <div className={classes.sidebar}>
        <h3>Configurações</h3>
        {renderSidebarItem("Opções", "options")}
        {renderSidebarItem("Empresas", "companies")}
        <div onClick={() => setHelpSubOptionsVisible(!isHelpSubOptionsVisible)}>
          <div
            className={`${classes.sidebarItem} ${tab === "helps" ? classes.active : ""}`}
          >
            Ajuda
            <ExpandMore position='end' align='center' style={{ marginLeft: 13, algin: 'center', transform: isHelpSubOptionsVisible ? 'rotate(180deg)' : 'rotate(0deg)', color: "gray" }} />
          </div>
        </div>
        {isHelpSubOptionsVisible && (
          <div style={{ marginLeft: '20px' }}>
            <div className={classes.sidebarItem} onClick={() => handleHelpSubOptionClick("tutorials")}>
              Tutoriais
            </div>
            <div className={classes.sidebarItem} onClick={() => handleHelpSubOptionClick("administration")}>
              Administração
            </div>
          </div>
        )}
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
              <Table className={classes.table} style={{ backgroundColor: "#F8F8F9", borderCollapse: 'collapse' }}>
                <TableHead>
                  <TableRow style={{ fontWeight: 'bold' }}>
                    <TableCell className={classes.TableCell} style={{ textAlign: 'center' }}>#</TableCell>
                    <TableCell className={classes.TableCell}>Nome</TableCell>
                    <TableCell className={classes.TableCell}>E-mail</TableCell>
                    <TableCell className={classes.TableCell}>Telefone</TableCell>
                    <TableCell className={classes.TableCell}>Plano</TableCell>
                    <TableCell className={classes.TableCell}>Campanhas</TableCell>
                    <TableCell className={classes.TableCell}>Status</TableCell>
                    <TableCell className={classes.TableCell}>Criado Em</TableCell>
                    <TableCell className={classes.TableCell}>Vencimento</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow style={{ fontWeight: 'bold' }}>
                    <TableCell className={classes.TableCell} style={{ textAlign: 'center' }}><img src={pencilicon}></img></TableCell>
                    <TableCell className={classes.TableCell}>Empresa 1</TableCell>
                    <TableCell className={classes.TableCell} align='center'>-</TableCell>
                    <TableCell className={classes.TableCell} align="center">-</TableCell>
                    <TableCell className={classes.TableCell}>Plano1</TableCell>
                    <TableCell className={classes.TableCell}>Desabilitadas</TableCell>
                    <TableCell className={classes.TableCell}>Sim</TableCell>
                    <TableCell className={classes.TableCell} align="center">xx/xx/xxxx</TableCell>
                    <TableCell className={classes.TableCell} align="center">xx/xx/xxxx</TableCell>
                  </TableRow>
                  <TableRow style={{ fontWeight: 'bold' }}>
                    <TableCell className={classes.TableCell} style={{ textAlign: 'center' }}><img src={pencilicon}></img></TableCell>
                    <TableCell className={classes.TableCell}>Empresa 2</TableCell>
                    <TableCell className={classes.TableCell} align='center'>-</TableCell>
                    <TableCell className={classes.TableCell} align="center">-</TableCell>
                    <TableCell className={classes.TableCell}>Plano2</TableCell>
                    <TableCell className={classes.TableCell}>Habilitadas</TableCell>
                    <TableCell className={classes.TableCell}>Sim</TableCell>
                    <TableCell className={classes.TableCell} align="center">xx/xx/xxxx</TableCell>
                    <TableCell className={classes.TableCell} align="center">xx/xx/xxxx</TableCell>
                  </TableRow>
                  {tableData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className={classes.TableCell} style={{ textAlign: 'center' }}>
                        <img src={pencilicon} alt="edit" />
                      </TableCell>
                      <TableCell className={classes.TableCell}>{row.nome}</TableCell>
                      <TableCell className={classes.TableCell}>{row.email || '-'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.telefone || '-'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.plano || 'Plano 1'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.campanhas || 'Desabilitadas'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.status || 'Sim'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.createdAt || 'xx/xx/xxxx'}</TableCell>
                      <TableCell className={classes.TableCell}>{row.vencimento || 'xx/xx/xxxx'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
        {tab === "helps" && renderHelpTab()}


      </div>
    </div>
  );
}
export default SettingsCustom;

