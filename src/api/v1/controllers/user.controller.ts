import "reflect-metadata";
import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import { Controller, Get, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";

@Controller()
export class UserController {
  @Get("/users")
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const users = await UserService.fetchAllUsers();
      return res.status(200).json(successResponse(users, "Users retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }
}
