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
            v-dragon="{target: '.li', type: 3, dataName: 'testData', callback: sortFn}"
        >
            <ul>
                <li
                    class="li"
                    v-for="item in testData"
                    :key="item.text"
                >
                    <span>{{ item.text }}</span>
                </li>
            </ul>
        </div>
        <div
            class="more"
            v-dragon="{target: '.li', type: 2, sort: false, option: [
                {
                    dataName: 'testData2',
                    container: '.li-box1'
                },
                {
                    dataName: 'testData3',
                    container: '.li-box2'
                }
            ]}"
        >
            <div class="li-box li-box1">
                <ul>
                    <li
                        class="li"
                        v-for="item in testData2"
                        :key="item.value"
                    >
                        <span>{{ item.text }}</span>
                    </li>
                </ul>
            </div>
            <div class="li-box li-box2">
                <ul>
                    <li
                        class="li"
                        v-for="item in testData3"
                        :key="item.value"
                    >
                        <span>{{ item.text }}</span>
                    </li>
                </ul>
            </div>
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
            testData2: [
                {
                    text: '测试数据1',
                    value: 11,
                },
                {
                    text: '测试数据2',
                    value: 21,
                },
                {
                    text: '测试数据3',
                    value: 31,
                },
                {
                    text: '测试数据4',
                    value: 41,
                },
                {
                    text: '测试数据5',
                    value: 51,
                },
                {
                    text: '测试数据6',
                    value: 61,
                },
            ],
            testData3: [
                {
                    text: '测试数据1',
                    value: 12,
                },
                {
                    text: '测试数据2',
                    value: 22,
                },
                {
                    text: '测试数据3',
                    value: 32,
                },
                {
                    text: '测试数据4',
                    value: 42,
                },
                {
                    text: '测试数据5',
                    value: 52,
                },
                {
                    text: '测试数据6',
                    value: 62,
                },
            ],
        };
    },
    methods: {
        sortFn() {
            // console.log(data);
        },
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
    background-color: #eee;
    border: 1px solid #fff;
    padding-left: 10px;
    /* border-bottom: none; */
}

.more {
    width: 100%;
    margin: 100px;
}

.more .li-box {
    display: inline-block;
}
</style>
