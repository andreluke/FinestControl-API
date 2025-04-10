// src/index.ts
import { fastify } from "fastify";

// src/settings/env.ts
import { z } from "zod";
var envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string().url(),
  WEB_URL: z.string().url()
});
var env = envSchema.parse(process.env);

// src/config/base-config.ts
var portSettings = {
  PORT: env.PORT,
  BASE_URL: `http://localhost:${env.PORT}`,
  WEB_URL: env.WEB_URL
};
var version = "0.0.1";

// src/config/plugins.ts
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler
} from "fastify-type-provider-zod";

// src/themes/style.ts
var style = `
@media (prefers-color-scheme: dark) {
  /* primary colors */

  .swagger-ui .topbar .download-url-wrapper .select-label select {
    border: 2px solid var(--swagger-color);
  }

  .swagger-ui .info .title small.version-stamp {
    background-color: var(--swagger-color);
  }

  .swagger-ui .info a {
    color: var(--link-color);
  }

  .swagger-ui .response-control-media-type--accept-controller select {
    border-color: var(--accept-header-color);
  }

  .swagger-ui .response-control-media-type__accept-message {
    color: var(--accept-header-color);
  }

  .swagger-ui .btn.authorize {
    color: var(--post-method-color);
  }

  .swagger-ui .btn.authorize {
    border-color: var(--post-method-color);
  }

  .swagger-ui .btn.authorize svg {
    fill: var(--post-method-color);
  }

  /* methods colors */
  /* http post */

  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: var(--post-method-color);
  }

  .swagger-ui .opblock.opblock-post .opblock-summary {
    border-color: var(--post-method-color);
  }

  .swagger-ui .opblock.opblock-post {
    background: var(--post-method-background-color);
    border-color: var(--post-method-color);
  }

  .swagger-ui
    .opblock.opblock-post
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--post-method-color);
  }

  /* http get */

  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: var(--get-method-color);
  }

  .swagger-ui .opblock.opblock-get .opblock-summary {
    border-color: var(--get-method-color);
  }

  .swagger-ui .opblock.opblock-get {
    background: var(--get-method-background-color);
    border-color: var(--get-method-color);
  }

  .swagger-ui .opblock.opblock-get .tab-header .tab-item.active h4 span::after {
    background: var(--get-method-color);
  }

  /* http head */

  .swagger-ui .opblock.opblock-head .opblock-summary-method {
    background: var(--head-method-color);
  }

  .swagger-ui .opblock.opblock-head .opblock-summary {
    border-color: var(--head-method-color);
  }

  .swagger-ui .opblock.opblock-head {
    background: var(--head-method-background-color);
    border-color: var(--head-method-color);
  }

  .swagger-ui
    .opblock.opblock-head
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--head-method-color);
  }

  /* http put */

  .swagger-ui .opblock.opblock-put .opblock-summary-method {
    background: var(--put-method-color);
  }

  .swagger-ui .opblock.opblock-put .opblock-summary {
    border-color: var(--put-method-color);
  }

  .swagger-ui .opblock.opblock-put {
    background: var(--put-method-background-color);
    border-color: var(--put-method-color);
  }

  .swagger-ui .opblock.opblock-put .tab-header .tab-item.active h4 span::after {
    background: var(--put-method-color);
  }

  /* http delete */

  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: var(--delete-method-color);
  }

  .swagger-ui .opblock.opblock-delete .opblock-summary {
    border-color: var(--delete-method-color);
  }

  .swagger-ui .opblock.opblock-delete {
    background: var(--delete-method-background-color);
    border-color: var(--delete-method-color);
  }

  .swagger-ui
    .opblock.opblock-delete
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--delete-method-color);
  }

  /* http options */

  .swagger-ui .opblock.opblock-options .opblock-summary-method {
    background: var(--options-method-color);
  }

  .swagger-ui .opblock.opblock-options .opblock-summary {
    border-color: var(--options-method-color);
  }

  .swagger-ui .opblock.opblock-options {
    background: var(--options-method-background-color);
    border-color: var(--options-method-color);
  }

  .swagger-ui
    .opblock.opblock-options
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--options-method-color);
  }

  /* http patch */

  .swagger-ui .opblock.opblock-patch .opblock-summary-method {
    background: var(--patch-method-color);
  }

  .swagger-ui .opblock.opblock-patchs .opblock-summary {
    border-color: var(--patch-method-color);
  }

  .swagger-ui .opblock.opblock-patch {
    background: var(--patch-method-background-color);
    border-color: var(--patch-method-color);
  }

  .swagger-ui
    .opblock.opblock-patch
    .tab-header
    .tab-item.active
    h4
    span::after {
    background: var(--patch-method-color);
  }

  /* blocks */
  body {
    background-color: var(--all-bg-color);
    color: white;
  }

  .swagger-ui .topbar {
    background-color: var(--header-bg-color);
  }

  .swagger-ui .scheme-container {
    background: var(--secondary-bg-color);
  }

  .swagger-ui section.models .model-container {
    background: var(--secondary-bg-color);
    border-radius: var(--innner-block-border-radius);
  }

  .swagger-ui select {
    background: var(--selecter-bg-color);
    border-radius: var(--block-border-radius);
    color: var(--primary-text-color);
  }

  .swagger-ui section.models {
    border: 1px solid var(--block-border-color);
    background-color: var(--block-bg-color);
  }

  .swagger-ui .opblock .opblock-section-header {
    background: var(--secondary-bg-color);
  }

  .swagger-ui .body-param__example {
    background-color: var(--block-bg-color) !important;
    border-radius: var(--block-border-radius) !important;
  }

  .swagger-ui .example {
    background-color: var(--block-bg-color) !important;
    border-radius: var(--block-border-radius) !important;
  }

  .swagger-ui .copy-to-clipboard {
    background: rgba(255, 255, 255, var(--icons-opacity));
    border-radius: var(--block-border-radius);
  }

  .swagger-ui .opblock .opblock-summary-method {
    border-radius: var(--innner-block-border-radius);
  }

  .swagger-ui input[type="email"],
  .swagger-ui input[type="file"],
  .swagger-ui input[type="password"],
  .swagger-ui input[type="search"],
  .swagger-ui input[type="text"],
  .swagger-ui textarea {
    background: var(--secondary-bg-color);
    border: 1px solid var(--block-border-color);
    border-radius: var(--block-border-radius);
    color: var(--primary-text-color);
    outline: none;
  }

  .swagger-ui .dialog-ux .modal-ux-header {
    border-bottom: 1px solid var(--block-border-color);
  }

  .swagger-ui .btn {
    border: 2px solid var(--block-border-color);
    border-radius: var(--block-border-radius);
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux {
    background: var(--block-bg-color);
    border: 1px solid var(--block-border-color);
    border-radius: var(--block-border-radius);
  }

  .swagger-ui .auth-btn-wrapper {
    justify-content: left;
  }

  .swagger-ui .opblock-tag {
    border-bottom: 1px solid var(--block-border-color);
  }

  .swagger-ui section.models.is-open h4 {
    border-bottom: 1px solid var(--block-border-color);
  }

  .swagger-ui .opblock {
    border-radius: var(--block-border-radius);
  }

  .swagger-ui section.models {
    border-radius: var(--block-border-radius);
  }

  /* button white outline fix */

  .swagger-ui .model-box-control:focus,
  .swagger-ui .models-control:focus,
  .swagger-ui .opblock-summary-control:focus {
    outline: none;
  }

  /* icons */

  .swagger-ui .model-toggle::after {
    opacity: var(--icons-opacity);
    filter: var(--black-icons-filter);
  }

  .swagger-ui svg:not(:root) {
    fill: var(--primary-icon-color);
  }

  .swagger-ui .opblock-summary-control svg:not(:root) {
    opacity: var(--secondary-icon-opacity);
  }

  /* text */

  .swagger-ui {
    color: var(--primary-text-color);
  }

  .swagger-ui .info .title {
    color: var(--primary-text-color);
  }

  .swagger-ui a.nostyle {
    color: var(--primary-text-color);
  }

  .swagger-ui .model-title {
    color: var(--primary-text-color);
  }

  .swagger-ui .models-control {
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux-header h3 {
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux-content h4 {
    color: var(--primary-text-color);
  }

  .swagger-ui .dialog-ux .modal-ux-content p {
    color: var(--secondary-text-color);
  }

  .swagger-ui label {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock .opblock-section-header h4 {
    color: var(--primary-text-color);
  }

  .swagger-ui .tab li button.tablinks {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock-description-wrapper p,
  .swagger-ui .opblock-external-docs-wrapper p,
  .swagger-ui .opblock-title_normal p {
    color: var(--primary-text-color);
  }

  .swagger-ui table thead tr td,
  .swagger-ui table thead tr th {
    border-bottom: 1px solid var(--block-border-color);
    color: var(--primary-text-color);
  }

  .swagger-ui .response-col_status {
    color: var(--primary-text-color);
  }

  .swagger-ui .response-col_links {
    color: var(--secondary-text-color);
  }

  .swagger-ui .parameter__name {
    color: var(--primary-text-color);
  }

  .swagger-ui .parameter__type {
    color: var(--secondary-text-color);
  }

  .swagger-ui .prop-format {
    color: var(--secondary-text-color);
  }

  .swagger-ui .opblock-tag {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock .opblock-summary-operation-id,
  .swagger-ui .opblock .opblock-summary-path,
  .swagger-ui .opblock .opblock-summary-path__deprecated {
    color: var(--primary-text-color);
  }

  .swagger-ui .opblock .opblock-summary-description {
    color: var(--secondary-text-color);
  }

  .swagger-ui .info li,
  .swagger-ui .info p,
  .swagger-ui .info table {
    color: var(--secondary-text-color);
  }

  .swagger-ui .model {
    color: var(--secondary-text-color);
  }
}

:root {
  /* primary colors */
  --swagger-color: #86ff54;
  --link-color: #86e1f4;
  --accept-header-color: #34a05e;

  /* methods colors */
  --post-method-color: #5bdc3e;
  --post-method-background-color: rgba(0, 0, 0, 0);
  --get-method-color: #51e3cb;
  --get-method-background-color: rgba(0, 0, 0, 0);
  --head-method-color: #f87fbd;
  --head-method-background-color: rgba(0, 0, 0, 0);
  --put-method-color: #e0a44e;
  --put-method-background-color: rgba(0, 0, 0, 0);
  --delete-method-color: #9680ff;
  --delete-method-background-color: rgba(0, 0, 0, 0);
  --options-method-color: rgb(64, 145, 225);
  --options-method-background-color: rgba(0, 0, 0, 0);
  --patch-method-color: rgb(229, 178, 38);
  --patch-method-background-color: rgba(0, 0, 0, 0);

  /* background */
  --all-bg-color: #282a36;
  --secondary-bg-color: #282a35;
  --header-bg-color: #3a3d4c;
  --block-bg-color: #414450;
  --selecter-bg-color: #3a3d4c;

  /* text */
  --primary-text-color: rgba(255, 255, 255, 1);
  --secondary-text-color: rgba(193, 192, 192, 1);

  /* border */
  --block-border-color: rgba(255, 255, 255, 0.08);
  --block-border-radius: 12px;
  --innner-block-border-radius: 8px;

  /* icons */
  --primary-icon-color: #ffffff;
  --icons-opacity: 0;
  --secondary-icon-opacity: 0.6;
  --black-icons-filter: invert(1);
}

`;

