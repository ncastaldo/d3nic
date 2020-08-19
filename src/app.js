/* import Chart from '@/js/chart.js'
import Component from '@/js/component.js'

import Rect from '@/js/rect.js'

// axis
import AxisComponent from '@/js/axis/axisComponent.js'
import BxAxis from '@/js/axis/bxAxis.js'
import ByAxis from '@/js/axis/byAxis.js'
import XAxis from '@/js/axis/xAxis.js'
import YAxis from '@/js/axis/yAxis.js'

// geo
import GeoChart from '@/js/geo/geoChart.js'
import GeoContours from '@/js/geo/geoContours.js'
import GeoHexbin from '@/js/geo/geoHexbin.js'
import GeoRegions from '@/js/geo/geoRegions.js'
import GeoSvgs from '@/js/geo/geoSvgs.js'
import GeoSymbols from '@/js/geo/geoSymbols.js'
import GeoTooltips from '@/js/geo/geoTooltips.js'

// xy
import XyChart from '@/js/xy/xyChart.js'
import XyContours from '@/js/xy/xyContours.js'
import XySymbols from '@/js/xy/xySymbols.js'

// polar
import PolarChart from '@/js/polar/polarChart.js'
import PolarComponent from '@/js/polar/polarComponent.js'

// polar - arc
import ArcBars from '@/js/polar/arc/arcBars.js'
import ArcMouseBisector from '@/js/polar/arc/arcMouseBisector.js'
import ArcChart from '@/js/polar/arc/arcChart.js'

// polar - sector
import SectorArea from '@/js/polar/sector/sectorArea.js'
import SectorBars from '@/js/polar/sector/sectorBars.js'
import SectorChart from '@/js/polar/sector/sectorChart.js'
import SectorLine from '@/js/polar/sector/sectorLine.js'
import SectorMouseBisector from '@/js/polar/sector/sectorMouseBisector.js'
import SectorVLines from '@/js/polar/sector/sectorVLines.js'

// band
import BandArea from '@/js/band/bandArea.js'
import BandBars from '@/js/band/bandBars.js'
import BandBoxPlots from '@/js/band/bandBoxPlots.js'
import BandChart from '@/js/band/bandChart.js'
import BandLine from '@/js/band/bandLine.js'
import BandBisector from '@/js/band/bandBisector.js'
import BandBrusher from '@/js/band/bandBrusher.js'
import BandVLines from '@/js/band/bandVLines.js'
import BandSymbols from '@/js/band/bandSymbols.js'
import BandAxis from '@/js/band/bandAxis.js'

// bb
import BbChart from '@/js/bb/bbChart.js'
import BbContours from '@/js/bb/bbContours.js'
import BbRects from '@/js/bb/bbRects.js' */

// TEST

import bbChart from './js_2/composite/bb/bbChart'
import bbCircles from './js_2/composite/bb/bbCircles'
import bbRects from './js_2/composite/bb/bbRects'

import baArea from './js_2/composite/ba/baArea'
import baAxisA from './js_2/composite/ba/baAxisA'
import baChart from './js_2/composite/ba/baChart'
import baCircles from './js_2/composite/ba/baCircles'
import baBars from './js_2/composite/ba/baBars'
import baCircle from './js_2/composite/ba/baCircle'
import baLine from './js_2/composite/ba/baLine'
import baMouseBars from './js_2/composite/ba/baMouseBars'

import baseChart from './js_2/composite/base/baseChart'
import basePaths from './js_2/composite/base/basePaths'
import baseLabelAxisX from './js_2/composite/base/baseLabelAxisX'

import brChart from './js_2/composite/br/brChart'
import brBars from './js_2/composite/br/brBars'

import bxChart from './js_2/composite/bx/bxChart'
import bxAxisX from './js_2/composite/bx/bxAxisX'
import bxAxisY from './js_2/composite/bx/bxAxisY'
import bxBars from './js_2/composite/bx/bxBars'
import bxBrush from './js_2/composite/bx/bxBrush'
import bxArea from './js_2/composite/bx/bxArea'
import bxLine from './js_2/composite/bx/bxLine'
import bxLines from './js_2/composite/bx/bxLines'
import bxCircles from './js_2/composite/bx/bxCircles'
import bxMouseBars from './js_2/composite/bx/bxMouseBars'

import byChart from './js_2/composite/by/byChart'
import byBars from './js_2/composite/by/byBars'
import byLines from './js_2/composite/by/byLines'
import byAxisX from './js_2/composite/by/byAxisX'
import byAxisY from './js_2/composite/by/byAxisY'
import byMouseBars from './js_2/composite/by/byMouseBars'

import geoChart from './js_2/composite/geo/geoChart'
import geoRegions from './js_2/composite/geo/geoRegions'

import xyChart from './js_2/composite/xy/xyChart'
import xyAxisX from './js_2/composite/xy/xyAxisX'
import xyAxisY from './js_2/composite/xy/xyAxisY'
import xyCircles from './js_2/composite/xy/xyCircles'
import xyLinesH from './js_2/composite/xy/xyLinesH'
import xyLinesV from './js_2/composite/xy/xyLinesV'
import xyTexts from './js_2/composite/xy/xyTexts'

// import { event } from 'd3-selection'

export {

  // TEST
  // chart,
  // xyChart,
  // event,

  bbChart,
  bbCircles,
  bbRects,

  baArea,
  baAxisA,
  baChart,
  baBars,
  baCircles,
  baCircle,
  baLine,
  baMouseBars,

  baseChart,
  basePaths,
  baseLabelAxisX,

  brChart,
  brBars,

  bxChart,
  bxAxisX,
  bxAxisY,
  bxBars,
  bxBrush,
  bxCircles,
  bxArea,
  bxLine,
  bxLines,
  bxMouseBars,

  byChart,
  byAxisX,
  byAxisY,
  byBars,
  byLines,
  byMouseBars,

  geoChart,
  geoRegions,

  xyChart,
  xyAxisX,
  xyAxisY,
  xyCircles,
  xyLinesH,
  xyLinesV,
  xyTexts

  /* Chart,
  Component,

  Rect,

  AxisComponent,
  BxAxis,
  ByAxis,
  XAxis,
  YAxis,

  GeoChart,
  GeoContours,
  GeoHexbin,
  GeoRegions,
  GeoSvgs,
  GeoSymbols,
  GeoTooltips,

  XyChart,
  XyContours,
  XySymbols,

  PolarChart,
  PolarComponent,

  ArcBars,
  ArcChart,
  ArcMouseBisector,

  SectorArea,
  SectorBars,
  SectorChart,
  SectorLine,
  SectorMouseBisector,
  SectorVLines,

  BandArea,
  BandAxis,
  BandBars,
  BandBoxPlots,
  BandChart,
  BandLine,
  BandBisector,
  BandBrusher,
  BandSymbols,
  BandVLines,

  BbChart,
  BbContours,
  BbRects */

}
