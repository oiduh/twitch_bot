"use strict";
exports.__esModule = true;
exports.Queue = void 0;
var Queue = /** @class */ (function () {
    function Queue(capacity) {
        if (capacity === void 0) { capacity = 5000; }
        this.storage = [];
        this.capacity = capacity;
    }
    Queue.prototype.enqueue = function (item) {
        if (this.storage.length === this.capacity) {
            throw Error('The queue has reached its maximum size!');
        }
        this.storage.push(item);
    };
    Queue.prototype.dequeue = function () {
        if (this.storage.length === 0) {
            throw Error('The queue is empty!');
        }
        return this.storage.shift();
    };
    Queue.prototype.size = function () {
        return this.storage.length;
    };
    Queue.prototype.show = function () {
        console.log(this.storage);
    };
    return Queue;
}());
exports.Queue = Queue;
var g = new Queue();
g.enqueue('a');
g.enqueue('c');
g.enqueue('v');
console.log(g.dequeue());
console.log(g.dequeue());
console.log(g.dequeue());
