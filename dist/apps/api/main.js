/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_controller_1 = __webpack_require__(5);
const config_1 = __webpack_require__(26);
const nestjs_rmq_1 = __webpack_require__(23);
const rmq_config_1 = __webpack_require__(27);
const jwt_1 = __webpack_require__(28);
const jwt_config_1 = __webpack_require__(29);
const passport_1 = __webpack_require__(30);
const user_controller_1 = __webpack_require__(31);
const jwt_strategy_1 = __webpack_require__(35);
const wallet_controller_1 = __webpack_require__(37);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ envFilePath: 'envs/.api.env', isGlobal: true }),
            nestjs_rmq_1.RMQModule.forRootAsync((0, rmq_config_1.getRMQConfig)()),
            jwt_1.JwtModule.registerAsync((0, jwt_config_1.getJWTConfig)()),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' })
        ],
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController, wallet_controller_1.WalletController],
        providers: [
            jwt_strategy_1.JwtStrategy
        ]
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const contracts_1 = __webpack_require__(6);
const nestjs_rmq_1 = __webpack_require__(23);
const login_dto_1 = __webpack_require__(24);
const register_dto_1 = __webpack_require__(25);
let AuthController = class AuthController {
    constructor(rmqService) {
        this.rmqService = rmqService;
    }
    async register(dto) {
        try {
            return await this.rmqService.send(contracts_1.AccountRegister.topic, dto);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new common_1.UnauthorizedException(e.message);
            }
        }
    }
    async login(dto) {
        try {
            return await this.rmqService.send(contracts_1.AccountLogin.topic, dto);
        }
        catch (e) {
            if (e instanceof Error) {
                throw new common_1.UnauthorizedException(e.message);
            }
        }
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, common_1.Post)('register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof register_dto_1.RegisterDto !== "undefined" && register_dto_1.RegisterDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.Post)('login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_c = typeof login_dto_1.LoginDto !== "undefined" && login_dto_1.LoginDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(7), exports);
tslib_1.__exportStar(__webpack_require__(9), exports);
tslib_1.__exportStar(__webpack_require__(10), exports);
tslib_1.__exportStar(__webpack_require__(11), exports);
tslib_1.__exportStar(__webpack_require__(12), exports);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountLogin = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var AccountLogin;
(function (AccountLogin) {
    AccountLogin.topic = 'account.login.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsEmail)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "email", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "password", void 0);
    AccountLogin.Request = Request;
    class Response {
    }
    AccountLogin.Response = Response;
})(AccountLogin || (exports.AccountLogin = AccountLogin = {}));


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountRegister = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var AccountRegister;
(function (AccountRegister) {
    AccountRegister.topic = 'account.register.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsEmail)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "email", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "password", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "displayName", void 0);
    AccountRegister.Request = Request;
    class Response {
    }
    AccountRegister.Response = Response;
})(AccountRegister || (exports.AccountRegister = AccountRegister = {}));


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUserInfo = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var AccountUserInfo;
(function (AccountUserInfo) {
    AccountUserInfo.topic = 'account.user-info.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    AccountUserInfo.Request = Request;
    class Response {
    }
    AccountUserInfo.Response = Response;
})(AccountUserInfo || (exports.AccountUserInfo = AccountUserInfo = {}));


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountChangeProfile = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var AccountChangeProfile;
(function (AccountChangeProfile) {
    var _a;
    AccountChangeProfile.topic = 'account.change-profile.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsObject)(),
        tslib_1.__metadata("design:type", typeof (_a = typeof Pick !== "undefined" && Pick) === "function" ? _a : Object)
    ], Request.prototype, "user", void 0);
    AccountChangeProfile.Request = Request;
    class Response {
    }
    AccountChangeProfile.Response = Response;
})(AccountChangeProfile || (exports.AccountChangeProfile = AccountChangeProfile = {}));


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountCreate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
const class_transformer_1 = __webpack_require__(18);
var AccountCreate;
(function (AccountCreate) {
    var _a;
    AccountCreate.topic = 'account.create.command';
    class CreditDto {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "creditLimit", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "gracePeriodDays", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsIn)(['fixed', 'calendar', 'perPurchase']),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.BillingCycleType !== "undefined" && interfaces_1.BillingCycleType) === "function" ? _a : Object)
    ], CreditDto.prototype, "billingCycleType", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "billingCycleLengthDays", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "billingCycleStartDayOfMonth", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "paymentPeriodDays", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "interestRate", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "annualFee", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashWithdrawalFeePercent", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashWithdrawalFeeFixed", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashWithdrawalLimitPerMonth", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashbackPercentMax", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        tslib_1.__metadata("design:type", Array)
    ], CreditDto.prototype, "cashbackCategories", void 0);
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsIn)(['savings', 'debit', 'creditCard']),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "type", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "currency", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(() => CreditDto),
        tslib_1.__metadata("design:type", CreditDto)
    ], Request.prototype, "creditDetails", void 0);
    AccountCreate.Request = Request;
    class Response {
    }
    AccountCreate.Response = Response;
})(AccountCreate || (exports.AccountCreate = AccountCreate = {}));


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(14), exports);
tslib_1.__exportStar(__webpack_require__(15), exports);
tslib_1.__exportStar(__webpack_require__(16), exports);
tslib_1.__exportStar(__webpack_require__(17), exports);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountType = void 0;
var AccountType;
(function (AccountType) {
    AccountType["Savings"] = "savings";
    AccountType["Debit"] = "debit";
    AccountType["CreditCard"] = "creditCard";
})(AccountType || (exports.AccountType = AccountType = {}));


