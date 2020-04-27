/**
 * vue-directive-dragon
 * @author yuge9413
 * @description vue拖拽指令
 */


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
        return parent.getElementsByTagName(str);
    },

    /**
     * get element offset
     * @param {Object} element dom object
     */
    getElementOffset(element) {
        if (!element || !element.getBoundingClientRect) {
            return {};
        }

        const box = element.getBoundingClientRect();
        const { body } = document;
        const xPosition = box.left + body.scrollLeft;
        const yPosition = box.top + body.scrollTop;
        const { width, height } = box;

        return {
            left: xPosition,
            top: yPosition,
            width,
            height,
        };
    },

    /**
     * insert after dom
     * @param {Object} element dom object
     * @param {Object} target target dom object
     */
    insertAfter(element, target) {
        const parent = target.parentNode;

        if (parent.lastChild === target) {
            parent.appendChild(element);
        } else {
            parent.insertBefore(element, target.nextSibling);
        }
    },

    /**
     * get element for behind point
     * @param {Object} behind current dom
     * @param {number} x page x
     * @param {number} y page y
     * @param {string} name calss name
     */
    getElementBehindPoint(behind, x, y, name) {
        const originalDisplay = behind.css('display');

        behind.css({ display: 'none', 'pointer-events': 'none' });

        const top = document.documentElement.scrollTop;
        const left = document.documentElement.scrollLeft;
        // eslint-disable-next-line no-use-before-define
        let element = $(document.elementFromPoint(x - left, y - top));

        while (name && element[0] && !element.hasClass(name.replace(/[.#]+/g, ''))) {
            element = element.parent();
        }

        behind.css({ display: originalDisplay, 'pointer-events': 'auto' });

        return element;
    },

    /**
     * get dom computed style
     * @param {Object} el element
     * @param {string} name style attr name
     */
    getStyle(el, name) {
        let style = null;

        if (window.getComputedStyle) {
            style = window.getComputedStyle(el, null);
        } else {
            style = el.currentStyle;
        }

        if (!name) {
            if (style.cssText) {
                return style.cssText;
            }
            // 兼容火狐
            const keys = Object.values(style);
            let res = '';

            keys.forEach((item) => {
                res += `${item}:${style[item]};`;
            });

            return res;
        }

        name = name.replace(/-(\w)/g, (all, letter) => letter.toUpperCase());

        return style[name];
    },

    /**
     * css text parse to object
     * @param {string} css css text
     */
    cssTextParseObject(css) {
        const cssArray = css.replace(/;\s+/g, ';').split(';');
        const res = {};

        cssArray.forEach((item) => {
            if (!item) {
                return;
            }

            const attr = item.split(':');
            const key = attr[0].replace(/[-_][^-_]/g, match => match.charAt(1).toUpperCase());
            res[key] = attr[1].toString().trim();
        });

        return res;
    },

    /**
     * use style tag set dom style
     * @param {string} name class name
     * @param {string} css css text
     */
    setStyleTag(name, css) {
        let style = document.getElementById('dragon-clone-dom-css');

        if (style && style.innerHTML.indexOf(name) === -1) {
            style.innerHTML += `.${name} { ${css} }`;
        }

        if (!style) {
            style = document.createElement('style');
            style.type = 'text/css';
            style.id = 'dragon-clone-dom-css';
            style.innerHTML = `.${name} { ${css} }`;
            document.getElementsByTagName('head')[0].appendChild(style);
        }
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

            if (this.length === 1 && !this.element.length) {
                this[0] = this.element;
            } else {
                Array.prototype.slice.call(this.element).forEach((item, index) => {
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
     * get element by index
     * @param {number} index dom index
     */
    eq(index) {
        return new Query(this[index]);
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
        return this[0] ? rep.test(this[0].className) : false;
    }

    /**
     * dom add class name
     * @param {string} name class name
     */
    addClass(name) {
        for (let i = 0; i < this.length; i += 1) {
            if (!new Query(this[i]).hasClass(name)) {
                this[i].className = `${this[i].className} ${name}`;
            }
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
     * get dom childrens
     */
    children() {
        return this[0] ? new Query(this[0].children) : new Query();
    }

    /**
     * get element index of element's parent node
     *
     * @param {Object} element element node
     */
    index(element) {
        return Array.prototype.slice.call(this.parent().children()).indexOf(element[0]);
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
        if (this[0]) {
            this[0].className = this[0].className.replace(name, '');
        }

        return this;
    }

    /**
     * get target dom
     * @param {string} name class name
     */
    getTarget(name) {
        let el = this;

        while (el && el.length && !el.hasClass(name.replace(/[.#]+/g, ''))) {
            el = el.parent();
        }

        return el && el.length ? el : null;
    }
}

/**
 * create Query instance
 * @param {string|Object} select dom selcet
 * @param {Object} parent parent select
 */
const $ = (select, parent) => new Query(select, parent);

/**
 * dragon class
 */
class Dragon {
    constructor(element, param, vm) {
        // is start or not
        this.start = false;

        // element
        this.el = element;

        // directive dom
        this.element = $(element);

        // target dom
        this.targetElement = $(element);

        // directive param
        this.param = {
            // 拖拽类型:
            // move为只能拖动，不涉及数据
            // sort为单一数据源下拖拽排序，涉及数据交换
            // drag为多数据源相互拖动及排序，涉及数据交换
            type: 'move',
            // 多数据源拖拽时 是否支持排序
            sort: true,
            // target dom's class(.xxx) or id(#xxx)
            target: '',
            // 是否可以超越浏览器边界
            overstep: true,
            // 数据源名称 - 单数据源拖拽排序时使用
            dataName: '',
            // 拖拽方向 - 单数据拖拽排序使用 - top, left
            direction: '',
            // 多数据源配置: [{container: '容器class如：.box 或 id如：#box', dataName: '数据源名称', vm: '组件实例'}]
            option: null,
            ...param,
        };

        // vue instance
        this.vueInstance = vm;

        // source data
        this.formData = null;

        // start index
        this.startIndex = null;

        // callback result data
        this.result = {
            start: null,
            end: null,
            formDataName: null,
            toDataName: null,
            item: null,
        };

        // set dom text disable
        this.disableStyle = {
            '-moz-user-select': '-moz-none',
            '-khtml-user-select': 'none',
            '-webkit-user-select': 'none',
            '-ms-user-select': 'none',
            'user-select': 'none',
        };

        // set dom text enable
        this.enableStyle = {
            '-moz-user-select': '',
            '-khtml-user-select': '',
            '-webkit-user-select': '',
            '-ms-user-select': '',
            'user-select': '',
        };

        // 鼠标事件 - 增加引用 用于解绑事件
        this.mousedownFn = e => this.startDrag(e);
        // 鼠标事件 - 增加引用 用于解绑事件
        this.mousemoveFn = e => this.drag(e);
        // 鼠标事件 - 增加引用 用于解绑事件
        this.mouseupFn = e => this.endDrag(e);

        this.init();
    }

    /**
     * init method
     */
    init() {
        this.targetElement.unbind('mousedown', this.mousedownFn);

        // 获取目标元素
        if (
            this.param.target
            && $(this.param.target, this.el).length
        ) {
            this.targetElement = $(this.param.target, this.el);
        }

        // add drag mouse style
        this.targetElement.addClass('v-dragon-element').css({ cursor: 'move' });
        // bind mousedown for document
        this.targetElement.on('mousedown', this.mousedownFn);
    }

    /**
     * drag event
     * @param {Object} event event object
     */
    drag(event) {
        if (!this.start) {
            return;
        }

        if (!this.floaty) {
            this.spawnFloaty(this.element, event);
        }

        let left;
        let top;

        const { pageX, pageY } = event;
        const { offsetX, offsetY } = this;

        // 拖拽是否可超出浏览器范围
        if (!this.param.overstep || this.param.type !== 'move') {
            left = pageX - offsetX;
            top = pageY - offsetY;
        } else {
            const offsetWidth = this.offset.width;
            const offsetHeight = this.offset.height;
            const height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

            const width = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth || 0;

            left = pageX - offsetX >= 0 ? pageX - offsetX : 0;
            left = left + offsetWidth >= width ? width - offsetWidth : left;
            top = pageY - offsetY >= 0 ? pageY - offsetY : 0;
            top = top + offsetHeight >= height ? height - offsetHeight : top;
        }

        // 位置拖动
        if (this.param.type === 'move') {
            return this.floaty.css({ left: `${left}px`, top: `${top}px` });
        }

        const start = this.element.parent().children().index(this.element);

        // 多数据间拖动
        if (this.param.type === 'drag') {
            this.floaty.css({ left: `${left}px`, top: `${top}px` });
            this.element = $('.current-dragon-item').css({ opacity: 0 });
            this.dataExchange(event, start, top, left, pageX, pageY, this.param.target);
        // 拖动排序
        } else {
            if (this.param.direction === 'left') {
                this.floaty.css({ left: `${left}px` });
            } else if (this.param.direction === 'top') {
                this.floaty.css({ top: `${top}px` });
            } else {
                this.floaty.css({ top: `${top}px`, left: `${left}px` });
            }

            this.sort(start, top, left, pageX, pageY, this.param.target, this.param.dataName, this.param.dataName);
        }
    }

    /**
     * sort data
     *
     * @param {number} start start index
     * @param {number} top top position
     * @param {number} left left position
     * @param {number} x pageX
     * @param {number} y pageY
     * @param {string} targetClass target dom class name
     * @param {string} formDataName start data name
     * @param {string} toDataName end data name
     */
    sort(start, top, left, x, y, targetClass, formDataName, toDataName, source) {
        const target = utils.getElementBehindPoint(this.floaty, x, y, targetClass);
        const pos = target.parent().children().index(target);
        let index = -1;
        index = pos === -1 ? index : pos;

        if (!formDataName) {
            throw new Error('请传入数据源名称');
        }

        const data = this.vueInstance.context[formDataName];
        const old = data[start];
        const item = data[index];

        if (!old || !item || index === -1) {
            return;
        }

        this.vueInstance.context.$set(data, start, item);
        this.vueInstance.context.$set(data, index, old);

        this.setResult({
            start: this.startIndex,
            end: index,
            formDataName: source || formDataName,
            toDataName,
            item: old,
        });
    }

    /**
     * data change
     *
     * @param {Object} event event object
     * @param {number} start start index
     * @param {number} top top position
     * @param {number} left left position
     * @param {number} x pageX
     * @param {number} y pageY
     * @param {string} targetClass target dom class name
     */
    dataExchange(event, start, top, left, x, y, targetClass) {
        let current = null;
        const { option } = this.param;
        const target = utils.getElementBehindPoint(this.floaty, x, y, targetClass);
        // const pos = target.parent().children().index(target);
        const formData = this.vueInstance.context[this.formData.dataName];

        if (Array.isArray(option)) {
            [current] = option.filter(item => target.getTarget(item.container));
        }

        if (!current) {
            return;
        }

        const currentData = this.vueInstance.context[current.dataName];
        let old = null;

        // 不支持排序
        if (!this.param.sort) {
            // 从源数据拖动到其他数据中
            if (this.formData.dataName !== current.dataName && formData[start]) {
                [old] = formData.splice(start, 1);
                currentData.push(old);

                this.setResult({
                    item: old,
                    formDataName: this.formData.dataName,
                    toDataName: current.dataName,
                    start: this.startIndex,
                    end: currentData.length - 1,
                });
            }

            // 从源数据拖到其他数据又拖回源数据
            if (this.formData.dataName === current.dataName && this.result.item) {
                const prevData = this.vueInstance.context[this.result.toDataName];
                formData.splice(this.startIndex, 0, this.result.item);
                prevData.splice(prevData.length - 1, 1);

                this.element = $(this.formData.container).find(this.param.target).eq(this.startIndex);

                this.setResult({
                    item: null,
                    formDataName: null,
                    toDataName: null,
                    start: null,
                    end: null,
                });
            }

            return;
        }

        const targetElements = $(current.container).find(this.param.target);

        for (let i = 0; i < targetElements.length; i += 1) {
            if (!$(targetElements[i]).hasClass('v-dragon-element')) {
                $(targetElements[i]).addClass('v-dragon-element current-dragon-item');
            }
        }

        // 在同一数据中排序
        if (this.formData.dataName === current.dataName) {
            this.sort(start, top, left, x, y, this.param.target, this.formData.dataName, this.formData.dataName, this.formData.source);
        }

        if (this.formData.dataName !== current.dataName) {
            [old] = formData.splice(start, 1);
            if (!old) {
                return;
            }
            currentData.splice(start - 1 < 0 ? 0 : start - 1, 0, old);
            const source = this.formData.source || this.formData.dataName;
            this.formData = current;
            this.formData.source = source;
        }
    }

    /**
     * set callback result data
     *
     * @param {Object} param params object
     */
    setResult(param) {
        if (typeof param !== 'object') {
            return;
        }

        Object.keys(param).forEach((item) => {
            this.result[item] = param[item];
        });
    }

    /**
     * disable select text
     */
    disableSelect(elemet) {
        $(elemet).css(this.disableStyle);
        $(document.body).css(this.disableStyle);
    }

    /**
     * enable select text
     */
    enableSelect(elemet) {
        $(elemet).css(this.disableStyle);
        $(document.body).css(this.enableStyle);
    }

    /**
     * start drag event
     * @param {Object} event object
     */
    startDrag(event) {
        this.element = this.param.type === 'move' ? this.element : $(event.target).getTarget(this.param.target);
        this.offset = utils.getElementOffset(this.element[0]);
        this.pageY = event.pageY;
        this.offsetX = (event.pageX - this.offset.left);
        this.offsetY = (event.pageY - this.offset.top);
        this.start = true;

        if (this.param.type !== 'move') {
            const start = this.element.parent().children().index(this.element);
            this.startIndex = start;
            const { option } = this.param;

            if (Array.isArray(option)) {
                [this.formData] = option.filter(item => this.element.getTarget(item.container));
            }
        }

        $(document).on('mousemove', this.mousemoveFn);
        $(document).on('mouseup', this.mouseupFn);
    }

    /**
     * end drag
     */
    endDrag() {
        this.start = false;
        $(document).unbind('mousemove', this.mousemoveFn);
        $(document).unbind('mouseup', this.mouseupFn);

        this.enableSelect(this.floaty && this.floaty[0]);

        const style = document.getElementById('dragon-clone-dom-css');
        if (style) {
            style.innerHTML = '';
        }

        if (this.floaty && this.param.type !== 'move') {
            this.floaty.remove();
            this.floaty = null;

            this.targetElement.css({ opacity: 1 });

            // call callback
            if (typeof this.param.callback === 'function') {
                this.param.callback.call(this.vueInstance.context, this.result);
            }
        }
        this.floaty = null;

        this.element.removeClass('current-dragon-item').css({ opacity: 1 });

        if (this.param.type === 'drag') {
            this.init();
        }
    }

    /**
     * drag dom
     * @param {*} element $(dom)
     * @param {*} event event object
     */
    spawnFloaty(element, event) {
        const offset = utils.getElementOffset(element[0]);

        // only drag dom
        if (this.param.type === 'move') {
            this.floaty = element;
            this.floaty.css({ position: 'fixed', margin: '0px', 'z-index': '9999999999' });
        // drag dom and change data
        } else {
            this.floaty = element.clone();
            element.addClass('current-dragon-item');
            // eslint-disable-next-line class-methods-use-this
            this.floaty.addClass('vue-dragon-clone');
            const cssText = utils.getStyle(element[0]);
            // utils.setStyleTag('vue-dragon-clone', cssText);
            const cssObj = utils.cssTextParseObject(cssText);
            this.floaty.css(cssObj);

            element.css({ opacity: 0 });
            // this.floaty.css({ opacity: 1, width: `${offset.width}px` });

            this.floaty.css({ left: `${event.clientX - event.pageX + offset.left}px` });
            this.floaty.css({ top: `${event.clientY - event.pageY + offset.top}px` });


            $(document.body).append(this.floaty[0]);
        }

        this.floaty.css({ position: 'fixed', 'z-index': '9999999999' });

        this.disableSelect(this.floaty[0]);
    }
}

export default {
    install(Vue) {
        /**
         * 注册全局指令
         */
        Vue.directive('dragon', {
            inserted(el, binding, vm) {
                const value = binding.value || {};
                // eslint-disable-next-line no-new
                new Dragon(el, value, vm);
            },
        });
    },
};
