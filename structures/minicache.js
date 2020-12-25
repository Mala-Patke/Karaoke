const { Collection } = require("discord.js");

class MiniCache extends Collection{
    constructor(){
        super();
    }

    tset(key, val, time){
        if(this.has(key)) clearTimeout(super.get(key).time);
        this.set(key, {
            time: setTimeout(this.delete.bind(this, key), time).unref(),
            val
        });
    }

    get(key){
        let ret = super.get(key);
        if(ret) return ret.val
        return null;
    }

    delete(key){
        let ret = super.get(key);
        try{
            clearTimeout(ret.time);
            super.delete(key);
        } catch { return; }
    }
}

module.exports = MiniCache;