<template>
  <div id="app">
    <calender-comp />
  </div>
</template>

<script>
import CalenderComp from './components/Calender.vue'
export default {
    name: 'App',
    components: {
        CalenderComp
    },
    methods:{
        
    }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
body,
html {
    margin: 0;
    padding: 0;
    font-size: 16px;
}

/* variable */
:root {
    /* --color-primary: rgb(42, 170, 233); */
    --color-primary: #4f86f8;
    /* --font-size-primary: 16px; */
    --font-color-primary: #333;
    --font-size-primary: 12px;
    --color-border: #ccc;
    --color-grid-hover: #eee;
    --color-grid-selected: var(--color-primary);
}
</style>
