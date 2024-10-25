

export enum OperationType {
  INIT = 'init',          // Initialization operations, such as setting up the database or inserting initial data.
  INSERT = 'insert',      // Operations for inserting new data into the database.
  UPDATE = 'update',      // Operations for updating existing data.
  DELETE = 'delete',      // Operations for deleting data from the database.
  STRUCT = 'struct',      // Operations related to the structure of the database, like adding or removing fields in a document.
  MIGRATE = 'migrate',    // Operations for migrating data from one structure to another or from one database to another.
  VALIDATE = 'validate',  // Operations for validating data, ensuring it meets certain rules or constraints.
  SEED = 'seed',          // Operations for seeding the database with test or demo data.
  CLEANUP = 'cleanup',    // Operations for cleaning up, such as removing obsolete or unnecessary data.
  OTHER = 'other',        // Any other operation that does not fit into the above categories.
}

export interface OperationStep {
  name: string;
  operationType?: OperationType;
  description?: string;
  error?: string;
  appliedAt?: Date;
}

export interface CollectionOperations extends Document {
  collection: string;
  steps: OperationStep[];
}
