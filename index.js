const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio'); // Agregar cheerio

const app = express();

app.get('/:teamName', async (req, res) => {
    const teamName = req.params.teamName.toLowerCase().trim(); // Convertir a minúsculas y eliminar espacios

    try {
        const response = await axios.get(`https://www.vlr.gg/matches`); // Obtener la página de partidos

        const $ = cheerio.load(response.data); // Cargar el HTML en cheerio
        const results = [];

        // Buscar en los partidos
        $('.wf-card').each((index, element) => {
            // Obtener la fecha del partido desde el contexto superior
            const rawMatchDate = $(element).prevAll('.wf-label.mod-large').first().text().trim(); // Obtener la fecha del partido
            const matchDate = rawMatchDate.split('Today')[0].trim(); // Formatear la fecha para eliminar "Today" y espacios

            const matchItems = $(element).find('.wf-module-item.match-item'); // Obtener los elementos de los partidos

            matchItems.each((i, match) => {
                const matchTime = $(match).find('.match-item-time').text().trim(); // Obtener la hora del partido
                const team1 = $(match).find('.match-item-vs-team').first().find('.match-item-vs-team-name .text-of').text().toLowerCase().trim(); // Obtener el nombre del equipo 1
                const team2 = $(match).find('.match-item-vs-team').last().find('.match-item-vs-team-name .text-of').text().toLowerCase().trim(); // Obtener el nombre del equipo 2

                // Debugging: Imprimir los nombres de los equipos y la fecha
                console.log(`Fecha: ${matchDate}, Hora: ${matchTime}, Equipo 1: ${team1}, Equipo 2: ${team2}`);

                // Verificar si el nombre del equipo ingresado coincide con alguno de los equipos
                if (team1.includes(teamName) || team2.includes(teamName)) {
                    // Almacenar la fecha y hora del partido
                    results.push({ matchDate, matchTime, team1, team2 }); // Almacenar la fecha, la hora, el nombre del equipo 1 y el nombre del equipo 2
                }
            });
        });

        // Verificar si se encontraron resultados
        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron resultados para el equipo ingresado.' });
        }

        // Enviar los resultados como respuesta
        res.json(results.map(result => ({
            matchDate: result.matchDate,
            matchTime: result.matchTime,
            team1: result.team1,
            team2: result.team2
        }))); // Asegurarse de que solo se envíen datos simples

    } catch (error) {
        console.error(error); // Cambiar a console.error para errores
        res.status(500).send('Error al buscar el equipo');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});