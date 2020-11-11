const axios = require('axios').default;
const cheerio = require('cheerio');

module.exports = async (url) => {
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $('div[class="lyrics"]').text().trim();
}