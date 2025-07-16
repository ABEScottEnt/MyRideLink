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