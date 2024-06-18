"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const fs = __importStar(require("fs"));
const SlashCommands_1 = require("./Handler/SlashCommands");
const Events_1 = require("./Handler/Events");
const Components_1 = require("./Handler/Components");
class Handler {
    constructor(client) {
        this.client = client;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.slashcommands = new SlashCommands_1.SlashCommands(this.client);
            this.events = new Events_1.Events(this.client);
            this.components = new Components_1.Components(this.client);
        });
    }
    static getPathsFiles(dir) {
        let paths = [];
        for (let file of fs.readdirSync(dir)) {
            if (file.includes('.')) {
                paths.push(dir + '/' + file);
            }
            else {
                paths.concat(Handler.getPathsFiles(dir + '/' + file));
            }
        }
        return paths;
    }
}
exports.Handler = Handler;
