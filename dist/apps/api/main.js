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
const config_1 = __webpack_require__(40);
const nestjs_rmq_1 = __webpack_require__(37);
const rmq_config_1 = __webpack_require__(41);
const jwt_1 = __webpack_require__(42);
const jwt_config_1 = __webpack_require__(43);
const passport_1 = __webpack_require__(44);
const user_controller_1 = __webpack_require__(45);
const jwt_strategy_1 = __webpack_require__(49);
const wallet_controller_1 = __webpack_require__(51);
const category_controller_1 = __webpack_require__(56);
const transaction_controller_1 = __webpack_require__(61);
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
        controllers: [auth_controller_1.AuthController, user_controller_1.UserController, wallet_controller_1.WalletController, category_controller_1.CategoryController, transaction_controller_1.TransactionController],
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
const nestjs_rmq_1 = __webpack_require__(37);
const login_dto_1 = __webpack_require__(38);
const register_dto_1 = __webpack_require__(39);
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
tslib_1.__exportStar(__webpack_require__(22), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);
tslib_1.__exportStar(__webpack_require__(26), exports);
tslib_1.__exportStar(__webpack_require__(27), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);
tslib_1.__exportStar(__webpack_require__(34), exports);
tslib_1.__exportStar(__webpack_require__(35), exports);
tslib_1.__exportStar(__webpack_require__(36), exports);


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
const class_transformer_1 = __webpack_require__(21);
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
tslib_1.__exportStar(__webpack_require__(18), exports);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);


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
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryIcon = void 0;
var CategoryIcon;
(function (CategoryIcon) {
    CategoryIcon["FOOD"] = "food";
    CategoryIcon["TRANSPORT"] = "transport";
    CategoryIcon["SHOPPING"] = "shopping";
    CategoryIcon["SALARY"] = "salary";
    CategoryIcon["RENT"] = "rent";
    CategoryIcon["TRANSFER"] = "transfer";
    // Добавьте остальные иконки здесь
})(CategoryIcon || (exports.CategoryIcon = CategoryIcon = {}));


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FlowType = void 0;
var FlowType;
(function (FlowType) {
    FlowType["Income"] = "income";
    FlowType["Expense"] = "expense";
    FlowType["Transfer"] = "transfer";
})(FlowType || (exports.FlowType = FlowType = {}));


