require('child_process').exec('rethinkdb.exe', {
    cwd:'./database/RethinkDB',
})
.on('message', console.log)
.on('error', console.error);