import type { FeatureCollection } from '@turf/turf'
import { nanoid } from 'nanoid'

interface Configuration {
  /**
   * If property values should be trimmed.
   * @default true
   */
  trim?: boolean
}

export class ShpParser {
  #shp: Uint8Array
  #dbf: Uint8Array
  #configuration?: Configuration
  #features: any[] = []
  #propertiesArray: any[] = []

  constructor(shp: Uint8Array, dbf: Uint8Array, configuration?: Configuration) {
    this.#shp = shp
    this.#dbf = dbf
    this.#configuration = configuration
  }

  #parseShp() {
    const dataView = new DataView(this.#shp.buffer)
    let idx = 0
    // fileCode
    dataView.getInt32(idx, false)
    const wordLength = dataView.getInt32(idx += 6 * 4, false)
    const byteLength = wordLength * 2
    // version
    dataView.getInt32(idx += 4, true)
    // shapeType
    dataView.getInt32(idx += 4, true)
    // minX
    dataView.getFloat64(idx += 4, true)
    // minY
    dataView.getFloat64(idx + 8, true)
    // maxX
    dataView.getFloat64(idx + 16, true)
    // maxY
    dataView.getFloat64(idx + 24, true)
    // minZ
    dataView.getFloat64(idx + 32, true)
    // maxZ
    dataView.getFloat64(idx + 40, true)
    // minM
    dataView.getFloat64(idx + 48, true)
    //
    dataView.getFloat64(idx + 56, true)
    idx += 8 * 8

    const features: any[] = []
    while (idx < byteLength) {
      const feature: any = {}
      // const number: number = dataView.getInt32(idx, false)
      const length: number = dataView.getInt32(idx += 4, false)
      try {
        const type: number = dataView.getInt32(idx += 4, true)
        let idxFeature: number = idx + 4
        // const byteLen: number = length * 2
        switch (type) {
          case 1:
          case 11:
          case 21:
            feature.type = 'Point'
            feature.coordinates = [
              dataView.getFloat64(idxFeature, true),
              dataView.getFloat64(idxFeature + 8, true),
            ]
            break
          case 3:
          case 13:
          case 23:
          case 5:
          case 15:
          case 25:
            if (type === 3 || type === 13 || type === 23)
              feature.type = 'LineString'
            else if (type === 5 || type === 15 || type === 25)
              feature.type = 'Polygon'

            // eslint-disable-next-line no-case-declarations
            const numberOfParts: number = dataView.getInt32(idxFeature + 32, true)
            // eslint-disable-next-line no-case-declarations
            const nbpoints: number = dataView.getInt32(idxFeature + 36, true)
            idxFeature += 40
            // eslint-disable-next-line no-case-declarations
            const nbpartsPoint: number[] = Array.from({ length: numberOfParts }).fill(0).map(() => {
              const result = dataView.getInt32(idxFeature, true)
              idxFeature += 4
              return result
            })

            feature.coordinates = Array.from({ length: numberOfParts }).fill(0).map((_, i) => {
              const idstart = nbpartsPoint[i]
              const idend = (i < numberOfParts - 1 ? nbpartsPoint[i + 1] : nbpoints) - 1
              const part = []
              for (let j = idstart; j <= idend; j++) {
                part.push([
                  dataView.getFloat64(idxFeature, true),
                  dataView.getFloat64(idxFeature + 8, true),
                ])
                idxFeature += 16
              }
              return part
            })
            break
          case 8:
          case 18:
          case 28:
            feature.type = 'MultiPoint'
            // eslint-disable-next-line no-case-declarations
            const numberOfPoints = dataView.getInt32(idxFeature + 32, true)
            idxFeature += 36
            feature.coordinates = Array.from({ length: numberOfPoints }).fill(0).map(() => {
              const result = [
                dataView.getFloat64(idxFeature, true),
                dataView.getFloat64(idxFeature + 8, true),
              ]
              idxFeature += 16
              return result
            })
            break
        }
      }
      catch (e) { }
      idx += length * 2
      features.push(feature)
    }
    this.#features = features
  }

  #parseDbf() {
    const dataView = new DataView(this.#dbf.buffer)
    let idx = 4
    const numberOfRecords: number = dataView.getInt32(idx, true)
    idx += 28
    let end: boolean = false
    const fields = []
    try {
      while (true) {
        const field: any = {}
        const nameArray: string[] = []
        for (let i = 0; i < 10; i++) {
          const letter = dataView.getUint8(idx)
          if (letter !== 0)
            nameArray.push(String.fromCharCode(letter))

          idx += 1
        }
        field.name = nameArray.join('')
        idx += 1
        field.type = String.fromCharCode(dataView.getUint8(idx))
        idx += 5
        field.fieldLength = dataView.getUint8(idx)
        idx += 16
        fields.push(field)
        if (dataView.getUint8(idx) === 0x0D)
          break
      }
    }
    catch (err) {
      end = true
    }
    idx += 1
    const propertiesArray = []
    for (let i = 0; i < numberOfRecords; i++) {
      const properties: any = {}
      if (!end) {
        try {
          idx += 1
          for (let j = 0; j < fields.length; j++) {
            let str = ''
            const charString = []
            for (let h = 0; h < fields[j].fieldLength; h++) {
              charString.push(String.fromCharCode(dataView.getUint8(idx)))
              idx += 1
            }
            str = charString.join('')
            // }
            if (this.#configuration?.trim !== false)
              str = str.trim()

            const number = Number.parseFloat(str)
            if (Number.isNaN(number))
              properties[fields[j].name] = str
            else
              properties[fields[j].name] = number
          }
        }
        catch (err) {
          end = true
        }
      }
      propertiesArray.push(properties)
    }
    this.#propertiesArray = propertiesArray
  }

  #geoJSON() {
    const geojson: any = {
      type: 'FeatureCollection',
      features: [],
    }
    for (let i = 0; i < Math.min(this.#features.length, this.#propertiesArray.length); i++) {
      geojson.features.push({
        type: 'Feature',
        geometry: this.#features[i],
        properties: this.#propertiesArray[i],
      })
    }
    return geojson
  }

  parse() {
    this.#parseShp()
    this.#parseDbf()

    return this.#geoJSON()
  }
}

export function shp2geojson(shpGeojson: FeatureCollection) {
  shpGeojson.features.forEach((feature) => {
    const id = nanoid()
    feature.properties = {
      ...feature.properties,
      id: feature.properties?.id || feature.id || id,
      name: feature.properties?.name || id,
      visibility: true,
    }
  })
  return shpGeojson
}
