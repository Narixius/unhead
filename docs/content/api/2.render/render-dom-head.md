---
title: renderDOMHead
description: Render the head to the DOM.
---

**Type:**

```ts
function renderDOMHead<T extends Unhead<any>>(head: T, options: RenderDomHeadOptions = {}): void
```

```ts
interface RenderDomHeadOptions {
  /**
   * Document to use for rendering. Allows stubbing for testing.
   */
  document?: Document
}
```

Render the head to the DOM.

This is useful for when you want to render the tags to the DOM immediately.

## Example

```ts
import { renderDOMHead } from '@unhead/dom'
import { createHead } from 'unhead'

const head = createHead()

head.push({ title: 'Hello World ' })

renderDOMHead(head)
```
