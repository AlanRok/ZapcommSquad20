import React, { useState, useEffect, useReducer, useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import Board from 'react-trello';
import { toast } from "react-toastify";
import { i18n } from "../../translate/i18n";
import { useHistory } from 'react-router-dom';
<<<<<<< HEAD
import './kanban.css'
import mulher2 from '../../assets/mulher2.png';
import mulher3 from '../../assets/kanban/mulher3.png';
import homem1 from '../../assets/homem1.png';
import homem2 from '../../assets/kanban/homem2.png';
import homem3 from '../../assets/kanban/homem3.png';
import retanguloazul2 from '../../assets/kanban/retanguloazul2.png';
import retanguloverde from '../../assets/kanban/retanguloverde.png';

=======
>>>>>>> main

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

    const lanes = [
      {
        id: "lane0",
        title: i18n.t("Em aberto"),
        label: "0",
        cards: filteredTickets.map(ticket => ({
          id: ticket.id.toString(),
          label: "Ticket nº " + ticket.id.toString(),
          description: (
            <div>
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
            description: (
              <div>
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
          style: { backgroundColor: tag.color, color: "white" }
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
<<<<<<< HEAD
      <Board
        data={file}
        onCardMoveAcrossLanes={handleCardMove}
        style={{ backgroundColor: 'rgba(252, 252, 252, 0.03)' }}
      />
=======
      <Board 
		data={file} 
		onCardMoveAcrossLanes={handleCardMove}
		style={{backgroundColor: 'rgba(252, 252, 252, 0.03)'}}
    />
>>>>>>> main
    </div>
  );
};


<<<<<<< HEAD
export default Kanban;


/*
function kanbanColumns() {
  return (
    <body>
      <div className="kanban">
        <div className="column">
          <span className="textcolumntasks">Tarefas</span>
          <div className="item" draggable="true">
            <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Criar o Figma</span>          
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
            <div class="anexocome">
              <img src="public/external/raphaelclip3251-u9pq.svg" alt="" className="anexo" />
              <img src="public/external/materialsymbolslightchatoutline3251-4pqp.svg" alt="" className="comentario" />
            </div>
          </div>
          <div className="item" draggable="true">
           <div className="retangulosdoitem">
               <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
               <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Criar backlog</span>
            <div className="data"><span>15 de abril</span></div>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Organizar entrega parcial</span>
            <div className="data"><span>08 de março</span></div>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Rodar Backend</span>
            <div className="data"><span>01 de fevereiro</span></div>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
        </div>
        <div className="column">
          <span className="textcolumntasks">Em aberto</span>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Criar o Figma</span>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Criar backlog</span>
            <div className="data"><span>15 de abril</span></div>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>      
          </div>
        </div>
        <div className="column">
          <span className="textcolumntasks">Em andamento</span>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem1">Criar o Figma</span>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Criar backlog</span>
            <div className="data"><span>15 de abril</span></div>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Organizar entrega parcial</span>
            <div className="data"><span>08 de março</span></div>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
        </div>
        <div className="column">
          <span className="textcolumntasks">Concluído</span>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Criar o Figma</span>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Criar backlog</span>
            <span className="data">15 de abril</span>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>     
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Organizar entrega parcial</span>
            <span className="data">08 de março</span>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>  
          </div>
          <div className="item" draggable="true">
          <div className="retangulosdoitem">
              <img src={retanguloazul2} alt="retanguloazul" className="retanguloazul2"></img>
              <img src={retanguloverde} className="reatanguloverde"></img>
            </div>
            <span className="textoitem">Rodar Backend</span>
            <div className="data"><span>01 de fevereiro|</span></div>
            <div className="pessoas">
              <img className="homem1" src={homem1} alt="homem1"></img>
              <img className="mulher2" src={mulher2} alt="mulher2"></img>
              <img className="mulher3" src={mulher3} alt="mulher3"></img>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}
export default kanbanColumns;
*/ 
=======
export default Kanban;
>>>>>>> main
