const { Collection } = require("discord.js");
const { EventEmitter } = require('events');

class MiniCache extends Collection{
    constructor(){
        super();
    }

    /**
     * @private
     */
    _ee = new EventEmitter();

    tset(key, val, time){
        //Remove listener if key exists
        if(this.get(key)){
            this._ee.removeListener(key, (key) => {
                this.delete(key);
            });
        //Set Value
        } 
        
        this.set(key, {val: val, time:time})

        //Declare Listener
        this._ee.on(key, (key) => {
            this.delete(key);
        })
        
        //Await listener
        setTimeout(() => {
            this._ee.emit(key, key);
        }, time);

    }

    tget(key){
        let ret = this.get(key);
        this.tset(key, ret.val, ret.time);
        return ret.val;
    }

    take(key){
        let ret = this.get(key);
        if(ret) this.delete(key);
        return ret;
    }
}

module.exports = MiniCache;