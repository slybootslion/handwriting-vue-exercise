<template>
  <div class="about">
    <h1>This is an about page</h1>

    <div>
      <router-link to="/about/a">to a</router-link>
    </div>
    <div>
      <router-link to="/about/b">to b</router-link>
    </div>

    <router-view></router-view>
  </div>
</template>
