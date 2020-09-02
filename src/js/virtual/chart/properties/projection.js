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
        .fitExtent(this.extent(), geoDomainObject)
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

  self.subscribe('data', 'components', updateGeoDomainObject)

  return self
}

export { hasGeoProjection }
