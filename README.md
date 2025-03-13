
# linityTodo

A ToDo application built with Rust (using Axum and Utoipa) for the backend and Next.js (with TailwindCSS) for the frontend. The backend features a REST API powered by tokio, serde, tower-http, and sqlx (for PostgreSQL), with OpenAPI documentation provided by Utoipa.
- The frontend is developed with Next.js and styled using TailwindCSS, with Zustand for state management.
- Users can create, update, toggle, and delete todos seamlessly.
- The app includes session-based authentication, ensuring users remain logged in even after leaving and returning to the page.

## Tech Stack

**Client:** NextJS (Typescript), Zustand, TailwindCSS.

**Server:** Rust, Axum, sqlx, PostgreSQL.

## Installation

#### Prerequisites
```bash
- Rust (1.85.5 or higher)
- npm and Node.js
- PostgreSQL 16 (or higher)
```

1. Create a .env file in the `root` directory with the following values. DB_URL must be for PostgreSQL with the following keys.
```bash
DB_URL='postgres://user:password@host/dbName'
SERVER_ADDRESS='127.0.0.1:8080'
```

2. Install node dependencies in `frontend` and build
```bash
  cd frontend
  npm install
  npm run build
```


3. Build and run server in `backend` 
```bash
  cd ../backend
  cargo ru
```


The app must now be running on `http://127.0.0.1:PORT`. Don't use localhost as I haven't configured CORS for the backend, so cookies won't be saved and hence session won't be saved either.
## API Reference
#### OpenAPI Documentation
```http
GET /swagger-ui
```

The API Reference for all paths is at `/swagger-ui`

## Further Implementation
I would have liked to implement some more stuff, but due to the time constraints I couldn't
- Make a new struct for the return vales of the handlers in Rust, specifically : Result<(StatusCode, String), (StatusCode, String)> 
- Implement JWT for secure authentication(I was trying this first, but due to the time-constraints I did like a weird JWT-Session Cookie combo which has 0 security but it works)
- A prettier UI(I can't design stuff for shit)
- Extract the redundant code in auth_middleware and check_auth into a separate function(Again, I tried, and it was taking too long to debug, too many compiler errors, so I couldn't)
- Reorganize the `mod`'s and the `use`'s for proper formatting
- EDIT THE TODO??? I FORGOT ABOUT THIS I'M JUST REMEMBERING IT I'M SO DUMB OMG
- Fallback route for client-side Nextjs routing. I know this is a bug, and I know how to solve this also, by creating a fallback handler which will serve index.html from my `out` directory in my NextJS build, or not use client-side routing at all, but again, I didn't have the time to do this.
- Is anyone even reading this?

So now you may ask? Why don't I implement this now lol. I'm pretty sure ya'll aren't gonna check this like immediatly-immediately, and ur prolly not gonna go though my commit history and calulate my exact commit times. But eh, I was given one day, so I'll use only 1 day. If given a chance I would love to refactor and add these extra features.

#### Annoying Shit which I overcame
- Borrow checking. OMG this killed me
- sqlx was annoying with some stupid buffer thing? I had to install sqlx-cli and do sm shit
- utoipa. Fucking hell. I had modularized my code and I was having so many module issues and shit and LLMs were USELESS. I legit thought I wouldn't be able to implement this, but I figured it out in the last 1hr
- NextJs - It's frontend. Need I say more.
- Serving the frontend build file using tower-http. Another part riddled with errors. DeepSeek saved me here like FR(turns out my relative path was wrong, what a clown)

I gave this my best shot, and tried to write the best code possible. I was working with Rust AND NextJS for the first time, and let me tell you learning Rust in <5 hours fried my brain. I legit got through like 1 hour of a coure after spending 3hours (5:30-8:30pm), and then I ate dinner and speedran EVERYTHING else: Fucntions, References, Ownership, Structs, Enums, Borrow-checking, Traits, Derived Traits, Modules and Crates and a lot of other shit in like 2 hours. Then came coding the backend, where I learnt what these packages anol were - axum, tokio, serde, sqlx, utoipa, tower-http. Then finally I started coding, LOT of debugging, wasting time coz for somereason LLMs suck with Rust, I had to rewrite basically everything(or maybe I wasn't prompting right? Idk). Finished this by like what, 6-7am? Then learnt NextJS, struggled with frontend, HAD TO GO TO COLLEGE BECAUSE YES, came back, coded some more, went back to clg to write a test(I did decent incase u were wondering), and then after coming out at 4, somehow managed to make utoipa work and submit my thing at 5pm (I git the assignment at 5:06pm so technically, this was <24hrs)
Anyways, please be lenient with ur evaluation and stuff I really want this internship ya'll seemed so fun to talk to and you guys taught me load balancing and stuff so yeah.
Good Night(Baby's first all-nighter, and honestly it was worth it I did so much more that I though I could), I hope you had fun reading this monolouge.


