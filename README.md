## 🚀 Getting Started
This project uses the OpenAI API and requires a valid API key to run locally.

## Prerequisites
Ensure you have the following installed on your machine:

Node.js (v16 or higher recommended)

npm

Prisma CLI
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

This is the backend of a web application built with NestJS and SQLite, designed to:

- Process uploaded invoice images using OCR (Optical Character Recognition)

- Extract and analyze text via OpenAI's API

- Enable users to interact with the AI through a chat interface

- Generate downloadable PDF reports containing the invoice, extracted text, and chat history

- Support JWT-based authentication with hashed passwords

## Project Links
If you're interested, you can explore the live version and the frontend code here:

🔗 Live Project: https://invoice-case.vercel.app

💻 Frontend Repository: https://github.com/fromanoel/invoice-case-frontend



## 🚀 Instalation and Running 
### Clone the repository and switch to the dev branch:
```bash
git clone <repository-url>
cd <project-directory>
git checkout dev
```

### Install all the dependencies

```bash
npm install
```

### Create a .env file in the root directory (outside the src folder) and configure the following environment variables:

```bash
# Configuration
JWT_SECRET="your_jwt_secret"
REFRESH_TOKEN_SECRET="your_refresh_token_secret"

# Database
DATABASE_URL="file:./sqlite.db"

# OpenAI API Key
OPEN_API_KEY="your_personal_openai_api_key"
```


To obtain your OpenAI API key:

Visit https://platform.openai.com/account/api-keys.

Generate a new API key and paste it into the .env file.


### Generate a prisma client

```bash
npx prisma generate
```


### Start the development server: 
```bash
npm run start:dev
```
### To view and manage your database in a visual editor, run:
```bash
npx prisma studio
```

### Important!
The backend server runs on:
http://localhost:3004

## Stay in touch
- Author - Fernanda Romanoel
- GitHub - @fromanoel
- [@LinkedIn](linkedin.com/in/fernandaromanoel/)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
