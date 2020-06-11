# Telegram Bot CLI (Debug)

## Background
I've been working on Telegram Bot these days, and there are instances where I want to quickly debug/send message to my bot without altering the initial codes. Hence this. It is currently still in **development stage**.

*Note: the package has not been uploaded to NPM yet. Hence, manual installation is required.*

## Installation
Download the files, navigate to the folder, then:
`$ npm install -g .`

## Getting Started
Let's get started and play around with the CLI!

### Simple Example (Send Message)
```
$ tb add sgrs <token>
> [SUCCESS] sgrs has been added.

$ tb msg sgrs test 'This is a test message.'
> [SUCCESS] Stored user ID, you may use @test next time instead of user ID.
> [SUCCESS] Sent to @test: This is a test message.
```

## Commands
## Add New Bot
`$ tb add <bot name> <bot token>`

## Send Message
`$ tb msg <bot name> <username | chatID> <text>`
*On initial, use chatID. Username will be saved upon successful execution. You'll then be able to use username afterwards.*

## About
Contributed by Samuel Lee.
Credits to various depedencies for making this possible: yargs, keytar, axios, store, data-store.