/***/ }),
/* 21 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUpdate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(21);
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
/* 23 */
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
/* 24 */
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
/* 25 */
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
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryDelete = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var CategoryDelete;
(function (CategoryDelete) {
    CategoryDelete.topic = 'category.delete.command';
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
    CategoryDelete.Request = Request;
    class Response {
    }
    CategoryDelete.Response = Response;
})(CategoryDelete || (exports.CategoryDelete = CategoryDelete = {}));


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryCreate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
var CategoryCreate;
(function (CategoryCreate) {
    var _a, _b;
    CategoryCreate.topic = 'category.create.command';
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
        (0, class_validator_1.IsEnum)(interfaces_1.FlowType, { message: 'type must be income or expense' }),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.FlowType !== "undefined" && interfaces_1.FlowType) === "function" ? _a : Object)
    ], Request.prototype, "type", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsEnum)(interfaces_1.CategoryIcon),
        tslib_1.__metadata("design:type", typeof (_b = typeof interfaces_1.CategoryIcon !== "undefined" && interfaces_1.CategoryIcon) === "function" ? _b : Object)
    ], Request.prototype, "icon", void 0);
    CategoryCreate.Request = Request;
    class Response {
    }
    CategoryCreate.Response = Response;
})(CategoryCreate || (exports.CategoryCreate = CategoryCreate = {}));


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryGet = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var CategoryGet;
(function (CategoryGet) {
    CategoryGet.topic = 'category.get.query';
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
    CategoryGet.Request = Request;
    class Response {
    }
    CategoryGet.Response = Response;
})(CategoryGet || (exports.CategoryGet = CategoryGet = {}));


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryList = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
var CategoryList;
(function (CategoryList) {
    var _a;
    CategoryList.topic = 'category.list.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsEnum)(interfaces_1.FlowType, { message: 'type must be income or expense' }),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.FlowType !== "undefined" && interfaces_1.FlowType) === "function" ? _a : Object)
    ], Request.prototype, "type", void 0);
    CategoryList.Request = Request;
    class Response {
    }
    CategoryList.Response = Response;
})(CategoryList || (exports.CategoryList = CategoryList = {}));


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryUpdate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
var CategoryUpdate;
(function (CategoryUpdate) {
    var _a;
    CategoryUpdate.topic = 'category.update.command';
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
        (0, class_validator_1.IsEnum)(interfaces_1.CategoryIcon),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.CategoryIcon !== "undefined" && interfaces_1.CategoryIcon) === "function" ? _a : Object)
    ], Request.prototype, "icon", void 0);
    CategoryUpdate.Request = Request;
    class Response {
    }
    CategoryUpdate.Response = Response;
})(CategoryUpdate || (exports.CategoryUpdate = CategoryUpdate = {}));


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionUpdate = void 0;
const tslib_1 = __webpack_require__(4);
// libs/contracts/src/lib/transaction/transaction.update.ts
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(21);
var TransactionUpdate;
(function (TransactionUpdate) {
    var _a;
    TransactionUpdate.topic = 'transaction.update.command';
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
    ], Request.prototype, "accountId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "categoryId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "toAccountId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], Request.prototype, "amount", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsDateString)(),
        (0, class_transformer_1.Type)(() => Date),
        tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
    ], Request.prototype, "date", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "description", void 0);
    TransactionUpdate.Request = Request;
    class Response {
    }
    TransactionUpdate.Response = Response;
})(TransactionUpdate || (exports.TransactionUpdate = TransactionUpdate = {}));


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionCreate = void 0;
const tslib_1 = __webpack_require__(4);
// libs/contracts/src/lib/transaction/transaction.create.ts
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(21);
var TransactionCreate;
(function (TransactionCreate) {
    var _a;
    TransactionCreate.topic = 'transaction.create.command';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "accountId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "categoryId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "toAccountId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsNumber)(),
        tslib_1.__metadata("design:type", Number)
    ], Request.prototype, "amount", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsDateString)(),
        (0, class_transformer_1.Type)(() => Date),
        tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
    ], Request.prototype, "date", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "description", void 0);
    TransactionCreate.Request = Request;
    class Response {
    }
    TransactionCreate.Response = Response;
})(TransactionCreate || (exports.TransactionCreate = TransactionCreate = {}));


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionDelete = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var TransactionDelete;
(function (TransactionDelete) {
    TransactionDelete.topic = 'transaction.delete.command';
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
    TransactionDelete.Request = Request;
    class Response {
    }
    TransactionDelete.Response = Response;
})(TransactionDelete || (exports.TransactionDelete = TransactionDelete = {}));


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionPurge = void 0;
// libs/contracts/src/lib/transaction/transaction.purge.ts
var TransactionPurge;
(function (TransactionPurge) {
    TransactionPurge.topic = 'transaction.purge.command';
    class Request {
    }
    TransactionPurge.Request = Request;
    class Response {
    }
    TransactionPurge.Response = Response;
})(TransactionPurge || (exports.TransactionPurge = TransactionPurge = {}));


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionGet = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
var TransactionGet;
(function (TransactionGet) {
    TransactionGet.topic = 'transaction.get.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        tslib_1.__metadata("design:type", Array)
    ], Request.prototype, "peers", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    TransactionGet.Request = Request;
    class Response {
    }
    TransactionGet.Response = Response;
})(TransactionGet || (exports.TransactionGet = TransactionGet = {}));


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionList = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
var TransactionList;
(function (TransactionList) {
    var _a;
    TransactionList.topic = 'transaction.list.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "userId", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        tslib_1.__metadata("design:type", Array)
    ], Request.prototype, "peers", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        tslib_1.__metadata("design:type", Array)
    ], Request.prototype, "accountIds", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        tslib_1.__metadata("design:type", Array)
    ], Request.prototype, "userIds", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsString)({ each: true }),
        tslib_1.__metadata("design:type", Array)
    ], Request.prototype, "categoryIds", void 0);
    tslib_1.__decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsIn)(Object.values(interfaces_1.FlowType)),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.FlowType !== "undefined" && interfaces_1.FlowType) === "function" ? _a : Object)
    ], Request.prototype, "type", void 0);
    TransactionList.Request = Request;
    class Response {
    }
    TransactionList.Response = Response;
})(TransactionList || (exports.TransactionList = TransactionList = {}));


