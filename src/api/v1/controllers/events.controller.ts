import "reflect-metadata";
import { Request, Response } from "express";
import * as EventService from "../services/event.service";
import { Controller, Get, Req, Res } from "routing-controllers";
import { successResponse } from "../models/responseModel";

@Controller()
export class EventController {
  @Get("/events")
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const events = await EventService.fetchAllEvents();
      return res.status(200).json(successResponse(events, "Events retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }
}
