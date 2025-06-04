# SpendIQ-Wealth Dashboard
_A modern full-stack personal finance tracker_

![Demo Screenshot](public/demo-screenshot.png)
<!-- Or: [Live Demo](https://your-deployment-link.com) -->

## Tech Stack

| Technology    | Purpose                   |
| ------------- | ------------------------ |
| Next.js 14    | React framework (frontend & backend) |
| React         | UI library                |
| Tailwind CSS  | Styling                   |
| Prisma ORM    | Database ORM              |
| SuperBase     | Database                  |
| Clerk         | Authentication            |
| Inngest       | Background jobs           |
| Arcjet        | Edge security & protection|
| Sonner        | Toast notifications       |

## Features

- User authentication & secure sessions (Clerk)
- Track expenses, incomes, and budgets
- Visual dashboards for financial insights
- Responsive UI with Tailwind CSS
- Real-time toast notifications (Sonner)
- Background processing for scheduled tasks (Inngest)

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- SuperBase instance
- Clerk account

### Installation

```bash
git clone https://github.com/Chethantram/personal-finance-tracker.git
npm install
```

### Setup

1. Copy `.env.example` to `.env` and fill in your credentials.
2. Run database migrations:
    ```bash
    npx prisma migrate dev
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```


## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/wealth_dashboard
DIRECT_URL= your_superbase_direct_url
CLERK_SECRET_KEY=your-clerk-secret-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
INNGEST_EVENT_KEY=your-inngest-key
ARCJET_KEY= your_arcjet_api_key
RESEND_API_KEY = your_resend_api_key
GEMINI_API_KEY=your-gemini-api-key
```

## Folder Structure

```
.
├── app/                # Next.js app directory
├── components/         # Reusable React components
├── prisma/             # Prisma schema & migrations
├── pages/              # API routes
├── styles/             # Tailwind CSS config
├── utils/              # Utility functions
├── public/             # Static assets
└── README.md
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements.
