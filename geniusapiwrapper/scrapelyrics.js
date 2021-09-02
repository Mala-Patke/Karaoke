const axios = require('axios').default;
const cheerio = require('cheerio');

function parseTextFromChildren(children){
    let ret = '';
    for(let child of children){     
        if(child.type == 'text') ret += child.data;
        if(child.type == 'tag' && child.name === 'br') ret += '\n';
        if(child.type == 'tag' && child.children.length)ret += parseTextFromChildren(child.children)
    }
    return ret;
}

module.exports = async (url) => {
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let page = $('div[class*="Lyrics__Container"]')

    let ret = '';
    page.each((index, i) => ret += parseTextFromChildren(i.children) )
    return ret;
}
