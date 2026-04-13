# Jackpot Therapy — UI Feature Documentation

**Project:** JackpotTherapy  
**Team:** Team 5  
**Author:** MaryElizabeth Chukwu  
**Role:** UI Developer  

---

## Overview

This document provides a comprehensive record of all UI features designed, built, and integrated by the UI developer throughout the Jackpot Therapy project. The application is a Django-based slot machine game with user authentication, persistent player profiles, and a full game flow from title screen to end credits.

---

## 1. Title Screen

**File:** `templates/game/title.html`

The title screen is the first page a user sees when visiting the application. It was styled to match the neon/purple aesthetic of the original prototype and serves as the entry point to all major navigation paths.

**Features:**
- Displays the game logo and title
- "Play Now" button that routes logged-in users directly to the game, or redirects new visitors to the login page
- "Sign Up" link for new users
- Themed background and font consistent with the game's visual identity

---

## 2. Authentication System — Login and Signup Pages

**Files:** `templates/registration/login.html`, `templates/registration/signup.html`, `accounts/views.py`, `accounts/urls.py`

The login and signup system was implemented following Django's Chapter 8/9 authentication pattern. This feature was specifically requested by the project manager during the Sprint #2 planning meeting.

**Login Page Features:**
- Username and password fields
- Form validation with error messaging
- Redirect to game screen on successful login
- Link to signup for new users

**Signup Page Features:**
- New user registration form with username, password, and confirmation fields
- On successful registration, the user is automatically logged in and redirected to the game
- Styled consistently with the rest of the application

**Backend:**
- Uses Django's built-in `User` model and `AuthenticationForm`
- Session management handled by Django's auth framework
- `LOGIN_REDIRECT_URL` and `LOGOUT_REDIRECT_URL` configured in settings

---

## 3. Main Game Screen

**Files:** `templates/game/game.html`, `static/js/game.js`, `static/css/game.css`

The main game screen is the core of the application. All prototype assets (images, sounds, icons, avatars) were migrated from the original prototype and integrated into the Django static file system.

**HUD (Heads-Up Display):**
- Player balance shown in real time
- Current debt displayed when applicable
- Player avatar selector (10 avatars)
- Bet amount selector

**Slot Machine:**
- Three animated reels using icon images from the prototype
- Spin button that triggers the spin API endpoint
- Win/loss result displayed after each spin
- Jackpot banner animation on jackpot wins

**Controls:**
- Bet selector to adjust wager amount
- Loan button to take on debt when balance is low
- Theme switcher to toggle visual themes
- Save & Quit button — saves progress and logs out the user
- Start Over button — resets balance and stats to default values
- Exit button — navigates directly to the end credits screen

**Game Logic (via Django API):**
- All spin results calculated server-side via `POST /api/spin/`
- Loan requests handled via `POST /api/loan/`
- Profile data saved continuously via `POST /api/save-profile/`
- CSRF tokens passed with every API request for security

---

## 4. Balance Persistence and Database Integration

**Files:** `game/models.py`, `game/views.py`

Initially the application was resetting the player balance to $1,000 on every login. This issue was identified during testing and corrected by properly implementing persistent database storage per user account.

**PlayerProfile Model Fields:**

| Field | Type | Description |
|---|---|---|
| `user` | OneToOneField | Linked to Django's built-in User model |
| `balance` | IntegerField | Player's current balance (persists between sessions) |
| `debt` | IntegerField | Outstanding loan amount |
| `avatar` | IntegerField | Selected avatar (1–10) |
| `total_spins` | IntegerField | Lifetime spin count |
| `total_winnings` | IntegerField | Total amount won |
| `total_losses` | IntegerField | Total amount lost |
| `jackpots_hit` | IntegerField | Number of jackpots hit |
| `last_recovery_check` | DateTimeField | Timestamp for balance recovery tracking |

**How Persistence Works:**
- When a user logs in, the game view loads their existing `PlayerProfile` from the database
- All balance and stat changes are saved to the database after each spin and interaction
- Data is stored in `db.sqlite3` on the server and survives server restarts
- The only time a profile resets is when the user explicitly clicks "Start Over"

---

## 5. Balance Recovery System

**Files:** `game/models.py` (`apply_recovery` method), `game/views.py` (`check_recovery` view), `static/js/game.js`

This feature was requested by the project manager after a team meeting. If a player's balance reaches $0, they will gradually recover funds over time rather than being permanently locked out.

**How It Works:**
- Every 30 minutes that a player's balance remains at $0, they automatically receive $150
- The `apply_recovery()` method on the `PlayerProfile` model calculates how many 30-minute intervals have passed since the last recovery check
- Recovery is applied when the player loads the game screen
- A background check runs every 5 minutes while the player is actively on the game page
- A `💰 +$150 Recovery!` banner notification is shown when recovery funds are added

**API Endpoint:** `GET /api/recovery/`  
Returns the current balance and the number of minutes until the next recovery grant.

---

## 6. Game Over / Stats Screen

**File:** `templates/game/game_over.html`

When a player goes broke and clicks "See Stats," they are taken to the game over screen, which provides a full summary of their session.

**Stats Displayed:**
- Total spins
- Total winnings
- Total losses
- Jackpots hit
- Net profit or loss

**Navigation Options:**
- Start Over — resets the player's profile and returns them to the game
- Exit — navigates to the end credits screen

---

## 7. End Credits Screen

**File:** `templates/game/credits.html`

The credits screen is displayed when the user exits the game. It features a scrolling animation and acknowledges the development team.

**Features:**
- Scrolling credits animation styled to match the game aesthetic
- Displays all team member names and roles
- "Main Menu" button to return to the title screen

---

## 8. Navigation Flow

The full navigation flow implemented across all screens:

```
Title Screen
    ├── Login → Main Game Screen
    └── Sign Up → Main Game Screen
            │
            ├── Save & Quit → Title Screen (logged out)
            ├── Start Over → Main Game Screen (reset)
            └── Exit → Credits Screen
                            │
                    Main Game Screen (via Main Menu)
```

---

## 9. Static Assets Integration

**Directory:** `static/`

All assets from the original Jackpot-Therapy prototype were migrated and registered with Django's static file system.

| Asset Type | Location | Contents |
|---|---|---|
| Icons | `static/images/Icons/` | 1.png through 10.png (slot reel symbols) |
| Avatars | `static/images/Avatars/` | 1.png through 10.png (player avatars) |
| Sounds | `static/sounds/` | music.mp3, click.mp3, spin.mp3, jackpot.mp3 |
| CSS | `static/css/game.css` | Full stylesheet ported from prototype |
| JS | `static/js/game.js` | Game logic refactored to use Django API instead of localStorage |

Django's `{% load static %}` and `{% static '' %}` template tags are used throughout all templates to reference these assets correctly.