const axios = require('axios').default;
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const headers = {
    Authorization: `Bearer ${process.env.GENIUSAPIKEY}`
}

module.exports = async (url) => {
    return new Promise((res, rej) => {
        axios.get(url, { headers: headers })
            .then(a => {
                res(a.data.response)
            }).catch(err => {
                rej(err);
            })
    })
}