const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { PORT } = require("./utils/secret");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gallery Backend API",
      version: "2.0.0",
      description:
        "Professional File Upload va Gallery Management API. Duplicate detection, cron jobs, multiple upload va boshqa imkoniyatlar.",
      contact: {
        name: "Jorabek",
        email: "support@gallery.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT || 3000}`,
        description: "Development server",
      },
      {
        url: "https://gallery-backend-g1ha.onrender.com",
        description: "Production server",
      }
    ],
    tags: [
      {
        name: "Upload",
        description: "Fayl yuklash operatsiyalari (single, multiple, cleanup)",
      },
      {
        name: "Gallery",
        description: "Galereyani boshqarish (CRUD)",
      },
    ],
    components: {
      schemas: {
        Gallery: {
          type: "object",
          required: ["url", "file_type"],
          properties: {
            _id: {
              type: "string",
              description: "Gallery ID",
              example: "507f1f77bcf86cd799439011",
            },
            url: {
              type: "string",
              description: "Fayl URL manzili",
              example: "http://localhost:3000/uploads/images/abc123.jpg",
            },
            file_type: {
              type: "string",
              description: "Fayl turi",
              enum: ["image", "video", "other"],
              example: "image",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Yaratilgan vaqti",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Yangilangan vaqti",
            },
          },
        },
        Upload: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "507f1f77bcf86cd799439011",
            },
            url: {
              type: "string",
              example: "http://localhost:3000/uploads/images/abc123.jpg",
            },
            is_use: {
              type: "boolean",
              description: "Fayl galereyada ishlatilganmi",
              default: false,
            },
            file_size: {
              type: "number",
              description: "Fayl hajmi (bytes)",
              example: 1024000,
            },
            file_name: {
              type: "string",
              description: "Original fayl nomi",
              example: "my-photo.jpg",
            },
            mime_type: {
              type: "string",
              description: "MIME type",
              example: "image/jpeg",
            },
            file_hash: {
              type: "string",
              description: "MD5 hash (duplicate check)",
              example: "abc123xyz789",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        UploadResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            url: {
              type: "string",
              example: "http://localhost:3000/uploads/images/abc123.jpg",
            },
            file_type: {
              type: "string",
              enum: ["image", "video", "other"],
              example: "image",
            },
            file_size: {
              type: "number",
              example: 1024000,
            },
            file_name: {
              type: "string",
              example: "my-photo.jpg",
            },
            is_duplicate: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Bu fayl avval yuklangan",
            },
          },
        },
        MultipleUploadResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            total: {
              type: "number",
              example: 5,
            },
            uploaded: {
              type: "number",
              example: 4,
            },
            failed: {
              type: "number",
              example: 1,
            },
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  file_type: { type: "string" },
                  file_name: { type: "string" },
                  file_size: { type: "number" },
                  is_duplicate: { type: "boolean" },
                },
              },
            },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  file_name: { type: "string" },
                  error: { type: "string" },
                },
              },
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Operation successful",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
      },
    },
    paths: {
      "/upload/file": {
        post: {
          tags: ["Upload"],
          summary: "Bitta fayl yuklash",
          description:
            "Rasm (max 20MB), video (max 50MB) yuklash. Duplicate check avtomatik.",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["file"],
                  properties: {
                    file: {
                      type: "string",
                      format: "binary",
                      description: "Yuklanadigan fayl (image/video)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Fayl muvaffaqiyatli yuklandi",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UploadResponse",
                  },
                },
              },
            },
            200: {
              description: "Fayl duplicate (avval yuklangan)",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UploadResponse",
                  },
                },
              },
            },
            400: {
              description: "Xatolik (fayl yo'q, hajm katta, format noto'g'ri)",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/upload/files": {
        post: {
          tags: ["Upload"],
          summary: "Ko'p fayl yuklash",
          description: "Bir vaqtda 10 tagacha fayl yuklash mumkin",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["files"],
                  properties: {
                    files: {
                      type: "array",
                      items: {
                        type: "string",
                        format: "binary",
                      },
                      description: "Ko'p fayllar (max 10)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Fayllar yuklandi",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/MultipleUploadResponse",
                  },
                },
              },
            },
            400: {
              description: "Fayllar topilmadi",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/upload/cleanup": {
        post: {
          tags: ["Upload"],
          summary: "Manual cleanup (Admin)",
          description:
            "is_use=false va 7+ kun o'tgan fayllarni o'chirish. Odatda cron job avtomatik qiladi.",
          responses: {
            200: {
              description: "Tozalash bajarildi",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/SuccessResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/gallery/create": {
        post: {
          tags: ["Gallery"],
          summary: "Galereyaga fayl qo'shish",
          description: "Yuklangan faylni galereyaga qo'shish",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["url", "file_type"],
                  properties: {
                    url: {
                      type: "string",
                      description: "Yuklangan fayl URL",
                      example: "http://localhost:3000/uploads/images/abc123.jpg",
                    },
                    file_type: {
                      type: "string",
                      enum: ["image", "video", "other"],
                      description: "Fayl turi",
                      example: "image",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Galereyaga qo'shildi",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/SuccessResponse",
                  },
                },
              },
            },
            400: {
              description: "Fayl topilmadi yoki allaqachon ishlatilgan",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
      "/gallery/get-all": {
        get: {
          tags: ["Gallery"],
          summary: "Barcha galereyani olish",
          description: "file_type bo'yicha filter qilish mumkin",
          parameters: [
            {
              name: "file_type",
              in: "query",
              description: "Fayl turi bo'yicha filter",
              required: false,
              schema: {
                type: "string",
                enum: ["image", "video", "other"],
              },
              example: "image",
            },
          ],
          responses: {
            200: {
              description: "Muvaffaqiyatli",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: {
                        type: "boolean",
                        example: true,
                      },
                      data: {
                        type: "array",
                        items: {
                          $ref: "#/components/schemas/Gallery",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/gallery/{id}": {
        delete: {
          tags: ["Gallery"],
          summary: "Gallereyadan o'chirish",
          description:
            "Fayl gallereyadan o'chiriladi. is_use=false qilinadi. Fizik fayl cron job orqali tozalanadi.",
          parameters: [
            {
              name: "id",
              in: "path",
              description: "Gallery item ID",
              required: true,
              schema: {
                type: "string",
              },
              example: "507f1f77bcf86cd799439011",
            },
          ],
          responses: {
            200: {
              description: "O'chirildi",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: {
                        type: "string",
                        example: "Fayl gallereyadan o'chirildi",
                      },
                      info: {
                        type: "string",
                        example: "Fizik fayl cron job orqali tozalanadi",
                      },
                    },
                  },
                },
              },
            },
            404: {
              description: "Topilmadi",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Gallery API Documentation",
    })
  );

  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.log(
    `📚 Swagger docs: http://localhost:${PORT || 3000}/api-docs`
  );
};

module.exports = { setupSwagger };
