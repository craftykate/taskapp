// Packages
import React from 'react'
import { set, get } from 'idb-keyval'
// Types
import { TagType, TaskType } from 'Types/task-types'

// Type the variables and functions that are defined in the context that can be
// used by other components
type TasksContextType = {
  allTasks: TaskType[]
  allTags: TagType[]
  addTask: (text: string, tags: string[]) => void
  toggleTagVisibility: (id: number) => void
  deleteTask: (id: number) => void
  completeTask: (id: number) => void
  addTag: (emoji: string, text: string) => void
  deleteTag: (id: number) => void
  sortTags: (tags: TagType[]) => void
  sortTasks: (tasks: TaskType[]) => void
  resetAll: () => void
  itemToEdit: number | undefined
  setItemToEdit: (id?: number) => void
  showAddEditForm: boolean
  setShowAddEditForm: (arg1: boolean) => void
  updateTask: (id: number, text: string, tags: string[]) => void
}

// Create the context with starting values
const TasksContext = React.createContext<TasksContextType>({
  allTasks: [],
  allTags: [],
  addTask: (text: string, tags: string[]) => {},
  toggleTagVisibility: (id: number) => {},
  deleteTask: (id: number) => {},
  completeTask: (id: number) => {},
  addTag: (emoji: string, text: string) => {},
  deleteTag: (id: number) => {},
  sortTags: (tags: TagType[]) => {},
  sortTasks: (tasks: TaskType[]) => {},
  resetAll: () => {},
  itemToEdit: undefined,
  setItemToEdit: (id?: number) => {},
  showAddEditForm: false,
  setShowAddEditForm: (arg1: boolean) => {},
  updateTask: (id: number, text: string, tags: string[]) => {},
})

