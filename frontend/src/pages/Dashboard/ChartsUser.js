import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import brLocale from 'date-fns/locale/pt-BR';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { Button, Stack, TextField } from '@mui/material';
import Typography from "@material-ui/core/Typography";
import api from '../../services/api';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import './button.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
);

export const options = {
    responsive: true,
    indexAxis: 'y', // Configuração para exibir o gráfico de barras horizontalmente
    plugins: {
        legend: {
            position: 'top',
            display: false,
        },
        tooltip: {
            enabled: true,
        },
        datalabels: {
            display: true,
            color: "#000",
            anchor: 'end',
            align: 'right',
            font: {
                weight: "bold",
                size: 12,
            },
            formatter: (value) => value, // Exibe o valor ao lado de cada barra
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Quantidade de Chamados',
            },
            beginAtZero: true,
        },
        y: {
            title: {
                display: true,
                text: 'Usuários',
            },
        },
    },
};

export const ChatsUser = () => {
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [ticketsData, setTicketsData] = useState({ data: [] });

    const companyId = localStorage.getItem("companyId");

    useEffect(() => {
        handleGetTicketsInformation();
    }, []);

    const dataCharts = {
        labels: ticketsData?.data.map((item) => item.nome),
        datasets: [
            {
                label: 'Quantidade de Chamados',
                data: ticketsData?.data.map((item) => item.quantidade),
                backgroundColor: '#33d0a1',
                barThickness: 20, // Define a grossura máxima da barra
                maxBarThickness: 20, // Define grossura máxima para opção dinâmica
            },
        ],
    };

    const handleGetTicketsInformation = async () => {
        try {
            const { data } = await api.get(`/dashboard/ticketsUsers?initialDate=${format(initialDate, 'yyyy-MM-dd')}&finalDate=${format(finalDate, 'yyyy-MM-dd')}&companyId=${companyId}`);
            setTicketsData(data);
        } catch (error) {
            toast.error('Erro ao obter informações da conversa');
        }
    };

    return (
        <>
            <Typography component="h2" variant="h6" color="#000000" gutterBottom>
                Quantidade de Chamados por Usuário
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ my: 2 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                    <DatePicker
                        value={initialDate}
                        onChange={(newValue) => setInitialDate(newValue)}
                        label="Início"
                        renderInput={(params) => <TextField fullWidth {...params} sx={{ width: '20ch' }} />}
                    />
                </LocalizationProvider>

                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={brLocale}>
                    <DatePicker
                        value={finalDate}
                        onChange={(newValue) => setFinalDate(newValue)}
                        label="Fim"
                        renderInput={(params) => <TextField fullWidth {...params} sx={{ width: '20ch' }} />}
                    />
                </LocalizationProvider>

                <Button className="buttonHover" onClick={handleGetTicketsInformation} variant="contained">
                    Filtrar
                </Button>
            </Stack>

            <Bar options={options} data={dataCharts} style={{ maxWidth: '100%', maxHeight: '280px' }} />
        </>
    );
};
