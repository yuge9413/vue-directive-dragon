<template>
    <div id="app">
        <div
            class="box"
            v-dragon="{target: '.head'}"
        >
            <div class="head">
                test
            </div>
            xxxxxxx
            xxxxxxx
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import dragon from './directive/dragon';

Vue.use(dragon);

export default {
    name: 'App',
    data() {
        return {
            text: 'Hello World',
        };
    },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.box {
    width: 400px;
    height: 200px;
    background: #eee;
}

.head {
    height: 50px;
    line-height: 50px;
}
</style>
