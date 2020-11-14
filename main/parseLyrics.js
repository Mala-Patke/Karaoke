/**
 * I hate regex, regex hates me. We are happy family
 * @param {string} lyrics
 */
function parseLyrics(lyrics){
    return lyrics
        .toLowerCase()
        //Characters that can be replaced with spaces
        .replace(/[-]/g, ' ')
        //Characters that can be completely deleted
        .replace(/['"’,.?¿!¡:*;\(\)]/g, '')
        //Fuck you Tally Hall
        .replace('&', 'and')
        //Kill all double+ linebreaks
        .split(/\n+/g)
        //Remove everything inside of brackets
        .filter(elem => !elem.startsWith('['))
        .join('\n')
        //Replace any double spaces previous methods may have caused
        .replace(/ +/g, ' ');
}

module.exports = parseLyrics;