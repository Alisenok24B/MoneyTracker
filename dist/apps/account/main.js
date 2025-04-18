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
const auth_module_1 = __webpack_require__(27);
const config_1 = __webpack_require__(32);
const mongoose_1 = __webpack_require__(8);
const mongo_config_1 = __webpack_require__(33);
const nestjs_rmq_1 = __webpack_require__(23);
const rmq_config_1 = __webpack_require__(34);
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
const user_repository_1 = __webpack_require__(14);
const user_commands_1 = __webpack_require__(15);
const user_queries_1 = __webpack_require__(26);
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([
                { name: user_model_1.User.name, schema: user_model_1.UserSchema }
            ])],
        providers: [user_repository_1.UserRepository],
        exports: [user_repository_1.UserRepository],
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


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = exports.UserCoursesSchema = exports.UserCourses = void 0;
const tslib_1 = __webpack_require__(4);
const mongoose_1 = __webpack_require__(8);
const mongoose_2 = __webpack_require__(10);
const interfaces_1 = __webpack_require__(11);
let UserCourses = class UserCourses extends mongoose_2.Document {
};
exports.UserCourses = UserCourses;
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    tslib_1.__metadata("design:type", String)
], UserCourses.prototype, "courseId", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: interfaces_1.PurchaseState, type: String }),
    tslib_1.__metadata("design:type", typeof (_a = typeof interfaces_1.PurchaseState !== "undefined" && interfaces_1.PurchaseState) === "function" ? _a : Object)
], UserCourses.prototype, "purchaseState", void 0);
exports.UserCourses = UserCourses = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], UserCourses);
exports.UserCoursesSchema = mongoose_1.SchemaFactory.createForClass(UserCourses);
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
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: interfaces_1.UserRole, type: String, default: interfaces_1.UserRole.Student }),
    tslib_1.__metadata("design:type", typeof (_b = typeof interfaces_1.UserRole !== "undefined" && interfaces_1.UserRole) === "function" ? _b : Object)
], User.prototype, "role", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ type: [exports.UserCoursesSchema], _id: false }),
    tslib_1.__metadata("design:type", typeof (_c = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.Array) === "function" ? _c : Object)
], User.prototype, "courses", void 0);
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


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(12), exports);
tslib_1.__exportStar(__webpack_require__(13), exports);


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PurchaseState = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["Teacher"] = "Teacher";
    UserRole["Student"] = "Student";
})(UserRole || (exports.UserRole = UserRole = {}));
var PurchaseState;
(function (PurchaseState) {
    PurchaseState["Started"] = "Started";
    PurchaseState["WaitingForPayment"] = "WaitingForPayment";
    PurchaseState["Purchased"] = "Purchased";
    PurchaseState["Canceled"] = "Canceled";
})(PurchaseState || (exports.PurchaseState = PurchaseState = {}));


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 14 */
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
    async updateUser(_id, ...rest) {
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
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserCommands = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const user_repository_1 = __webpack_require__(14);
const contracts_1 = __webpack_require__(16);
const nestjs_rmq_1 = __webpack_require__(23);
const user_entity_1 = __webpack_require__(24);
let UserCommands = class UserCommands {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async userInfo({ user, id }) {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new Error('Такого пользователя не существует');
        }
        const userEntity = new user_entity_1.UserEntity(existedUser).updateProfile(user.displayName);
        await this.userRepository.updateUser(userEntity);
        return {};
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
], UserCommands.prototype, "userInfo", null);
exports.UserCommands = UserCommands = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_repository_1.UserRepository !== "undefined" && user_repository_1.UserRepository) === "function" ? _a : Object])
], UserCommands);


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(4);
tslib_1.__exportStar(__webpack_require__(17), exports);
tslib_1.__exportStar(__webpack_require__(19), exports);
tslib_1.__exportStar(__webpack_require__(20), exports);
tslib_1.__exportStar(__webpack_require__(21), exports);
tslib_1.__exportStar(__webpack_require__(22), exports);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountLogin = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(18);
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
/* 18 */
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountRegister = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(18);
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
/* 20 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUserInfo = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(18);
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
/* 21 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountUserCourses = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(18);
var AccountUserCourses;
(function (AccountUserCourses) {
    AccountUserCourses.topic = 'account.user-courses.query';
    class Request {
    }
    tslib_1.__decorate([
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", String)
    ], Request.prototype, "id", void 0);
    AccountUserCourses.Request = Request;
    class Response {
    }
    AccountUserCourses.Response = Response;
})(AccountUserCourses || (exports.AccountUserCourses = AccountUserCourses = {}));


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountChangeProfile = void 0;
const tslib_1 = __webpack_require__(4);
const class_validator_1 = __webpack_require__(18);
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
        (0, class_validator_1.IsString)(),
        tslib_1.__metadata("design:type", typeof (_a = typeof Pick !== "undefined" && Pick) === "function" ? _a : Object)
    ], Request.prototype, "user", void 0);
    AccountChangeProfile.Request = Request;
    class Response {
    }
    AccountChangeProfile.Response = Response;
})(AccountChangeProfile || (exports.AccountChangeProfile = AccountChangeProfile = {}));


/***/ }),
/* 23 */
/***/ ((module) => {

module.exports = require("nestjs-rmq");

/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const bcryptjs_1 = __webpack_require__(25);
class UserEntity {
    constructor(user) {
        this._id = user._id;
        this.displayName = user.displayName;
        this.passwordHash = user.passwordHash;
        this.email = user.email;
        this.role = user.role;
        this.courses = user.courses;
    }
    getPublicProfile() {
        return {
            email: this.email,
            role: this.role,
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
    }
}
exports.UserEntity = UserEntity;


/***/ }),
/* 25 */
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserQueries = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const contracts_1 = __webpack_require__(16);
const nestjs_rmq_1 = __webpack_require__(23);
const user_repository_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(24);
let UserQueries = class UserQueries {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async userInfo({ id }) {
        const user = await this.userRepository.findUserById(id);
        const profile = new user_entity_1.UserEntity(user).getPublicProfile();
        return { profile };
    }
    async userCourses({ id }) {
        const user = await this.userRepository.findUserById(id);
        return {
            courses: user.courses
        };
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
tslib_1.__decorate([
    (0, nestjs_rmq_1.RMQValidate)(),
    (0, nestjs_rmq_1.RMQRoute)(contracts_1.AccountUserCourses.topic),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof contracts_1.AccountUserCourses !== "undefined" && contracts_1.AccountUserCourses.Request) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], UserQueries.prototype, "userCourses", null);
exports.UserQueries = UserQueries = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_repository_1.UserRepository !== "undefined" && user_repository_1.UserRepository) === "function" ? _a : Object])
], UserQueries);


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_controller_1 = __webpack_require__(28);
const auth_service_1 = __webpack_require__(29);
const user_module_1 = __webpack_require__(7);
const jwt_1 = __webpack_require__(30);
const jwt_config_1 = __webpack_require__(31);
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
/* 28 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const auth_service_1 = __webpack_require__(29);
const nestjs_rmq_1 = __webpack_require__(23);
const contracts_1 = __webpack_require__(16);
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
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__(4);
const common_1 = __webpack_require__(1);
const user_repository_1 = __webpack_require__(14);
const user_entity_1 = __webpack_require__(24);
const interfaces_1 = __webpack_require__(11);
const jwt_1 = __webpack_require__(30);
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
            role: interfaces_1.UserRole.Student
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
/* 30 */
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getJWTConfig = void 0;
const config_1 = __webpack_require__(32);
const getJWTConfig = () => ({
    imports: [config_1.ConfigModule],
    inject: [config_1.ConfigService],
    useFactory: (ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET')
    })
});
exports.getJWTConfig = getJWTConfig;


/***/ }),
/* 32 */
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMongoConfig = void 0;
const config_1 = __webpack_require__(32);
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
/* 34 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRMQConfig = void 0;
const config_1 = __webpack_require__(32);
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