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
> <b>[SUCCESS] Stored user ID, you may use @test next time instead of user ID.</b>
> <b>[SUCCESS] Sent to @test: This is a test message.</b>
```

## About
Contributed by Samuel Lee.
Credits to various depedencies for making this possible: yargs, keytar, axios, store, data-store.