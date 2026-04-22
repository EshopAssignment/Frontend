# Pallshoppen frontend

Frontend for Pallshoppen, an e-commerce app where customers can find, filter, and buy pallet products, as well as submit custom product requests. The app also includes authenticated profile pages and an admin area for products, orders, fulfillment, dashboard metrics, and custom requests.

## Overview

This project is a React/Vite application with routing handled by React Router and server state handled by TanStack Query. API calls use a generated OpenAPI client from `@hey-api/openapi-ts`, wrapped by a custom fetch client that uses cookie-based authentication and refreshes the session after `401` responses.

## Features

- Home page with promotional/image slider and a link to the product catalog.
- Product catalog with pagination, grid/list view, search, sorting, and filters for pallet type, condition, price, and stock status.
- Search bar with debounced product suggestions and navigation to product detail pages.
- Product detail page with image slider, stock status, price including VAT, and add-to-cart action.
- Cart with localStorage persistence, quantity management, VAT calculation, and stock reservation through the API.
- Checkout flow with order creation, customer details, shipping address, PostNord service point selection, and Stripe Payment Element.
- Order confirmation page that fetches orders by order number or order id and clears the cart after a successful payment redirect.
- Custom request form for made-to-order pallets, including validation and file upload.
- Authentication flows for registration, login, logout, email verification, forgot password, and password reset.
- Protected profile pages with user details, address management, default address selection, and order history.
- Admin area protected by the `Admin` role.
- Admin dashboard with KPIs, sales chart, top products, recent orders, and fulfillment summary.
- Admin product management with listing, filtering, creation, editing, image handling, and activation/deactivation.
- Admin order management with filtering, status updates, order details, and tracking.
- Admin fulfillment queue with filters, notes, mark-as-fulfilled, and reopen actions.
- Admin custom request management with status filters, details, quote creation, and quote sending.
- Theme and cookie preferences stored in localStorage.

## Tech Stack

- **Framework:** React 19, Vite 7, and TypeScript.
- **Routing:** `react-router-dom`.
- **Server state and data fetching:** `@tanstack/react-query`.
- **Local state:** React Context for the cart, React state/hooks, and localStorage for cart, theme, cookies, and view preferences.
- **Forms:** `react-hook-form` in auth flows, plus custom validation helpers for flows such as custom requests and profile forms.
- **API client:** generated SDK from `@hey-api/openapi-ts`, `fetch`, and a custom client in `src/lib/http.ts`.
- **Payments:** `@stripe/react-stripe-js` and `@stripe/stripe-js`.
- **Styling:** global CSS files in `src/css`, Tailwind CSS v4 through `@tailwindcss/vite`, Headless UI, and Heroicons.
- **UI/visualization:** Swiper for image sliders, Recharts for admin charts, and React Hot Toast for notifications.
- **Lint/build:** ESLint 9, TypeScript build mode, and Vite build.

## Project Structure

```text
src/
  api/          Generated OpenAPI client, SDK, and types.
  components/   Reusable UI components for products, checkout, admin, orders, auth, cart, and settings.
  constants/    Query keys, storage keys, and theme constants.
  context/      CartContext with cart state, localStorage persistence, and stock reservations.
  css/          Global styling, layout, reset, admin, responsive CSS, Stripe, and Swiper overrides.
  data/         Static data for home page promos.
  helpers/      Formatters, filter params, image URLs, validation, and view-model helpers.
  hooks/        React Query hooks, auth hooks, product hooks, order hooks, theme/cookie/localStorage hooks.
  Images/       Local image assets used by the app.
  layout/       MainLayout, AdminLayout, ProfileLayout, Header, and Footer.
  lib/          HTTP client, React Query client, error formatting, product validation, and redirect toast helpers.
  pages/        Routed pages for users, auth, profile, and admin.
  routes/       AppRouter and route guards for auth and admin access.
  Services/     API service functions for products, auth, orders, payments, shipping, profile, and admin.
  types/        Local TypeScript types.
```

Important entrypoints:

- `src/main.tsx` mounts the app with `QueryClientProvider`, `BrowserRouter`, `CartProvider`, and theme initialization.
- `src/App.tsx` renders the toast container, options button, and `AppRouter`.
- `src/routes/AppRouter.tsx` defines public routes, auth routes, profile pages, and admin routes.
- `src/lib/http.ts` creates the API client and handles cookies, request timeout, and refresh on `401`.

## Getting Started

Install dependencies:

```bash
npm install
```

Create or update `.env` in the project root:

```bash
VITE_API_URL=https://localhost:7152
VITE_STRIPE_PK=your_stripe_publishable_key
```

Start the development server:

```bash
npm run dev
```

The app runs through Vite, normally on the local URL printed in the terminal.

## Environment Variables

| Variable | Used for | Required |
| --- | --- | --- |
| `VITE_API_URL` | Base URL for the backend API. Read in `src/config.ts` and `src/lib/http.ts`. | Yes |
| `VITE_STRIPE_PK` | Stripe publishable key for checkout. Read in `src/components/Stripe/Checkout.tsx`. | Yes, for checkout |

Environment variables are read when Vite starts. Restart the dev server after changing `.env`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Vite development server. |
| `npm run build` | Runs the TypeScript build (`tsc -b`) and then `vite build`. |
| `npm run preview` | Serves the production build locally through Vite. |
| `npm run lint` | Runs ESLint over the project. |
| `npm run api:gen` | Generates `src/api` from the OpenAPI configuration. |

## Data Flow / API Integration

The API client is generated from `openapi-ts.config.ts`, which points to `https://localhost:7152/openapi.json` and writes output to `src/api`.

The service layer in `src/Services` wraps SDK calls:

- `productService.ts` fetches product lists, product details, and product suggestions.
- `authService.ts` handles login, registration, logout, current user, email verification, and password reset.
- `orderService.ts` creates orders from the cart, fetches orders, and updates customer/shipping details.
- `paymentService.ts` creates Stripe Payment Intents.
- `shippingService.ts` fetches service points and saves shipping selections.
- `profileService.ts` handles profile details, addresses, and default address selection.
- `cartReservationService.ts` reserves stock for cart lines.
- Admin services handle dashboard data, products, orders, fulfillment, and custom requests.

React Query hooks in `src/hooks` use the service layer for caching, invalidation, and mutations. The cart is a separate Context flow that is stored in localStorage and synchronized with the backend through the reservation API.

## Build & Production

Create a production build:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

The build requires TypeScript compilation to pass and the required Vite environment variables to be available. The backend API must be reachable at `VITE_API_URL` for the app's data flows to work.

## Known Limitations

- The project has no test script in `package.json`.
- `npm run api:gen` requires the OpenAPI spec to be available at `https://localhost:7152/openapi.json`.
- The checkout flow requires backend support for orders, payments, shipping, and a valid Stripe publishable key.
