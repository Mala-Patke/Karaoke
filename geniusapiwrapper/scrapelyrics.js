const axios = require('axios').default;
const cheerio = require('cheerio');

module.exports = async (url) => {
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let lyrics = $('div[class="lyrics"]').text().trim();
    return !lyrics ? null : lyrics;
}