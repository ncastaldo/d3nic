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
    const fnsValue = chart.components()
      .map(c => 'fnsValue' in c ? c.fnsValue() : [])
      .flat()

    const geometries = chart.data()
      .map((d, i) => fnsValue.map(fn => fn(d, i)))
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
