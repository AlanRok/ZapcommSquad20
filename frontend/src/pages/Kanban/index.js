import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
import "./responsive.css";

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
        // PARA ESTILIZAR A LANE 
        style: { backgroundColor: "#364865", color: "white" },
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "#364865",
                  width: "20px",
                  height: "9px",
                  borderRadius: "3px",
                  marginRight: "5px",
                }}
              />
              <span>Ticket nº {ticket.id.toString()}</span>
            </div>
          ),
          description: (
            <div>
              <p style={{ wordWrap: "break-word", overflow: "hidden", maxHeight: "40px" }}>
                {ticket.contact.number}
                <br />
                {ticket.lastMessage}
              </p>
              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  className={classes.button}
                  onClick={() => {
                    handleCardClick(ticket.uuid);
                  }}
                >
                  Ver Ticket
                </button>
              </div>
            </div>
          ),
          title: ticket.contact.name,
          draggable: true,
          href: "/tickets/" + ticket.uuid,
          // style: { backgroundColor: "#FFF", color: "white" } para estilização do card (caso precise)
        })),
      },
      {
        id: "lane1",
        title: "Em atendimento",  
        label: emAtendimentoTickets.length,
        style: { backgroundColor: "#364865", color: "white" },
        cards: [],
      },
      {
        id: "lane2",
        title: "Aguardando Fornecedor",  
        label: aguardandoFornecedorTickets.length,
        style: { backgroundColor: "#364865", color: "white" },
        cards: [],
      },
      {
        id: "lane3",
        title: "Impedido",  
        label: impedidoTickets.length,
        style: { backgroundColor: "#364865", color: "white" },
        cards: [],
      },
      {
        id: "lane4",
        title: "Finalizado",  
        label: finalizadoTickets.length,
        style: { backgroundColor: "#364865", color: "white" },
        cards: [],
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
          style: { backgroundColor: tag.color, color: "white" },
          cards: filteredTickets.map(ticket => ({
            id: ticket.id.toString(),
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    backgroundColor: tag.color,
                    width: "20px",
                    height: "9px",
                    borderRadius: "3px",
                    marginRight: "5px",
                  }}
                />
                <span>Ticket nº {ticket.id.toString()}</span>
              </div>
            ),
            description: (
              <div>
                <p style={{ wordWrap: "break-word", overflow: "hidden", maxHeight: "40px" }}>
                  {ticket.contact.number}
                  <br />
                  {ticket.lastMessage}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <button
                    className={classes.button}
                    onClick={() => {
                      handleCardClick(ticket.uuid);
                    }}
                  >
                    Ver Ticket
                  </button>
                </div>
              </div>
            ),
            title: ticket.contact.name,
            draggable: true,
            href: "/tickets/" + ticket.uuid,
          })),
          
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