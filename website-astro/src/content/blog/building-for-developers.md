---
title: 'Building software that developers actually love'
description: 'Developer experience is the sum of all interactions a developer has with your product. Here is how I think about building great DX from the ground up.'
date: '12th Feb 2025'
views: '9,241'
featured: true
---

Developer experience has become one of the most overloaded terms in the industry. Everyone says they care about it, yet so few products actually deliver it. After years of building tools used by thousands of developers, I have developed a working definition and a set of principles I keep returning to.

## What DX actually means

DX is not just good documentation, though documentation matters. It is not just a clean API, though a clean API is table stakes. DX is the sum of every interaction a developer has with your product — from the moment they first hear about it, through install, through their first working example, through debugging at 2am, through upgrading to the next major version.

Every one of those touchpoints either builds trust or erodes it. There are no neutral interactions.

## The pit of success

The best DX tools are designed around what Russ Cox calls the "pit of success" — making the right thing easy and the wrong thing hard. This is harder than it sounds. It requires you to have strong opinions about what "right" looks like and to encode those opinions into the tool itself.

```ts
// Bad DX: easy to do the wrong thing
const result = await fetch(url);
const data = result.json(); // forgot await, silent bug

// Good DX: the API makes the mistake harder
const data = await fetchJson(url); // single call, always returns parsed data
```

## Feedback loops are everything

The fastest way to improve DX is to shorten the feedback loop between action and result. This is why hot module replacement changed frontend development more than any API redesign. When a developer can see the result of their change in under 100ms, they are in a different mental state entirely — exploratory, playful, confident.

Invest ruthlessly in the inner loop. Every second you shave off the edit-run-see cycle compounds across millions of developer-hours.

## Error messages are part of the product

Nothing breaks trust faster than a cryptic error message. When something goes wrong, the error message is your product speaking directly to the developer. It should be honest, specific, and actionable.

A great error message answers three questions: what happened, why it happened, and what to do about it. If your error messages only answer the first question, you have DX work to do.
