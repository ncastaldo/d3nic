import * as geo from 'd3-geo'

const geoProjectionTypes = [
  'geoEquirectangular',
  'geoMercator'
]

const hasGeoProjection = (state = {}) => {
  let geoProjectionType = geoProjectionTypes[0]
  let geoDomainObject
  let geoExtent

  // default something

  const getGeoProjectionType = (maybe) => {
    return geoProjectionTypes.includes(maybe)
      ? maybe : geoProjectionType
  }

  const self = {
    ...state,
    geoProjectionType: (value) => {
      if (typeof value === 'undefined') return geoProjectionType
      geoProjectionType = getGeoProjectionType(value)
    },
    fnGeoProjection: () => {
      return geo[geoProjectionType]()
        .fitExtent(geoExtent, geoDomainObject)
    }
  }

  const updateGeoDomainObject = (chart) => {
    const componentProperties = chart.components()
      .filter(c => 'fnsValue' in c)
      .map(c => ({
        fnsValue: c.fnsValue(),
        fnDefined: c.fnDefined()
      }))

    const geometries = chart.data()
      .map((d, i) => componentProperties
        .filter(prop => prop.fnDefined(d, i))
        .map(prop => prop.fnsValue)
        .flat()
        .map(fn => fn(d, i)))
      .flat()

    geoDomainObject = {
      type: 'GeometryCollection',
      geometries
    }
  }

  const updateGeoExtent = (chart) => {
    geoExtent = chart.extent()
  }

  self.subscribe('data', updateGeoDomainObject)
  self.subscribe('components', updateGeoDomainObject)
  self.subscribe('size', updateGeoExtent)
  self.subscribe('padding', updateGeoExtent)

  return self
}

export { hasGeoProjection }
