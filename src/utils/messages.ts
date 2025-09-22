export const createNotFoundEntityMessage = (entity: string) => (id: number) =>
  `${entity} with ID=${id} not found`;

export const createAlreadyExistedMessage = (entity: string) =>
  `${entity} is already existed`;
