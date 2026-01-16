import { Application, Request, Response } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import express from "express";

interface UserData {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
}

interface WebhookHandlers {
  onUserCreated?: (userData: UserData) => Promise<void>;
  onUserUpdated?: (userData: UserData) => Promise<void>;
  onUserDeleted?: (userId: string) => Promise<void>;
}

function extractUserData(data: any): UserData {
  return {
    clerkId: data.id,
    email: data.email_addresses[0]?.email_address || "",
    username: data.username || "",
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    imageUrl: data.image_url || "",
  };
}

async function handleClerkWebhook(req: Request, res: Response, handlers: WebhookHandlers) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET!,
    });

    switch (evt.type) {
      case "user.created":
        if (handlers.onUserCreated) {
          await handlers.onUserCreated(extractUserData(evt.data));
        }
        break;

      case "user.updated":
        if (handlers.onUserUpdated) {
          await handlers.onUserUpdated(extractUserData(evt.data));
        }
        break;

      case "user.deleted":
        if (handlers.onUserDeleted) {
          await handlers.onUserDeleted(evt.data.id!);
        }
        break;

      default:
        console.log(`Unhandled webhook event: ${evt.type}`);
    }

    return res.status(200).send("Webhook processed");
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return res.status(400).send("Invalid webhook signature");
  }
}

export function setupClerkWebhook(app: Application, handlers: WebhookHandlers) {
  app.post("/api/webhooks/clerk", express.raw({ type: "application/json" }), async (req: Request, res: Response) => {
    await handleClerkWebhook(req, res, handlers);
  });
}
