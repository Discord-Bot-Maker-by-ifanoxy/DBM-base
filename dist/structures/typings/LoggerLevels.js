"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerLevels = void 0;
var LoggerLevels;
(function (LoggerLevels) {
    LoggerLevels[LoggerLevels["TRACE"] = 0] = "TRACE";
    LoggerLevels[LoggerLevels["DEBUG"] = 1] = "DEBUG";
    LoggerLevels[LoggerLevels["INFO"] = 2] = "INFO";
    LoggerLevels[LoggerLevels["WARN"] = 3] = "WARN";
    LoggerLevels[LoggerLevels["ERROR"] = 4] = "ERROR";
    LoggerLevels[LoggerLevels["FATAL"] = 5] = "FATAL";
})(LoggerLevels || (exports.LoggerLevels = LoggerLevels = {}));
