---
title: renderSSRHead
description: Render Unhead to a string that be can be server side rendered.
---

**Type:**

```ts
function renderSSRHead<T extends Record<string, any>>(head: Unhead<T>): Promise<SSRHeadPayload>
```

```ts
export interface SSRHeadPayload {
  headTags: string
  bodyTags: string
  bodyTagsOpen: string
  htmlAttrs: string
  bodyAttrs: string
}
```

Render Unhead to a string that can be server side rendered.

This is useful for when you want to render the tags to a string that can be used in SSR.

## Example

```ts
import { renderSSRHead } from '@unhead/ssr'
import { createHead } from 'unhead'

const head = createHead()

head.push({ title: 'Hello World ' })

// requires top-level await
const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(head)

return `
<!DOCTYPE html>
<html ${htmlAttrs}>
  <head>
    ${headTags}
  </head>
  <body ${bodyAttrs}>
    ${bodyTagsOpen}
    <div id="app"></div>
    ${bodyTags}
  </body>
</html>
`
