const axios = require('axios').default;
require('dotenv').config();

const headers = {
    Authorization: `Bearer ${process.env.GENIUSAPIKEY}`
}

module.exports = async (url) => {
    return new Promise((res, rej) => {
        axios.get(url, { headers: headers })
            .then(a => {
                res(a.data.response)
            }).catch(err => {
                rej(err.meta.message);
            })
    })
}