<template>
    <div id="app">
        <div
            class="box"
            v-dragon="{target: '.head'}"
        >
            <div class="head">
                test
            </div>
            可直接拖动，并可设置是否超出浏览器边界
        </div>

        <div
            class="li-box list-box"
            v-dragon="{target: '.li', type: 'sort', dataName: 'testData', callback: sortFn}"
        >
            <ul>
                <li
                    class="li"
                    v-for="item in testData"
                    :key="item.value"
                >
                    <span>{{ item.text }}</span>
                </li>
            </ul>
        </div>
        <!-- 多数据拖拽 - 第一种方式 - 指令挂载拖拽元素共同父级上 - 适用于拖拽元素在共同父级下的布局 -->
        <div
            class="more"
            v-dragon="{target: '.li-other', type: 'drag', sort: true, callback: changeData, option: [
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
                        class="li-other"
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
                        class="li-other"
                        v-for="item in testData3"
                        :key="item.value"
                    >
                        <span>{{ item.text }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 多数据拖拽 - 第二种方式 - 指令各自拖拽元素上 - 适用于拖拽元素不在共同父级下的布局 -->
        <div class="more">
            <div
                class="li-box li-box3"
                v-dragon="{target: '.li-other2', type: 2, sort: true, callback: changeData, option: [
                    {
                        dataName: 'testData',
                        container: '.li-box3'
                    },
                    {
                        dataName: 'testData2',
                        container: '.li-box4'
                    },
                    {
                        dataName: 'testData3',
                        container: '.li-box5'
                    }
                ]}"
            >
                <ul>
                    <li
                        class="li-other2"
                        v-for="item in testData"
                        :key="item.value"
                    >
                        <span>{{ item.text }}</span>
                    </li>
                </ul>
            </div>
            <div
                class="li-box li-box4"
                v-dragon="{target: '.li-other2', type: 2, sort: true, callback: changeData, option: [
                    {
                        dataName: 'testData',
                        container: '.li-box3'
                    },
                    {
                        dataName: 'testData2',
                        container: '.li-box4'
                    },
                    {
                        dataName: 'testData3',
                        container: '.li-box5'
                    }
                ]}"
            >
                <ul>
                    <li
                        class="li-other2"
                        v-for="item in testData2"
                        :key="item.value"
                    >
                        <span>{{ item.text }}</span>
                    </li>
                </ul>
            </div>
            <div
                class="li-box li-box5"
                v-dragon="{target: '.li-other2', type: 2, sort: true, callback: changeData, option: [
                    {
                        dataName: 'testData',
                        container: '.li-box3'
                    },
                    {
                        dataName: 'testData2',
                        container: '.li-box4'
                    },
                    {
                        dataName: 'testData3',
                        container: '.li-box5'
                    }
                ]}"
            >
                <ul>
                    <li
                        class="li-other2"
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
        // 排序回调
        sortFn(data) {
            // eslint-disable-next-line no-console
            console.log(data);
        },
        // 拖动回调
        changeData(data) {
            // eslint-disable-next-line no-console
            console.log(data);
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
    top: 100px;
    left: 50%;
    text-align: center;
    border: 1px solid #aaa;
    background: #fff;
}

.head {
    height: 50px;
    line-height: 50px;
    background-color: #eee;
    border-bottom: 1px solid #aaa;
}

.list-box {
    margin: 100px;
    width: 100%;
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
