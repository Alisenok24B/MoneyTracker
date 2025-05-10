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
const app_controller_1 = __webpack_require__(5);
const app_service_1 = __webpack_require__(6);
const user_module_1 = __webpack_require__(7);
const auth_module_1 = __webpack_require__(42);
const config_1 = __webpack_require__(47);
const mongoose_1 = __webpack_require__(8);
const mongo_config_1 = __webpack_require__(48);
const nestjs_rmq_1 = __webpack_require__(36);
const rmq_config_1 = __webpack_require__(49);
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true, envFilePath: 'envs/.account.env' }),
            nestjs_rmq_1.RMQModule.forRootAsync((0, rmq_config_1.getRMQConfig)()),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            mongoose_1.MongooseModule.forRootAsync((0, mongo_config_1.getMongoConfig)())
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("tslib");

/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const app_service_1 = __webpack_require__(6);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getData() {
        return this.appService.getData();
    }
};
exports.AppController = AppController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
exports.AppController = AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
let AppService = class AppService {
    getData() {
        return { message: 'Hello API' };
    }
};
exports.AppService = AppService;
exports.AppService = AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const mongoose_1 = __webpack_require__(8);
const user_model_1 = __webpack_require__(9);
const user_repository_1 = __webpack_require__(11);
const user_commands_1 = __webpack_require__(12);
const user_queries_1 = __webpack_require__(41);
const user_service_1 = __webpack_require__(37);
const user_event_immiter_1 = __webpack_require__(40);
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: user_model_1.User.name, schema: user_model_1.UserSchema }
            ])],
        providers: [
            user_repository_1.UserRepository,
            user_service_1.UserService,
            user_event_immiter_1.UserEventEmmiter
        ],
        exports: [
            user_repository_1.UserRepository,
            user_service_1.UserService
        ],
        controllers: [user_commands_1.UserCommands, user_queries_1.UserQueries]
    })
], UserModule);


