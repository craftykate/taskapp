// Packages
import React from 'react'
import { set, get } from 'idb-keyval'
// Types
import { TagType, TaskType } from 'Types/task-types'
// Utils
import config from 'Utils/Config/config'

// Type the variables and functions that are defined in the context that can be
// used by other components
type TasksContextType = {
  allTasks: TaskType[]
  allTags: TagType[]
  addTask: (text: string, tags: number[]) => void
  toggleTagVisibility: (id: number) => void
  deleteTask: (id: number) => void
  completeTask: (id: number) => void
  addTag: (emoji: string, text: string) => void
  deleteTag: (id: number) => void
  sortTags: (tags: TagType[]) => void
  resetAll: () => void
  itemToEdit: number | undefined
  setItemToEdit: (id?: number) => void
  showAddEditForm: boolean
  setShowAddEditForm: (arg1: boolean) => void
  updateTask: (id: number, text: string, tags: number[]) => void
}

// Create the context with starting values
const TasksContext = React.createContext<TasksContextType>({
  allTasks: [],
  allTags: [],
  addTask: (text: string, tags: number[]) => {},
  toggleTagVisibility: (id: number) => {},
  deleteTask: (id: number) => {},
  completeTask: (id: number) => {},
  addTag: (emoji: string, text: string) => {},
  deleteTag: (id: number) => {},
  sortTags: () => {},
  resetAll: () => {},
  itemToEdit: undefined,
  setItemToEdit: (id?: number) => {},
  showAddEditForm: false,
  setShowAddEditForm: (arg1: boolean) => {},
  updateTask: (id: number, text: string, tags: number[]) => {},
})

