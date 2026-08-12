# NestFinder

NestFinder is a static front-end rental marketplace demo built with HTML, CSS, and JavaScript.
It simulates owner, tenant, and admin workflows for listing properties, browsing rentals, sending booking requests, and reviewing applications.

## Features

- Role-based experience for Owners, Tenants, and Admins
- Demo login with pre-seeded credentials
- Property browsing with filters by location, rent, and bedrooms
- Owner dashboard for managing listings and pending requests
- Tenant application flow with booking request submission
- Admin overview of users, listings, and requests
- Property listing modal with photo preview support and interior photo gallery
- Notification center and toast feedback messages

## Demo Credentials

- Owner: `owner@demo.com` / `1234`
- Tenant: `customer@demo.com` / `1234`
- Admin: `admin@demo.com` / `1234`

## Getting Started

1. Open `NestFinder/index.html` in your browser.
2. Choose a role at the login screen.
3. Sign in with one of the demo accounts or register a new account.

## How to Use

### Owner
- Add, edit, or remove rental listings.
- View booking requests from tenants.
- Accept or decline pending tenant requests.
- See listing stats and request summaries.

### Tenant
- Browse available properties.
- Filter listings by location, rent range, and bedroom count.
- View property details and photo previews.
- Submit booking requests with an optional message.
- Track request status in My Requests.

### Admin
- View total users, owners, tenants, listings, and pending requests.
- Inspect all listings and registered users.

## Media & Image Notes

- Property photos use direct image URLs.
- For custom listings, provide a direct image link ending with `.jpg`, `.png`, or `.webp`.
- Social image links (Pinterest, Facebook, Instagram) may not load.

## Project Structure

- `index.html` — main application shell and page layout
- `css/` — styles and layout definitions
- `js/` — application logic, state, rendering, authentication, modals, and seed data

## Development

No build step is required. This is a static application.

Recommended options:

- Open `index.html` directly in a browser
- Or serve locally with a simple server, for example:
  - `python -m http.server` from the `NestFinder` folder

## Notes

- All data is stored in memory while the page is open.
- Refreshing the page resets the seeded demo data.
