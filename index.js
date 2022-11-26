/*
 * @Author: justinbreakbo@gmail.com
 * @Date: 2022-11
 * @LastEditors: justinbreakbo@gmail.com
 * @LastEditTime: 2022-11
 * @Description: Koa实现静态服务器以提供文件(js，html)
 * 
 * Copyright (c) 2022 by justinbreakbo@gmail.com, All Rights Reserved. 
 */
const Koa = require('koa')
const fs = require('fs')
const path = require('path')

const app = new Koa()
app.use(async ctx => {
  const { url, query } = ctx.request
  console.log('request url: ' + url)

  // read html
  if (url === '/') {
    // to index.html
    const content = fs.readFileSync('./index.html', 'utf-8')
    ctx.type = 'text/html'
    ctx.body = content
  } 
  
  // read js
  else if (url.endsWith('.js')) {
    // to absolute path
    const p = path.resolve(__dirname, url.slice(1))
    const content = fs.readFileSync(p, 'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(content)
  }

  // read library
  else if (url.startsWith('/@node_modules')) {
    const 
  }


  /* library support */
  function rewriteImport (content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function(match, s1) {
      // to node_modules
      if (s1[0] !== '.' && s1[1] !== '/') {
        return ` from '/@node_modules/${s1}'`
      } else {
        return match
      }
    })
  }
  
})

app.listen(3000, () => {
  console.log('Vite started at port 3000...')
})