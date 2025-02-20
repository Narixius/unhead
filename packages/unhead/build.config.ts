import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  hooks: {
    'rollup:options': (_, options) => {
      options.experimentalLogSideEffects = true
    },
  },
  entries: [
    { input: 'src/index', name: 'index' },
    { input: 'src/plugins/index', name: 'plugins' },
    { input: 'src/server/index', name: 'server' },
    { input: 'src/client/index', name: 'client' },
    { input: 'src/scripts/index', name: 'scripts' },
    { input: 'src/legacy', name: 'legacy' },
    { input: 'src/types', name: 'types' },
    { input: 'src/utils', name: 'utils' },
  ],
})
