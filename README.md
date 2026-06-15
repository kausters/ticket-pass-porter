# Ticket Pass Porter

A Next.js application that processes cinema ticket PDFs. Currently supports MARKUS Cinema System (Forum Cinemas) as input and Calendar events as output.

## Getting Started

Install dependencies and start the development server:

```bash
bun install
bun dev
```

It is now available at [http://localhost:3000](http://localhost:3000).

## How it works

You give the app a ticket PDF (uploaded in the browser, or loaded from `/sample`
during development) and it re-renders the tickets and lets you export them as a
calendar (`.ics`) file. The PDF is opened with `pdf.js`, then handed to a parser.

Parsers live under `src/app/(converter)/parse/`. Each one declares whether it
recognises a given PDF and, if so, parses it into a common invoice shape that the
UI and the calendar exporter consume. This keeps support for new ticket systems
isolated to their own parser — the only one implemented today is **MARKUS Cinema
System** (Forum Cinemas), under `parse/markus/`.

### The MARKUS parser

It runs three things in parallel and merges the results into one invoice:

- **read** — pulls the text out of the PDF and turns it into structured ticket
  data (title, date, time, auditorium, row, seat, price, etc.).
- **scan** — finds each ticket's rectangle on the page, renders it to an image,
  and decodes its QR code (a more reliable source for the ticket code).
- **load** — enriches each ticket with data fetched from the cinema's public API
  (currently the show's end time).

`pdf.js` gives back a flat list of text fragments, each with its position on the
page. The reader keeps those coordinates and anchors on stable landmarks and
layout rather than fixed positions, since the exact text varies from ticket to
ticket. A single invoice can hold several tickets, which are split apart and
parsed individually.

Tests in `parse/markus/read/` exercise the reader against fixtures captured from
the real sample PDFs.

## Development

For testing during development, you can use sample tickets by adding the `id` parameter:
```
http://localhost:3000/?id=example
```
This will load a local PDF from `/sample/example.pdf`.
