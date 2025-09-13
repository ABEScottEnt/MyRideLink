app/
├── home/
│   └── (tabs)/                  # Bottom tab navigation
│       ├── _layout.tsx          # Defines tab icons, labels, styles
│       ├── home.tsx             # (Optional) general dashboard or redirect
│       ├── rides.tsx            # Rides screen (Uber/Lyft map + comparison)
│       ├── transit.tsx          # Transit screen (map + schedule)
│       ├── rentals.tsx          # Rentals screen (compare car services)
│       └── account.tsx          # Settings, manage account, activity cards
├── auth/
│   ├── login.tsx
│   ├── signup.tsx
│   └── forgot-password.tsx
├── support/
│   ├── index.tsx             # Help center overview
│   ├── faq.tsx               # Common questions
│   └── contact.tsx           # Submit a support request
├─── activity/
│   └── [id].tsx   
└── payments/
    ├── methods.tsx           # Add/edit cards
    └─── history.tsx           # Past ride/rental payments

components/
├── common/
│   ├── LocationSearchBar.tsx    # Origin + destination input fields
│   ├── MapViewBox.tsx           # Reusable MapView (used in rides, transit)
│   ├── ComparisonCard.tsx       # Generic comparison card (Uber/Lyft, Rentals)
│   ├── SectionTitle.tsx         # UI header for sections
│
├── rides/
│   ├── RideComparisonList.tsx   # List comparing Uber/Lyft
│   ├── RideMap.tsx              # Map with car markers
│
├── transit/
│   ├── TransitOptionsList.tsx   # Transit routes list (bus, train)
│   └── TransitMap.tsx           # Transit overlay map
│
├── rentals/
│   ├── RentalFilters.tsx        # Car type/duration form
│   ├── RentalComparisonList.tsx # List comparing Turo, Zipcar, etc.
│
├── account/
│   ├── SettingCard.tsx          # Reusable setting block
│   ├── ActivityCard.tsx         # Tap to view activity details
│   ├── ManageAccount.tsx        # Edit profile / delete account (modal maybe)
└── auth/
    ├── login.tsx
    ├── signup.tsx
    └── forgot-password.tsx

├── README.md
├── backend
│   ├── PROJECT_SUMMARY.txt
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── src
│       ├── app.js
│       ├── config
│       │   ├── env.js
│       │   └── logger.js
│       ├── lib
│       │   ├── gracefulShutdown.js
│       │   ├── socket.js
│       │   └── supabase.js
│       ├── middleware
│       │   ├── auth.js
│       │   ├── errorHandler.js
│       │   ├── logging.js
│       │   ├── notFound.js
│       │   ├── rateLimiter.js
│       │   └── validation.js
│       ├── modules
│       │   ├── auth
│       │   │   ├── controllers.js
│       │   │   ├── routes.js
│       │   │   ├── services.js
│       │   │   └── validators.js
│       │   ├── health
│       │   │   ├── controllers.js
│       │   │   ├── routes.js
│       │   │   └── services.js
│       │   ├── payments
│       │   │   ├── controllers.js
│       │   │   ├── routes.js
│       │   │   └── services.js
│       │   ├── rentals
│       │   │   ├── controllers.js
│       │   │   ├── routes.js
│       │   │   └── services.js
│       │   ├── rides
│       │   │   ├── controllers.js
│       │   │   ├── routes.js
│       │   │   └── services.js
│       │   └── transit
│       │       ├── controllers.js
│       │       ├── routes.js
│       │       └── services.js
│       └── utils
│           ├── appError.js
│           ├── auth.js
│           ├── fareEngine.js
│           ├── notifications.js
│           ├── stripe.js
│           └── uber.js
└── frontend
    ├── README.md
    ├── app
    │   ├── _layout.jsx
    │   ├── activity
    │   │   ├── history.jsx
    │   │   └── recent.jsx
    │   ├── auth
    │   │   ├── forgot-password.jsx
    │   │   ├── index.jsx
    │   │   ├── otp-input.jsx
    │   │   └── verify-email.jsx
    │   ├── entry.jsx
    │   ├── home
    │   │   ├── (tabs)
    │   │   │   ├── account.jsx
    │   │   │   ├── home.jsx
    │   │   │   ├── rentals.jsx
    │   │   │   ├── rides.jsx
    │   │   │   └── transit.jsx
    │   │   └── _layout.jsx
    │   ├── index.jsx
    │   └── settings
    │       ├── FavoritePlaces.jsx
    │       ├── Preferences.jsx
    │       ├── Trip-History.jsx
    │       ├── payment-method.jsx
    │       └── personal-info.jsx
    ├── app.json
    ├── assets
    │   ├── fonts
    │   │   └── SpaceMono-Regular.ttf
    │   └── images
    │       ├── adaptive-icon.png
    │       ├── favicon.png
    │       ├── icon.png
    │       ├── loca.png
    │       ├── logo.png
    │       ├── partial-react-logo.png
    │       ├── react-logo.png
    │       ├── react-logo@2x.png
    │       ├── react-logo@3x.png
    │       └── splash-icon.png
    ├── babel.config.js
    ├── components
    │   ├── account
    │   │   ├── ManageAccount.jsx
    │   │   ├── ProfileCard.jsx
    │   │   ├── SettingCard.jsx
    │   │   └── StatsCard.jsx
    │   ├── home
    │   │   ├── ActivityHistory.jsx
    │   │   ├── QuickAccessCard.jsx
    │   │   ├── QuickSearch.jsx
    │   │   └── RecentActivity.jsx
    │   ├── rentals
    │   │   ├── RentalCard.jsx
    │   │   ├── RentalComparisonList.jsx
    │   │   ├── RentalFilters.jsx
    │   │   └── RentalSearch.jsx
    │   ├── rides
    │   │   ├── RideComparisonList.jsx
    │   │   └── RideMap.jsx
    │   ├── shared
    │   │   ├── AuthTestButton.jsx
    │   │   ├── ComparisonCard.jsx
    │   │   ├── DevButton.jsx
    │   │   ├── LocationSearch.jsx
    │   │   ├── MapViewBox.jsx
    │   │   └── SectionTitle.jsx
    │   └── transit
    │       ├── TransitComparisonList.jsx
    │       └── TransitMap.jsx
    ├── config
    ├── constants
    │   └── theme.js
    ├── data
    │   ├── testRentals.js
    │   ├── testRides.js
    │   └── testTransits.js
    ├── eslint.config.js
    ├── hooks
    ├── metro.config.js
    ├── package-lock.json
    ├── package.json
    ├── plan.md
    ├── services
    ├── store
    └── utils
        └── location.js

