/*jshint esversion: 6 */

export function lastFMResponseVerifier(json): any[] {

  // Bail early if the response lacks the required json structure
  const foundTracks = json && json.results && json.results.trackmatches
  if (!foundTracks) {
    console.log('%c    No match found', 'color: #A62F2F')
    window.Logger.log('    No match found')
    console.groupEnd()
    return []
  }

  // Bail early if the results are empty
  const tracks: any[] = json.results.trackmatches.track;
  if (tracks.length == 0) {
    console.log('%c    No match found', 'color: #A62F2F')
    window.Logger.log('    No match found')
    console.groupEnd()
    return []
  }

  return tracks
}
