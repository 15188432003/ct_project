<template>
  <div id="app" class="Poppins-Regular color-2D2D2D">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app,
#root {
  height: 100%;
}
body {
  background: #f4f4f3 !important;
}
#app {
  width: 100%;
  // padding: 20px 20px 0 20px;
}
</style>
