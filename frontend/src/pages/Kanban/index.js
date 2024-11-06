import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(1),
  },
  button: {
    background: "#10a110",
    border: "none",
    padding: "10px",
    color: "white",
    fontWeight: "bold",
    borderRadius: "5px",
    display: 'flex'
  },

}));

const Kanban = () => {
  const classes = useStyles();
  const history = useHistory();

  const [tags, setTags] = useState([]);
  const [reloadData, setReloadData] = useState(false);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);


  const fetchTags = async () => {
    try {
      const response = await api.get("/tags/kanban");

      const fetchedTags = response.data.lista || [];
      setTags(fetchedTags);

      // Fetch tickets after fetching tags
      await fetchTickets(jsonString);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const [file, setFile] = useState({
    lanes: []
  });


  const [tickets, setTickets] = useState([]);
  const { user } = useContext(AuthContext);
  const { profile, queues } = user;
  const jsonString = user.queues.map(queue => queue.UserQueue.queueId);

  const fetchTickets = async (jsonString) => {
    try {

      const { data } = await api.get("/ticket/kanban", {
        params: {
          queueIds: JSON.stringify(jsonString),
          teste: true
        }
      });
      setTickets(data.tickets);
    } catch (err) {
      console.log(err);
      setTickets([]);
    }
  };


  const popularCards = (jsonString) => {
    const filteredTickets = tickets.filter(ticket => ticket.tags.length === 0);
    const emAtendimentoTickets = tickets.filter(ticket => ticket.status === "em_atendimento");
    const finalizadoTickets = tickets.filter(ticket => ticket.status === "finalizado");
    const impedidoTickets = tickets.filter(ticket => ticket.status === "impedido");
    const aguardandoFornecedorTickets = tickets.filter(ticket => ticket.status === "aguardandoFornecedor");

    const lanes = [
      {
        id: "lane0",
        title: i18n.t("Em aberto"),
        label: tickets.length,
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
            <div
              style={{
                backgroundColor: tags.color,
                width: "7px",
                height: "70px",
                borderRadius: "3px",
                marginRight: "10px",
              }}>
              <p>
                {ticket.contact.number}
                <br />
                {ticket.lastMessage}
              </p>
              <button
                className={classes.button}
                onClick={() => {
                  handleCardClick(ticket.uuid)
                }}>
                Ver Ticket
              </button>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
        })),
        style: { backgroundColor: "#364865", color: "white" }
      },
      {
        id: "lane1",
        title: "Em atendimento",
        label: emAtendimentoTickets.length,
        cards: [],
        style: { backgroundColor: "#364865", color: "white" }
      },
      {
        id: "lane2",
        title: "Aguardando Fornecedor",
        label: aguardandoFornecedorTickets.length,
        cards: [],
        style: { backgroundColor: "#364865", color: "white" }
      },
      {
        id: "lane3",
        title: "Impedido",
        label: impedidoTickets.length,
        cards: [],
        style: { backgroundColor: "#364865", color: "white" }
      },
      {
        id: "lane4",
        title: "Finalizado",
        label: finalizadoTickets.length,
        cards: [],
        style: { backgroundColor: "#364865", color: "white" }
      },
      ...tags.map(tag => {
        const filteredTickets = tickets.filter(ticket => {
          const tagIds = ticket.tags.map(tag => tag.id);
          return tagIds.includes(tag.id);
        });

        return {
          id: tag.id.toString(),
          title: tag.name,
          label: tag.id.toString(),
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: "Ticket nº " + ticket.id.toString(),
            description:(
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#E3E3E3",
                  borderRadius: "5px",
                  padding: "10px",
                  marginBottom: "10px",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                  justifyContent: "space-between",
                  maxWidth: "100%",
                }}>
                <div
                  style={{
                    backgroundColor: tag.color ,
                    width: "7px",
                    height: "70px",
                    borderRadius: "3px",
                    marginRight: "10px",
                  }}>
                </div>
                <div style={{ flex: 1, maxWidth: "70%" }}>
                  <p
                    style={{
                      color: "#000000",
                      margin: "0 0 5px 0",
                      fontWeight: "bold",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>{ticket.contact.name}</p>
                  <p
                    style={{
                      color: "#000000",
                      margin: "0",
                      wordWrap: "break-word",
                      overflow: "hidden",
                      maxHeight: "40px",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",}}>
                    {ticket.contact.number}
                    <br/>
                    {ticket.lastMessage}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    style={{
                      backgroundColor: "#0C2C54",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "5px",
                      padding: "5px 15px",
                      cursor: "pointer",
                      fontSize: "12px",
                      maxWidth: "50px",
                      textAlign: "center",}}
                    className={classes.button}
                    onClick={() => {
                      handleCardClick(ticket.uuid);}}>Ver</button>
                </div>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid,
          })),
          style: { backgroundColor: "#364865", color: "white" }
        };
      }),
    ];

    setFile({ lanes });
  };

  const handleCardClick = (uuid) => {
    //console.log("Clicked on card with UUID:", uuid);
    history.push('/tickets/' + uuid);
  };

  useEffect(() => {
    popularCards(jsonString);
  }, [tags, tickets, reloadData]);

  const handleCardMove = async (cardId, sourceLaneId, targetLaneId) => {
    try {

      await api.delete(`/ticket-tags/${targetLaneId}`);
      toast.success('Ticket Tag Removido!');
      await api.put(`/ticket-tags/${targetLaneId}/${sourceLaneId}`);
      toast.success('Ticket Tag Adicionado com Sucesso!');

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.root}>
      <Board
        data={file}
        onCardMoveAcrossLanes={handleCardMove}
        style={{ backgroundColor: 'rgba(252, 252, 252, 0.03)' }}
      />
    </div>
  );
};


export default Kanban;