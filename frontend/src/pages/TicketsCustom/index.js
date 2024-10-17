import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Checkbox from "@material-ui/core/Checkbox";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";
import SearchIcon from "@material-ui/icons/Search";

// Imagens de perfil :D
import trevorPic from "../../assets/trevor.png";
import sheilaPic from "../../assets/sheila.png";
import marcelaPic from "../../assets/marcela.png";
import marcosPic from "../../assets/marcos.png";

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    flex: 1,
    padding: theme.spacing(1),
    height: `calc(100% - 48px)`,
    overflowY: "hidden",
  },
  chatPapper: {
    display: "flex",
    height: "100%",
  },
  contactsWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflowY: "hidden",
  },
  messagesWrapper: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
  },
  welcomeMsg: {
    backgroundColor: "#FCFCFF",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
  },
  searchBar: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "8px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
  },
  input: {
    width: "100%",
    border: "none",
    outline: "none",
    boxSizing: "border-box",
    paddingLeft: "8px",
    backgroundColor: "transparent",
  },
  contactListContainer: {
    marginTop: "53px",
  },
  contactList: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: "8px",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    padding: theme.spacing(2),
  },
  contactCard: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
    margin: theme.spacing(1, 0),
    backgroundColor: "transparent",
    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
  },
  profilePic: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: theme.spacing(2),
  },
  contactInfo: {
    flexGrow: 1,
    display: "flex",
    justifyContent: "space-between",
  },
  contactDetails: {
    display: "flex",
    flexDirection: "column",
  },
  name: {
    fontSize: "15px",
    fontWeight: "bold",
  },
  email: {
    fontSize: "12px",
    opacity: 0.5,
    marginTop: "0",
  },
  otherInfo: {
    fontSize: "0.8em",
    display: "flex",
    gap: theme.spacing(4),
    marginTop: "6px",
    marginRight: '14em',
  },
  header: {
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
    textAlign: "left",
  },
  headers: {
    display: "flex",
    marginBottom: "-5px",
  },
  line: {
    borderBottom: "1px solid rgba(0, 0, 0, 0.2)",
    marginBottom: "3px",
  },
  infoContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: theme.spacing(1),
    paddingLeft: theme.spacing(9),
  },
  chipNumber: {
    marginRight: theme.spacing(5),
    marginLeft: theme.spacing(4),
  },
  headerElement: {
    marginRight: theme.spacing(4),
    flex: 1, 
    "@media (max-width: 600px)": {
      marginRight: theme.spacing(2), 
      fontSize: "12px", 
    },
  },
  headerTitle: {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontSize: "24px",
    fontWeight: "400",
    margin: "0 0 8.4px 0",
  },
}));

// Lista de contatos fictícia
const contactList = [
  {
    id: 1,
    name: "Trevor C. Lemon",
    email: "trevor.lemon@gmail.com",
    chipNumber: "12345",
    company: "Empresa A",
    phone: "+79 1234-5678",
    profilePic: trevorPic,
  },
  {
    id: 2,
    name: "Sheila M. Dooley",
    email: "sheila.dookley@gmail.com",
    chipNumber: "67890",
    company: "Empresa B",
    phone: "+79 9876-5432",
    profilePic: sheilaPic,
  },
  {
    id: 3,
    name: "Marcela S. Ferrais",
    email: "marcela.ferrais@gmail.com",
    chipNumber: "67590",
    company: "Empresa Z",
    phone: "+79 99930-3213",
    profilePic: marcelaPic,
  },
  {
    id: 4,
    name: "Marcos C. Pinheiro",
    email: "marcos.pinheiro@gmail.com",
    chipNumber: "32190",
    company: "Empresa X",
    phone: "+79 99930-3213",
    profilePic: marcosPic,
  },
];

