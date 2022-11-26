/*
 * @Author: justinbreakbo@gmail.com
 * @Date: 2022-11
 * @LastEditors: justinbreakbo@gmail.com
 * @LastEditTime: 2022-11
 * @Description: 
 * 
 * Copyright (c) 2022 by justinbreakbo@gmail.com, All Rights Reserved. 
 */

import { str } from './moduleA.js'
import { createApp, h } from 'vue'


console.log('vite...' + str)

const App = {
  render() {
    // create dom
    return h('div', null, [h('div', null, String('hello Vite'))])
  }
}

createApp(App).mount('#app')

