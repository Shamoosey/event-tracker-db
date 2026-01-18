import "reflect-metadata";
import "dotenv/config";
import express from "express";
import dotenv from "dotenv";
import { useExpressServer } from "routing-controllers";
import morgan from "morgan";
import corsOptions from "./config/corsOptions";
import { setupSwagger } from "./config/swagger";
import { clerkMiddleware } from "@clerk/express";
import { setupClerkWebhook } from "./api/v1/webhooks/clerkWebhook";
import * as UserService from "./api/v1/services/user.service";

const app = express();

setupClerkWebhook(app, {
  onUserCreated: async (userData) => {
    console.log("User created:", userData.username);
    UserService.createUser(userData.username, userData.email, userData.clerkId);
  },
  onUserUpdated: async (userData) => {
    console.log(userData);
    const user = await UserService.getUserByClerkId(userData.clerkId);
    if (user) {
      UserService.updateUser(user.id, userData.username, userData.email);
    } else {
      UserService.createUser(userData.username, userData.email, userData.clerkId);
    }
  },
  onUserDeleted: async (userId) => {
    console.log("User deleted:", userId);
    const user = await UserService.getUserByClerkId(userId);
    if (user) {
      UserService.deleteUser(user.id);
    }
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.use(clerkMiddleware());

useExpressServer(app, {
  routePrefix: "/api/v1",
  controllers: [__dirname + "/api/v1/controllers/*.ts"],
  cors: corsOptions,
  validation: true,
  classTransformer: true,
  defaultErrorHandler: true,
});

dotenv.config();

const PORT = process.env.PORT ?? 3000;

setupSwagger(app, PORT);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
