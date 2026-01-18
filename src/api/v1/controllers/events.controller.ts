import "reflect-metadata";
import { Response, Request } from "express";
import * as EventService from "../services/event.service";
import { Body, Controller, Get, Param, Post, Put, Req, Res, UseBefore } from "routing-controllers";
import { errorResponse, successResponse } from "../models/responseModel";
import { UpdateEventAttendanceDto } from "../types/UpdateEventAttendanceDto";
import { getAuth, requireAuth } from "@clerk/express";
import { CreateEventDto } from "../types/CreateEventDto";
import { sendDiscordWebhook } from "../services/webhook.service";

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

  @Post("/events")
  async createEvent(@Body() body: CreateEventDto, @Res() res: Response, @Req() req: Request) {
    try {
      const auth = getAuth(req);
      const userId = auth.userId;
      if (!userId) {
        return res.status(403).json(errorResponse("Unable to create event, userId is not set"));
      }
      const event = await EventService.createEvent(body, userId);
      try {
        await sendDiscordWebhook({
          username: "MarmaEvents",
          embeds: [
            {
              title: "New Event Created",
              description: event.description,
              color: 0x5865f2,
              fields: [
                {
                  name: "Event Name",
                  value: event.name,
                  inline: false,
                },
                {
                  name: "Location",
                  value: event.location,
                  inline: true,
                },
                {
                  name: "Date",
                  value: event.date.toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  }),
                  inline: true,
                },
              ],
              footer: {
                text: `Created By: ${event.user.username ?? "Unknown"}`,
              },
              timestamp: event.createdAt.toISOString(),
            },
          ],
        });
      } catch (webhookError) {
        console.error("Failed to send Discord webhook:", webhookError);
      }
      return res.status(200).json(successResponse(event, "Event created successfully"));
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
      }
      const events = await EventService.updateEventAttendance(eventId, userId, body.status);
      return res.status(200).json(successResponse(events, "Events retrieved successfully"));
    } catch (error) {
      throw error;
    }
  }
}