/***/ }),
/* 37 */
/***/ ((module) => {

module.exports = require("nestjs-rmq");

/***/ }),
/* 38 */
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
/* 39 */
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
/* 40 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRMQConfig = void 0;
const config_1 = __webpack_require__(40);
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
        serviceName: 'moneytracker-api'
    })
});
exports.getRMQConfig = getRMQConfig;


/***/ }),
/* 42 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getJWTConfig = void 0;
const config_1 = __webpack_require__(40);
const getJWTConfig = () => ({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET')
    })
});
exports.getJWTConfig = getJWTConfig;


/***/ }),
/* 44 */
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const jwt_guard_1 = __webpack_require__(46);
const user_decorator_1 = __webpack_require__(47);
const nestjs_rmq_1 = __webpack_require__(37);
const contracts_1 = __webpack_require__(6);
const change_profile_dto_1 = __webpack_require__(48);
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
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JWTAuthGuard = void 0;
const passport_1 = __webpack_require__(44);
class JWTAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
}
exports.JWTAuthGuard = JWTAuthGuard;


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserId = void 0;
const common_1 = __webpack_require__(1);
exports.UserId = (0, common_1.createParamDecorator)((data, ctx) => {
    return ctx.switchToHttp().getRequest()?.user;
});


/***/ }),
/* 48 */
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
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const config_1 = __webpack_require__(40);
const passport_1 = __webpack_require__(44);
const passport_jwt_1 = __webpack_require__(50);
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
/* 50 */
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WalletController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_rmq_1 = __webpack_require__(37);
const jwt_guard_1 = __webpack_require__(46);
const user_decorator_1 = __webpack_require__(47);
const contracts_1 = __webpack_require__(6);
const create_account_dto_1 = __webpack_require__(52);
const update_account_dto_1 = __webpack_require__(53);
const list_accounts_dto_1 = __webpack_require__(54);
const account_id_dto_1 = __webpack_require__(55);
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
/* 52 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateAccountDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(21);
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
/* 53 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateAccountDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const class_transformer_1 = __webpack_require__(21);
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
/* 54 */
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
/* 55 */
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


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_rmq_1 = __webpack_require__(37);
const jwt_guard_1 = __webpack_require__(46);
const user_decorator_1 = __webpack_require__(47);
const contracts_1 = __webpack_require__(6);
const list_categories_dto_1 = __webpack_require__(57);
const category_id_dto_1 = __webpack_require__(58);
const create_category_dto_1 = __webpack_require__(59);
const update_category_dto_1 = __webpack_require__(60);
let CategoryController = class CategoryController {
    constructor(rmqService) {
        this.rmqService = rmqService;
    }
    async list(userId, dto) {
        const response = await this.rmqService.send(contracts_1.CategoryList.topic, { userId, type: dto.type });
        const categories = response.categories.map(cat => ({
            _id: cat._id,
            name: cat.name,
            type: cat.type,
            icon: cat.icon,
            isDefault: cat.isDefault,
        }));
        return { categories };
    }
    async get(userId, params) {
        const response = await this.rmqService.send(contracts_1.CategoryGet.topic, { userId, id: params.id });
        const cat = response.category;
        // Оставляем только нужные поля, включая deletedAt
        const category = {
            _id: cat._id,
            name: cat.name,
            type: cat.type,
            icon: cat.icon,
            isDefault: cat.isDefault,
            deletedAt: cat.deletedAt ?? null,
        };
        return { category };
    }
    async create(userId, dto) {
        await this.rmqService.send(contracts_1.CategoryCreate.topic, { userId, ...dto });
        return {};
    }
    async update(userId, params, dto) {
        await this.rmqService.send(contracts_1.CategoryUpdate.topic, { userId, id: params.id, ...dto });
        return {};
    }
    async delete(userId, params) {
        await this.rmqService.send(contracts_1.CategoryDelete.topic, { userId, id: params.id });
        return {};
    }
};
exports.CategoryController = CategoryController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_b = typeof list_categories_dto_1.ListCategoriesDto !== "undefined" && list_categories_dto_1.ListCategoriesDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "list", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof category_id_dto_1.CategoryIdDto !== "undefined" && category_id_dto_1.CategoryIdDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "get", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_d = typeof create_category_dto_1.CreateCategoryDto !== "undefined" && create_category_dto_1.CreateCategoryDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof category_id_dto_1.CategoryIdDto !== "undefined" && category_id_dto_1.CategoryIdDto) === "function" ? _e : Object, typeof (_f = typeof update_category_dto_1.UpdateCategoryDto !== "undefined" && update_category_dto_1.UpdateCategoryDto) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_g = typeof category_id_dto_1.CategoryIdDto !== "undefined" && category_id_dto_1.CategoryIdDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "delete", null);
exports.CategoryController = CategoryController = tslib_1.__decorate([
    (0, common_1.Controller)('categories'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object])
], CategoryController);


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListCategoriesDto = void 0;
const tslib_1 = __webpack_require__(4);
const interfaces_1 = __webpack_require__(13);
const class_validator_1 = __webpack_require__(8);
class ListCategoriesDto {
}
exports.ListCategoriesDto = ListCategoriesDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(interfaces_1.FlowType, { message: 'type must be income or expense' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.FlowType !== "undefined" && interfaces_1.FlowType) === "function" ? _a : Object)
], ListCategoriesDto.prototype, "type", void 0);


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryIdDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class CategoryIdDto {
}
exports.CategoryIdDto = CategoryIdDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CategoryIdDto.prototype, "id", void 0);


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoryDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
class CreateCategoryDto {
}
exports.CreateCategoryDto = CreateCategoryDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(interfaces_1.FlowType, { message: 'type must be income or expense' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.FlowType !== "undefined" && interfaces_1.FlowType) === "function" ? _a : Object)
], CreateCategoryDto.prototype, "type", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEnum)(interfaces_1.CategoryIcon, { message: 'icon must be a valid CategoryIcon' }),
    tslib_1.__metadata("design:type", typeof (_b = typeof interfaces_1.CategoryIcon !== "undefined" && interfaces_1.CategoryIcon) === "function" ? _b : Object)
], CreateCategoryDto.prototype, "icon", void 0);


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCategoryDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
class UpdateCategoryDto {
}
exports.UpdateCategoryDto = UpdateCategoryDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateCategoryDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(interfaces_1.CategoryIcon, { message: 'icon must be a valid CategoryIcon' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.CategoryIcon !== "undefined" && interfaces_1.CategoryIcon) === "function" ? _a : Object)
], UpdateCategoryDto.prototype, "icon", void 0);


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_rmq_1 = __webpack_require__(37);
const jwt_guard_1 = __webpack_require__(46);
const user_decorator_1 = __webpack_require__(47);
const lodash_1 = __webpack_require__(62);
const contracts_1 = __webpack_require__(6);
const create_transaction_dto_1 = __webpack_require__(63);
const list_transactions_dto_1 = __webpack_require__(64);
const transaction_id_dto_1 = __webpack_require__(65);
const update_transaction_dto_1 = __webpack_require__(66);
function isoDateOnly(d) {
    return new Date(d).toISOString().split('T')[0];
}
let TransactionController = class TransactionController {
    constructor(rmq) {
        this.rmq = rmq;
    }
    async create(userId, dto) {
        await this.rmq.send(contracts_1.TransactionCreate.topic, {
            userId,
            ...dto,
            date: new Date(dto.date),
        });
        return {};
    }
    async list(userId, dto) {
        const { transactions: flat } = await this.rmq.send(contracts_1.TransactionList.topic, {
            userId,
            peers: dto.peers ?? [],
            accountIds: dto.accountIds,
            userIds: dto.userIds,
            categoryIds: dto.categoryIds,
            type: dto.type,
        });
        const enriched = await Promise.all(flat.map(async (tx) => {
            // --- общие данные: пользователь и категория -----------------
            const [userRes, catRes] = await Promise.all([
                this.rmq.send(contracts_1.AccountUserInfo.topic, { id: tx.userId }),
                this.rmq.send(contracts_1.CategoryGet.topic, { userId, id: tx.categoryId }),
            ]);
            const baseFields = {
                _id: tx._id,
                amount: tx.amount,
                date: isoDateOnly(tx.date),
                type: tx.type,
                description: tx.description,
                user: {
                    id: tx.userId,
                    name: userRes?.profile?.displayName ?? null,
                },
                category: {
                    id: catRes.category._id,
                    name: catRes.category.name,
                },
            };
            //----------------------------------------------------------------
            if (tx.type === 'transfer') {
                /* данные счетов */
                const [fromAccRes, toAccRes] = await Promise.all([
                    this.rmq.send(contracts_1.AccountGet.topic, { userId, id: tx.accountId }),
                    this.rmq.send(contracts_1.AccountGet.topic, { userId, id: tx.toAccountId }),
                ]);
                const toOwnerId = toAccRes.account.userId;
                let toOwner;
                if (toOwnerId !== userId) {
                    const ownerRes = await this.rmq.send(contracts_1.AccountUserInfo.topic, { id: toOwnerId });
                    toOwner = { name: ownerRes.profile.displayName };
                }
                return {
                    ...baseFields,
                    fromAccount: (0, lodash_1.pick)(fromAccRes.account, ['name', 'type', 'currency']),
                    toAccount: {
                        ...(0, lodash_1.pick)(toAccRes.account, ['name', 'type', 'currency']),
                        owner: toOwner,
                    },
                };
            }
            //----------------------------------------------------------------
            /* income | expense */
            const accRes = await this.rmq.send(contracts_1.AccountGet.topic, { userId, id: tx.accountId });
            return {
                ...baseFields,
                account: (0, lodash_1.pick)(accRes.account, ['name', 'type', 'currency']),
            };
        }));
        return { transactions: enriched };
    }
    async get(userId, params) {
        const { transaction: tx } = await this.rmq.send(contracts_1.TransactionGet.topic, {
            userId,
            id: params.id,
            peers: params.peers ?? [],
        });
        /* --- общие данные пользователя и категории -------------------- */
        const [userRes, catRes] = await Promise.all([
            this.rmq.send(contracts_1.AccountUserInfo.topic, { id: tx.userId }),
            this.rmq.send(contracts_1.CategoryGet.topic, { userId, id: tx.categoryId }),
        ]);
        const base = {
            _id: tx._id,
            type: tx.type,
            amount: tx.amount,
            date: isoDateOnly(tx.date),
            description: tx.description,
            deletedAt: tx.deletedAt ?? null,
            user: {
                id: tx.userId,
                name: userRes?.profile?.displayName ?? null,
            },
            category: {
                id: catRes.category._id,
                name: catRes.category.name,
            },
        };
        /* -------------------------------------------------------------- */
        if (tx.type === 'transfer') {
            const [fromAccRes, toAccRes] = await Promise.all([
                this.rmq.send(contracts_1.AccountGet.topic, { userId, id: tx.accountId }),
                this.rmq.send(contracts_1.AccountGet.topic, { userId, id: tx.toAccountId }),
            ]);
            const toOwnerId = toAccRes.account.userId;
            let toOwner;
            if (toOwnerId !== userId) {
                const ownerRes = await this.rmq.send(contracts_1.AccountUserInfo.topic, { id: toOwnerId });
                toOwner = { name: ownerRes.profile.displayName };
            }
            return {
                transaction: {
                    ...base,
                    fromAccount: (0, lodash_1.pick)(fromAccRes.account, ['name', 'type', 'currency']),
                    toAccount: {
                        ...(0, lodash_1.pick)(toAccRes.account, ['name', 'type', 'currency']),
                        owner: toOwner,
                    },
                },
            };
        }
        /* -------------------------------------------------------------- */
        const accRes = await this.rmq.send(contracts_1.AccountGet.topic, { userId, id: tx.accountId });
        return {
            transaction: {
                ...base,
                account: (0, lodash_1.pick)(accRes.account, ['name', 'type', 'currency']),
            },
        };
    }
    async update(userId, params, dto) {
        const { date, ...rest } = dto;
        await this.rmq.send(contracts_1.TransactionUpdate.topic, {
            userId,
            id: params.id,
            ...rest,
            ...(date ? { date: new Date(date) } : {}),
        });
        return {};
    }
    // @UseGuards(JWTAuthGuard)
    // @Delete(':id')
    // async delete(
    //   @UserId() userId: string,
    //   @Param() params: TransactionIdDto,
    // ) {
    //   await this.rmq.send<
    //     TransactionDelete.Request,
    //     TransactionDelete.Response
    //   >(
    //     TransactionDelete.topic,
    //     {
    //       userId,
    //       id: params.id,
    //     },
    //   );
    //   return {};
    // }
    async purge(userId, params) {
        await this.rmq.send(contracts_1.TransactionPurge.topic, {
            userId,
            id: params.id,
        });
        return {};
    }
};
exports.TransactionController = TransactionController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_b = typeof create_transaction_dto_1.CreateTransactionDto !== "undefined" && create_transaction_dto_1.CreateTransactionDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof list_transactions_dto_1.ListTransactionsDto !== "undefined" && list_transactions_dto_1.ListTransactionsDto) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionController.prototype, "list", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_d = typeof transaction_id_dto_1.TransactionIdDto !== "undefined" && transaction_id_dto_1.TransactionIdDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionController.prototype, "get", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Patch)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof transaction_id_dto_1.TransactionIdDto !== "undefined" && transaction_id_dto_1.TransactionIdDto) === "function" ? _e : Object, typeof (_f = typeof update_transaction_dto_1.UpdateTransactionDto !== "undefined" && update_transaction_dto_1.UpdateTransactionDto) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JWTAuthGuard),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, user_decorator_1.UserId)()),
    tslib_1.__param(1, (0, common_1.Param)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_g = typeof transaction_id_dto_1.TransactionIdDto !== "undefined" && transaction_id_dto_1.TransactionIdDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionController.prototype, "purge", null);
