const axios = require('axios').default;
const cheerio = require('cheerio');

//TODO: FindLowestTextElement function

module.exports = async (url) => {
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let page = $('div[class*="Lyrics__Container"]')

    console.log(page[0].children[23].children[0].children[0])

    let ret = '';
    page.each((index, i) => {
        for(let j of i.children){
            if(j.type === 'text') ret += j.data
            if(j.type === 'tag' && j.name === 'a')
                ret += j.children[0].children
                    .filter(e => (e.data && e.data.length) || (e.children && e.children.length))
                    .reduce((prev, e) => {
                        let mapret = '';
                        //if(prev && prev.trim().endsWith(e.data)) return;
                        if(e.data) mapret += e.data
                        else if(e.next && e.next.children && e.next.children.length && e.next.children[0].data) {
                            //console.log(mapret)
                            console.log('1' + e.next.children[0].data)
                        } 
                            //mapret += e.next.children[0].data + e.next.next.data;
                        return `${prev}\n${mapret}`
                    }, '')
                    //.join('\n')
            else if(j.type === 'tag' && j.name === 'br') ret += '\n'
        }
    })
    return ret;
}
