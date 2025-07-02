
# Gemini Code Understanding

This document summarizes the understanding of the `app-link-explorer` codebase.

## Project Overview

The project is a web application named "App Link Explorer". It allows users to discover which iOS and Android applications are linked to a specific website. It works by checking the website's configuration for [Android App Links](https://developer.android.com/training/app-links) (`assetlinks.json`) and [iOS Universal Links](https://developer.apple.com/library/archive/documentation/General/Conceptual/AppSearch/UniversalLinks.html) (`apple-app-site-association`).

The application was initially bootstrapped using `v0.dev`, a tool that generates React code from text and image prompts. It is configured for continuous deployment on Vercel.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (React framework)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** A combination of custom components and components from [Radix UI](https://www.radix-ui.com/) and [shadcn/ui](https://ui.shadcn.com/).

## Project Structure

- `app/page.tsx`: The main landing page of the application. It contains the main user interface for entering a domain.
- `app/(domain)/[domain]/page.tsx`: This page likely displays the results of the app link analysis for a given domain.
- `app/(marketing)/gallery/page.tsx`: A page that showcases a curated gallery of websites with their app link configurations.
- `components/`: This directory contains the reusable React components used throughout the application.
  - `link-discovery.tsx`: The primary component for the user to input a domain and trigger the analysis.
  - `android-apps-visualization.tsx` & `apple-apps-visualization.tsx`: Components responsible for displaying the discovered Android and iOS app information, respectively.
- `lib/`: Contains utility functions.
- `data/`: Contains static data, such as the list of websites for the gallery.
- `public/`: Contains static assets like images and logos.
