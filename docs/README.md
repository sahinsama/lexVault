# LexVault

> **A personal vocabulary operating system.**

LexVault is a vocabulary management platform built around a simple idea:

People remember words they discover naturally far better than words they are forced to memorize.

Instead of creating another language course, LexVault helps users capture interesting words from their daily life—whether they come from movies, books, games, articles, videos, conversations, or anywhere else—and transforms them into a personal, searchable knowledge archive.

---

## Core Philosophy

LexVault is not designed to replace real-world language exposure.

Real life is already the curriculum.

The product exists to remove the friction between *discovering* a word and *remembering* it months later.

Every saved word becomes part of a growing personal vocabulary database enriched with:

* meanings
* examples
* personal notes
* pronunciation
* CEFR level
* source information
* review history
* future learning tools

---

## Current Status

LexVault is currently under active development.

The first version focuses on:

* fast word capture
* automatic linguistic analysis
* centralized vocabulary storage
* personal notes
* searchable archive
* modern web interface

The long-term architecture is built around **Supabase** as the primary database, while external services (such as Notion) are planned as optional synchronization targets rather than the source of truth.

---

## Project Documentation

The project documentation is maintained inside the `/docs` directory.

| Document                  | Purpose                                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| `01_PRODUCT_VISION.md`    | Long-term philosophy, mission, product identity and North Star.         |
| `02_PRODUCT_ROADMAP.md`   | Planned features, milestones and development phases.                    |
| `03_PROJECT_STRUCTURE.md` | Explanation of the codebase, folders and responsibilities of each file. |
| `04_ARCHITECTURE.md`      | Backend flow, frontend communication and overall system architecture.   |
| `05_DATABASE.md`          | Database design, schema and data model.                                 |
| `06_API.md`               | Backend endpoints and API specification.                                |
| `07_CHANGELOG.md`         | Major project changes and architectural decisions over time.            |

---

## Development Principles

LexVault follows a few simple rules throughout development:

* Simplicity before complexity.
* Fast capture before perfect organization.
* AI should assist learning—not become the product itself.
* Personal notes are more valuable than generated content.
* Every feature must improve long-term vocabulary retention.

---

## License

This project is released under the MIT License.
