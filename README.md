<h1 align="center">
  <br>
  Issue Tracker
</h1>

<h4 align="center">Inspired by <a href="https://github.com/">GitHub</a>, Issue-Tracker is an open-sourced project designed to help teams track and manage issues for their software. Users can create projects to help manage and track their issues, as well as invite other users to join and contribute issues to their projects. Users can also create organizations to help manage their team members and projects to keep everything in one place. The front-end is designed with ease of use in mind so users and teams can easily search and manage issues in a fast, efficient, and organized manner.</h4>

<p align="center">
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#media">Media</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#building">Building</a> •
  <a href="#todo">TODO</a> •
  <a href="#authors">Authors</a> 
</p>

## Tech Stack

- [Next.js 13](https://nextjs.org/)
- [React.js](https://reactjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Postgres SQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Next Auth](https://next-auth.js.org/)
- [tRPC](https://trpc.io/)
- [React Query](https://tanstack.com/query/latest/)
- [React Table](https://tanstack.com/table/v8)
- [React-Markdown](https://github.com/remarkjs/react-markdown)
- [React Hook Form](https://www.react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Shadcn-ui](https://ui.shadcn.com/)
- [Radix](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Font Awesome](https://fontawesome.com/)

## Media

### Home page
![Home Page](/screenshots/Home_page.gif)

### Sign up
![Sign up](/screenshots/Sign_up.gif)

### Profile Page
![Profile page](/screenshots/Profile_page.png)

### User Assigned Issues
![User Assigned Issues](/screenshots/User-assigned-issues.png)

### Create new project
![Create new project](/screenshots/Create-project.gif)

### Create new organization
![Create new organization](/screenshots/Create-organization.png)

# Project Pages

### Create new issue
![Create new issue](/screenshots/Organization-create-issue.png)

### Project view page
![Project view page](/screenshots/Project-view.png)

### Project settings page
![Project settings page](/screenshots/Project-settings.png)

# Organization Pages

### Organization view page
![Organization view](/screenshots/Organization-view.png)

### Organization members page
![Organization members page](/screenshots/Organizations-member-view.png)

**Prerequisites:**

- [Node.js](https://nodejs.org/en/download/)
- [Git](https://git-scm.com)
- [NPM](http://npmjs.com)
- [Docker](https://www.docker.com/)

1. Clone the repository

```sh
git clone https://github.com/Yzma/Issue-Tracker.git
```

2. Move to the correct directory

```sh
cd Issue-Tracker
```

3. Install dependencies

```sh
npm install
```

4. Fill out all variables in .env file.

```sh
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=

DOCKER_POSTGRES_HOST=localhost
DOCKER_POSTGRES_PORT=5432
DOCKER_POSTGRES_USER=
DOCKER_POSTGRES_PASSWORD=
DOCKER_POSTGRES_DB=

DATABASE_URL="postgresql://${DOCKER_POSTGRES_USER}:${DOCKER_POSTGRES_PASSWORD}@${DOCKER_POSTGRES_HOST}:${DOCKER_POSTGRES_PORT}/${DOCKER_POSTGRES_DB}"

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

5. Download Docker Desktop App from the official website: https://www.docker.com/products/docker-desktop/. And run the following command in your terminal

```sh
docker-compose up
```

6. Initialize prisma

```sh
npx prisma db push
```

7. Run the application

```sh
npm run dev
```

## Building

Run 'npm run build' and use the newly created 'build' folder for deployment.

## TODO

1. Redis Cache Implementation
2. Add a milestone system

## Authors

- <a href="https://github.com/Yzma">Andrew Caruso</a>
- <a href="https://github.com/jpared3s">Julian Paredes</a>