// src/config/logger.ts
import pc from "picocolors";
async function logger(app2) {
  let startTime;
  let messageName;
  app2.addHook("onRequest", (request, reply, done) => {
    startTime = Date.now();
    done();
  });
  app2.addHook("onSend", (request, reply, payload, done) => {
    if (reply.statusCode >= 400 /* BAD_REQUEST */) {
      const parsedPayload = JSON.parse(payload);
      if (parsedPayload?.name) {
        messageName = parsedPayload.name;
      }
    }
    done();
  });
  app2.addHook("onResponse", (request, reply, done) => {
    const responseTime = Date.now() - startTime;
    const statusCode = reply.statusCode;
    let statusColor = pc.green;
    switch (true) {
      case (statusCode >= 300 /* MULTIPLE_CHOICES */ && statusCode < 400 /* BAD_REQUEST */):
        statusColor = pc.yellow;
        break;
      case statusCode >= 400 /* BAD_REQUEST */:
        statusColor = pc.red;
        break;
    }
    if (!request.url.includes("/docs") && !request.url.includes("/favicon.ico")) {
      console.info(
        pc.yellow("Response: ") + statusColor(
          `${request.method} ${request.url} - ${statusCode} - ${responseTime}ms ${messageName ? `- Error name: ${messageName}` : ""}`
        )
      );
    }
    messageName = "";
    done();
  });
  app2.setErrorHandler((error, request, reply) => {
    if (error.code === "FST_ERR_VALIDATION") {
      const validation = error.validation?.[0];
      return reply.status(400 /* BAD_REQUEST */).send({
        name: "ValidationError",
        message: validation?.message || "Erro de valida\xE7\xE3o."
      });
    }
    return reply.status(500 /* INTERNAL_SERVER_ERROR */).send({
      name: "InternalError",
      message: "Algo deu errado."
    });
  });
}

// src/config/plugins.ts
function registerPlugins(app2) {
  app2.register(fastifyCors, {
    origin: [portSettings.BASE_URL, portSettings.WEB_URL]
  });
  app2.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Finest API",
        version
      }
      // components: {
      //   securitySchemes: {
      //     bearerAuth: {
      //       type: 'http',
      //       scheme: 'bearer',
      //       bearerFormat: 'JWT',
      //     },
      //   },
      // },
      // security: [{ bearerAuth: [] }],
    },
    transform: jsonSchemaTransform
  });
  app2.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    theme: {
      css: [{ filename: "theme.css", content: style }]
    }
  });
  logger(app2);
  app2.setSerializerCompiler(serializerCompiler);
  app2.setValidatorCompiler(validatorCompiler);
}

// src/utils/registerPrefix.ts
var registerPrefix = (routes6, prefix5) => {
  return async (app2) => {
    for (const route of routes6) {
      app2.register(route, { prefix: prefix5 });
    }
  };
};

// src/routes/paymentType/createPaymentTypeRoute.ts
import z3 from "zod";

// src/controller/PaymentTypeController.ts
import { and, desc, eq, isNotNull, isNull } from "drizzle-orm";

// src/drizzle/schemas/transactions.ts
import {
  boolean,
  integer,
  pgTable as pgTable3,
  serial as serial3,
  timestamp as timestamp3
} from "drizzle-orm/pg-core";

// src/drizzle/schemas/paymentType.ts
import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";
var paymentType = pgTable("payment_type", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at"),
  removedAt: timestamp("removed_at")
});

// src/drizzle/schemas/tags.ts
import { pgTable as pgTable2, serial as serial2, timestamp as timestamp2, varchar as varchar2 } from "drizzle-orm/pg-core";
var tags = pgTable2("tags", {
  id: serial2("id").primaryKey().notNull(),
  name: varchar2("name", { length: 255 }).notNull().unique(),
  color: varchar2("color", { length: 255 }).notNull(),
  description: varchar2("description", { length: 255 }),
  createdAt: timestamp2("created_at").defaultNow(),
  updatedAt: timestamp2("updated_at"),
  removedAt: timestamp2("removed_at")
});

// src/drizzle/schemas/transactions.ts
var transactions = pgTable3("transactions", {
  id: serial3("id").primaryKey(),
  amount: integer("amount").notNull(),
  createdAt: timestamp3("created_at").defaultNow(),
  isSpend: boolean("is_spend").notNull(),
  paymentTypeId: serial3("payment_type_id").references(() => paymentType.id, {
    onDelete: "set null",
    onUpdate: "cascade"
  }).notNull(),
  tagId: serial3("tag_id").references(() => tags.id, {
    onDelete: "set null",
    onUpdate: "cascade"
  }).notNull(),
  removedAt: timestamp3("removed_at")
});

// src/drizzle/schemas/totalAmount.ts
import { integer as integer2, pgTable as pgTable4, serial as serial4, timestamp as timestamp4 } from "drizzle-orm/pg-core";
var totalAmount = pgTable4("total_amount", {
  id: serial4("id").primaryKey(),
  total: integer2("total_amount").notNull(),
  lastAmount: integer2("last_amount"),
  createdAt: timestamp4("created_at").defaultNow(),
  lastTransaction: serial4("last_spend").references(() => transactions.id, {
    onDelete: "set null",
    onUpdate: "cascade"
  })
});

