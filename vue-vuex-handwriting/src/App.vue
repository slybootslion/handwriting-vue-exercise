<template>
  <div id="app">
    <p>name：{{ $store.state.name }}</p>
    <p>age：{{ $store.state.age }}</p>
    <p>getters age：{{ $store.getters.addAge }}</p>
    <button @click="$store.commit('changeName', 'gg')">同步修改name</button>
    <button @click="$store.dispatch('changeAge', 20)">异步修改age</button>
    <p>___________</p>
    <p>
      <button @click="$store.commit('a/changeAge', 10)">命名空间修改年龄</button>
    </p>
    <div>
      a: {{$store.state.a.name}}
    </div>
    <div>
      a age: {{$store.state.a.age}}
    </div>
    <div>
      b: {{$store.state.b.name}}
    </div>
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
</style>
