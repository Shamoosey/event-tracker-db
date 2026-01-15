import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

export const setupSwagger = (app: Express, port: string | 3000): void => {
  const spec = routingControllersToSpec(
    getMetadataArgsStorage(),
    { routePrefix: "/api/v1" },
    {
      info: {
        title: "Event Tracker DB",
        version: "1.0.0",
        description: "API docs",
      },
      servers: [
        {
          url: `http://localhost:${port}`,
          description: "Development server",
        },
      ],
    }
  );

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(spec);
  });
};
