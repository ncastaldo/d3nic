import { geoMercator } from 'd3-geo'

const hasGeoProjection = (state = {}) => {
  const fnGeoProjection = geoMercator()

  let geoDomainObject

  // default something

  const self = {
    ...state,
    fnGeoProjection: () => {
      return fnGeoProjection
    }
  }

  const computeGeoDomainObject = (chart) => {
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

  const updateGeoDomainObject = (chart) => {
    computeGeoDomainObject(chart)
    fnGeoProjection.fitExtent(chart.extent(), geoDomainObject)
  }

  const updateExtent = (chart) => {
    fnGeoProjection.fitExtent(chart.extent(), geoDomainObject)
  }

  self.subscribe('data', updateGeoDomainObject)
  self.subscribe('components', updateGeoDomainObject)
  self.subscribe('size', updateExtent)
  self.subscribe('padding', updateExtent)

  return self
}

export { hasGeoProjection }
