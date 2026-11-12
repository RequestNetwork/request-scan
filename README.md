<!-- @format -->

# Request Scan

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Request Scan is a powerful blockchain explorer designed to provide insights into the Request Network. Built using Next.js for a performant frontend and a GraphQL API for efficient data access, Request Scan empowers users to explore and analyze requests, accounts, and other on-chain data related to the Request Network.

## Features

- **Intuitive Interface:** A user-friendly design makes it easy to navigate and find the information you need.
- **Real-Time Data:** Access the latest request network data with real-time updates.
- **Advanced Search:** Search for specific requests or addresses.
- **Detailed Request or Address Views:** Get a comprehensive breakdown of each request or address.

## Technologies Used

- **Next.js:** A React framework for building server-side rendered and static web applications.
- **GraphQL API:** An open-source GraphQL engine that connects to your databases and provides a real-time GraphQL API.
- **Request Network:** A decentralized network for creating, storing, and managing payment requests.

## Installation

1. Clone the repository:

```bash
git clone [https://github.com/RequestNetwork/request-scan.git](https://github.com/RequestNetwork/request-scan.git)
```

2. Install dependencies:

```bash
cd request-scan
npm install
```

3. Configure the Hasura GraphQL endpoint in your `.env` file.
```bash
cp .env.example .env
```
Make sure to replace `<your_hasura_graphql_url_here>` and `<your_jwt_token_here>` in the `.env` file with your actual Hasura GraphQL URL and JWT token.

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to http://localhost:3000.

## EasyPanel deployment

Keep the Nixpacks build method and existing environment settings.
`nixpacks.toml` pins the Nix package snapshot supplying Node.js 22.23.5 and
requires Node >=22.23.5 <23 before dependency installation. This pin is
needed because selecting Node 22 alone can select an older patch release.

The container listens on port 3000. After staging deployment, verify
`node --version` is `v22.23.5`, check known requests and payments (including
USDC amounts), and check address pages and the `X-Robots-Tag` header.

Publishing a GitHub Release triggers the production deployment webhook through
`.github/workflows/deploy-to-production.yml`. Publish only after staging UAT
passes and production deployment is approved.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](/CONTRIBUTING.md) file for guidelines on how to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
