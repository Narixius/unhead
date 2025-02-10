import type { NodeRelation, Thing } from '../../types'
import type { PostalAddress } from '../PostalAddress'
import { defineSchemaOrgResolver, resolveRelation } from '../../util'
import { addressResolver } from '../PostalAddress'

export interface PlaceSimple extends Thing {
  '@type'?: 'Place'
  'name': string
  'address': NodeRelation<PostalAddress | string>
  'latitude'?: number | string
  'longitude'?: number | string
}

export interface Place extends PlaceSimple {}

/**
 * Describes a HowTo guide, which contains a series of steps.
 */
export const placeResolver = /* @__PURE__ */ defineSchemaOrgResolver<Place>({
  defaults: {
    '@type': 'Place',
  },
  resolve(node, ctx) {
    if (typeof node.address !== 'string')
      node.address = resolveRelation(node.address, ctx, addressResolver)
    return node
  },
})
