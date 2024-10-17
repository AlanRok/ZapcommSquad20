import React from "react";
import { useParams } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";

import TicketsManager from "../../components/TicketsManagerTabs/";
import Ticket from "../../components/Ticket/";
import logo from "../../assets/logo.png"; //PLW DESIGN LOGO//
import { i18n } from "../../translate/i18n";
import lupaIcon from "../../assets/lupa.png";

const useStyles = makeStyles(theme => ({
	chatContainer: {
		flex: 1,
		// backgroundColor: "#eee",
		padding: theme.spacing(1), //Aqui ele ajusta espaço na tela de ticket
		height: `calc(100% - 48px)`,
		overflowY: "hidden",
	},

	chatPapper: {
		// backgroundColor: "red",
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
		backgroundColor: '#FCFCFF', //Cor de fundo aplica aqui
		display: "flex",
		justifyContent: "space-evenly",
		alignItems: "center",
		height: "100%",
		textAlign: "center",
	},
}));

const TicketsCustom = () => {
	const classes = useStyles();
	const { ticketId } = useParams();

	return (
		<div className={classes.chatContainer}>
			<div className={classes.chatPapper}>
				<Grid container spacing={0}>
					<Grid item xs={4} className={classes.contactsWrapper}>
						<TicketsManager />
					</Grid>
					<Grid item xs={8} className={classes.messagesWrapper}>
						{ticketId ? (
							<>
								<Ticket />
							</>
						) : (
							<Paper square variant="outlined" className={classes.welcomeMsg} style={{ padding: "40px", height: "100%", display: "block", backgroundColor: "#F2F5FF" }}>
							<header 
							style={{ 
								width: '100%', 
								marginTop: 0, 
								display: 'flex', 
								flexDirection: 'column', 
								alignItems: 'flex-start' 
								}}>
								<h2
								style={{ 
									fontFamily: 'Arial, Helvetica, sans-serif', 
									marginTop: 0 
									}}>Chamados</h2>
								<div style={{ 
									width: '100%' 
									}}> {/* Para o formulário ocupar toda a largura */}
								<form
									style={{
									width: '100%',
									maxWidth: 'calc(100% - 100px)',
									height: '44px',
									margin: '0 auto',
									backgroundColor: 'rgba(255, 255, 255, 0.7)',
									borderRadius: '8px',
									display: 'flex',
									alignItems: 'center',
									padding: '0 10px',
									}}>
									
									<img
									src={lupaIcon} // Usando a imagem da lupa
									alt="Lupa"
									style={{ width: '20px', height: '20px', marginRight: '8px' }} // Estilo da imagem
									/>
									<input
									type="text"
									id="fname"
									name="fname"
									placeholder="Pesquisar..."
									style={{
										width: '100%',
										height: '100%',
										border: 'none',
										outline: 'none',
										boxSizing: 'border-box',
									}}
									/>
								</form>
								</div>
							</header>
							</Paper>

						)}
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default TicketsCustom;
