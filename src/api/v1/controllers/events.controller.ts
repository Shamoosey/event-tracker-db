import "reflect-metadata";
import { Response, Request } from "express";
import * as EventService from "../services/event.service";
import { Body, Controller, Get, Param, Put, Req, Res, UseBefore } from "routing-controllers";
import { errorResponse, successResponse } from "../models/responseModel";
import { UpdateEventAttendanceDto } from "../types/UpdateEventAttendanceDto";
import { getAuth, requireAuth } from "@clerk/express";

@Controller()
@UseBefore(requireAuth())
export class EventController {
  @Get("/events")
  async getAll(@Res() res: Response) {
    try {
      const events = await EventService.fetchAllEvents();
      return res.status(200).json(successResponse(events, "Events retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }

  @Put("/events/:id/attendance")
  async updateEventAttendance(@Param("id") eventId: string, @Body() body: UpdateEventAttendanceDto, @Res() res: Response, @Req() req: Request) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId;
      if (!userId) {
        return res.status(403).json(errorResponse("Unable to set event attendance status, userId is not set"));
      } else {
        const events = await EventService.updateEventAttendance(eventId, userId, body.status);
        return res.status(200).json(successResponse(events, "Events retrieved successfully"));
      }
    } catch (error) {
      throw error;
    }
  }
}
