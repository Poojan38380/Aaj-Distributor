# Aaj Distributor

A simple distribution system for dorm residents. This application allows an admin to manage special items stock and provides a public interface for residents to view available items.

## Features

- **Public Homepage**: Displays available special items to all visitors
- **Admin Dashboard**: Secure admin panel for stock management
- **Simple Authentication**: Password-based admin login
- **Stock Management**: Add, edit, delete, and update item quantities
- **Real-time Updates**: Server-side rendering with automatic revalidation

## Tech Stack

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Prisma** with MongoDB for database
- **Tailwind CSS** for styling
- **Server Actions** for data operations

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aaj-distributor
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your MongoDB connection string:
```
DATABASE_URL="mongodb://localhost:27017/aaj-distributor"
```

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### For Visitors
- Visit the homepage to see available special items
- View total quantity and individual brand availability
- Check prices and descriptions

### For Admin
- Navigate to `/admin` to access the admin dashboard
- Use password `admin123` to login (change this in production)
- Add new items with brand, quantity, price, and description
- Edit existing items
- Update quantities quickly
- Delete items when needed

## Admin Features

- **Add Items**: Create new entries with brand, quantity, price, and optional description
- **Edit Items**: Modify existing item information
- **Quick Quantity Update**: Update item quantities without opening edit form
- **Delete Items**: Remove items completely
- **Real-time Sync**: All changes are immediately reflected on the public homepage

## Security Notes

- Change the default admin password in production
- Consider implementing proper authentication for production use
- The current implementation uses localStorage for session management

## Database Schema

The application uses a simple `Stock` model with the following fields:
- `id`: Unique identifier
- `brand`: Item brand name
- `quantity`: Available quantity
- `price`: Price per unit
- `description`: Optional description
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes only.
