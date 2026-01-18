import { DiscordWebhookPayload } from "../types/DiscordWebhookPayload";

interface SendWebhookOptions {
  message?: string;
  username?: string;
  avatarUrl?: string;
  embeds?: DiscordWebhookPayload["embeds"];
}

export async function sendDiscordWebhook(options: SendWebhookOptions): Promise<void> {
  const url = process.env.DISCORD_WEBHOOK_URL ?? "";

  const payload: DiscordWebhookPayload = {
    content: options.message,
    username: options.username,
    avatar_url: options.avatarUrl,
    embeds: options.embeds,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Discord webhook failed: ${response.status} - ${errorText}`);
  }
}
