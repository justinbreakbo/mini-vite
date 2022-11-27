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
const compilerSfc = require('@vue/compiler-sfc')
const compilerDom = require('@vue/compiler-dom')

const app = new Koa()
app.use(async ctx => {
  const { url, query } = ctx.request
  console.log('request url: ' + url)

  // TODO: 策略模式优化

  // read html
  if (url === '/') {
    // to index.html
    let content = fs.readFileSync('./index.html', 'utf-8')

    // simulate process.env.NODE_ENV
    content = content.replace(
      '<script', 
      `
        <script>
          window.process = { env: { NODE_ENV: 'dev' } }
        </script>
        <script
      `
    )

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
    const prefix = path.resolve(__dirname, 'node_modules', url.replace('/@node_modules/', ''))
    // read the "module" field of library's package.json
    const module = require(prefix + '/package.json').module
    const p = path.resolve(prefix, module)
    const content = fs.readFileSync(p, 'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(content)
  }

  // read SFC(*.vue)
  else if (url.indexOf('.vue') > -1) {
    // /*.vue?type=template => *.vue
    const p = path.resolve(__dirname, url.split('?')[0].slice(1))
    const { descriptor } =  compilerSfc.parse(fs.readFileSync(p, 'utf-8'))
    // console.log(descriptor)

    if (!query.type) {
      // 1. .vue => template + script (use compiler-sfc)
      ctx.type = "application/javascript"
      ctx.body = `
        ${rewriteImport(
          (descriptor.script || descriptor.scriptSetup).content.replace('export default ', 'const __script = ')
        )}
        import { render as __render } from "${url}?type=template"
        __script.render = __render
        export default __script
      `
    } else {
      // 2. template => render function (use compiler-dom)
      const render = compilerDom.compile(descriptor.template.content, { mode: 'module' })
      ctx.type = 'application/javascript'
      ctx.body = rewriteImport(render.code)
    }
  }

  // read css
  else if (url.endsWith('.css')) {
    const p = path.resolve(__dirname, url.slice(1))
    let content = fs.readFileSync(p, 'utf-8')

    // css => js (add style tag)
    content = `
      const css = "${content.replace(/[\r\n]/g, '')}"
      const link = document.createElement('style')
      link.setAttribute('type', 'text/css')
      document.head.appendChild(link)
      link.innerHTML = css
      export default css
    `
    ctx.type = 'application/javascript'
    ctx.body = content
  }


  /* library support */
  function rewriteImport (content) {
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function(match, s1) {
      // library path to node_modules
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