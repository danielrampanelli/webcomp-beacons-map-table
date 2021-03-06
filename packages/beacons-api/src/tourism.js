export async function getNearestTourismPOI(latitude, longitude) {
  var url = 'https://tourism.opendatahub.bz.it/api/ODHActivityPoi?latitude={{LAT}}&longitude={{LNG}}&radius={{RDS}}'
  url = url.replace('{{LAT}}', latitude)
  url = url.replace('{{LNG}}', longitude)
  url = url.replace('{{RDS}}', 50000)

  let response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json'
    })
  })

  let json = await response.json()

  if (!!json.Items && json.Items.length >= 1) {
    let item = json.Items[0]

    let poi = {
      id: item.Id,
      name: item.Shortname,
      type: null,
      municipality: null,
      district: null,
      latitude: null,
      longitude: null,
      distance: null
    }

    if (!!item.AdditionalPoiInfos && !!item.AdditionalPoiInfos.en) {
      poi.type = item.AdditionalPoiInfos.en.MainType
    }

    if (!!item.LocationInfo.MunicipalityInfo) {
      poi.municipality = item.LocationInfo.MunicipalityInfo.Name.en
    }

    if (!!item.LocationInfo.DistrictInfo) {
      poi.district = item.LocationInfo.DistrictInfo.Name.en
    }

    if (!!item.GpsPoints && !!item.GpsPoints.position) {
      poi.latitude = item.GpsPoints.position.Latitude
      poi.longitude = item.GpsPoints.position.Longitude
    }

    if (typeof item.DistanceLength !== 'undefined') {
      poi.distance = item.DistanceLength
    }

    return poi
  }

  return null
}