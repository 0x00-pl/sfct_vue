import config from '../config'
import url from 'url'

function api(path, args, native){
  let u = url.resolve(config.api_server, path)
  fetch(u, {method: 'post', body: JSON.stringify(args)})
  .then(res =>{
    if(native) {
      return res
    } else if(res.ok){
      return res.text()
    } else {
      return res.text().then(t=>{throw t})
    }
  })
}

export default api
