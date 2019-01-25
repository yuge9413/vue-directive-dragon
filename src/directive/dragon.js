/**
 * vue-directive-dragon
 * @author yuge9413
 * @description vue拖拽指令
 */

import Vue from 'vue';

/**
 * 工具对象
 */
const utils = {
    /**
     * fix typeof mothed
     * @param {*} param 待检测数据
     */
    typeof(param) {
        return Array.isArray(param) ? 'array' : typeof param;
    },

    /**
     * bind event
     * @param {Object} element dom object
     * @param {string} event event name
     * @param {Function} callback event callback
     */
    bindEvent(element, event, callback) {
        if (element.attachEvent) {
            element.attachEvent(`on${event}`, callback);
        } else {
            element.addEventListener(event, callback, false);
        }
    },

    /**
     * unbind event
     * @param {Object} element dom object
     * @param {string} event event name
     * @param {Function} callback event callback
     */
    unbindEvent(element, event, callback) {
        if (element.detachEvent) {
            element.detachEvent(`on${event}`, callback);
        } else {
            element.removeEventListener(event, callback, false);
        }
    },

    /**
     * get dom
     * @param {string|Object} str dom [name, class, id] or dom object
     * @param {Object} parent dom parent
     */
    getElement(str, parent) {
        // no str
        if (!str) {
            return null;
        }

        // str is dom object
        if (typeof str === 'object') {
            return str;
        }

        parent = parent || document;

        // use querySelectorAll
        if (parent.querySelectorAll) {
            return parent.querySelectorAll(str);
        }

        // use getElementsByClassName
        if (/^\./.test(str) && parent.getElementsByClassName) {
            return parent.getElementsByClassName(str.replace('.', ''));
        }

        // use getElementById
        if (/^#/.test(str)) {
            return parent.getElementById(str.replace('#', ''));
        }

        // use getElementsByTagName
        return parent.getElementsByTagName(str.replace('#', ''));
    },
};

/**
 * class Query - a easy jq
 */
class Query {
    constructor(select, parent) {
        this.element = utils.getElement(select, parent);

        this.length = 0;

        if (this.element) {
            this.length = this.element.length || this.element.length === 0 ? this.element.length : 1;

            if (this.length === 1) {
                this[0] = this.element;
            } else {
                this.element.forEach((item, index) => {
                    this[index] = item;
                });
            }
        }
    }

    css(style) {
        if (!this.length) {
            return this;
        }

        if (utils.typeof(style) === 'object') {
            if (this.length === 1) {
                Object.keys(style).forEach((item) => {
                    this.element.style[item] = style[item];
                });

                return this;
            }

            for (let i = 0; i < this.length; i++) {
                Object.keys(style).forEach((item) => {
                    this[i].style[item] = style[item];
                });
            }

            return this;
        }

        return this[0].style[style];
    }
};
