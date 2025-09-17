# Ticket Pass Porter

A Next.js application that processes cinema ticket PDFs. Currently supports MARKUS Cinema System (Forum Cinemas) as input and Calendar events as output.

## Getting Started

Install dependencies and start the development server:

```bash
bun install
bun dev
```

It is now available at [http://localhost:3000](http://localhost:3000).

## Development

For testing during development, you can use sample tickets by adding the `id` parameter:
```
http://localhost:3000/ticket?id=example
```
This will load a local PDF from `/sample/example.pdf`.
