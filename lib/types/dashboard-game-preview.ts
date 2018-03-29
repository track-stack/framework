interface DashboardGamePreviewPlayer {
  id: number,
  name: string,
  image: string
}

export default class DashboardGamePreview {
  viewersTurn: boolean
  status: number
  gameId: number
  opponent: DashboardGamePreviewPlayer

  constructor(viewersTurn: boolean, status: number, gameId: number, opponent: DashboardGamePreviewPlayer) {
    this.viewersTurn = viewersTurn
    this.status = status
    this.gameId = gameId
    this.opponent = opponent
  }

  static from(json: any): DashboardGamePreview {
    const viewersTurn = json.viewers_turn
    const status = json.status
    const gameId = json.game_id
    const opponent: DashboardGamePreviewPlayer = {
      id: json.opponent.id,
      name: json.opponent.name,
      image: json.opponent.image
    }
    return new DashboardGamePreview(viewersTurn, status, gameId, opponent)
  }
}