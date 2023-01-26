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
var _this = this;
var ytdl = require('ytdl-core');
var yt_url = 'https://www.youtube.com/watch?v=Rxc7u9p0VAU';
//let yt_url = 'https://www.youtube.com/watch?v=RXC7U9P0VA1';
var test = function (url) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ytdl.getBasicInfo(url)
                    .then(function (res) {
                    var meta_info = res['videoDetails'];
                    console.log(meta_info);
                    //let meta_info = res['player']['videoDetails'];
                    //console.log(meta_info);
                    var video_length_in_sec = meta_info['lengthSeconds'];
                    console.log("The length of this video is: ".concat(Math.floor(video_length_in_sec / 60), "min and ").concat(video_length_in_sec % 60, "sec"));
                    var view_count = meta_info['viewCount'];
                    console.log("The viewcount is: ".concat(view_count));
                    var age_restricted = meta_info['age_restricted'];
                    console.log("The video is ".concat(age_restricted ? '' : 'NOT', " age restricted"));
                    var available_formats = res['formats'];
                    var mp4 = available_formats.filter(function (x) { return x['mimeType'].includes('video/mp4') && x['height'] <= 720; });
                    console.log(mp4);
                    console.log('---');
                    var best_qual = mp4.sort(function (a, b) { return (a['height'] > b['height']) ? -1 : (a['height'] < b['height']) ? 1 : 0; })[0];
                    console.log(best_qual);
                })["catch"](function (e) { return console.log(e); })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
test(yt_url);
