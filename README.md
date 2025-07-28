# MongoMingle Module for NestJS

[![npm](https://img.shields.io/npm/v/%40hhnest%2Fmongo-mingle?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@hhnest/mongo-mingle)
[![npm](https://img.shields.io/npm/v/%40hhnest%2Fmongo-mingle?style=for-the-badge&logo=github&label=github)](https://github.com/hhnest/mongo-mingle)

[![Build hhnest/mongo-mingle](https://github.com/hhnest/mongo-mingle/actions/workflows/main.yml/badge.svg)](https://github.com/hhnest/mongo-mingle/actions/workflows/main.yml)
[![Publish hhnest/mongo-mingle to NPM](https://github.com/hhnest/mongo-mingle/actions/workflows/tag.yml/badge.svg)](https://github.com/hhnest/mongo-mingle/actions/workflows/tag.yml)

## What is MongoMingle?

MongoMingle is a NestJS module that simplifies MongoDB database migration management. Like [Liquibase](https://www.liquibase.org/), it allows you to execute database update operations in a controlled and reproducible manner.

### Key Features

- **Controlled Migrations** : Sequential and traceable operation execution
- **Step Tracking** : Each operation is recorded with its status
- **Security** : Prevents multiple executions of the same operations
- **Performance** : Uses RxJS for optimized asynchronous operations
- **NestJS Integration** : Native module with dependency injection

### Typical Use Cases

- **Data Initialization** : Adding default values on first deployment
- **Schema Evolution** : Adding, modifying, or removing fields
- **Data Migration** : Transforming existing data
- **Configuration Updates** : Modifying application parameters

## Install @hhnest/mongo-mingle

You can use either the npm or yarn command-line tool to install the `package`.    
Use whichever is appropriate for your project in the examples below.

### NPM

```bash
# @hhnest/mongo-mingle
npm install @hhnest/mongo-mingle --save 
```

### YARN

```bash
# @hhnest/mongo-mingle
yarn add @hhnest/mongo-mingle
```

### Peer dependencies

| name | version |
|---|---|
| @nestjs/common | ^10.0.0 |
| @nestjs/core | ^10.0.0 |

### Dependencies
| name | version |
|---|---|
| mongodb | ^6.10.0 |

## 📦 Installation

### NPM

```bash
npm install @hhnest/mongo-mingle --save 
```

### YARN

```bash
yarn add @hhnest/mongo-mingle
```

## 🔧 Configuration

Import the `MongoMingleModule` in your `AppModule` and specify your MongoDB database URL:

```typescript
import { Module } from '@nestjs/common';
import { MongoMingleModule } from '@hhnest/mongo-mingle';

@Module({
  imports: [
    MongoMingleModule.forRoot(
      'mongodb://localhost:27017/database',
      options?: MongoClientOptions
    ),
  ],
})
export class AppModule {}
```

### Dependencies

#### Peer dependencies
| name | version |
|---|---|
| @nestjs/common | ^10.0.0 |
| @nestjs/core | ^10.0.0 |

#### Dependencies
| name | version |
|---|---|
| mongodb | ^6.10.0 |

## 🚀 Usage

### Operation Types

MongoMingle supports three types of operations:

- **`INIT`** : Data initialization (executed only once)
- **`STRUCT`** : Structure modification (adding/removing fields)
- **`MIGRATE`** : Migration of existing data

### Implementation Example

```typescript
import { Injectable, Logger } from '@nestjs/common';
import { MongoMingle, OperationType } from '@hhnest/mongo-mingle';
import { Observable } from 'rxjs';

@Injectable()
export class MyService {
  constructor(
    private readonly logger: Logger,
    private readonly mongoMingle: MongoMingle,
  ) {}

  init(): Observable<void> {
    return this.mongoMingle.executeOperations([
      {collectionName: 'collectionTarget', operationStep: {name: 'init-default-values', operationType: OperationType.INIT, description: 'Add default values'}, operation$: this.#addDefaultValues()},
      {collectionName: 'collectionTarget', operationStep: {name: 'add-field', operationType: OperationType.STRUCT, description: 'Add field'}, operation$: this.#addField()},
      {collectionName: 'collectionTarget', operationStep: {name: 'rename-field', operationType: OperationType.MIGRATE, description: 'Rename field'}, operation$: this.#renameField()},
    ]);
  }
}
```

### 🔍 Operation Tracking

MongoMingle automatically records each operation in a `mongo-mingle-operations` collection with:
- Operation name
- Operation type
- Description
- Execution status
- Execution date

This ensures that an operation is executed only once, even if the application restarts.

