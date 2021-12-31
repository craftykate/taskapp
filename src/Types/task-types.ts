export type TagType = {
  id: number
  emoji?: string
  text: string
  order: number
  isVisible: boolean
}

export type TaskType = {
  id: number
  text: string
  order: { [key: string]: number }
  createdAt: number
  completedAt: number | false
}