// Custom provider
export const TasksContextProvider: React.FC = ({ children }) => {
  const [allTasks, setAllTasks] = React.useState<TaskType[]>([])
  const [allTags, setAllTags] = React.useState<TagType[]>([])
  const [itemToEdit, setItemToEdit] = React.useState<number | undefined>()
  const [showAddEditForm, setShowAddEditForm] = React.useState<boolean>(false)

  // Sets the order so item is at the end of every tag assigned
  const addTaskToEnd = (tags: string[]) => {
    let order = {}
    tags.forEach((tag) => {
      const matchingTags = allTasks.filter((task) =>
        Object.keys(task.order).includes(tag)
      )
      order = {
        ...order,
        [tag]: matchingTags.length,
      }
    })

    return order
  }

  // Re-sorts the tasks of a given tag so their sort orders match their index
  const updateSortOrder = (tasks: TaskType[], tag: string) => {
    const matchingItems = tasks.filter((task) =>
      Object.keys(task.order).includes(tag)
    )
    matchingItems.sort((a, b) => a.order[tag] - b.order[tag])
    const updatedItems = tasks.map((task) => {
      const index = matchingItems.findIndex((item) => item.id === task.id)
      let order = { ...task.order }
      if (index !== -1) {
        order = { ...order, [tag]: index }
      }
      return { ...task, order }
    })

    return updatedItems
  }

  // Add a task
  const addTask = (text: string, tags: string[]) => {
    // Create id
    const id = +`${new Date().getTime()}${
      Math.floor(Math.random() * 899) + 100
    }`
    // If no tags assigned, assign it to uncategorized tag
    tags = tags.length === 0 ? ['0'] : tags
    // Determine order under each tag
    const order = addTaskToEnd(tags)

    const newItem: TaskType = {
      id,
      text,
      order,
      createdAt: new Date().getTime(),
      completedAt: false,
    }
    setAllTasks((prevState) => {
      set('kt-tasks', [...prevState, newItem])
      return [...prevState, newItem]
    })
  }

  // Save details of a task
  const updateTask = (id: number, text: string, tags: string[]) => {
    setAllTasks((prevState) => {
      // Make a copy of the most recent state
      let prevStateCopy = [...prevState]

      // Find index of item needing to be updated
      const itemIndex = prevStateCopy.findIndex((item) => item.id === id)
      const prevItem = prevStateCopy[itemIndex]

      // Update item's text
      prevStateCopy[itemIndex] = {
        ...prevStateCopy[itemIndex],
        text,
      }

      // Update sort order
      let order = { ...prevItem.order }

      // If a task used to not have tags and now does, remove the blank
      if (tags.includes('0') && tags.length > 1) {
        delete order['0']
        prevStateCopy[itemIndex] = { ...prevStateCopy[itemIndex], order }
      }

      // If a tag was added, add task to end of that list
      tags.forEach((tag) => {
        if (tag !== '0') {
          if (!Object.keys(order).includes(tag.toString())) {
            const matchingItems = prevState.filter((item) =>
              Object.keys(item.order).includes(tag.toString())
            )
            order = {
              ...order,
              [tag.toString()]: matchingItems.length,
            }
          }
          prevStateCopy[itemIndex] = { ...prevStateCopy[itemIndex], order }
        }
      })

      // If a tag was removed, remove that tag from task and re-sort all tasks
      // that also have that task
      Object.keys(prevItem.order).forEach((oldTag) => {
        if (oldTag !== '0' && !tags.includes(oldTag)) {
          delete order[oldTag]
        }
        prevStateCopy[itemIndex] = { ...prevStateCopy[itemIndex], order }
        prevStateCopy = updateSortOrder(prevStateCopy, oldTag)
      })

      // If tag used to have tags and now doesn't, add in the blank
      if (!Object.keys(prevItem.order).includes('0') && tags.length === 0) {
        order = addTaskToEnd(['0'])
        prevStateCopy[itemIndex] = { ...prevStateCopy[itemIndex], order }
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
      let prevStateCopy = [...prevState]
      const deleteId = prevStateCopy.findIndex((item) => item.id === id)
      const order = { ...prevStateCopy[deleteId].order }
      prevStateCopy.splice(deleteId, 1)

      Object.keys(order).forEach((oldTag) => {
        prevStateCopy = updateSortOrder(prevStateCopy, oldTag)
      })

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

  // When tags are dragged around, make sure they are saved
  const sortTags = (tags: TagType[]) => {
    set('kt-tags', tags)
    setAllTags(tags)
  }

  // When tasks are dragged around, make sure they are saved
  const sortTasks = (tasks: TaskType[]) => {
    set('kt-tasks', tasks)
    setAllTasks(tasks)
  }

  // Delete tag - will remove tag id from any task that has it first
  const deleteTag = (id: number) => {
    // Remove tag from tasks
    setAllTasks((prevState) => {
      const updatedTasks = prevState.map((item) => {
        if (Object.keys(item.order).includes(id.toString())) {
          delete item.order[id.toString()]
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
        id: 1640388007034,
        text: 'Soon',
        emoji: '🟠',
        order: 1,
        isVisible: true,
      },
      {
        id: 1640387991734,
        text: 'Now',
        emoji: '🔴',
        order: 0,
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
      {
        id: 0,
        text: 'Uncategorized',
        order: -1,
        isVisible: true,
      },
    ]
    const tasks: TaskType[] = [
      {
        id: 1640554950187,
        text: '👍 Tap me to mark me as complete',
        order: {
          1640387991734: 0,
        },
        createdAt: 1640554950187,
        completedAt: false,
      },
      {
        id: 1640554970171,
        text: "🙊 Oops, I'm not done - tap me to undo!",
        order: {
          '1640388007034': 0,
        },
        createdAt: 1640554970171,
        completedAt: 1640554989232,
      },
      {
        id: 1640554999417,
        text: '👉 Click my X to delete me',
        order: {
          '1640388021078': 0,
        },
        createdAt: 1640554999417,
        completedAt: false,
      },
      {
        id: 1640554999689,
        text: '👈 Click my pencil to edit me',
        order: {
          '1640388021078': 1,
        },
        createdAt: 1640554999689,
        completedAt: false,
      },
      {
        id: 1640555006143,
        text: 'Click the V 👆 to hide these tasks',
        order: {
          '1640902406334': 0,
        },
        createdAt: 1640555006143,
        completedAt: false,
      },
      {
        id: 1640555009713,
        text: '😎 You can have tasks with multiple tags!',
        order: {
          '1640388007034': 1,
          '1640902406334': 1,
        },
        createdAt: 1640555009713,
        completedAt: false,
      },
      {
        id: 1640555021024,
        text: "	🤔 I don't have a tag, but that's cool, any tasks without tags will show up here",
        order: {
          '0': 0,
        },
        createdAt: 1640555021024,
        completedAt: false,
      },
      {
        id: 1640561989783,
        text: '👇 Click the settings link in the footer to add, delete and rearrange tags!',
        order: {
          '0': 1,
        },
        createdAt: 1640561989783,
        completedAt: false,
      },
    ]
    set('kt-tags', tags)
    set('kt-tasks', tasks)
    setAllTags(tags)
    setAllTasks(tasks)
  }

  // When component loads the first time get tasks and tags, if any from local
  // storage
  React.useEffect(() => {
    get('kt-tags').then((storedTags) => {
      // Fetch tags
      const tags: TagType[] = storedTags || [
        {
          id: 1640388007034,
          text: 'Soon',
          emoji: '🟠',
          order: 1,
          isVisible: true,
        },
        {
          id: 1640387991734,
          text: 'Now',
          emoji: '🔴',
          order: 0,
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
        {
          id: 0,
          text: 'Uncategorized',
          order: -1,
          isVisible: true,
        },
      ]

      if (!storedTags) set('kt-tags', tags)
      setAllTags(tags)
    })

    get('kt-tasks').then((storedTasks) => {
      // Fetch Tasks
      const tasks: TaskType[] = storedTasks || [
        {
          id: 1640554950187,
          text: '👍 Tap me to mark me as complete',
          order: {
            '1640387991734': 0,
          },
          createdAt: 1640554950187,
          completedAt: false,
        },
        {
          id: 1640554970171,
          text: "🙊 Oops, I'm not done - tap me to undo!",
          order: {
            '1640388007034': 0,
          },
          createdAt: 1640554970171,
          completedAt: 1640554989232,
        },
        {
          id: 1640554999417,
          text: '👉 Click my X to delete me',
          order: {
            '1640388021078': 0,
          },
          createdAt: 1640554999417,
          completedAt: false,
        },
        {
          id: 1640554999689,
          text: '👈 Click my pencil to edit me',
          order: {
            '1640388021078': 1,
          },
          createdAt: 1640554999689,
          completedAt: false,
        },
        {
          id: 1640555006143,
          text: 'Click the V 👆 to hide these tasks',
          order: {
            '1640902406334': 0,
          },
          createdAt: 1640555006143,
          completedAt: false,
        },
        {
          id: 1640555009713,
          text: '😎 You can have tasks with multiple tags!',
          order: {
            '1640388007034': 1,
            '1640902406334': 1,
          },
          createdAt: 1640555009713,
          completedAt: false,
        },
        {
          id: 1640555021024,
          text: "	🤔 I don't have a tag, but that's cool, any tasks without tags will show up here",
          order: {
            '0': 0,
          },
          createdAt: 1640555021024,
          completedAt: false,
        },
        {
          id: 1640561989783,
          text: '👇 Click the settings link in the footer to add, delete and rearrange tags!',
          order: {
            '0': 1,
          },
          createdAt: 1640561989783,
          completedAt: false,
        },
      ]

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
    sortTasks,
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
