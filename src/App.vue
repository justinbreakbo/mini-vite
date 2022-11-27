<!--
 * @Author: justinbreakbo@gmail.com
 * @Date: 2022-11
 * @LastEditors: justinbreakbo@gmail.com
 * @LastEditTime: 2022-11
 * @Description: vue 单文件组件
 * 
 * Copyright (c) 2022 by justinbreakbo@gmail.com, All Rights Reserved. 
-->


<template>
  <div class="app">
    <h1>
      hello, SFC
    </h1>
    <p>count is: {{ count }}</p>
    <button @click="count++">Add</button>
  </div>
</template>

<script lang='ts' setup>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    return { count }
  }
}
</script>

<style lang='scss' scoped>
.app{
  
}
</style>