// src/errors/custom/CustomError.ts
var CustomError = class extends Error {
  statusCode;
  code;
  constructor(message, statusCode = 500 /* INTERNAL_SERVER_ERROR */, code = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.name = new.target.name;
    this.statusCode = statusCode;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/errors/custom/PaymentTypeError.ts
var PaymentTypeError = class extends CustomError {
  constructor(message, statusCode = 500 /* INTERNAL_SERVER_ERROR */, code = "ERROR_PAYMENT_TYPE") {
    super(message, statusCode, code);
  }
};
var PaymentTypeMissingParamsError = class extends PaymentTypeError {
  constructor() {
    super(
      "Ao menos um dos par\xE2metros precisa ser informado",
      400 /* BAD_REQUEST */,
      "MISSING_PAYMENT_TYPE_PARAMS"
    );
  }
};
var PaymentTypeNotFoundError = class extends PaymentTypeError {
  constructor() {
    super(
      "Tipo de pagamento n\xE3o encontrado",
      404 /* NOT_FOUND */,
      "PAYMENT_TYPE_NOT_FOUND"
    );
  }
};
var PaymentTypeAlreadyExistsError = class extends PaymentTypeError {
  constructor() {
    super(
      "Tipo de pagamento j\xE1 existe",
      409 /* CONFLICT */,
      "PAYMENT_TYPE_ALREADY_EXISTS"
    );
  }
};

// src/controller/PaymentTypeController.ts
var PaymentTypeController = class {
  constructor(db2) {
    this.db = db2;
  }
  notRemovedCondition = () => isNull(paymentType.removedAt);
  async getPaymentType({ typeId, name, search }) {
    if (!name && !typeId) {
      throw new PaymentTypeMissingParamsError();
    }
    const id = typeId ?? 0;
    const equal = name ? eq(paymentType.name, name) : eq(paymentType.id, id);
    const query = this.db.select().from(paymentType);
    const [newPaymentType] = await query.where(
      and(this.notRemovedCondition(), equal)
    );
    if (!newPaymentType && !search) {
      throw new PaymentTypeNotFoundError();
    }
    return newPaymentType;
  }
  async createPaymentType({ name, description }) {
    const paymentTypeExists = await this.getPaymentType({ name });
    if (paymentTypeExists) {
      throw new PaymentTypeAlreadyExistsError();
    }
    const [newPaymentType] = await this.db.insert(paymentType).values({ name, description }).returning();
    return newPaymentType;
  }
  async updatePaymentType({
    typeId,
    name,
    description
  }) {
    if (!name && !description) {
      throw new PaymentTypeMissingParamsError();
    }
    const [newPaymentType] = await this.db.update(paymentType).set({
      name,
      description,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(and(this.notRemovedCondition(), eq(paymentType.id, typeId))).returning();
    if (!newPaymentType) {
      throw new PaymentTypeNotFoundError();
    }
    return newPaymentType;
  }
  async removePaymentType({ typeId }) {
    const [newPaymentType] = await this.db.update(paymentType).set({
      removedAt: /* @__PURE__ */ new Date()
    }).where(and(this.notRemovedCondition(), eq(paymentType.id, typeId))).returning();
    if (!newPaymentType) {
      throw new PaymentTypeNotFoundError();
    }
    return newPaymentType;
  }
  async getAllPaymentTypes() {
    const paymentTypes = await this.db.select().from(paymentType).where(this.notRemovedCondition()).orderBy(desc(paymentType.createdAt));
    return paymentTypes;
  }
  async getAllRemovedPaymentTypes() {
    const paymentTypes = await this.db.select().from(paymentType).where(isNotNull(paymentType.removedAt)).orderBy(desc(paymentType.createdAt));
    return paymentTypes;
  }
  async restorePaymentType({ typeId }) {
    const [newPaymentType] = await this.db.update(paymentType).set({
      removedAt: null
    }).where(and(isNotNull(paymentType.removedAt), eq(paymentType.id, typeId))).returning();
    if (!newPaymentType) {
      throw new PaymentTypeNotFoundError();
    }
    return newPaymentType;
  }
};

// src/drizzle/client.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
var pg = postgres(env.POSTGRES_URL, {});
var db = drizzle(pg, {
  schema: {
    transactions,
    paymentType,
    totalAmount,
    tags
  }
});

// src/utils/catchError.ts
async function catchError(promise, ...customErrors) {
  try {
    const result = await promise;
    return [null, result];
  } catch (err) {
    let error;
    if (err instanceof CustomError) {
      error = err;
    } else if (customErrors.length > 0) {
      const matched = customErrors.find((customErr) => {
        return err instanceof Object && "code" in err && customErr.code === err.code;
      });
      const selectedError = matched ?? customErrors[0];
      selectedError.message = String(err instanceof Error ? err.message : err);
      error = selectedError;
    } else {
      error = new CustomError(String(err instanceof Error ? err.message : err));
    }
    return [error, null];
  }
}

// src/zod/schemaFactory.ts
import { createSchemaFactory } from "drizzle-zod";
import z2 from "zod";
var { createInsertSchema, createSelectSchema, createUpdateSchema } = createSchemaFactory({
  zodInstance: z2
});

// src/zod/paymentType.ts
var selectPaymentTypeSchema = createSelectSchema(paymentType);
var insertPaymentTypeSchema = createInsertSchema(paymentType);
var updatePaymentTypeSchema = createUpdateSchema(paymentType);

// src/routes/paymentType/createPaymentTypeRoute.ts
var createPaymentTypeRoute = async (app2) => {
  app2.post(
    "/create",
    {
      schema: {
        summary: "Create Payment Type",
        tags: ["Payment Types"],
        operationId: "createPaymentType",
        body: z3.object({
          name: z3.string(),
          description: z3.string().optional()
        }),
        response: {
          [201 /* CREATED */]: insertPaymentTypeSchema,
          [409 /* CONFLICT */]: z3.object({
            name: z3.string(),
            message: z3.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { name, description } = request.body;
      const paymentTypeController = new PaymentTypeController(db);
      const [error, data] = await catchError(
        paymentTypeController.createPaymentType({
          name,
          description
        }),
        new PaymentTypeAlreadyExistsError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(201 /* CREATED */).send(data);
    }
  );
};

// src/routes/paymentType/getAllPaymentTypesRoute.ts
import z4 from "zod";
var getPaymentTypesRoute = async (app2) => {
  app2.get(
    "/all",
    {
      schema: {
        summary: "Get all Payment Types",
        tags: ["Payment Types"],
        operationId: "getAllPaymentTypes",
        response: {
          [200 /* OK */]: z4.object({
            paymentTypes: z4.array(selectPaymentTypeSchema)
          }),
          [500 /* INTERNAL_SERVER_ERROR */]: z4.object({
            name: z4.string(),
            message: z4.string()
          })
        }
      }
    },
    async (request, reply) => {
      const paymentTypeController = new PaymentTypeController(db);
      const [error, data] = await catchError(
        paymentTypeController.getAllPaymentTypes()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({ paymentTypes: data });
    }
  );
};

// src/routes/paymentType/getAllRemovedPaymentTypesRoute.ts
import z5 from "zod";
var getRemovedPaymentTypesRoute = async (app2) => {
  app2.get(
    "/all-removed",
    {
      schema: {
        summary: "Get all removed Payment Types",
        tags: ["Payment Types"],
        operationId: "getAllRemovedPaymentTypes",
        response: {
          [200 /* OK */]: z5.object({
            paymentTypes: z5.array(selectPaymentTypeSchema)
          }),
          [500 /* INTERNAL_SERVER_ERROR */]: z5.object({
            name: z5.string(),
            message: z5.string()
          })
        }
      }
    },
    async (request, reply) => {
      const paymentTypeController = new PaymentTypeController(db);
      const [error, data] = await catchError(
        paymentTypeController.getAllRemovedPaymentTypes()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({ paymentTypes: data });
    }
  );
};

// src/routes/paymentType/getPaymentTypeRoute.ts
import z6 from "zod";
var getPaymentTypeRoute = async (app2) => {
  app2.get(
    "",
    {
      schema: {
        summary: "Get Payment Type by id or name",
        tags: ["Payment Types"],
        operationId: "getPaymentType",
        querystring: z6.object({
          id: z6.string().optional(),
          name: z6.string().optional()
        }),
        response: {
          [200 /* OK */]: selectPaymentTypeSchema,
          [404 /* NOT_FOUND */]: z6.object({
            name: z6.string(),
            message: z6.string()
          }),
          [400 /* BAD_REQUEST */]: z6.object({
            name: z6.string(),
            message: z6.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id, name } = request.query;
      const paymentTypeController = new PaymentTypeController(db);
      const typeId = id ? Number.parseInt(id) : void 0;
      const [error, data] = await catchError(
        paymentTypeController.getPaymentType({
          typeId,
          name
        }),
        new PaymentTypeNotFoundError(),
        new PaymentTypeMissingParamsError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/paymentType/removePaymentTypeRoute.ts
import z7 from "zod";
var removePaymentTypeRoute = async (app2) => {
  app2.patch(
    "/remove/:id",
    {
      schema: {
        summary: "Remove a Payment Type",
        tags: ["Payment Types"],
        operationId: "removePaymentType",
        params: z7.object({
          id: z7.string()
        }),
        response: {
          [200 /* OK */]: updatePaymentTypeSchema,
          [404 /* NOT_FOUND */]: z7.object({
            name: z7.string(),
            message: z7.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const paymentTypeController = new PaymentTypeController(db);
      const typeId = Number.parseInt(id);
      const [error, data] = await catchError(
        paymentTypeController.removePaymentType({
          typeId
        }),
        new PaymentTypeNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/paymentType/restorePaymentType.ts
import z8 from "zod";
var restorePaymentTypeRoute = async (app2) => {
  app2.patch(
    "/restore/:id",
    {
      schema: {
        summary: "Restore a Payment Type",
        tags: ["Payment Types"],
        operationId: "removePaymentType",
        params: z8.object({
          id: z8.string()
        }),
        response: {
          [200 /* OK */]: updatePaymentTypeSchema,
          [404 /* NOT_FOUND */]: z8.object({
            name: z8.string(),
            message: z8.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const paymentTypeController = new PaymentTypeController(db);
      const typeId = Number.parseInt(id);
      const [error, data] = await catchError(
        paymentTypeController.restorePaymentType({
          typeId
        }),
        new PaymentTypeNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/paymentType/updatePaymentTypeRoute.ts
import z9 from "zod";
var updatePaymentTypeRoute = async (app2) => {
  app2.patch(
    "/update",
    {
      schema: {
        summary: "Update Payment Type",
        tags: ["Payment Types"],
        operationId: "updatePaymentType",
        body: z9.object({
          id: z9.number(),
          name: z9.string().optional(),
          description: z9.string().optional()
        }),
        response: {
          [200 /* OK */]: updatePaymentTypeSchema,
          [404 /* NOT_FOUND */]: z9.object({
            name: z9.string(),
            message: z9.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id, name, description } = request.body;
      const paymentTypeController = new PaymentTypeController(db);
      const [error, data] = await catchError(
        paymentTypeController.updatePaymentType({
          typeId: id,
          name,
          description
        }),
        new PaymentTypeNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/paymentType/index.ts
var routes = [
  getPaymentTypesRoute,
  getRemovedPaymentTypesRoute,
  getPaymentTypeRoute,
  createPaymentTypeRoute,
  updatePaymentTypeRoute,
  removePaymentTypeRoute,
  restorePaymentTypeRoute
];
var prefix = "/payment-type";
var paymentTypeRoutes = registerPrefix(routes, prefix);

// src/routes/tags/createTagRoute.ts
import z10 from "zod";

// src/controller/TagsController.ts
import { and as and2, eq as eq2, isNotNull as isNotNull2, isNull as isNull2 } from "drizzle-orm";

// src/errors/custom/TagError.ts
var TagError = class extends CustomError {
  constructor(message, statusCode = 500 /* INTERNAL_SERVER_ERROR */, code = "ERROR_TAGS") {
    super(message, statusCode, code);
  }
};
var MissingTagParamsError = class extends TagError {
  constructor() {
    super(
      "Ao menos um dos par\xE2metros precisa ser informado",
      400 /* BAD_REQUEST */,
      "MISSING_TAGS_PARAMS"
    );
  }
};
var TagNotFoundError = class extends TagError {
  constructor() {
    super("Tag n\xE3o encontrada", 404 /* NOT_FOUND */, "TAGS_NOT_FOUND");
  }
};
var TagAlreadyExistsError = class extends TagError {
  constructor() {
    super("Tag j\xE1 existe", 409 /* CONFLICT */, "TAG_ALREADY_EXISTS");
  }
};
var TagInvalidColor = class extends TagError {
  constructor(color) {
    super(
      `Cor inv\xE1lida fornecida: ${color}`,
      400 /* BAD_REQUEST */,
      "INVALID_TAG_COLOR"
    );
  }
};

// src/class/HexColor.ts
var HexColor = class _HexColor {
  value;
  constructor(color) {
    const normalized = _HexColor.normalize(color);
    if (!_HexColor.isValid(normalized)) {
      throw new TagInvalidColor(color);
    }
    this.value = normalized;
  }
  static isValid(color) {
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  }
  static normalize(color) {
    return color.trim().toUpperCase();
  }
  getValue() {
    return this.value;
  }
  toString() {
    return this.getValue();
  }
};

// src/controller/TagsController.ts
var TagsController = class {
  constructor(db2) {
    this.db = db2;
  }
  notRemovedCondition = () => isNull2(tags.removedAt);
  async getTag({ tagId, name, search }) {
    if (!name && !tagId) {
      throw new MissingTagParamsError();
    }
    const id = tagId ?? 0;
    const equal = name ? eq2(tags.name, name) : eq2(tags.id, id);
    const query = this.db.select().from(tags);
    const [tag] = await query.where(and2(this.notRemovedCondition(), equal));
    if (!tag && !search) {
      throw new TagNotFoundError();
    }
    return tag;
  }
  async getAllTags() {
    const query = this.db.select().from(tags).where(this.notRemovedCondition());
    const tagsList = await query;
    return tagsList;
  }
  async getAllRemovedTags() {
    const query = this.db.select().from(tags).where(isNotNull2(tags.removedAt));
    const tagsList = await query;
    return tagsList;
  }
  async createTag({ name, color, description }) {
    const tagExists = await this.getTag({ name, search: true });
    if (tagExists) {
      throw new TagAlreadyExistsError();
    }
    const normalizedColor = color ? new HexColor(color).toString() : null;
    const query = this.db.insert(tags).values({ name, color: normalizedColor, description }).returning();
    const [tag] = await query;
    return tag;
  }
  async updateTag({ tagId, color, description, name }) {
    const normalizedColor = color ? new HexColor(color).toString() : null;
    const query = this.db.update(tags).set({ color: normalizedColor, description, name }).where(and2(this.notRemovedCondition(), eq2(tags.id, tagId)));
    const [tag] = await query.returning();
    if (!tag) {
      throw new TagNotFoundError();
    }
    return tag;
  }
  async removeTag({ tagId }) {
    const query = this.db.update(tags).set({ removedAt: /* @__PURE__ */ new Date() }).where(and2(this.notRemovedCondition(), eq2(tags.id, tagId)));
    const [tag] = await query.returning();
    if (!tag) {
      throw new TagNotFoundError();
    }
    return tag;
  }
  async restoreTag({ tagId }) {
    const query = this.db.update(tags).set({ removedAt: null }).where(and2(isNotNull2(tags.removedAt), eq2(tags.id, tagId)));
    const [tag] = await query.returning();
    if (!tag) {
      throw new TagNotFoundError();
    }
    return tag;
  }
};

// src/zod/tagSchema.ts
var selectTagSchema = createSelectSchema(tags);
var insertTagSchema = createInsertSchema(tags);
var updateTagSchema = createUpdateSchema(tags);

// src/routes/tags/createTagRoute.ts
var createTagRoute = async (app2) => {
  app2.post(
    "/create",
    {
      schema: {
        summary: "Create tag",
        tags: ["Tags"],
        operationId: "createTag",
        body: z10.object({
          name: z10.string(),
          color: z10.string().optional(),
          description: z10.string().optional()
        }),
        response: {
          [201 /* CREATED */]: insertTagSchema,
          [500 /* INTERNAL_SERVER_ERROR */]: z10.object({
            name: z10.string(),
            message: z10.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { name, color, description } = request.body;
      const tagsController = new TagsController(db);
      const [error, data] = await catchError(
        tagsController.createTag({
          name,
          color,
          description
        }),
        new TagAlreadyExistsError(),
        new TagInvalidColor(color ?? "")
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(201 /* CREATED */).send(data);
    }
  );
};

// src/routes/tags/getAllRemovedTagsRoute.ts
import z11 from "zod";
var getRemovedTagsRoute = async (app2) => {
  app2.get(
    "/all-removed",
    {
      schema: {
        summary: "Get all removed tags",
        tags: ["Tags"],
        operationId: "getAllRemovedTags",
        response: {
          [200 /* OK */]: z11.object({
            tags: z11.array(selectTagSchema)
          }),
          [500 /* INTERNAL_SERVER_ERROR */]: z11.object({
            name: z11.string(),
            message: z11.string()
          })
        }
      }
    },
    async (request, reply) => {
      const tagsController = new TagsController(db);
      const [error, data] = await catchError(tagsController.getAllRemovedTags());
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({ tags: data });
    }
  );
};

// src/routes/tags/getAllTagsRoute.ts
import z12 from "zod";
var getTagsRoute = async (app2) => {
  app2.get(
    "/all",
    {
      schema: {
        summary: "Get all tags",
        tags: ["Tags"],
        operationId: "getAllTags",
        response: {
          [200 /* OK */]: z12.object({
            tags: z12.array(selectTagSchema)
          }),
          [500 /* INTERNAL_SERVER_ERROR */]: z12.object({
            name: z12.string(),
            message: z12.string()
          })
        }
      }
    },
    async (request, reply) => {
      const tagsController = new TagsController(db);
      const [error, data] = await catchError(tagsController.getAllTags());
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({ tags: data });
    }
  );
};

// src/routes/tags/getTagRoute.ts
import z13 from "zod";
var getTagRoute = async (app2) => {
  app2.get(
    "",
    {
      schema: {
        summary: "Get tag by id or name",
        tags: ["Tags"],
        operationId: "getTag",
        querystring: z13.object({
          id: z13.string().optional(),
          name: z13.string().optional()
        }),
        response: {
          [200 /* OK */]: selectTagSchema,
          [404 /* NOT_FOUND */]: z13.object({
            name: z13.string(),
            message: z13.string()
          }),
          [400 /* BAD_REQUEST */]: z13.object({
            name: z13.string(),
            message: z13.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id, name } = request.query;
      const tagsController = new TagsController(db);
      const tagId = id ? Number.parseInt(id) : void 0;
      const [error, data] = await catchError(
        tagsController.getTag({
          tagId,
          name
        }),
        new TagNotFoundError(),
        new MissingTagParamsError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/tags/removeTagRoute.ts
import z14 from "zod";
var removeTagRoute = async (app2) => {
  app2.patch(
    "/remove/:id",
    {
      schema: {
        summary: "Remove tag",
        tags: ["Tags"],
        operationId: "removeTag",
        params: z14.object({
          id: z14.string()
        }),
        response: {
          [200 /* OK */]: updateTagSchema,
          [404 /* NOT_FOUND */]: z14.object({
            name: z14.string(),
            message: z14.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const tagsController = new TagsController(db);
      const tagId = Number.parseInt(id);
      const [error, data] = await catchError(
        tagsController.removeTag({
          tagId
        }),
        new TagNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/tags/restoreTagRoute.ts
import z15 from "zod";
var restoreTagRoute = async (app2) => {
  app2.patch(
    "/restore/:id",
    {
      schema: {
        summary: "Restore tag",
        tags: ["Tags"],
        operationId: "restoreTag",
        params: z15.object({
          id: z15.string()
        }),
        response: {
          [200 /* OK */]: updateTagSchema,
          [404 /* NOT_FOUND */]: z15.object({
            name: z15.string(),
            message: z15.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.params;
      const tagId = Number.parseInt(id);
      const tagsController = new TagsController(db);
      const [error, data] = await catchError(
        tagsController.restoreTag({
          tagId
        }),
        new TagNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/tags/updateTagRoute.ts
import z16 from "zod";
var updateTagRoute = async (app2) => {
  app2.patch(
    "/update",
    {
      schema: {
        summary: "Update tag",
        tags: ["Tags"],
        operationId: "updateTag",
        body: z16.object({
          id: z16.number(),
          name: z16.string().optional(),
          color: z16.string().optional(),
          description: z16.string().optional()
        }),
        response: {
          [200 /* OK */]: updateTagSchema,
          [404 /* NOT_FOUND */]: z16.object({
            name: z16.string(),
            message: z16.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id, name, color, description } = request.body;
      const tagsController = new TagsController(db);
      const [error, data] = await catchError(
        tagsController.updateTag({
          tagId: id,
          name,
          color,
          description
        }),
        new TagNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/tags/index.ts
var routes2 = [
  getTagsRoute,
  getTagRoute,
  getRemovedTagsRoute,
  createTagRoute,
  updateTagRoute,
  removeTagRoute,
  restoreTagRoute
];
var prefix2 = "/tags";
var tagsRoutes = registerPrefix(routes2, prefix2);

// src/routes/totalAmount/getAmountRoute.ts
import z17 from "zod";

// src/controller/TotalAmountController.ts
import { and as and3, desc as desc2, gte, lte } from "drizzle-orm";

// src/errors/custom/TotalAmountError.ts
var TotalAmountError = class extends CustomError {
  constructor(message, statusCode = 500 /* INTERNAL_SERVER_ERROR */, code = "ERROR_TOTAL_AMOUNT") {
    super(message, statusCode, code);
  }
};
var TotalAmountNotFoundError = class extends TotalAmountError {
  constructor() {
    super(
      "Valor total n\xE3o encontrado",
      404 /* NOT_FOUND */,
      "TOTAL_AMOUNT_NOT_FOUND"
    );
  }
};

// src/model/TransactionModel.ts
var TotalAmountModel = class {
  constructor(db2, totalAmount2) {
    this.db = db2;
    this.totalAmount = totalAmount2;
  }
  async insertAmount({ total, lastAmount, transactionId }) {
    const [totalAmountValue] = await this.db.insert(this.totalAmount).values({ total, lastAmount, lastTransaction: transactionId }).returning();
    return totalAmountValue;
  }
};

// src/controller/TotalAmountController.ts
var TotalAmountController = class {
  constructor(db2) {
    this.db = db2;
  }
  async getAmount() {
    const [totalAmountValue] = await this.db.select().from(totalAmount).orderBy(desc2(totalAmount.createdAt)).limit(1);
    return totalAmountValue;
  }
  async createAmount({ amount, isSpend, transactionId }) {
    const totalAmountModel = new TotalAmountModel(this.db, totalAmount);
    const { total } = await this.getAmount();
    const lastAmount = total ?? 0;
    const newTotal = isSpend ? lastAmount - amount : lastAmount + amount;
    const totalAmountValue = await totalAmountModel.insertAmount({
      total: newTotal,
      lastAmount,
      transactionId
    });
    return totalAmountValue;
  }
  async getMonthAmount({ month, year: baseYear, last }) {
    const year = baseYear ?? (/* @__PURE__ */ new Date()).getFullYear();
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
    const query = this.db.select().from(totalAmount).where(
      and3(
        gte(totalAmount.createdAt, monthStart),
        lte(totalAmount.createdAt, monthEnd)
      )
    ).orderBy(desc2(totalAmount.createdAt));
    if (last) {
      query.limit(1);
    }
    const totalAmountValue = await query;
    if (Array.isArray(totalAmountValue) && totalAmountValue.length === 0) {
      throw new TotalAmountNotFoundError();
    }
    return totalAmountValue;
  }
};

// src/zod/totalAmountSchema.ts
var selectTotalAmountSchema = createSelectSchema(totalAmount);
var insertTotalAmountSchema = createInsertSchema(totalAmount);
var updateTotalAmountSchema = createUpdateSchema(totalAmount);

// src/routes/totalAmount/getAmountRoute.ts
var getLastAmountRoute = async (app2) => {
  app2.get(
    "/",
    {
      schema: {
        summary: "Get last total amount",
        tags: ["Total Amount"],
        operationId: "getLastAmount",
        response: {
          [200 /* OK */]: selectTotalAmountSchema,
          [500 /* INTERNAL_SERVER_ERROR */]: z17.object({
            name: z17.string(),
            message: z17.string()
          })
        }
      }
    },
    async (request, reply) => {
      const totalAmountController = new TotalAmountController(db);
      const [error, data] = await catchError(totalAmountController.getAmount());
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/totalAmount/getMonthAmountRoute.ts
import z18 from "zod";
var getMonthAmountRoute = async (app2) => {
  app2.get(
    "/month",
    {
      schema: {
        summary: "Get total amount from a specific month",
        tags: ["Total Amount"],
        operationId: "getMonthAmount",
        querystring: z18.object({
          month: z18.string().refine(
            (val) => {
              const num = Number(val);
              return !Number.isNaN(num) && num >= 1 && num <= 12;
            },
            {
              message: "O m\xEAs deve ser um n\xFAmero entre 1 e 12."
            }
          ),
          year: z18.string().optional(),
          last: z18.string().optional().transform((value) => {
            if (!value) return void 0;
            const lowerVal = value.toLowerCase();
            if (lowerVal === "true") return true;
            if (lowerVal === "false") return false;
          })
        }),
        response: {
          [200 /* OK */]: z18.array(selectTotalAmountSchema),
          [500 /* INTERNAL_SERVER_ERROR */]: z18.object({
            name: z18.string(),
            message: z18.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { month, year, last } = request.query;
      const totalAmountController = new TotalAmountController(db);
      const parsedMonth = Number.parseInt(month);
      const parsedYear = year ? Number.parseInt(year) : void 0;
      const [error, data] = await catchError(
        totalAmountController.getMonthAmount({
          month: parsedMonth,
          year: parsedYear,
          last
        }),
        new TotalAmountNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/totalAmount/index.ts
var routes3 = [getLastAmountRoute, getMonthAmountRoute];
var prefix3 = "/total-amount";
var totalAmountRoutes = registerPrefix(routes3, prefix3);

// src/routes/transactions/createTransaction.ts
import z19 from "zod";

// src/controller/TransactionsController.ts
import { and as and4, desc as desc3, eq as eq3, gte as gte2, isNull as isNull3, lte as lte2 } from "drizzle-orm";

// src/class/Money.ts
var Money = class _Money {
  cents;
  constructor(amount) {
    this.cents = Math.round(amount * 100);
  }
  static fromCents(cents) {
    return new _Money(cents / 100);
  }
  getCents() {
    return this.cents;
  }
  getReais() {
    return this.cents / 100;
  }
  format(locale = "pt-BR", currency = "BRL") {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency
    }).format(this.getReais());
  }
  add(other) {
    this.cents += other.getCents();
    return this;
  }
  subtract(other) {
    this.cents -= other.getCents();
    return this;
  }
  multiply(factor) {
    this.cents = Math.round(this.cents * factor);
    return this;
  }
  equals(other) {
    return this.cents === other.getCents();
  }
};

// src/class/TransactionHelper.ts
var TransactionHelper = class {
  constructor(transactionList) {
    this.transactionList = transactionList;
  }
  separateSpends() {
    const spends = this.transactionList.filter(
      (transaction) => transaction.isSpend
    );
    const incomes = this.transactionList.filter(
      (transaction) => !transaction.isSpend
    );
    const totalSpends = spends.reduce(
      (acc, curr) => acc.add(new Money(curr.amount)),
      new Money(0)
    );
    const totalIncomes = incomes.reduce(
      (acc, curr) => acc.add(new Money(curr.amount)),
      new Money(0)
    );
    const overallBalance = totalIncomes.subtract(totalSpends);
    return {
      spends,
      incomes,
      details: {
        totalSpends: totalSpends.getReais(),
        totalIncomes: totalIncomes.getReais(),
        overallBalance: overallBalance.getReais()
      }
    };
  }
  separateByMonth() {
    return this.transactionList.reduce(
      (months, transaction) => {
        if (transaction.createdAt) {
          const monthKey = `${transaction.createdAt.getFullYear()}-${transaction.createdAt.getMonth() + 1}`;
          if (!months[monthKey]) {
            months[monthKey] = [];
          }
          months[monthKey].push(transaction);
        }
        return months;
      },
      {}
    );
  }
  separateByMonthWithTotals() {
    const groupedByMonth = this.separateByMonth();
    const result = {};
    for (const [month, transactions2] of Object.entries(groupedByMonth)) {
      const spends = transactions2.filter((t) => t.isSpend);
      const incomes = transactions2.filter((t) => !t.isSpend);
      const totalSpends = spends.reduce(
        (acc, curr) => acc.add(new Money(curr.amount)),
        new Money(0)
      );
      const totalIncomes = incomes.reduce(
        (acc, curr) => acc.add(new Money(curr.amount)),
        new Money(0)
      );
      const overallBalance = totalIncomes.subtract(totalSpends);
      result[month] = {
        spends,
        incomes,
        details: {
          totalSpends: totalSpends.getReais(),
          totalIncomes: totalIncomes.getReais(),
          overallBalance: overallBalance.getReais()
        }
      };
    }
    return result;
  }
};

// src/errors/custom/TransactionError.ts
var TransactionError = class extends CustomError {
  constructor(message, statusCode = 500 /* INTERNAL_SERVER_ERROR */, code = "ERROR_TRANSACTION") {
    super(message, statusCode, code);
  }
};
var MissingTransactionParamsError = class extends TransactionError {
  constructor() {
    super(
      "Ao menos um dos par\xE2metros precisa ser informado",
      400 /* BAD_REQUEST */,
      "MISSING_TRANSACTION_PARAMS"
    );
  }
};
var TransactionNotFoundError = class extends TransactionError {
  constructor() {
    super(
      "Transa\xE7\xE3o n\xE3o encontrada",
      404 /* NOT_FOUND */,
      "TRANSACTION_NOT_FOUND"
    );
  }
};

// src/controller/TransactionsController.ts
var TransactionsController = class {
  constructor(db2) {
    this.db = db2;
    this.paymentTypeController = new PaymentTypeController(this.db);
    this.tagController = new TagsController(this.db);
  }
  notRemovedCondition = () => isNull3(transactions.removedAt);
  paymentTypeController;
  tagController;
  async getTransaction({ transactionId }) {
    const query = this.db.select({
      id: transactions.id,
      paymentType: paymentType.name,
      tagName: tags.name,
      tagColor: tags.color,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      isSpend: transactions.isSpend
    }).from(transactions).where(
      and4(this.notRemovedCondition(), eq3(transactions.id, transactionId))
    ).innerJoin(paymentType, eq3(transactions.paymentTypeId, paymentType.id)).innerJoin(tags, eq3(transactions.tagId, tags.id)).orderBy(transactions.createdAt);
    const [transaction] = await query;
    if (!transaction) {
      throw new TransactionNotFoundError();
    }
    return transaction;
  }
  async getAllTransactionsPaymentType({
    paymentId,
    paymentTypeName,
    limit
  }) {
    if (!paymentId && !paymentTypeName) {
      throw new MissingTransactionParamsError();
    }
    const id = paymentId ?? (await this.paymentTypeController.getPaymentType({
      name: paymentTypeName
    })).id;
    const query = this.db.select({
      id: transactions.id,
      paymentType: paymentType.name,
      tagName: tags.name,
      tagColor: tags.color,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      isSpend: transactions.isSpend
    }).from(transactions).where(
      and4(this.notRemovedCondition(), eq3(transactions.paymentTypeId, id))
    ).innerJoin(paymentType, eq3(transactions.paymentTypeId, paymentType.id)).innerJoin(tags, eq3(transactions.tagId, tags.id)).orderBy(transactions.createdAt);
    if (limit) query.limit(limit);
    const paymentTransactions = await query;
    if (paymentTransactions.length === 0) {
      throw new TransactionNotFoundError();
    }
    return paymentTransactions;
  }
  async getAllTransactionsTag({
    tagId,
    tagName,
    limit
  }) {
    if (!tagId && !tagName) {
      throw new MissingTransactionParamsError();
    }
    const id = tagId ?? (await this.tagController.getTag({
      name: tagName
    })).id;
    const query = this.db.select({
      id: transactions.id,
      paymentType: paymentType.name,
      tagName: tags.name,
      tagColor: tags.color,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      isSpend: transactions.isSpend
    }).from(transactions).where(
      and4(this.notRemovedCondition(), eq3(transactions.paymentTypeId, id))
    ).innerJoin(paymentType, eq3(transactions.paymentTypeId, paymentType.id)).innerJoin(tags, eq3(transactions.tagId, tags.id)).orderBy(transactions.createdAt);
    if (limit) query.limit(limit);
    const tagTransactions = await query;
    if (tagTransactions.length === 0) {
      throw new TransactionNotFoundError();
    }
    return tagTransactions;
  }
  async getAllTransactions({ limit }) {
    const query = this.db.select({
      id: transactions.id,
      paymentType: paymentType.name,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      tagName: tags.name,
      tagColor: tags.color,
      isSpend: transactions.isSpend
    }).from(transactions).innerJoin(paymentType, eq3(transactions.paymentTypeId, paymentType.id)).innerJoin(tags, eq3(transactions.tagId, tags.id)).where(this.notRemovedCondition()).orderBy(desc3(transactions.createdAt));
    if (limit) query.limit(limit);
    const transactionsList = await query;
    const transactionHelperInstance = new TransactionHelper(transactionsList);
    const separatedTransactions = transactionHelperInstance.separateByMonth();
    return separatedTransactions;
  }
  async getAllTransactionsWithMonth({
    month,
    year
  }) {
    const now = /* @__PURE__ */ new Date();
    const currentYear = year ? year : now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const monthStart = month ? new Date(currentYear, month - 1, 1) : new Date(currentYear, currentMonth - 4, 1);
    const query = this.db.select({
      id: transactions.id,
      paymentType: paymentType.name,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      tagName: tags.name,
      tagColor: tags.color,
      isSpend: transactions.isSpend
    }).from(transactions).innerJoin(paymentType, eq3(transactions.paymentTypeId, paymentType.id)).innerJoin(tags, eq3(transactions.tagId, tags.id)).where(
      and4(this.notRemovedCondition(), gte2(transactions.createdAt, monthStart))
    ).orderBy(desc3(transactions.createdAt));
    const transactionsList = await query;
    const transactionHelperInstance = new TransactionHelper(transactionsList);
    const separatedTransactions = transactionHelperInstance.separateByMonthWithTotals();
    return separatedTransactions;
  }
  async getAllTransactionsByMonth({
    month,
    year: baseYear
  }) {
    const year = baseYear ?? (/* @__PURE__ */ new Date()).getFullYear();
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);
    const query = this.db.select({
      id: transactions.id,
      paymentType: paymentType.name,
      amount: transactions.amount,
      createdAt: transactions.createdAt,
      tagName: tags.name,
      tagColor: tags.color,
      isSpend: transactions.isSpend
    }).from(transactions).innerJoin(paymentType, eq3(transactions.paymentTypeId, paymentType.id)).innerJoin(tags, eq3(transactions.tagId, tags.id)).where(
      and4(
        this.notRemovedCondition(),
        gte2(transactions.createdAt, monthStart),
        lte2(transactions.createdAt, monthEnd)
      )
    ).orderBy(desc3(transactions.createdAt));
    const transactionsList = await query;
    const transactionHelperInstance = new TransactionHelper(transactionsList);
    return {
      month,
      year,
      transactions: transactionHelperInstance.separateSpends()
    };
  }
  async createTransaction({
    amount,
    isSpend,
    paymentTypeId,
    tagId
  }) {
    const payment = amount % 1 !== 0 ? new Money(amount) : new Money(amount / 100);
    const paymentType2 = await this.paymentTypeController.getPaymentType({
      typeId: paymentTypeId
    });
    const tag = await this.tagController.getTag({
      tagId
    });
    const result = await this.db.transaction(async (tx) => {
      const totalAmountController = new TotalAmountController(tx);
      const [newTransaction] = await tx.insert(transactions).values({
        amount: payment.getCents(),
        isSpend,
        paymentTypeId: paymentType2.id,
        tagId: tag.id
      }).returning();
      await totalAmountController.createAmount({
        amount: payment.getCents(),
        isSpend,
        transactionId: newTransaction.id
      });
      return newTransaction;
    });
    return result;
  }
};

// src/zod/transactionSchema.ts
var selectTransactionSchema = createSelectSchema(transactions);
var insertTransactionSchema = createInsertSchema(transactions);
var updateTransactionSchema = createUpdateSchema(transactions);

// src/routes/transactions/createTransaction.ts
var createTransactionRoute = async (app2) => {
  app2.post(
    "/create",
    {
      schema: {
        summary: "Create a transaction",
        tags: ["Transactions"],
        operationId: "createTransaction",
        body: z19.object({
          amount: z19.number(),
          isSpend: z19.boolean(),
          paymentTypeId: z19.number(),
          tagId: z19.number()
        }),
        response: {
          [200 /* OK */]: insertTransactionSchema,
          [404 /* NOT_FOUND */]: z19.object({
            name: z19.string(),
            message: z19.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { amount, isSpend, paymentTypeId, tagId } = request.body;
      const transactionsController = new TransactionsController(db);
      const [error, data] = await catchError(
        transactionsController.createTransaction({
          amount,
          isSpend,
          paymentTypeId,
          tagId
        }),
        new TagNotFoundError(),
        new PaymentTypeNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/transactions/getAllTransactionsByMonthRoute.ts
import z20 from "zod";
var getAllTransactionsByMonthRoute = async (app2) => {
  app2.get(
    "/month",
    {
      schema: {
        summary: "Get all transactions from a specific month",
        tags: ["Transactions"],
        operationId: "getAllTransactionsByMonth",
        querystring: z20.object({
          month: z20.string().refine(
            (val) => {
              const num = Number(val);
              return !Number.isNaN(num) && num >= 1 && num <= 12;
            },
            {
              message: "O m\xEAs deve ser um n\xFAmero entre 1 e 12."
            }
          ).transform((val) => Number(val)),
          year: z20.string().optional().refine(
            (val) => {
              if (!val) return true;
              const num = Number(val);
              return !Number.isNaN(num) && num > 0;
            },
            {
              message: "O ano deve ser um n\xFAmero v\xE1lido."
            }
          )
        }),
        response: {
          [200 /* OK */]: z20.object({
            month: z20.number(),
            year: z20.number(),
            transactions: z20.object({
              spends: z20.array(
                z20.object({
                  id: z20.number(),
                  createdAt: z20.date().nullable(),
                  isSpend: z20.boolean(),
                  amount: z20.number(),
                  paymentType: z20.string(),
                  tagName: z20.string(),
                  tagColor: z20.string()
                })
              ),
              incomes: z20.array(
                z20.object({
                  id: z20.number(),
                  createdAt: z20.date().nullable(),
                  isSpend: z20.boolean(),
                  amount: z20.number(),
                  paymentType: z20.string(),
                  tagName: z20.string(),
                  tagColor: z20.string()
                })
              ),
              details: z20.object({
                totalSpends: z20.number(),
                totalIncomes: z20.number(),
                overallBalance: z20.number()
              })
            })
          }),
          [404 /* NOT_FOUND */]: z20.object({
            name: z20.string(),
            message: z20.string()
          }),
          [400 /* BAD_REQUEST */]: z20.object({
            name: z20.string(),
            message: z20.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { month, year: baseYear } = request.query;
      const year = baseYear ? Number.parseInt(baseYear) : void 0;
      const transactionsController = new TransactionsController(db);
      const [error, data] = await catchError(
        transactionsController.getAllTransactionsByMonth({ month, year })
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/transactions/getAllTransactionsPaymentTypeRoute.ts
import z21 from "zod";
var getAllTransactionsPaymentTypeRoute = async (app2) => {
  app2.get(
    "/payment-type",
    {
      schema: {
        summary: "Get all transactions from a specific payment type",
        tags: ["Transactions"],
        operationId: "getAllTransactionsByPaymentType",
        querystring: z21.object({
          paymentTypeId: z21.string(),
          paymentTypeName: z21.string().optional()
        }),
        response: {
          [200 /* OK */]: z21.object({
            transactions: z21.array(
              z21.object({
                id: z21.number(),
                createdAt: z21.date().nullable(),
                isSpend: z21.boolean(),
                amount: z21.number(),
                paymentType: z21.string(),
                tagName: z21.string(),
                tagColor: z21.string()
              })
            )
          }),
          [400 /* BAD_REQUEST */]: z21.object({
            name: z21.string(),
            message: z21.string()
          }),
          [404 /* NOT_FOUND */]: z21.object({
            name: z21.string(),
            message: z21.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { paymentTypeId: stringPaymentTypeId, paymentTypeName } = request.query;
      const transactionsController = new TransactionsController(db);
      const paymentId = Number.parseInt(stringPaymentTypeId);
      const [error, data] = await catchError(
        transactionsController.getAllTransactionsPaymentType({
          paymentId,
          paymentTypeName
        }),
        new MissingTransactionParamsError(),
        new TransactionNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({ transactions: data });
    }
  );
};

// src/routes/transactions/getAllTransactionsRoute.ts
import z22 from "zod";
var transactionSchema = z22.object({
  id: z22.number(),
  createdAt: z22.date().nullable(),
  isSpend: z22.boolean(),
  amount: z22.number(),
  paymentType: z22.string(),
  tagName: z22.string(),
  tagColor: z22.string()
});
var getAllTransactionsRoute = async (app2) => {
  app2.get(
    "/all",
    {
      schema: {
        summary: "Get all transactions",
        tags: ["Transactions"],
        operationId: "getAllTransactions",
        querystring: z22.object({
          limit: z22.string().optional()
        }),
        response: {
          [200 /* OK */]: z22.object({
            transactions: z22.record(z22.string(), z22.array(transactionSchema))
          }),
          [500 /* INTERNAL_SERVER_ERROR */]: z22.object({
            name: z22.string(),
            message: z22.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { limit: stringLimit } = request.query;
      const limit = stringLimit ? Number.parseInt(stringLimit) : void 0;
      const transactionsController = new TransactionsController(db);
      const [error, data] = await catchError(
        transactionsController.getAllTransactions({ limit })
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({ transactions: data });
    }
  );
};

// src/routes/transactions/getAllTransactionsTagRoute.ts
import z23 from "zod";
var getAllTransactionsTagRoute = async (app2) => {
  app2.get(
    "/tag",
    {
      schema: {
        summary: "Get all transactions from a specific tag",
        tags: ["Transactions"],
        operationId: "getAllTransactionsByTag",
        querystring: z23.object({
          tagId: z23.string(),
          tagName: z23.string().optional()
        }),
        response: {
          [200 /* OK */]: z23.object({
            transactions: z23.array(
              z23.object({
                id: z23.number(),
                createdAt: z23.date().nullable(),
                isSpend: z23.boolean(),
                amount: z23.number(),
                paymentType: z23.string(),
                tagName: z23.string(),
                tagColor: z23.string()
              })
            )
          }),
          [400 /* BAD_REQUEST */]: z23.object({
            name: z23.string(),
            message: z23.string()
          }),
          [404 /* NOT_FOUND */]: z23.object({
            name: z23.string(),
            message: z23.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { tagId: stringTagId, tagName } = request.query;
      const transactionsController = new TransactionsController(db);
      const tagId = Number.parseInt(stringTagId);
      const [error, data] = await catchError(
        transactionsController.getAllTransactionsTag({
          tagId,
          tagName
        }),
        new MissingTransactionParamsError(),
        new TransactionNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send({ transactions: data });
    }
  );
};

// src/routes/transactions/getAllTransactionsWithMonthRoute.ts
import z24 from "zod";
var transactionSchema2 = z24.object({
  id: z24.number(),
  createdAt: z24.date().nullable(),
  isSpend: z24.boolean(),
  amount: z24.number(),
  paymentType: z24.string(),
  tagName: z24.string(),
  tagColor: z24.string()
});
var monthlyTransactionSummarySchema = z24.record(
  z24.string(),
  z24.object({
    spends: z24.array(transactionSchema2),
    incomes: z24.array(transactionSchema2),
    details: z24.object({
      totalSpends: z24.number(),
      totalIncomes: z24.number(),
      overallBalance: z24.number()
    })
  })
);
var getAllTransactionsWithMonthRoute = async (app2) => {
  app2.get(
    "/with-month",
    {
      schema: {
        summary: "Get all transactions from a specific range of months",
        tags: ["Transactions"],
        operationId: "getAllTransactionsWithMonth",
        querystring: z24.object({
          month: z24.string().optional().refine(
            (val) => val === void 0 || Number(val) >= 1 && Number(val) <= 12,
            {
              message: "O m\xEAs deve ser um n\xFAmero entre 1 e 12."
            }
          ).transform((val) => {
            const num = Number(val);
            return Number.isNaN(num) ? void 0 : num;
          }),
          year: z24.string().optional().refine(
            (val) => {
              if (!val) return true;
              const num = Number(val);
              return !Number.isNaN(num) && num > 0;
            },
            {
              message: "O ano deve ser um n\xFAmero v\xE1lido."
            }
          ).transform((val) => {
            const num = Number(val);
            return Number.isNaN(num) ? void 0 : num;
          })
        }),
        response: {
          [200 /* OK */]: monthlyTransactionSummarySchema,
          [404 /* NOT_FOUND */]: z24.object({
            name: z24.string(),
            message: z24.string()
          }),
          [400 /* BAD_REQUEST */]: z24.object({
            name: z24.string(),
            message: z24.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { month, year } = request.query;
      const transactionsController = new TransactionsController(db);
      const [error, data] = await catchError(
        transactionsController.getAllTransactionsWithMonth({ month, year })
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/transactions/getTransactionRoute.ts
import z25 from "zod";
var getTransactionRoute = async (app2) => {
  app2.get(
    "",
    {
      schema: {
        summary: "Get a transaction by id",
        tags: ["Transactions"],
        operationId: "getTransactionById",
        querystring: z25.object({
          id: z25.string()
        }),
        response: {
          [200 /* OK */]: z25.object({
            id: z25.number(),
            createdAt: z25.date().nullable(),
            isSpend: z25.boolean(),
            amount: z25.number(),
            paymentType: z25.string(),
            tagName: z25.string(),
            tagColor: z25.string()
          }),
          [404 /* NOT_FOUND */]: z25.object({
            name: z25.string(),
            message: z25.string()
          })
        }
      }
    },
    async (request, reply) => {
      const { id } = request.query;
      const transactionsController = new TransactionsController(db);
      const transactionId = Number.parseInt(id);
      const [error, data] = await catchError(
        transactionsController.getTransaction({ transactionId }),
        new TransactionNotFoundError()
      );
      if (error) {
        return reply.status(error.statusCode).send({
          name: error.name,
          message: error.message
        });
      }
      return reply.status(200 /* OK */).send(data);
    }
  );
};

// src/routes/transactions/index.ts
var routes4 = [
  getAllTransactionsRoute,
  getTransactionRoute,
  getAllTransactionsPaymentTypeRoute,
  getAllTransactionsTagRoute,
  getAllTransactionsByMonthRoute,
  getAllTransactionsWithMonthRoute,
  createTransactionRoute
];
var prefix4 = "/transactions";
var transactionsRoutes = registerPrefix(routes4, prefix4);

// src/routes/index.ts
var routes5 = [
  transactionsRoutes,
  totalAmountRoutes,
  tagsRoutes,
  paymentTypeRoutes
];

// src/config/routes.ts
function registerRoutes(app2) {
  for (const route of routes5) {
    app2.register(route);
  }
  app2.setNotFoundHandler((req, res) => {
    res.status(404).send({
      message: "P\xE1gina n\xE3o encontrada. Verifique a URL e tente novamente."
    });
  });
}

// src/index.ts
var app = fastify().withTypeProvider();
registerPlugins(app);
registerRoutes(app);
app.listen({ port: env.PORT }).then(() => {
  console.log(`HTTP server running on port ${portSettings.PORT}`);
  console.log(`See the documentation on ${portSettings.BASE_URL}/docs`);
});