/***/ }),
/* 8 */
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(10);
let User = class User extends mongoose_2.Document {
};
exports.User = User;
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "displayName", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "email", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
exports.User = User = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),
/* 10 */
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRepository = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(10);
const user_model_1 = __webpack_require__(9);
const mongoose_2 = __webpack_require__(8);
const common_1 = __webpack_require__(1);
let UserRepository = class UserRepository {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async createUser(user) {
        const newUser = new this.userModel(user);
        return newUser.save();
    }
    async updateUser(user) {
        const { _id, ...rest } = user;
        return this.userModel.updateOne({ _id }, { $set: { ...rest } }).exec();
    }
    async findUser(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async findUserById(id) {
        return this.userModel.findById(id).exec();
    }
    async deleteUser(email) {
        this.userModel.deleteOne({ email }).exec();
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_2.InjectModel)(user_model_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object])
], UserRepository);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserCommands = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const contracts_1 = __webpack_require__(13);
const nestjs_rmq_1 = __webpack_require__(36);
const user_service_1 = __webpack_require__(37);
let UserCommands = class UserCommands {
    constructor(userService) {
        this.userService = userService;
    }
    async changeProfile({ user, id }) {
        return this.userService.changeProfile(user, id);
    }
};
exports.UserCommands = UserCommands;
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountChangeProfile.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof contracts_1.AccountChangeProfile !== "undefined" && contracts_1.AccountChangeProfile.Request) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UserCommands.prototype, "changeProfile", null);
exports.UserCommands = UserCommands = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserCommands);


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(14), exports);
tslib_1.__exportStar(__webpack_require__(16), exports);
tslib_1.__exportStar(__webpack_require__(17), exports);
tslib_1.__exportStar(__webpack_require__(18), exports);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(27), exports);
tslib_1.__exportStar(__webpack_require__(28), exports);
tslib_1.__exportStar(__webpack_require__(29), exports);
tslib_1.__exportStar(__webpack_require__(30), exports);
tslib_1.__exportStar(__webpack_require__(31), exports);
tslib_1.__exportStar(__webpack_require__(32), exports);
tslib_1.__exportStar(__webpack_require__(33), exports);
tslib_1.__exportStar(__webpack_require__(34), exports);
tslib_1.__exportStar(__webpack_require__(35), exports);


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountLogin = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 15 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountRegister = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUserInfo = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 18 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountChangeProfile = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountCreate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
const interfaces_1 = __webpack_require__(20);
const class_transformer_1 = __webpack_require__(26);
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
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);
tslib_1.__exportStar(__webpack_require__(23), exports);
tslib_1.__exportStar(__webpack_require__(24), exports);
tslib_1.__exportStar(__webpack_require__(25), exports);


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 24 */
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
/* 25 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryType = exports.CategoryIcon = void 0;
var CategoryIcon;
(function (CategoryIcon) {
    CategoryIcon["FOOD"] = "food";
    CategoryIcon["TRANSPORT"] = "transport";
    CategoryIcon["SHOPPING"] = "shopping";
    CategoryIcon["SALARY"] = "salary";
    CategoryIcon["RENT"] = "rent";
    // Добавьте остальные иконки здесь
})(CategoryIcon || (exports.CategoryIcon = CategoryIcon = {}));
var CategoryType;
(function (CategoryType) {
    CategoryType["Income"] = "income";
    CategoryType["Expense"] = "expense";
})(CategoryType || (exports.CategoryType = CategoryType = {}));


/***/ }),
/* 26 */
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUpdate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
const class_transformer_1 = __webpack_require__(26);
const interfaces_1 = __webpack_require__(20);
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
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountGet = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountList = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 30 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountDelete = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryDelete = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 32 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryCreate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
const interfaces_1 = __webpack_require__(20);
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
        (0, class_validator_1.IsEnum)(interfaces_1.CategoryType, { message: 'type must be income or expense' }),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.CategoryType !== "undefined" && interfaces_1.CategoryType) === "function" ? _a : Object)
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
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryGet = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
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
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryList = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
const interfaces_1 = __webpack_require__(20);
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
        (0, class_validator_1.IsEnum)(interfaces_1.CategoryType, { message: 'type must be income or expense' }),
        tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.CategoryType !== "undefined" && interfaces_1.CategoryType) === "function" ? _a : Object)
    ], Request.prototype, "type", void 0);
    CategoryList.Request = Request;
    class Response {
    }
    CategoryList.Response = Response;
})(CategoryList || (exports.CategoryList = CategoryList = {}));


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoryUpdate = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(15);
const interfaces_1 = __webpack_require__(20);
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
/* 36 */
/***/ ((module) => {

module.exports = require("nestjs-rmq");

/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const user_entity_1 = __webpack_require__(38);
const user_repository_1 = __webpack_require__(11);
const user_event_immiter_1 = __webpack_require__(40);
let UserService = class UserService {
    constructor(userRepository, userEventEmmiter) {
        this.userRepository = userRepository;
        this.userEventEmmiter = userEventEmmiter;
    }
    async changeProfile(user, id) {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new Error('Такого пользователя не существует');
        }
        const userEntity = new user_entity_1.UserEntity(existedUser).updateProfile(user.displayName);
        await this.updateUser(userEntity);
        return {};
    }
    updateUser(user) {
        return Promise.all([
            this.userEventEmmiter.handle(user),
            this.userRepository.updateUser(user)
        ]);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_repository_1.UserRepository !== "undefined" && user_repository_1.UserRepository) === "function" ? _a : Object, typeof (_b = typeof user_event_immiter_1.UserEventEmmiter !== "undefined" && user_event_immiter_1.UserEventEmmiter) === "function" ? _b : Object])
], UserService);


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const bcryptjs_1 = __webpack_require__(39);
class UserEntity {
    constructor(user) {
        this.events = [];
        this._id = user._id;
        this.displayName = user.displayName;
        this.passwordHash = user.passwordHash;
        this.email = user.email;
    }
    getPublicProfile() {
        return {
            email: this.email,
            displayName: this.displayName
        };
    }
    async setPassword(password) {
        const salt = await (0, bcryptjs_1.genSalt)(10);
        this.passwordHash = await (0, bcryptjs_1.hash)(password, salt);
        return this;
    }
    validatePassword(password) {
        return (0, bcryptjs_1.compare)(password, this.passwordHash);
    }
    updateProfile(displayName) {
        this.displayName = displayName;
        return this;
    }
}
exports.UserEntity = UserEntity;


