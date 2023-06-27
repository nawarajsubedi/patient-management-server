# Patient Management

## Tech Stack

1. Typescript
2. Node
3. Express
4. PostgreSQL
5. Prisma (ORM)

## Installation and Running

1. Clone the repo.
2. Install the dependencies by running `npm install`.
3. Run `npm run prisma:migrate` to migrate schema.
4. Run `npm run prisma:generate` to install prisma client.

`npm run start:dev` start the server in development mode.
`npm run test:dev` to start Jest testing

## Database Migration and Setting

1. Run `npm run prisma:migrate` to migrate the prisma.schema.
2. Run `npm run prisma:generate` to update the prisma client with latest changes so that you get typechecking for latest changes to your schema.

Every time you make changes to `prisma/schema.prisma` make sure to run above commands.

## Scripts

1. Run app in watch mode
   `npm run start:dev`

2. Run test
   `npm run test`

3. Run test with coverage
   `npm run test:badges`

4. Run production build
   `npm run build`

## Postman

You can find the postman collection of the available APIs [here](https://www.postman.com/joint-operations-pilot-53016632/workspace/patientmanagement/collection/27342787-2bb81c36-2852-4d14-bd0d-7e91a8087de1?action=share&creator=27342787)

## Challenges

The application architecture follows the following structure:

- Route
- Controller
- Service
- Repository
