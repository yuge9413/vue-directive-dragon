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
        parent = utils.getElement(parent);
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

    /**
     * set css style
     * @param {string|Object} style css styles
     */
    css(style) {
        if (!this.length) {
            return this;
        }

        if (utils.typeof(style) === 'object') {
            for (let i = 0; i < this.length; i += 1) {
                Object.keys(style).forEach((item) => {
                    this[i].style[item] = style[item];
                });
            }

            return this;
        }

        return this[0].style[style];
    }

    /**
     * bind event
     * @param {string} event event name
     * @param {*} handle event callback
     */
    on(event, handle) {
        for (let i = 0; i < this.length; i += 1) {
            utils.bindEvent(this[i], event, handle);
        }

        return this;
    }

    /**
    * unbind event
    * @param {string} event event name
    * @param {*} handle event callback
    */
    unbind(event, handle) {
        for (let i = 0; i < this.length; i += 1) {
            utils.unbindEvent(this[i], event, handle);
        }

        return this;
    }

    /**
     * check has class
     * @param {string} name class name
     */
    hasClass(name) {
        const rep = new RegExp(`(^|\\s)${name}(\\s|$)`);
        return this[0] ? rep.test(this[0].className) : '';
    }

    /**
     * dom add class name
     * @param {string} name class name
     */
    addClass(name) {
        for (let i = 0; i < this.length; i += 1) {
            this[i].className = `${this[i].className} ${name}`;
        }

        return this;
    }

    /**
     * clone dom
     */
    clone() {
        return new Query(this[0].cloneNode(true));
    }

    /**
     * get dom parent
     */
    parent() {
        return this[0] ? new Query(this[0].parentNode) : new Query();
    }

    /**
     * append inner
     * @param {string|Object} str inner
     */
    append(str) {
        if (typeof str === 'string') {
            this[0].innerHTML += str;
        } else if (typeof str === 'object') {
            this[0].appendChild(str);
        }

        return this;
    }

    /**
     * set/get dom attribute
     * @param {string} name attribute name
     * @param {string} val attribute value
     */
    attr(name, val) {
        return val ? this[0].setAttribute(name, val) : this[0].getAttribute(name);
    }

    /**
     * find dom
     * @param {string|Object} name dom name or dom Object
     */
    find(name) {
        return new Query(name, this[0]);
    }

    /**
     * remove dom self
     */
    remove() {
        this.parent()[0].removeChild(this[0]);
    }

    /**
     * remove class name
     * @param {string} name class name
     */
    removeClass(name) {
        this[0].className.replace(name, '');

        return this;
    }
}

/**
 * create Query instance
 * @param {string|Object} select dom selcet
 * @param {Object} parent parent select
 */
const $ = (select, parent) => new Query(select, parent);
