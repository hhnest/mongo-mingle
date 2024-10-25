# GRANTED Module for Nestjs

[![npm](https://img.shields.io/npm/v/%40hhnest%2Fgranted?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/@hhnest/granted)
[![npm](https://img.shields.io/npm/v/%40hhnest%2Fgranted?style=for-the-badge&logo=github&label=github)](https://github.com/hhnest/granted)

[![Build hhnest/granted](https://github.com/hhnest/granted/actions/workflows/main.yml/badge.svg)](https://github.com/hhnest/granted/actions/workflows/main.yml)
[![Publish hhnest/granted to NPM](https://github.com/hhnest/granted/actions/workflows/tag.yml/badge.svg)](https://github.com/hhnest/granted/actions/workflows/tag.yml)



This module allow you to use RBAC security on your endpoints nestjs

## Install @hhnest/granted

You can use either the npm or yarn command-line tool to install the `package`.    
Use whichever is appropriate for your project in the examples below.

### NPM

```bash
# @hhnest/granted
npm install @hhnest/granted --save 
```

### YARN

```bash
# @hhnest/granted
yarn add @hhnest/granted
```

### Peer dependencies

| name | version |
|---|---|
| @nestjs/common | ^10.0.0 |
| @nestjs/core | ^10.0.0 |
| @nestjs/platform-express | ^10.0.0 |

### Dependencies
| name | version |
|---|---|
| jsonwebtoken | ^9.0.0 |

## Configuration

Just import the module `GrantedModule`, specify the implementation for fetch username, roles  and you can use the `annotations`.   


Header provider
`AppModule.ts`
```typescript
@Module({
  // Declare the module and define the option apply (for apply or not the security)
  imports: [
    GrantedModule.forRoot({apply: environment.applyAuthGuard}),
  ],
})
export class AppModule {}
```

Jwt Provider
`AppModule.ts`
```typescript
@Module({
  // Declare the module and define the option apply (for apply or not the security) and GrantedInfoJwtProvider (for decode user info from jwt token)
  imports: [
    GrantedModule.forRoot({apply: environment.applyAuthGuard, infoProvider: new GrantedInfoJwtProvider({
      algorithm: 'RS256', // RS256, EC256, PS256
      pemFile: 'path/jwt_public_key.pem',
      // or
      base64Key: '-----BEGIN PUBLIC KEY-----\nBASE64KEYENCODED\n-----END PUBLIC KEY-----'
    })}),
  ],
})
export class AppModule {}
```

## Use

### Inject informations

The module allow you to inject informations in your endpoints:

```typescript
@Get('username')
username(@Username() userId: string): Observable<string> {
    return of(userId);
}

@Get('roles')
roles(@Roles() roles: string[]): Observable<string[]> {
    return of(roles);
}

@Get('groups')
groups(@Groups() groups: string[]): Observable<string[]> {
    return of(groups);
}
@Get('locale')
groups(@Locale() locale: string): Observable<string> {
    return of(locale);
}
```

### Secure endpoints

```typescript
@Get('username')
@GrantedTo(and(isAuthenticated(), hasRole('GET_USERNAME')))
username(@Username() userId: string): Observable<string> {
    return of(userId);
}
```

### Details

```typescript
GrantedTo(...booleanSpecs: BooleanSpec[])
```

```typescript
// AndSpec
and(...booleanSpecs: BooleanSpec[]): BooleanSpec
// IsTrueSpec
isTrue(): BooleanSpec
// HasRoleSpec
hasRole(role: string): BooleanSpec
// IsAuthenticatedSpec
isAuthenticated(): BooleanSpec
// IsFalseSpec
isFalse(): BooleanSpec
// NotSpec
not(booleanSpec: BooleanSpec): BooleanSpec
// OrSpec
or(...booleanSpecs: BooleanSpec[]): BooleanSpec
// IsUserSpec
isUser(type: 'Param' | 'Query' | 'Body', field?: string): BooleanSpec
```
### User informations provider

2 providers information are provide by `GrantedModule`

- `GrantedInfoProvider`
- `GrantedInfoJwtProvider`

`GrantedInfoProvider` get user information directly in headers

 - `username`
 - `roles`
 - `groups`
 - `locale`

`GrantedInfoJwtProvider` get information from JWT token (since 1.0.3)

if token provide `username`/`roles`/`groups` informations will be available

`locale` is still get from header

You have to provide a public RSA key for verify the token

`AppModule.ts`
```typescript
import { GrantedModule } from '@hhnest/granted';
import { GrantedInfoJwtProvider } from '@hhnest/granted/services';

@Module({
  imports: [
    GrantedModule.forRoot({infoProvider: new GrantedInfoJwtProvider('-----BEGIN PUBLIC KEY-----\nMIIBIj...IDAQAB\n-----END PUBLIC KEY-----', 'RS256')}),
  ],
})
export class AppModule {}
```

### Extends

AppRbacGuard read information in http headers request

username, roles, groups and accept-language

If you want to extract information from other behaviors, just write an other implementation of IGrantedInfoProvider
and set on option

`AppModule.ts`
```typescript
@Module({
  // Declare the module and define the option apply (for apply or not the security)
  providers: [MyGrantedInfoProvider],
  imports: [
    GrantedModule.forRoot({apply: environment.applyAuthGuard, infoProvider: new MyGrantedInfoProvider()}),
  ],
})
export class AppModule {}
```

This is actualy the default provider that get information simply from headers

Note that you have to manage 2 cases: `Request` and `IncomingMessage`

```typescript
export class MyGrantedInfoProvider implements IGrantedInfoProvider {

    getUsernameFromRequest(request: Request): string {
        return JSON.parse(request.header('username') || 'anonymous');
    }

    getRolesFromRequest(request: Request): string[] {
        return JSON.parse(request.header('roles') || '[]');
    }

    getGroupsFromRequest(request: Request): string[] {
        return JSON.parse(request.header('groups') || '[]');
    }

    getLocaleFromRequest(request: Request): string {
        return request.header('accept-language') || 'en';
    }

    getUsernameFromIncomingMessage(incomingMessage: IncomingMessage): string {
        return JSON.parse(incomingMessage.headers('username') || 'anonymous');
    }

    getRolesFromIncomingMessage(incomingMessage: IncomingMessage): string[] {
        return JSON.parse(incomingMessage.headers['roles'] as string || '[]')
    }

    getGroupsFromIncomingMessage(incomingMessage: IncomingMessage): string[] {
        return JSON.parse(incomingMessage.headers['groups'] as string || '[]')
    }

    getLocaleFromIncomingMessage(incomingMessage: IncomingMessage): string {
        return incomingMessage.headers['accept-language'] || 'en';
    }
}
```