// Custom provider
export const TasksContextProvider: React.FC = ({ children }) => {
  const [allTasks, setAllTasks] = React.useState<TaskType[]>([])
  const [allTags, setAllTags] = React.useState<TagType[]>([])
  const [itemToEdit, setItemToEdit] = React.useState<number | undefined>()
  const [showAddEditForm, setShowAddEditForm] = React.useState<boolean>(false)

  // Add a task
  const addTask = (text: string, tags: number[]) => {
    const id = +`${new Date().getTime()}${
      Math.floor(Math.random() * 899) + 100
    }`
    const newItem: TaskType = {
      id,
      text,
      tags: tags,
      createdAt: new Date().getTime(),
      completedAt: false,
    }
    setAllTasks((prevState) => {
      set('kt-tasks', [...prevState, newItem])
      return [...prevState, newItem]
    })
  }

  // Save details of a task
  const updateTask = (id: number, text: string, tags: number[]) => {
    setAllTasks((prevState) => {
      // Make a copy of the most recent state
      const prevStateCopy = [...prevState]

      // Find index of item needing to be updated
      const itemIndex = prevStateCopy.findIndex((item) => item.id === id)

      // Copy over old item with new item, with updated params
      prevStateCopy[itemIndex] = {
        ...prevStateCopy[itemIndex],
        text,
        tags,
      }

      set('kt-tasks', [...prevStateCopy])

      // Return copy of updated copy
      return [...prevStateCopy]
    })
  }

  // Mark a task as complete
  const completeTask = (id: number) => {
    setAllTasks((prevState) => {
      // Make a copy of the most recent state
      const prevStateCopy = [...prevState]

      // Find index of item needing to be updated
      const itemIndex = prevStateCopy.findIndex((item) => item.id === id)

      // Figure out what new param value should be based on old one
      const updatedCompletedAt =
        prevStateCopy[itemIndex].completedAt === false
          ? new Date().getTime()
          : false

      // Copy over old item with new item, with updated param
      prevStateCopy[itemIndex] = {
        ...prevStateCopy[itemIndex],
        completedAt: updatedCompletedAt,
      }

      set('kt-tasks', [...prevStateCopy])

      // Return copy of updated copy
      return [...prevStateCopy]
    })
  }

  // Delete a task
  // Note: not using filter here or all duplicates would be deleted which may
  // not be intended
  const deleteTask = (id: number) => {
    setAllTasks((prevState) => {
      const prevStateCopy = [...prevState]
      const deleteId = prevStateCopy.findIndex((item) => item.id === id)
      prevStateCopy.splice(deleteId, 1)
      set('kt-tasks', [...prevStateCopy])
      return [...prevStateCopy]
    })
  }

  // Add a tag
  const addTag = (emoji: string, text: string) => {
    const id = +`${new Date().getTime()}${
      Math.floor(Math.random() * 899) + 100
    }`
    const order = allTags.length
    const newTag: TagType = {
      id,
      emoji,
      text,
      order,
      isVisible: true,
    }
    setAllTags((prevState) => {
      set('kt-tags', [...prevState, newTag])
      return [...prevState, newTag]
    })
  }

  // Set whether tag's tasks should be visible or hidden
  const toggleTagVisibility = (id: number) => {
    setAllTags((prevState) => {
      // Make a copy of the most recent state
      const prevStateCopy = [...prevState]

      // Find index of item needing to be updated
      const itemIndex = prevStateCopy.findIndex((item) => item.id === +id)

      // Figure out what new param value should be based on old one
      const updatedVisibility = !prevStateCopy[itemIndex].isVisible

      // Copy over old item with new item, with updated param
      prevStateCopy[itemIndex] = {
        ...prevStateCopy[itemIndex],
        isVisible: updatedVisibility,
      }

      set('kt-tags', [...prevStateCopy])

      // Return copy of updated copy
      return [...prevStateCopy]
    })
  }

  // When tags are dragged around, make sure they are saved to local storage
  const sortTags = (tags: TagType[]) => {
    set('kt-tags', tags)
    setAllTags(tags)
  }

  // Delete tag - will remove tag id from any task that has it first
  const deleteTag = (id: number) => {
    // Remove tag from tasks
    setAllTasks((prevState) => {
      const updatedTasks = prevState.map((item) => {
        if (item.tags.includes(id)) {
          item.tags = item.tags.filter((tagId) => tagId !== id)
        }
        return item
      })
      return [...updatedTasks]
    })

    // Remove tag
    setAllTags((prevState) => {
      const prevStateCopy = [...prevState]
      const deleteId = prevStateCopy.findIndex((item) => item.id === id)
      prevStateCopy.splice(deleteId, 1)
      set('kt-tags', [...prevStateCopy])
      return [...prevStateCopy]
    })
  }

  // Reset all tasks and tags
  const resetAll = () => {
    const tags: TagType[] = [
      {
        id: 1640387991734,
        text: 'Now',
        emoji: '🔴',
        order: 0,
        isVisible: true,
      },
      {
        id: 1640388007034,
        text: 'Soon',
        emoji: '🟠',
        order: 1,
        isVisible: true,
      },
      {
        id: 1640388021078,
        text: 'Someday',
        emoji: '🟢',
        order: 2,
        isVisible: true,
      },
      {
        id: 1640902406334,
        text: 'Chores',
        emoji: '🏠',
        order: 3,
        isVisible: true,
      },
    ]
    const tasks = config.defaultTasks || []
    set('kt-tags', tags)
    set('kt-tasks', tasks)
    setAllTags(tags)
    setAllTasks(tasks)
  }

  // When component loads the first time get to dos and tags, if any from local
  // storage
  React.useEffect(() => {
    get('kt-tags').then((storedTags) => {
      // Fetch tags
      const tags: TagType[] = storedTags || [
        {
          id: 1640387991734,
          text: 'Now',
          emoji: '🔴',
          order: 0,
          isVisible: true,
        },
        {
          id: 1640388007034,
          text: 'Soon',
          emoji: '🟠',
          order: 1,
          isVisible: true,
        },
        {
          id: 1640388021078,
          text: 'Someday',
          emoji: '🟢',
          order: 2,
          isVisible: true,
        },
        {
          id: 1640902406334,
          text: 'Chores',
          emoji: '🏠',
          order: 3,
          isVisible: true,
        },
      ]

      if (!storedTags) set('kt-tags', tags)
      setAllTags(tags)
    })

    get('kt-tasks').then((storedTasks) => {
      // Fetch Tasks
      const tasks = storedTasks
        ? storedTasks
        : config.defaultTasks
        ? [...config.defaultTasks]
        : []
      if (!storedTasks) set('kt-tasks', tasks)
      setAllTasks(tasks)
    })
  }, [])

  const contextValue: TasksContextType = {
    allTasks,
    allTags,
    addTask,
    toggleTagVisibility,
    deleteTask,
    completeTask,
    addTag,
    deleteTag,
    sortTags,
    resetAll,
    itemToEdit,
    setItemToEdit,
    showAddEditForm,
    setShowAddEditForm,
    updateTask,
  }
  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  )
}

export default TasksContext
