# Chat Room App

This is a real-time chat application built with Next.js, Redux, and PeerJS. It allows users to join chat rooms and communicate directly with each other using WebRTC.

## Features

- Real-time peer-to-peer communication
- Automatic room assignment
- Redux state management
- Rate limiting with Upstash Redis
- Automatic cleanup of inactive users and empty rooms
- Health check endpoint for monitoring
- Logging system for better debugging and monitoring


## Prerequisites

- Node.js 14.x or later
- npm 6.x or later
- PostgreSQL database or Neon database
- Upstash Redis account for rate limiting


## Neon Database Setup

1. Create a Neon account and set up a new project.
2. In your project dashboard, find your connection string.
3. Add the following environment variables to your `.env.local` file and Vercel project settings:
   \`\`\`
   DATABASE_URL=your_neon_connection_string
   DIRECT_URL=your_neon_direct_connection_string
   \`\`\`
   The `DIRECT_URL` is used for direct connections to the database, which is necessary for migrations.


## Installation

1. Clone the repository:
git clone [https://github.com/yourusername/chat-room-app.git](https://github.com/yourusername/chat-room-app.git)
cd chat-room-app
2. Install dependencies:
npm install
3. Set up environment variables:
Create a .env.local file in the root directory and add the following variables:
DATABASE_URL=your_postgresql_database_url
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
4. Run database migrations:
npx prisma migrate dev
5. Start the development server:
npm run dev


## Deploying to Vercel

1. Push your code to a GitHub repository.
2. Create a new project on Vercel and link it to your GitHub repository.
3. In the Vercel project settings, add the following environment variables:

1. DATABASE_URL
2. DIRECT_URL
3. UPSTASH_REDIS_REST_URL
4. UPSTASH_REDIS_REST_TOKEN



4. Deploy the project.


## Database Migrations

The project is set up to automatically run database migrations during the Vercel build process. This is configured in the `vercel-build` script in `package.json`. If you need to run migrations manually, you can use the following command:

\`\`\`
npx prisma migrate deploy
\`\`\`

This will apply any pending migrations to your database.


## Infrastructure

- Database: PostgreSQL or Neon (You can use Vercel Postgres, Neon, or any other PostgreSQL provider)
- Rate Limiting: Upstash Redis
- Hosting: Vercel (Serverless)


## Setting up Redis on Upstash

1. Go to the Upstash website ([https://upstash.com/](https://upstash.com/)) and create an account or log in.
2. Create a new Redis database.
3. Once created, you'll be provided with a UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.
4. Add these to your environment variables both locally and in your Vercel project settings.


## API Endpoints

- /api/room: GET - Join or create a room
- /api/room/[roomId]/events: GET - Server-Sent Events for room updates
- /api/room/[roomId]/user/[userId]: PATCH - Update user's peerId, DELETE - Remove user from room
- /api/cleanup: POST - Remove inactive users and empty rooms
- /api/health: GET - Health check endpoint


## Monitoring and Maintenance

- Use the /api/health endpoint to check the application's health. This endpoint verifies the database connection.
- Set up monitoring for the health check endpoint to ensure the application is running smoothly.
- The /api/cleanup endpoint should be called periodically to remove inactive users and empty rooms. You can set up a cron job or use a service like Vercel Cron to call this endpoint regularly.
- Review the application logs regularly to identify any recurring issues or patterns.


## Logging

The application uses a custom logging system. Logs are currently output to the console, but in a production environment, you should consider sending logs to a centralized logging service for better analysis and monitoring.

## Rate Limiting

Rate limiting is implemented using Upstash Redis. The current configuration allows 10 requests per minute per IP address. You can adjust these settings in the lib/rateLimit.ts file.

## Troubleshooting

If you encounter any issues with peer-to-peer connections:

1. Ensure that both peers are not behind restrictive firewalls.
2. Check that the STUN/TURN servers are accessible.
3. Verify that the peerId is being correctly updated and shared between users.
4. Check the application logs for any error messages or warnings.
5. Ensure that the Redis and PostgreSQL connections are working correctly.


Common issues and solutions:

- If users can't connect to each other, check the STUN/TURN server configuration in lib/usePeerConnection.ts.
- If rooms are not being cleaned up properly, ensure that the cleanup endpoint is being called regularly and check the logs for any errors during the cleanup process.
- If you're experiencing high latency, consider using a different TURN server or setting up your own.


## Performance Optimization

- The application uses Server-Sent Events (SSE) for real-time updates. If you need to scale to a large number of concurrent users, consider implementing a WebSocket solution or using a service like Pusher.
- Implement caching strategies for frequently accessed data to reduce database load.
- Consider implementing pagination for message history if chat rooms need to support a large number of messages.


## Security Considerations

- Ensure that all user inputs are properly sanitized to prevent XSS attacks.
- Implement proper authentication and authorization if you plan to add user accounts.
- Regularly update dependencies to patch any security vulnerabilities.
- Consider implementing end-to-end encryption for messages if privacy is a concern.


## Future Improvements

- Implement user authentication and persistent user profiles.
- Add support for file sharing and multimedia messages.
- Implement chat room moderation features.
- Add support for multiple participants in a single chat room.
- Implement message persistence (currently, messages are only stored in memory).


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request


Please ensure that your code adheres to the existing style and that you've added tests for any new functionality.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

This README provides a comprehensive guide to understanding, setting up, and maintaining the chat room application. It covers all aspects from installation to troubleshooting, and should be helpful for both users and contributors.

