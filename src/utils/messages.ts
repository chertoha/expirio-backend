export const ERROR_MESSAGE = {
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden (invalid Role)",
  NOT_FOUND: "Not found",
  BAD_REQUEST: "Bad Request (validation failed)",
  CONFLICT: "Required data is already existed",
};

export const SWAGGER_DESCRIPTIONS_MESSAGE = {
  ONLY_FOR_ROOT: `<b>Available only for users with role "ROOT"</b>`,
};

export const createNotFoundWithIdMessage = (entity: string, id: number) =>
  `${entity} with ID=${id} not found`;

export const createNotFoundEntityMessage = (entity: string) => (id: number) =>
  `${entity} with ID=${id} not found`;

export const createAlreadyExistedMessage = (entity: string) => `${entity} is already existed`;

export const createSwaggerMessage = (entity: string) => ({
  CREATED: `${entity} has been successfully created.`,
  FOUND_MANY: `${entity} records found`,
  FOUND_ONE: `${entity} found`,
  UPDATED: `${entity} updated successfully`,
  DELETED: `${entity} successfully deleted`,

  SUMMARY: {
    CREATED: `Create ${entity.toLowerCase()}`,
    FOUND_MANY: `Find ${entity.toLowerCase()} records`,
    FOUND_ONE: `Find ${entity.toLowerCase()} by id`,
    UPDATED: `Update ${entity.toLowerCase()}`,
    DELETED: `Delete ${entity.toLowerCase()}`,
  },
});
