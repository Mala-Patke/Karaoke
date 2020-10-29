const querystring = require('querystring');
const request = require('./geniusrequest');
const scrapelyrics = require('./scrapelyrics');
const baseurl = 'https://api.genius.com/'

module.exports.search = async (query) => {
    return await request(baseurl + `search/?${querystring.encode({q:query})}`);
}

module.exports.song = async (id) => {
    return await request(baseurl + `songs/${id}`);
}

module.exports.artist = async (id) => {
    return await request(baseurl + `artists/${id}`);
}

module.exports.lyrics = async (url) => {
    return await scrapelyrics(url);
}