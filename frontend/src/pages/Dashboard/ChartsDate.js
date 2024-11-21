import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
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
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
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
            align: 'bottom',
            font: {
                weight: "bold",
                size: 12,
            },
            formatter: (value) => value, // Exibe o valor acima de cada ponto
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'Datas',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Total de Chamados',
            },
            beginAtZero: true,
        },
    },
};

export const ChartsDate = () => {
    const [initialDate, setInitialDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState(new Date());
    const [ticketsData, setTicketsData] = useState({ data: [], count: 0 });
    const companyId = localStorage.getItem("companyId");

    useEffect(() => {
        handleGetTicketsInformation();
    }, []);

    const dataCharts = {
        labels: ticketsData?.data.map((item) =>
            item.hasOwnProperty('horario') ? `Das ${item.horario}:00 às ${item.horario}:59` : item.data
        ),
        datasets: [
            {
                label: 'Total de Chamados',
                data: ticketsData?.data.map((item) => item.total),
                borderColor: '#33d0a1',
                backgroundColor: 'rgba(45, 221, 127, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#33d0a1',
                pointBorderColor: '#33d0a1',
                pointHoverRadius: 6,
                pointRadius: 5,
            },
        ],
    };

    const handleGetTicketsInformation = async () => {
        try {
            const { data } = await api.get(`/dashboard/ticketsDay?initialDate=${format(initialDate, 'yyyy-MM-dd')}&finalDate=${format(finalDate, 'yyyy-MM-dd')}&companyId=${companyId}`);
            setTicketsData(data);
        } catch (error) {
            toast.error('Erro ao buscar informações dos tickets');
        }
    };

    return (
        <>
            <Typography component="h2" variant="h6" color="#000" gutterBottom>
                Total de Chamados ({ticketsData?.count})
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

            <Line options={options} data={dataCharts} style={{ maxWidth: '100%', maxHeight: '280px' }} />
        </>
    );
};
