# AGENTS.md

## Project Overview

This project is an Apps in Toss mini app entry for the "귀여운게 최고야" vibe-coding challenge.

Working product concept: **선물 취향 도감**.

The app helps users save each person's cute gift preferences as a small profile/dex, then recommends gift ideas by occasion and budget. The core product promise is:

> 소중한 사람의 취향을 귀여운 태그 도감으로 기록하고, 예산 안에서 실패 확률 낮은 선물을 추천한다.

Primary user flow:

1. View people to gift.
2. Create or edit a person's taste profile.
3. Pick an occasion and budget.
4. Review cute gift recommendation cards.
5. Save or share a recommendation card.

The app should feel useful first, cute second. Cuteness must support the gift decision, not decorate unrelated screens.

## Product Direction for Apps in Toss

- Build as a React-based mobile webview mini app for Apps in Toss.
- Keep the first screen actionable, not a marketing landing page.
- Optimize for short sessions: users should get from entry to a recommendation in under one minute.
- Use white as the base surface color. Add soft accent colors only for tags, illustrations, states, and recommendation cards.
- Treat "cute" as a product mechanic:
  - preference tags as collectible stickers,
  - people as small gift-dex cards,
  - recommendations as shareable cards,
  - empty states as gentle prompts.
- Avoid manipulative UX. Do not block exits, force notifications, hide alternatives, or use unclear CTA labels.
- Use clear Korean UX writing in a casual but respectful tone.
- Prefer positive phrasing. Explain what users can do next instead of blaming missing input.

## Design System and UX References

Use **TDS Mobile** as the required UI foundation.

- Install and import from `@toss/tds-mobile`.
- Do not use deprecated `@toss-design-system/*` packages.
- Use TDS components for core controls such as buttons, list rows, text fields, tabs, bottom sheets, dialogs, and navigation-like surfaces.
- Use local app styling only for product-specific composition, illustrations, gift cards, and lightweight layout wrappers.

Reference the files in `ui-ux-guide/` before changing screens:

- `ui-ux-guide/mini-app-branding-guide.md`: branding, logo, display name, primary color, tab bar guidance.
- `ui-ux-guide/resolution.md`: mobile viewport, safe area, logical resolution, responsive behavior.
- `ui-ux-guide/graphic.md`: icon and illustration usage, visual hierarchy, graphic restraint.
- `ui-ux-guide/ux-wrighting.md`: Korean UX writing tone and CTA copy.
- `ui-ux-guide/dark-pattern-prevent-policy.md`: dark pattern prevention and exit/choice clarity.

Visual rules:

- White is the default background.
- Use one clear primary accent for brand actions, plus limited secondary tag colors.
- Keep cards compact and scannable. Cards should not be nested inside other cards.
- Use illustrations sparingly. One main visual per screen is usually enough.
- Icons should be 24-40px when used as UI aids.
- Respect safe areas and test narrow mobile screens.
- Design around a vertical logical resolution in the 360-420px width range.

## Technical Stack

Recommended stack:

- Runtime/build: Vite + React + TypeScript.
- UI: `@toss/tds-mobile`.
- Styling: TDS primitives first; CSS Modules or plain CSS for local layout if needed.
- Backend and database: Firebase.
- Auth: Firebase Auth, preferably anonymous auth for MVP unless Apps in Toss identity integration is added later.
- Database: Cloud Firestore.
- Storage: Firebase Storage only if user-generated images are added.
- Hosting/build output: static web build suitable for Apps in Toss webview submission.
- Testing: Vitest + React Testing Library for unit/component tests.
- E2E or smoke testing: Playwright for main mobile flows when the app becomes interactive.

Suggested Firebase collections:

- `users/{userId}`
- `users/{userId}/people/{personId}`
- `users/{userId}/people/{personId}/recommendations/{recommendationId}`

Recommended person profile fields:

- `name`
- `relationship`
- `favoriteColors`
- `favoriteAnimals`
- `favoriteStyles`
- `hobbies`
- `avoidItems`
- `preferredBudgetMin`
- `preferredBudgetMax`
- `specialDates`
- `createdAt`
- `updatedAt`

## Build and Test Commands

Use these commands once the React project is scaffolded:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

Recommended package scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

If Firebase emulators are configured later, add:

```bash
npm run firebase:emulators
```

Recommended script:

```json
{
  "scripts": {
    "firebase:emulators": "firebase emulators:start"
  }
}
```

## Code Rules

Follow the provided ESLint configuration from `/eslint.config.js`.

## Suggested Source Structure

```text
src/
  app/
  components/
  features/
    people/
    recommendations/
  firebase/
  styles/
    tokens.css
    global.css
  test/
    setup.ts
```

## MVP Acceptance Criteria

- A user can add at least one person.
- A user can save taste tags and avoid-item notes for that person.
- A user can choose an occasion and budget.
- The app shows at least three gift recommendations with reasons.
- The recommendation result can be saved locally or in Firestore.
- The UI uses TDS Mobile components for primary controls.
- The visual base is white and follows the local `ui-ux-guide/` guidance.
- `npm run lint`, `npm run build`, and `npm run test` pass before submission.
