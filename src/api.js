import config from '../config'

function api(token, path, args, native){
  let u = new URL(path, config.api_server)
  u.searchParams.append('token', token)
  console.log('api href: ', u.href)
  return fetch(u.href, {method: 'post', body: JSON.stringify(args)})
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
