# About this app

You are using a Twitter-like app built with Next.js (pages router).

🤓 Check out the code [on Github](https://github.com/dvinubiu/nextjs-twitter-clone).

## Purpose

This app is created for educational purposes. Initially a project by [Web Dev Simplified](https://github.com/WebDevSimplified/twitter-clone), we've changed it, extended it, added some functionaltiy in order to try out features of Next.js & tRPC.

Our changes include: 
- more interaction with the tweets (reply, echo)
- more specifc types of feeds (my echoed / my liked)
- a dedicated tweet page
- a feature-rich user profile management (twitter handle, profile banner, profile picture)
- using supabase instead of planetscale 
  - in order to automatically have a twitter handle created on each user registration via oauth2, it was necessary to write an sql trigger, which is not possible on planetscale

## Project specifics

The name *Twitter Clone* would not be accurate since a lot of the functionality in ***X*** at the moment of creating this project, is missing here.

Apart from that, some features are simplified versions of ***X*** features, in order to better fit the reduced scope of this project.

Visit [the repo](https://github.com/dvinubiu/nextjs-twitter-clone) for details. We've documented the requirements definition and the implementation steps we've taken.

### Echo

You repost someone else's tweet. 

It helps users who follow you be fed with the tweet you echo, even if they don't follow the original author. 

Echoes appear as tags in the original tweet. The recency of a tweet is updated with every new echo received (it moves to the top of any feed).

You cannot echo your own tweets. You can echo a tweet only once.

### Reply

Reply to a user's tweet while including it as a quote.

The purpose is for you to engage with the author while both your followers and the author's followers will see your reply in their feed.

You can reply multiple times to the same tweet. You can also reply to your own tweets.