const TicketsCustom = () => {
  const classes = useStyles(); // Hook para aplicar estilos
  const { ticketId } = useParams(); // Hook para obter o ID do ticket a partir dos parâmetros da URL
  const [selectedContacts, setSelectedContacts] = useState([]); // Estado para armazenar os contatos selecionados

  // Função para selecionar todos os contatos
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedContacts(contactList.map((contact) => contact.id));
    } else {
      setSelectedContacts([]);
    }
  };

  // Função para selecionar ou desmarcar um contato específico
  const handleSelectContact = (contactId) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter((id) => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  return (
    <div className={classes.chatContainer}>
      <div className={classes.chatPapper}>
        <Grid container spacing={0}>
          {/* Seção esquerda da tela */}
          <Grid item xs={4} className={classes.contactsWrapper}>
            <TicketsManager />
          </Grid>
          {/* Seção direita da tela */}
          <Grid item xs={8} className={classes.messagesWrapper}>
            {ticketId ? (
              <Ticket />
            ) : (
              <Paper
                square
                variant="outlined"
                className={classes.welcomeMsg}
                style={{
                  padding: "40px",
                  height: "100%",
                  display: "block",
                  backgroundColor: "#F2F5FF",
                }}
              >
                <header
                  style={{
                    width: "100%",
                    marginTop: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <h5 className={classes.headerTitle}>
                    Chamados
                  </h5>
                </header>

                {/* Barra de Pesquisa */}
                <div className={classes.searchBar}>
                  <SearchIcon style={{ marginRight: "8px" }} /> 
                  <input
                    type="text"
                    placeholder="Pesquisar..."
                    className={classes.input}
                  />
                </div>

                {/* Div para lista de contatos com margem de 53px */}
                <div className={classes.contactListContainer}>
                  <div className={classes.contactList}>
                    {/* Cabeçalho da barra de contatos */}
                    <div className={classes.headers}>
                      <Checkbox
                        indeterminate={
                          selectedContacts.length > 0 &&
                          selectedContacts.length < contactList.length
                        }
                        checked={selectedContacts.length === contactList.length}
                        onChange={handleSelectAll}
                        color="primary"
                        style={{ marginTop: "-14px", marginLeft: '8.5px' }}
                      />
                      <span
                        className={`${classes.header} ${classes.headerElement}`}
                        style={{ marginLeft: "4px", marginRight: "18em" }}
                      >
                        Contato
                      </span>
                      <span
                        className={`${classes.header} ${classes.headerElement}`}
                        style={{ marginRight: "8em", marginLeft: "5px" }}
                      >
                        Chip
                      </span>
                      <span
                        className={`${classes.header} ${classes.headerElement}`}
                        style={{ marginRight: "8em" }}
                      >
                        Empresa
                      </span>
                      <span
                        className={`${classes.header} ${classes.headerElement}`}
                        style={{ marginRight: "14em" }}
                      >
                        Telefone
                      </span>
                      <span
                        className={`${classes.header} ${classes.headerElement}`}
                      >
                        Ação
                      </span>
                    </div>
                    <div className={classes.line}></div>

                    {/* Mapeamento e exibição da lista de contatos */}
                    {contactList.map((contact) => (
                      <div key={contact.id} className={classes.contactCard}>
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => handleSelectContact(contact.id)}
                          color="primary"
                        />
                        <img
                          src={contact.profilePic}
                          alt={contact.name}
                          className={classes.profilePic}
                        />
                        <div className={classes.contactInfo}>
                          <div className={classes.contactDetails}>
                            <span className={classes.name} >{contact.name}</span>
                            <span className={classes.email}>{contact.email}</span>
                          </div>
                          <div className={classes.otherInfo}>
                            <div className={classes.chipNumber} style={{marginRight: '70px'}}>
                              <span
                                style={{
                                  backgroundColor: "#34D3A3",
                                  borderRadius: "20px",
                                  padding: "5px 10px",
                                  color: "white",
                                  fontWeight: "bold",
                                }}
                              >
                                Chip 1
                              </span>
                            </div>
                            <div style={{marginRight: '70px'}}>{contact.company}</div>
                            <div>{contact.phone}</div>
                          </div>
                        </div>
                        {/* Botões de ação */}
                        <div>
                          <IconButton>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Paper>
            )}
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default TicketsCustom;
