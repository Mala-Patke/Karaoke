const axios = require('axios').default;
const cheerio = require('cheerio');

function parseTextFromChildren(children){
    let ret = '';
    for(let child of children){
        
        if(child.type == 'text') ret += child.data;
        if(child.type == 'tag' && child.name === 'br') ret += '\n';
        if(child.type == 'tag' && child.children.length){
            //console.log(child.children)
            ret += parseTextFromChildren(child.children)
        } //console.log(child.name)
    }
    return ret;
}

module.exports = async (url) => {
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let page = $('div[class*="Lyrics__Container"]')
    console.log(page.length);

    let ret = '';
    page.each((index, i) => {
        //console.log(index)
        ret += parseTextFromChildren(i.children)
    })
    return ret;
}
