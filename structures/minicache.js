const { Collection } = require("discord.js");

class MiniCache extends Collection{
    constructor(defaulttime = 0){
        super();
        this.defaulttime = defaulttime;
    }

    tset(key, val, time = this.defaulttime){
        if(this.has(key)) clearTimeout(super.get(key).time);
        this.set(key, {
            time: setTimeout(this.delete.bind(this, key), time).unref(),
            val
        });
    }

    get(key){
        let ret = super.get(key);
        if(ret) return ret.val;
        return null;
    }

    getOrSet(key, val, time = this.defaulttime){
        if(this.has(key)) return this.get(key);
        this.tset(key, val, time);
        return val;
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