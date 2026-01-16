import "reflect-metadata";
import { Response } from "express";
import * as UserService from "../services/user.service";
import { Controller, Get, Req, Res, UseBefore } from "routing-controllers";
import { successResponse } from "../models/responseModel";
import { requireAuth } from "@clerk/express";

@Controller()
@UseBefore(requireAuth())
export class UserController {
  @Get("/users")
  async getAll(@Res() res: Response) {
    try {
      const users = await UserService.getAllUsers();
      return res.status(200).json(successResponse(users, "Users retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }
}
