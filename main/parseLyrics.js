/**
 * I hate regex, regex hates me. We are happy family
 * @param {string} lyrics
 * @param {string[]} bannedwords
 */
function parseLyrics(lyrics, bannedwords){
    return lyrics
        .toLowerCase()
        //Characters that can be replaced with spaces
        .replace(/[-]/g, ' ')
        //Characters that can be completely deleted
        .replace(/['"’,.?!:;\(\)]/g, '')
        //Fuck you Tally Hall
        .replace('&', 'and')
        //Kill all double+ linebreaks
        .split(/\n+/g)
        //Remove everything inside of brackets
        .filter(elem => !elem.startsWith('['))
        //Filter out banned words
        .map(elem => {
            if(!bannedwords.length) return elem;
            return elem.replace(new RegExp(`(${bannedwords.join(')|(')})`, 'g'), '+=-=!')
        })
        .join('\n');
}

module.exports = parseLyrics;