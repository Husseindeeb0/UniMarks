"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const middlewares_1 = require("../middlewares");
const router = express_1.default.Router();
router.post("/createUser", middlewares_1.verifyJWT, user_controller_1.createUser);
router.patch("/updateUser/:id", middlewares_1.verifyJWT, user_controller_1.updateUser);
router.delete("/deleteUser/:id", middlewares_1.verifyJWT, user_controller_1.deleteUser);
router.get("/getAllUsers", middlewares_1.verifyJWT, user_controller_1.getAll);
router.get("/getMe", middlewares_1.verifyJWT, user_controller_1.getMe);
exports.default = router;
