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

        <div
            class="li-box"
            v-dragon="{target: 'li', type: 3}"
        >
            <ul>
                <li
                    v-for="item in testData"
                    :key="item.text"
                >
                    <span>{{ item.text }}</span>
                </li>
            </ul>
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
            testData: [
                {
                    text: '测试数据1',
                    value: 1,
                },
                {
                    text: '测试数据2',
                    value: 2,
                },
                {
                    text: '测试数据3',
                    value: 3,
                },
                {
                    text: '测试数据4',
                    value: 4,
                },
                {
                    text: '测试数据5',
                    value: 5,
                },
                {
                    text: '测试数据6',
                    value: 6,
                },
            ],
        };
    },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

.box {
    width: 400px;
    height: 200px;
    position: absolute;
    top: 50px;
    left: 50%;
    text-align: center;
    border: 1px solid #aaa;
}

.head {
    height: 50px;
    line-height: 50px;
    background-color: #eee;
    border-bottom: 1px solid #aaa;
}

.li-box ul{
    list-style: none;
    margin: 0;
}

.li-box ul li {
    width: 400px;
    height: 40px;
    line-height: 40px;
    border: 1px solid #dadada;
    border-bottom: none;
}

.li-box ul li:last-child {
    border-bottom: 1px solid #dadada;
}
</style>
