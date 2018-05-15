"use strict";

var BlackItem = function (text) {
    if (text) {
        text = text.replace(/\\/g, "");
        var obj = JSON.parse(text);
        this.title = obj.title;
        this.keywords = obj.keywords;
        this.company = obj.company;
        this.content = obj.content;
        this.createdate = new Date();
    } else {
        this.title = "";
        this.keywords = "";
        this.company = "";
        this.content = "";
        this.content = "";
        this.createdate = new Date();
    }
};

BlackItem.prototype = {
    toString: function () {
        return JSON.stringify(this);
    }
};

var BlackContract = function () {
    //数据
    LocalContractStorage.defineMapProperty(this, "dataMap");
    //index 到 字典key索引
    LocalContractStorage.defineMapProperty(this, "arrayMap");
    //字典size
    LocalContractStorage.defineProperty(this, "size");
};

BlackContract.prototype = {
    init: function () {
        this.size = 0;
    },

    // 保存
    save: function (key, value) {
        //检查入参数
        var blackItem = new BlackItem(value);
        if (typeof(key) == "undefined" || key == '') {
            throw new Error("empty key");
        }
        if (blackItem.title == '' || blackItem.content == '') {
            throw new Error("empty error");
        }

        //如果之前没有添加过，初始化数组
        var blackMap = this.dataMap.get(key);
        if (typeof(blackMap) == "undefined" || blackMap == null) {
            blackMap = [];
            var index = this.size;
            this.arrayMap.set(index, key);
            this.size += 1;
        }

        //添加到数组
        blackMap.push(blackItem);
        //存储到发布遗言的链中
        this.dataMap.set(key, blackMap);
    },
    // 搜索关键字
    search: function (key) {
        if (key === "") {
            throw new Error("empty key")
        }

        var keyArray = [];
        if (this.size == 0) {
            return keyArray;
        }

        for (var i = 0; i < this.size; i++) {
            var storeKey = this.arrayMap.get(i);
            //如果匹配到了数据
            if (storeKey.indexOf(key) != -1) {
                keyArray.push(storeKey);
            }
            return keyArray;
        }
    },
    len: function () {
        return this.size;
    },
    forEach: function (limit, offset) {
        limit = parseInt(limit);
        offset = parseInt(offset);
        if (offset > this.size) {
            throw new Error("offset is not valid");
        }
        var number = offset + limit;
        if (number > this.size) {
            number = this.size;
        }
        var result = [];
        for (var i = offset; i < number; i++) {
            var key = this.arrayMap.get(i);
            var object = this.dataMap.get(key);
            var temp = {
                index: i,
                key: key,
                value: object
            }
            result.push(temp);
        }
        return JSON.stringify(result);
    },
    get: function (key) {
        if (key === "") {
            throw new Error("empty key")
        }
        return this.dataMap.get(key);
    }
};
module.exports = BlackContract;