
const axios = require('axios');
const cheerio = require('cheerio'); 
const { getVLRMatches } = require('./service');

const getMatches = async (req, res) => {

    const teamName = req.params.teamName.toLowerCase().trim(); // anashi minusculeishions

    try {
        const matches = await getVLRMatches(teamName);
        res.json(matches);

    } catch (error) {
        console.error(error); 
        res.status(500).send('Error al buscar el equipo');
    }

}   

module.exports = {
    getMatches
}
