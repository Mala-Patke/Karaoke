/**
 * I hate regex, regex hates me. We are happy family
 * @param {string} lyrics
 * @param {string[]} bannedWords
 * @param {boolean} user
 */
function parseLyrics(lyrics, bannedWords = [], user = false){
    if(!user)
        return lyrics
            .toLowerCase()
            //Characters that can be replaced with spaces
            .replace(/[-]/g, ' ')
            //Characters that can be completely deleted
            .replace(/['"’,.?¿!¡:#*;\(\)]/g, '')
            //Tally Hall rule
            .replace('&', 'and')
            //Remove BannedWords
            .replace(new RegExp(bannedWords.map(elem => `(${elem}\\w*)`).join('|'), 'g'), '{}')
            //Kill all double+ linebreaks
            .split(/\n+/g)
            //Remove everything inside of brackets
            .filter(elem => !elem.startsWith('['))
            .join('\n')
            //Replace any double spaces previous methods may have caused
            .replace(/ +/g, ' ')
            //Remove funny space characters that exist for no good reason
            .replace(/\u2005/g, ' ')
    else return lyrics //Not going to recomment every line
        .toLowerCase()
        .replace(/[-]/g, ' ')
        .replace(/['"’,.?¿!¡:;\(\)]/g, '')
        .replace('&', 'and')
        .replace(/[^\s]*[*#][^\s]*/g, '{}')
        .split(/\n+/g)
        .filter(elem => !elem.startsWith('['))
        .join('\n')
        .replace(/ +/g, ' ');
}

module.exports = parseLyrics;