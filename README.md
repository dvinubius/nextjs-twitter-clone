# Project Extension

The starting point for this Next app was the Twitter clone created by [WebDevSimplified](https://github.com/WebDevSimplified/twitter-clone).

Built with the T3-stack, using Next.js pages directory.

The initial project demonstrates a few basic tRPC and Next features. 

✅ This project **adds some features, as well as UI & architecture improvements**. 
📝 Additionally, it **documents** the steps of **the development**  (see the section below).

### Try the app ⚡️ [**here**](https://nextjs-twitter-clone-dvinubius.vercel.app/) ⚡️

# Enhancements and New Features 🤓💡🤩

<img width="660" alt="combined2" src="https://github.com/dvinubius/nextjs-twitter-clone/assets/32189942/af0cb83a-47eb-4b66-bb48-c59f64bed3f2">

---

<img width="1200" alt="combinedX" src="https://github.com/dvinubius/nextjs-twitter-clone/assets/32189942/b8c2cd8d-6082-4737-9fd7-5e8c4abfc38f">

---

## 1 Auth
- [x] add google sign-in

## 2 UI Refinements

- [x] fix infinite-list displacement (scrollbar)

### 2.1 Sidenav
- [x] auth button (to login/logout)
  - separate in layout
  - current user
  - tooltip for actual action
- [x] border for the sidenav
- [x] button width full (better alignment)
- [x] highlight currently active section
- [x] bg
  
### 2.2 New Tweet Form
- [x] move above tabs 
- [x] alignment of picture with input
- [x] button on same row - more compact
- [x] non-white bg for better visibility
- [x] character count
- [x] smaller text
- [x] prevent empty tweet

### 2.3 Responsive
- [x] tweets not too wide
- [x] tweet form not too wide
- [x] profile banner not too wide

### 2.4 Tabs
- [x] active tab underline doesn't displace text
- [x] tabs keep equal widths when active tab changes (bold text doesn't affect tab width)
- [x] underline color transitions 

### 2.5 Misc
- [x] twitter logo as pure css icon
- [x] user profile header
  - taller
  - non-white bg for better visibility
- [x] spinner position on page while loading tweets
- [x] back arrow on profile makes no sense

- [x] navigation
  - protect profile page

## 3 Add *Liked Tweets* tab
- [x] on profile page, display liked tweets (becomes a 2-tab-page)

## 4 Add *Echo* Feature
Echo is like reposting, with nothing added. It helps users who follow the echoer be fed with the echoed tweet, even if they don't follow the original author.

### 4.1 Specs
- for a new echo there is no new entity in DB
- instead, the recency of the parent tweet updates: max(creation date, any echo date)
- an echoed tweet only appears ONCE in any particular feed
  - has all its echoers listed in the tweet card (A, B, C ...show more style)
  - echoers are listed according to recency of echo
- a new echo produces some updates as if the echoer was the creator of the original tweet: 
  - recent tweets (overall / for logged in user) - echoed tweet recency update (move to top)
  - following-feeds - tweet included in feed if not already present / tweet recency update if already present
  - echoer's profile[echoed] - add tweet in here

### 4.2 Implementation
#### Back End
  - [x] schema update w/ selfrelation
  - [x] tweet recency by lastPostedAt field
  - [x] query for echoed tweets
  - [x] echoer information included in tweet 
  - [x] echo mutation: create => update echo count, echoedByMe
  - [x] query tweets: recency based on creation & existing echoes
  - [x] echoers are sorted: most recent first
  - [x] limit how many echoers are provided to a tweet
#### Front End
  - [x] echo action & echoed-stats
  - [x] profile page tab: echoes
    - cannot echo my own
    - cannot re-echo
  - [x] echoed tweet cards display echoers
    - max. 2 are previewed, the others are are "... + x more"


## 5 Add *Tweet Page*
Show interactable tweet along with
  - a form to reply (see next feature)
  - replies (see next feature)
  - quoters
Tweet page has meta tags for SEO (opengraph)

### Implementation
- [x] (BE) get data for 1 tweet
- [x] tweet page on dynamic route with interactable tweet
- [x] access tweet page: link surface on tweet
- [x] quoters

## 6 Consistent Navigation & Titles
- [x] back navigation & Title for tweet page
- [x] back navigation & Title for profile page

## 7 Add *Reply* Feature
Reply is like creating a new tweet while quoting. The purpose is for you to engage with the author while both your followers and the author's followers will see your reply in their feed.

### 7.1 Specs
- reply is a standalone tweet that happens to have a replyParent
- all interactions (like, echo, reply) pertain to the reply itself
- reply appears as tweet with content + quote in brief form
- quote can be viewed in full on its own tweet page 
- a tweet's replies appear on the tweet page

- feature: 1-layer reply system
  - T2 replies to T1, T3 replies to T2 => T3 is not among the replies of T1
  - simple UI: in feed, no preview of the replies list

### 7.2 Implementation
- [x] BE: replyParent type definition
- FE: quoted tweet in tweet
  - [x] display inside the tweet, except for the reply tweets on the tweet page
  - [x] link to its page
- FE: reply forms
  - [x] tweet page
  - [x] tweet reply modal

## 8 Add *About/FAQ Page*

  - [x] reply: can multiple times, can to my own
  - [x] cannot echo my own and my echoed
  - [x] links to github: original project, this repo

## 9 Add *Edit User Profile* capability
- + FEATURE: Edit User Profile
  - a display of the user profile with new fields (see below)
  - a modal with a form to edit all the fields (see below)
  - on profile picture update, intentionally not updating user avatar in already displayed tweets, but only on subsequent data fetching
  
### Implementation
  - [x] user can set profile image
  - [x] user automaticallly has a handle and can update it
    - [x] need a trigger to store initial handle as email or a slug (on user signup with oauth2)
    - [x] no trigger can run on planetscale -> use supabase + postgres instead
    - [x] create trigger in db, save the code used in a project file for reference
    - [x] handle update -> duplication handling
  - [x] user has profile banner and can update it
    - [x] placeholder before user sets it
  - [x] user has bio and can edit it
    - [x] textarea with used characters display
  - [x] display "joined ... " info on profile page'
  - [x] user info in sidenav taken from trpc call (update sidenav via query invalidation on profile info update)
  
## 10 User Feedback

- [x] Successful updates
- [x] Failed updates of UI
  - infinite data
  - tweet on tweet page
  - profile on profile page
  - name & handle in sidenav

## 11 Final Touches

- [x] profile page, edit modal - skeleton for photo 
- [x] tooltips on icons
- [x] update user avatar in NewTweetForm upon profile update?
- [x] flicker on infinite scroll
- [x] new tweet form to adjust height when tweet is multiple lines long
  
- [x] refactor trpc logic - DRY
- [x] refactor components - DRY & extract complex handlers (tweet card updates etc)


# Takeaways 🤔 🧐 📝

## Tooling

### Typescript 

tRPC has inconveniences in terms of its type system. For a complex functionality in the trpc procedures, the refactoring into DRY code is rather cumbersome.

### Local infinite query update
The utils for updating infinite list data on the front end do not consistently behave as expected. The update callback sometimes has an undefined input (the `oldData). As a workaround I've used query invalidation in multiple places. But updating the data locally would have been the optimal way to go. 
  - Definitely something to tackle in a production app that is supposed to scale with good performance.
  - UX is not optimal on echoing a tweet: the tweet becomes more recent and moves up to the top of the feed. At the same time, its echo count and the list of echoers are visibly updated. With query invalidation (the workaround we chose to adopt), there is no way to have the latter without the former. But an optimal UX would be to only have the former: update the tweet stats but keep it in the same place in the feed.

## Stack
- prisma types create problems
  - can not explicitly define tweet type like the TS inferred type (prisma definitions not strict enough) 
  - orderBy not recognized as valid field in select
- prisma migrate dev discouraged on planetscale, but actually necessary for advanced use cases like initializing the handle with a value from another user field

# To improve 🚧 🛠️ 🧨
- echoers sorted by most recent echoer, not necessarily so that my own followed people come first -> would be a nice challenge for a real app
- some typescript & linter disabling or workarounds due to imperfect type support from trpc / cloudinary
- more efficient query invalidation & a better ux by storing the selected tab / infinite feed in the route (all vs following, tweeted vs echoed vs liked)
