<h1 align='center'>Unhead</h1>

<p align="center">
<a href='https://github.com/unjs/unhead/actions/workflows/test.yml'>
</a>
<a href="https://www.npmjs.com/package/unhead" target="__blank"><img src="https://img.shields.io/npm/v/unhead?style=flat&colorA=002438&colorB=28CF8D" alt="NPM version"></a>
<a href="https://www.npmjs.com/package/unhead" target="__blank"><img alt="NPM Downloads" src="https://img.shields.io/npm/dm/unhead?flat&colorA=002438&colorB=28CF8D"></a>
<a href="https://github.com/unjs/unhead" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/unjs/unhead?flat&colorA=002438&colorB=28CF8D"></a>
</p>

<p align="center">
Universal document &lt;head&gt tag manager. Tiny, adaptable and full featured.
</p>

<p align="center">
<table>
<tbody>
<td align="center">
<img width="800" height="0" /><br>
<i>Status:</i> <a href="https://github.com/unjs/unhead/releases/tag/v1.9.0">v1.9 Released</a></b> <br>
<sup> Please report any issues 🐛</sup><br>
<sub>Made possible by my <a href="https://github.com/sponsors/harlan-zw">Sponsor Program 💖</a><br> Follow me <a href="https://twitter.com/harlan_zw">@harlan_zw</a> 🐦 • Join <a href="https://discord.gg/275MBUBvgP">Discord</a> for help</sub><br>
<img width="800" height="0" />
</td>
</tbody>
</table>
</p>

## Highlights

- 🌳 Powerful pluggable core with a tiny footprint
- 🍣 All the good stuff: deduping, sorting, title templates, template params, etc.
- 🪨 Rock-solid DOM updates, fast and tiny (~1kB minzipped)
- 🚀 Add-ons for extra oomph: Capo.js, Tree-shaking, `useSeoMeta`, `useScript`, etc.
- 💎 Fully typed with MDN docs
- 🤝 Used by [Nuxt](https://nuxt.com/) with more framework support coming soon.

## Docs

Visit the [documentation site](https://unhead.unjs.io/) for guides and API references.

## Install

```bash
npm i unhead
```

### Quick Setup

Create the head client somewhere in your root application.

```ts
import { createHead } from 'unhead'

createHead()
```

Then use the composables anywhere you want.

```ts
// pages/about.js
import { useHead } from 'unhead'

useHead({
  title: 'About',
  meta: [
    { name: 'description', content: 'Learn more about us.' },
  ],
})
```

## Demos

- [StackBlitz - Vue SPA](https://stackblitz.com/edit/vitejs-vite-uijgqa?file=package.json)

## Sponsors

<p align="center">
  <a href="https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg">
    <img src='https://raw.githubusercontent.com/harlan-zw/static/main/sponsors.svg'/>
  </a>
</p>

## License

MIT License © 2022-PRESENT [Harlan Wilton](https://github.com/harlan-zw)
