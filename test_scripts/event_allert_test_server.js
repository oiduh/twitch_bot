"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var ws = require("ws");
require("dotenv").config();
var queue_1 = require("../utility/queue");
// EVENT QUEUE
//
var event_queue = new queue_1.Queue();
event_queue.enqueue({ type: 'FOLLOWER', content: 'first' });
var _loop_1 = function (user_name) {
    setTimeout(function () {
        event_queue.enqueue({ type: 'FOLLOWER', content: user_name });
        event_client.send(JSON.stringify({ type: 'GET_STATUS', content: '' }));
    }, Math.floor(Math.random() * 30000));
};
for (var _i = 0, _a = ['user1', 'user2', 'weeb1', 'weeb2', 'gachi1']; _i < _a.length; _i++) {
    var user_name = _a[_i];
    _loop_1(user_name);
}
event_queue.show();
// SERVER COMMUNICATING WITH OVERLAY
//
var event_server = new ws.Server({ port: 3001 });
var event_client;
event_server.on("connection", function (ws) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("new connection");
                return [4 /*yield*/, ws];
            case 1:
                event_client = _a.sent();
                event_client.on("message", function (response) {
                    var message = JSON.parse(response)['content'];
                    console.log("received message: ".concat(message, " of type: ").concat(typeof message));
                    switch (message) {
                        case 'BUSY':
                            console.log('client is busy, wait for READY message');
                            break;
                        case 'READY':
                            console.log('client is ready, processing next event, if available');
                            if (event_queue.size() > 0) {
                                var next_event = event_queue.dequeue();
                                event_client.send(JSON.stringify(next_event));
                            }
                            break;
                        default:
                            console.log("unknown message: ".concat(message));
                            break;
                    }
                });
                event_client.send(JSON.stringify({ type: 'GET_STATUS', content: '' }));
                return [2 /*return*/];
        }
    });
}); });
