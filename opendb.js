const { exec } = require('child_process')

if(process.platform === 'win32'){
    exec('rethinkdb.exe', {
        cwd:'./database/RethinkDB',
    })
        .on('message', console.log)
        .on('error', console.error);
} else if (process.platform === 'darwin'){
    exec('rethinkdb')
        .on('message', console.log)
        .on('error', console.error)
}