exports.TransactionController = TransactionController = tslib_1.__decorate([
    (0, common_1.Controller)('transactions'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object])
], TransactionController);


/***/ }),
/* 62 */
/***/ ((module) => {

module.exports = require("lodash");

/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTransactionDto = void 0;
const tslib_1 = __webpack_require__(4);
// apps/api/src/app/dtos/create-transaction.dto.ts
const class_validator_1 = __webpack_require__(8);
class CreateTransactionDto {
}
exports.CreateTransactionDto = CreateTransactionDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTransactionDto.prototype, "accountId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTransactionDto.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTransactionDto.prototype, "toAccountId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreateTransactionDto.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], CreateTransactionDto.prototype, "date", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateTransactionDto.prototype, "description", void 0);


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListTransactionsDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
const interfaces_1 = __webpack_require__(13);
class ListTransactionsDto {
}
exports.ListTransactionsDto = ListTransactionsDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], ListTransactionsDto.prototype, "peers", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], ListTransactionsDto.prototype, "accountIds", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], ListTransactionsDto.prototype, "userIds", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], ListTransactionsDto.prototype, "categoryIds", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(Object.values(interfaces_1.FlowType)),
    tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.FlowType !== "undefined" && interfaces_1.FlowType) === "function" ? _a : Object)
], ListTransactionsDto.prototype, "type", void 0);


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionIdDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class TransactionIdDto {
}
exports.TransactionIdDto = TransactionIdDto;
tslib_1.__decorate([
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], TransactionIdDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    tslib_1.__metadata("design:type", Array)
], TransactionIdDto.prototype, "peers", void 0);


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTransactionDto = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(8);
class UpdateTransactionDto {
}
exports.UpdateTransactionDto = UpdateTransactionDto;
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTransactionDto.prototype, "accountId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTransactionDto.prototype, "categoryId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTransactionDto.prototype, "toAccountId", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], UpdateTransactionDto.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTransactionDto.prototype, "date", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateTransactionDto.prototype, "description", void 0);


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