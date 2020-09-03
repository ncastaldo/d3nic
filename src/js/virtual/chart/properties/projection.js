import {
  geoEquirectangular,
  geoMercator
} from 'd3-geo'

const geoProjections = {
  geoEquirectangular,
  geoMercator
}

const hasGeoProjection = (state = {}) => {
  let geoProjectionType = Object.keys(geoProjections)[0]
  let geoDomainObject

  // default something

  const getGeoProjectionType = (maybe) => {
    return maybe in geoProjections
      ? maybe : geoProjectionType
  }

  const self = {
    ...state,
    geoProjectionType (value) {
      if (typeof value === 'undefined') return geoProjectionType
      geoProjectionType = getGeoProjectionType(value)
    },
    fnGeoProjection () {
      return geoProjections[geoProjectionType]()
        .fitExtent(self.extent(), geoDomainObject)
    }
  }

  const updateGeoDomainObject = () => {
    const componentProperties = self.components()
      .filter(c => 'values' in c)
      .map(c => ({
        values: c.values(),
        defined: c.defined()
      }))

    const geometries = self.data()
      .map((d, i) => componentProperties
        // for coherency
        .filter(prop => typeof prop.defined === 'function'
          ? prop.defined(d, i)
          : prop.defined)
        .map(prop => prop.values)
        .flat()
        .map(fn => typeof fn === 'function' ? fn(d, i) : fn))
      .flat()

    geoDomainObject = {
      type: 'GeometryCollection',
      geometries
    }
  }

  self.subscribe('data', 'components', updateGeoDomainObject)

  return self
}

export { hasGeoProjection }