/***/ }),
/* 39 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEventEmmiter = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const nestjs_rmq_1 = __webpack_require__(36);
let UserEventEmmiter = class UserEventEmmiter {
    constructor(rmqService) {
        this.rmqService = rmqService;
    }
    async handle(user) {
        for (const event of user.events) {
            await this.rmqService.notify(event.topic, event.data);
        }
    }
};
exports.UserEventEmmiter = UserEventEmmiter;
exports.UserEventEmmiter = UserEventEmmiter = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof nestjs_rmq_1.RMQService !== "undefined" && nestjs_rmq_1.RMQService) === "function" ? _a : Object])
], UserEventEmmiter);


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserQueries = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const contracts_1 = __webpack_require__(13);
const nestjs_rmq_1 = __webpack_require__(36);
const user_repository_1 = __webpack_require__(11);
const user_entity_1 = __webpack_require__(38);
let UserQueries = class UserQueries {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async userInfo({ id }) {
        const user = await this.userRepository.findUserById(id);
        const profile = new user_entity_1.UserEntity(user).getPublicProfile();
        return { profile };
    }
};
exports.UserQueries = UserQueries;
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountUserInfo.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof contracts_1.AccountUserInfo !== "undefined" && contracts_1.AccountUserInfo.Request) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UserQueries.prototype, "userInfo", null);
exports.UserQueries = UserQueries = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_repository_1.UserRepository !== "undefined" && user_repository_1.UserRepository) === "function" ? _a : Object])
], UserQueries);


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_controller_1 = __webpack_require__(43);
const auth_service_1 = __webpack_require__(44);
const user_module_1 = __webpack_require__(7);
const jwt_1 = __webpack_require__(45);
const jwt_config_1 = __webpack_require__(46);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [user_module_1.UserModule, jwt_1.JwtModule.registerAsync((0, jwt_config_1.getJWTConfig)())],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService],
    })
], AuthModule);


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(44);
const nestjs_rmq_1 = __webpack_require__(36);
const contracts_1 = __webpack_require__(13);
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(dto) {
        return this.authService.register(dto);
    }
    async login({ email, password }) {
        const { id } = await this.authService.validateUser(email, password);
        return this.authService.login(id);
    }
};
exports.AuthController = AuthController;
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountRegister.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof contracts_1.AccountRegister !== "undefined" && contracts_1.AccountRegister.Request) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountLogin.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof contracts_1.AccountLogin !== "undefined" && contracts_1.AccountLogin.Request) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = tslib_1.__decorate([
    (0, common_1.Controller)('auth'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const user_repository_1 = __webpack_require__(11);
const user_entity_1 = __webpack_require__(38);
const jwt_1 = __webpack_require__(45);
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register({ email, password, displayName }) {
        const oldUser = await this.userRepository.findUser(email);
        if (oldUser) {
            throw new Error('Такой пользователь уже зарегистрирован');
        }
        const newUserEntity = await new user_entity_1.UserEntity({
            displayName,
            email,
            passwordHash: '',
        }).setPassword(password);
        const newUser = await this.userRepository.createUser(newUserEntity);
        return { email: newUser.email };
    }
    async validateUser(email, password) {
        const user = await this.userRepository.findUser(email);
        if (!user) {
            throw new Error('Неверный логин или пароль');
        }
        const userEntity = new user_entity_1.UserEntity(user);
        const isCorrectPassword = await userEntity.validatePassword(password);
        if (!isCorrectPassword) {
            throw new Error('Неверный логин или пароль');
        }
        return { id: user._id };
    }
    async login(id) {
        return {
            access_token: await this.jwtService.signAsync({ id })
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_repository_1.UserRepository !== "undefined" && user_repository_1.UserRepository) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object])
], AuthService);


/***/ }),
/* 45 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getJWTConfig = void 0;
const config_1 = __webpack_require__(47);
const getJWTConfig = () => ({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET')
    })
});
exports.getJWTConfig = getJWTConfig;


/***/ }),
/* 47 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMongoConfig = void 0;
const config_1 = __webpack_require__(47);
const getMongoConfig = () => {
    return {
        useFactory: (configService) => ({
            uri: getMongoString(configService)
        }),
        inject: [config_1.ConfigService],
        imports: [config_1.ConfigModule]
    };
};
exports.getMongoConfig = getMongoConfig;
const getMongoString = (configService) => "mongodb://" +
    configService.get("MONGO_LOGIN") +
    ":" +
    configService.get("MONGO_PASSWORD") +
    "@" +
    configService.get("MONGO_HOST") +
    ":" +
    configService.get("MONGO_PORT") +
    "/" +
    configService.get("MONGO_DATABASE") +
    "?authSource=" +
    configService.get("MONGO_AUTHDATABASE");


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRMQConfig = void 0;
const config_1 = __webpack_require__(47);
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
        queueName: configService.get('AMQP_QUEUE'),
        prefetchCount: 32,
        serviceName: 'moneytracker-account'
    })
});
exports.getRMQConfig = getRMQConfig;


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
    await app.init();
    common_1.Logger.log(`🚀 Application is running`);
}
bootstrap();

})();

/******/ })()
;
//# sourceMappingURL=main.js.map