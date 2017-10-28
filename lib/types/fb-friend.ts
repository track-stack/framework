/*jshint esversion: 6 */

interface FBPictureData {
  data: {
      url: string
  }
}

export default class Friend {
    id: string
    name: string
    picture: FBPictureData

    constructor(id: string, name: string, picture: FBPictureData) {
      this.id = id
      this.name = name
      this.picture = picture
    }

    static from(json: any): Friend {
        return new Friend(json.id, json.name, json.picture)
    }
}