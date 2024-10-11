const axios = require('axios');
const cheerio = require('cheerio'); 

async function getVLRMatches(teamName) {

    const response = await axios.get(`https://www.vlr.gg/matches`); 

    const $ = cheerio.load(response.data); 
    const results = [];

    
    $('.wf-card').each((index, element) => {
        
        const rawMatchDate = $(element).prevAll('.wf-label.mod-large').first().text().trim(); 
        const matchDate = rawMatchDate.split('Today')[0].trim(); 

        const matchItems = $(element).find('.wf-module-item.match-item'); 

        matchItems.each((i, match) => {
            const matchTime = $(match).find('.match-item-time').text().trim(); 
            const team1 = $(match).find('.match-item-vs-team').first().find('.match-item-vs-team-name .text-of').text().toLowerCase().trim(); 
            const team2 = $(match).find('.match-item-vs-team').last().find('.match-item-vs-team-name .text-of').text().toLowerCase().trim(); 

            
            console.log(`Fecha: ${matchDate}, Hora: ${matchTime}, Equipo 1: ${team1}, Equipo 2: ${team2}`);

          
            if (team1.includes(teamName) || team2.includes(teamName)) {
                
                results.push({ matchDate, matchTime, team1, team2 }); 
            }
        });
    });

    
    if (results.length === 0) {
        return res.status(404).json({ message: 'No se encontraron resultados para el equipo ingresado.' });
    }

   
    return results.map(result => ({
        matchDate: result.matchDate,
        matchTime: result.matchTime,
        team1: result.team1,
        team2: result.team2
    })); 

}

module.exports = {
    getVLRMatches
}   