/***/ }),
/* 18 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUpdate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(18);
const interfaces_1 = __webpack_require__(13);
var AccountUpdate;
(function (AccountUpdate) {
    var _a;
    AccountUpdate.topic = 'wallet.update-account.command';
    class CreditDto {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "creditLimit", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "gracePeriodDays", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsIn)(Object.values(['fixed', 'calendar', 'perPurchase'])),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.BillingCycleType !== "undefined" && interfaces_1.BillingCycleType) === "function" ? _a : Object)
    ], CreditDto.prototype, "billingCycleType", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "billingCycleLengthDays", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "billingCycleStartDayOfMonth", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "paymentPeriodDays", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "interestRate", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "annualFee", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashWithdrawalFeePercent", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashWithdrawalFeeFixed", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashWithdrawalLimitPerMonth", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], CreditDto.prototype, "cashbackPercentMax", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        tslib_1.__metadata("design:type", Array)
    ], CreditDto.prototype, "cashbackCategories", void 0);
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "name", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "currency", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.ValidateNested)(),
        (0, class_transformer_1.Type)(() => CreditDto),
        tslib_1.__metadata("design:type", CreditDto)
    ], Request.prototype, "creditDetails", void 0);
    AccountUpdate.Request = Request;
    class Response {
    }
    AccountUpdate.Response = Response;
})(AccountUpdate || (exports.AccountUpdate = AccountUpdate = {}));


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountGet = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var AccountGet;
(function (AccountGet) {
    AccountGet.topic = 'account.get.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    AccountGet.Request = Request;
    class Response {
    }
    AccountGet.Response = Response;
})(AccountGet || (exports.AccountGet = AccountGet = {}));


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountList = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var AccountList;
(function (AccountList) {
    AccountList.topic = 'account.list.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        tslib_1.__metadata("design:type", Array)
    ], Request.prototype, "peers", void 0);
    AccountList.Request = Request;
    class Response {
    }
    AccountList.Response = Response;
})(AccountList || (exports.AccountList = AccountList = {}));


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountDelete = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var AccountDelete;
(function (AccountDelete) {
    AccountDelete.topic = 'account.delete.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    AccountDelete.Request = Request;
    class Response {
    }
    AccountDelete.Response = Response;
})(AccountDelete || (exports.AccountDelete = AccountDelete = {}));


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("nestjs-rmq");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class LoginDto {
}
exports.LoginDto = LoginDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], LoginDto.prototype, "password", void 0);


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class RegisterDto {
}
exports.RegisterDto = RegisterDto;
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "email", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], RegisterDto.prototype, "displayName", void 0);


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRMQConfig = void 0;
const config_1 = __webpack_require__(26);
const getRMQConfig = () => ({
    inject: [config_1.ConfigService],
    imports: [config_1.ConfigModule],
    useFactory: (configService) => ({
        exchangeName: configService.get('AMQP_EXCHANGE') ?? '',
        connections: [
            {
                login: configService.get('AMQP_USER') ?? '',
                password: configService.get('AMQP_PASSWORD') ?? '',
                host: configService.get('AMQP_HOSTNAME') ?? ''
            }
        ],
        prefetchCount: 32,
        serviceName: 'moneytracker-account'
    })
});
exports.getRMQConfig = getRMQConfig;


/***/ }),
/* 28 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getJWTConfig = void 0;
const config_1 = __webpack_require__(26);
const getJWTConfig = () => ({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET')
    })
});
exports.getJWTConfig = getJWTConfig;


/***/ }),
/* 30 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_guard_1 = __webpack_require__(32);
const user_decorator_1 = __webpack_require__(33);
const nestjs_rmq_1 = __webpack_require__(23);
const contracts_1 = __webpack_require__(6);
const change_profile_dto_1 = __webpack_require__(34);
let UserController = class UserController {
    constructor(rmqService) {
        this.rmqService = rmqService;
    }
    async info(userId) {
        return this.rmqService.send(contracts_1.AccountUserInfo.topic, { id: userId });
    }
    async changeProfile(userId, dto) {
        return this.rmqService.send(contracts_1.AccountChangeProfile.topic, {
            id: userId,
            user: { displayName: dto.displayName },
        });
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)('info'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "info", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Post)('change-profile'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_b = typeof change_profile_dto_1.ChangeProfileDto !== "undefined" && change_profile_dto_1.ChangeProfileDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "changeProfile", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, common_1.Controller)('user'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object])
], UserController);


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWTAuthGuard = void 0;
const passport_1 = __webpack_require__(30);
class JWTAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
}
exports.JWTAuthGuard = JWTAuthGuard;


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserId = void 0;
const common_1 = __webpack_require__(1);
exports.UserId = (0, common_1.createParamDecorator)((data, ctx) => {
    return ctx.switchToHttp().getRequest()?.user;
});


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeProfileDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class ChangeProfileDto {
}
exports.ChangeProfileDto = ChangeProfileDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ChangeProfileDto.prototype, "displayName", void 0);


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(26);
const passport_1 = __webpack_require__(30);
const passport_jwt_1 = __webpack_require__(36);
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: configService.get('JWT_SECRET')
        });
    }
    async validate({ id }) {
        return id;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], JwtStrategy);


/***/ }),
/* 36 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_rmq_1 = __webpack_require__(23);
const jwt_guard_1 = __webpack_require__(32);
const user_decorator_1 = __webpack_require__(33);
const contracts_1 = __webpack_require__(6);
const create_account_dto_1 = __webpack_require__(38);
const update_account_dto_1 = __webpack_require__(39);
const list_accounts_dto_1 = __webpack_require__(40);
const account_id_dto_1 = __webpack_require__(41);
const interfaces_1 = __webpack_require__(13);
let WalletController = class WalletController {
    constructor(rmqService) {
        this.rmqService = rmqService;
    }
    // 1) Получить список счетов (своих и peers), возвращаем только нужные поля
    async list(userId, dto) {
        const response = await this.rmqService.send(contracts_1.AccountList.topic, { userId, peers: dto.peers || [] });
        const sanitized = response.accounts.map(account => {
            const { _id, name, type, balance, currency, creditDetails } = account;
            if (type === interfaces_1.AccountType.CreditCard) {
                return { _id, name, type, balance, currency, creditDetails };
            }
            return { _id, name, type, balance, currency };
        });
        return { accounts: sanitized };
    }
    // 2) Создать новый счет
    async create(userId, dto) {
        // creditDetails обязательны для creditCard и запрещены для остальных
        if (dto.type === interfaces_1.AccountType.CreditCard && !dto.creditDetails) {
            throw new common_1.BadRequestException('For creditCard must to write creditDetails');
        }
        if (dto.creditDetails && dto.type !== interfaces_1.AccountType.CreditCard) {
            throw new common_1.BadRequestException('creditDetails are only allowed for creditCard accounts');
        }
        return this.rmqService.send(contracts_1.AccountCreate.topic, { userId, ...dto });
    }
    // 3) Получить один счет по ID, возвращая только определённые поля
    async getById(userId, params) {
        const response = await this.rmqService.send(contracts_1.AccountGet.topic, { userId, id: params.id });
        const { account } = response;
        const { _id, name, type, balance, currency, creditDetails } = account;
        if (type === interfaces_1.AccountType.CreditCard) {
            return { account: { _id, name, type, balance, currency, creditDetails } };
        }
        return { account: { _id, name, type, balance, currency } };
    }
    // 4) Обновить счет по ID
    async update(userId, params, dto) {
        return this.rmqService.send(contracts_1.AccountUpdate.topic, {
            userId,
            id: params.id,
            ...dto,
        });
    }
    // 5) Удалить счет (soft-delete) по ID
    async delete(userId, params) {
        return this.rmqService.send(contracts_1.AccountDelete.topic, {
            userId,
            id: params.id,
        });
    }
};
exports.WalletController = WalletController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_b = typeof list_accounts_dto_1.ListAccountsDto !== "undefined" && list_accounts_dto_1.ListAccountsDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "list", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof create_account_dto_1.CreateAccountDto !== "undefined" && create_account_dto_1.CreateAccountDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_d = typeof account_id_dto_1.AccountIdDto !== "undefined" && account_id_dto_1.AccountIdDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "getById", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof account_id_dto_1.AccountIdDto !== "undefined" && account_id_dto_1.AccountIdDto) === "function" ? _e : Object, typeof (_f = typeof update_account_dto_1.UpdateAccountDto !== "undefined" && update_account_dto_1.UpdateAccountDto) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_g = typeof account_id_dto_1.AccountIdDto !== "undefined" && account_id_dto_1.AccountIdDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "delete", null);
exports.WalletController = WalletController = tslib_1.__decorate([
    (0, common_1.Controller)('accounts'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object])
], WalletController);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAccountDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(18);
const interfaces_1 = __webpack_require__(13);
class CreditDetailsDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "creditLimit", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "gracePeriodDays", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsIn)(['fixed', 'calendar', 'perPurchase']),
    tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.BillingCycleType !== "undefined" && interfaces_1.BillingCycleType) === "function" ? _a : Object)
], CreditDetailsDto.prototype, "billingCycleType", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "billingCycleLengthDays", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "billingCycleStartDayOfMonth", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "paymentPeriodDays", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "interestRate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "annualFee", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "cashWithdrawalFeePercent", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "cashWithdrawalFeeFixed", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "cashWithdrawalLimitPerMonth", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsDto.prototype, "cashbackPercentMax", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreditDetailsDto.prototype, "cashbackCategories", void 0);
class CreateAccountDto {
}
exports.CreateAccountDto = CreateAccountDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAccountDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsIn)(Object.values(interfaces_1.AccountType)),
    tslib_1.__metadata("design:type", typeof (_b = typeof interfaces_1.AccountType !== "undefined" && interfaces_1.AccountType) === "function" ? _b : Object)
], CreateAccountDto.prototype, "type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateAccountDto.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreditDetailsDto),
    tslib_1.__metadata("design:type", CreditDetailsDto)
], CreateAccountDto.prototype, "creditDetails", void 0);


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAccountDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(18);
const interfaces_1 = __webpack_require__(13);
class CreditDetailsUpdateDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "creditLimit", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "gracePeriodDays", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['fixed', 'calendar', 'perPurchase']),
    tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.BillingCycleType !== "undefined" && interfaces_1.BillingCycleType) === "function" ? _a : Object)
], CreditDetailsUpdateDto.prototype, "billingCycleType", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "billingCycleLengthDays", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "billingCycleStartDayOfMonth", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "paymentPeriodDays", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "interestRate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "annualFee", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "cashWithdrawalFeePercent", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "cashWithdrawalFeeFixed", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "cashWithdrawalLimitPerMonth", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreditDetailsUpdateDto.prototype, "cashbackPercentMax", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], CreditDetailsUpdateDto.prototype, "cashbackCategories", void 0);
class UpdateAccountDto {
}
exports.UpdateAccountDto = UpdateAccountDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAccountDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateAccountDto.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CreditDetailsUpdateDto),
    tslib_1.__metadata("design:type", CreditDetailsUpdateDto)
], UpdateAccountDto.prototype, "creditDetails", void 0);


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListAccountsDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class ListAccountsDto {
}
exports.ListAccountsDto = ListAccountsDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], ListAccountsDto.prototype, "peers", void 0);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountIdDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class AccountIdDto {
}
exports.AccountIdDto = AccountIdDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], AccountIdDto.prototype, "id", void 0);


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(1);
const core_1 = __webpack_require__(2);
const app_module_1 = __webpack_require__(3);
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);
    const port = process.env.PORT || 3333;
    await app.listen(port);
    common_1.Logger.log(`🚀 API is running on: http://localhost:${port}/${globalPrefix}`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map