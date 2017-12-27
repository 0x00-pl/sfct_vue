let path = require('path')
let fs = require('fs')

function try_read(filename){
  let filepath = path.join(__dirname, './deployment_config', filename)
  try{
	  let content = fs.readFileSync(filename, {encoding: 'utf8'})
	  return JSON.parse(content)
  }catch(err){
	  return {}
  }
}

module.exports = Object.assign(
  {
    api_server: 'https://www.0x00-pl.site',
    mongourl: 'mongodb://localhost/test'
  },
  try_read('api_server.json'),
  try_read('mongodb.json')
)
