# Full Of Shift - Invoice Management System

https://fullofshift.vercel.app/

(feel free to put in a random BSB and accnt number)

## Overview

This project is a **Next.js-based Invoice Management System** designed to help users track their work shifts, calculate their earnings, and generate invoices dynamically. It leverages **Next.js**, **TypeScript**, **Prisma**, and **Next-Auth** for authentication, ensuring a secure and efficient workflow for invoice generation.

## Features

- **User Authentication**: Secure login/logout using `next-auth`.
- **Dynamic Invoice Generation**: Fetches user shift data from a database and calculates total pay.
- **Shift Tracking**: Users can view their logged, pending, and upcoming shifts.
- **PDF Download**: Ability to generate and download invoices.
- **Navigation & UI Components**: Utilizes modern UI components and a responsive design for a seamless experience.

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS (shadcn)
- **Backend**: Next.js API routes, Prisma ORM
- **Authentication**: Next-Auth
- **Database**: PostgreSQL (or any Prisma-supported database)

## Usage

- **Login**: Users log in via Next-Auth.
- **Dashboard**: View available options for managing shifts and invoices.
- **Invoice Page**: View and download invoices for a specific month.

## Folder Structure

```
/components       # Reusable UI components
/lib             # Helper functions and authentication config
/pages          # Next.js pages (Dashboard, Invoices, Login, etc.)
/prisma         # Database schema and migrations
```

## Skills Demonstrated

- **Full-stack development with Next.js**
- **Authentication handling with Next-Auth**
- **Database interaction using Prisma ORM**
- **Dynamic data fetching & processing**
- **State management in a server-side rendered app**
- **Modern UI/UX design with Tailwind CSS**

## License

This project is licensed under the MIT License.

