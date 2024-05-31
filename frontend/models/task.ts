export default interface Task {
  id: string
  content: string
  isDone: boolean
  dateCreated: string
  dateUpdated: string
}

export class TaskClass {
  id = ""
  content = ""
  isDone = false
  dateCreated = ""
  dateUpdated = ""
}