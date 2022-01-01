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
  updateTag: (id: number, emoji: string, text: string) => void
  focusTag: number | undefined
  setFocusTag: (id?: number) => void
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
  updateTag: (id: number, emoji: string, text: string) => {},
  focusTag: undefined,
  setFocusTag: (id?: number) => {},
})

// Custom provider
export const TasksContextProvider: React.FC = ({ children }) => {
  const [allTasks, setAllTasks] = React.useState<TaskType[]>([])
  const [allTags, setAllTags] = React.useState<TagType[]>([])
  const [itemToEdit, setItemToEdit] = React.useState<number | undefined>()
  const [showAddEditForm, setShowAddEditForm] = React.useState<boolean>(false)
  const [focusTag, setFocusTag] = React.useState<number>()

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
    tags = tags.length === 0 ? ['1'] : tags
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
      if (tags.includes('1') && tags.length > 1) {
        delete order['1']
        prevStateCopy[itemIndex] = { ...prevStateCopy[itemIndex], order }
      }

      // If a tag was added, add task to end of that list
      tags.forEach((tag) => {
        if (tag !== '1') {
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
        if (oldTag !== '1' && !tags.includes(oldTag)) {
          delete order[oldTag]
        }
        prevStateCopy[itemIndex] = { ...prevStateCopy[itemIndex], order }
        prevStateCopy = updateSortOrder(prevStateCopy, oldTag)
      })

      // If tag used to have tags and now doesn't, add in the blank
      if (!Object.keys(prevItem.order).includes('1') && tags.length === 0) {
        order = addTaskToEnd(['1'])
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

  // Save details of a tag
  const updateTag = (id: number, emoji: string, text: string) => {
    setAllTags((prevState) => {
      // Make a copy of the most recent state
      let prevStateCopy = [...prevState]

      // Find index of item needing to be updated
      const itemIndex = prevStateCopy.findIndex((item) => item.id === id)

      // Update item's text and emoji
      prevStateCopy[itemIndex] = {
        ...prevStateCopy[itemIndex],
        emoji,
        text,
      }

      set('kt-tags', [...prevStateCopy])
      // Return copy of updated copy
      return [...prevStateCopy]
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
      let uncatCount = prevState.filter((item) =>
        Object.keys(item.order).includes('1')
      ).length

      const updatedTasks = prevState.map((item) => {
        if (Object.keys(item.order).includes(id.toString())) {
          delete item.order[id.toString()]
        }
        if (Object.keys(item.order).length === 0) {
          item.order = { '1': uncatCount }
          uncatCount += 1
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
        id: 1640902409128,
        text: 'Shopping',
        emoji: '🛒',
        order: 4,
        isVisible: true,
      },
      {
        id: 1,
        text: 'Uncategorized',
        order: -1,
        isVisible: true,
      },
    ]
    const tasks: TaskType[] = [
      {
        id: 1640999289371,
        text: '👍 Tap me to mark me as complete',
        order: {
          1640387991734: 0,
        },
        createdAt: 1640999289371,
        completedAt: false,
      },
      {
        id: 1640999297256,
        text: "🙊 Oops, I'm not done - tap me to undo!",
        order: {
          '1640388007034': 0,
        },
        createdAt: 1640999297256,
        completedAt: 1640554989232,
      },
      {
        id: 1640999303768,
        text: '👉 Click my pencil to edit or delete me',
        order: {
          '1640388021078': 0,
        },
        createdAt: 1640999303768,
        completedAt: false,
      },
      {
        id: 1640999311699,
        text: 'Click the V 👆 to hide these tasks',
        order: {
          '1640902406334': 0,
        },
        createdAt: 1640999311699,
        completedAt: false,
      },
      {
        id: 1640999323216,
        text: '😎 You can have tasks with multiple tags!',
        order: {
          '1640388007034': 1,
          '1640902406334': 1,
        },
        createdAt: 1640999323216,
        completedAt: false,
      },
      {
        id: 1640999330468,
        text: '👆 Tap on "Shopping" to focus on just those tasks',
        order: {
          '1640902409128': 0,
        },
        createdAt: 1640999330468,
        completedAt: false,
      },
      {
        id: 1640999597592,
        text: '🔎 (Tap "Unfocus" to see them all again)',
        order: {
          '1640902409128': 1,
        },
        createdAt: 1640999597592,
        completedAt: false,
      },
      {
        id: 1640999337699,
        text: '👋  Drag items within a tag to reorder them!',
        order: {
          '1640902409128': 2,
        },
        createdAt: 1640999337699,
        completedAt: false,
      },
      {
        id: 1640999347435,
        text: "🤔 I don't have a tag, but that's cool, any tasks without tags will show up here",
        order: {
          '1': 0,
        },
        createdAt: 1640999347435,
        completedAt: false,
      },
      {
        id: 1640999355408,
        text: '👇 Click the settings link in the footer to add, edit, delete, and rearrange tags!',
        order: {
          '1': 1,
        },
        createdAt: 1640999355408,
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
          id: 1640902409128,
          text: 'Shopping',
          emoji: '🛒',
          order: 4,
          isVisible: true,
        },
        {
          id: 1,
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
          id: 1640999289371,
          text: '👍 Tap me to mark me as complete',
          order: {
            1640387991734: 0,
          },
          createdAt: 1640999289371,
          completedAt: false,
        },
        {
          id: 1640999297256,
          text: "🙊 Oops, I'm not done - tap me to undo!",
          order: {
            '1640388007034': 0,
          },
          createdAt: 1640999297256,
          completedAt: 1640554989232,
        },
        {
          id: 1640999303768,
          text: '👉 Click my pencil to edit or delete me',
          order: {
            '1640388021078': 0,
          },
          createdAt: 1640999303768,
          completedAt: false,
        },
        {
          id: 1640999311699,
          text: 'Click the V 👆 to hide these tasks',
          order: {
            '1640902406334': 0,
          },
          createdAt: 1640999311699,
          completedAt: false,
        },
        {
          id: 1640999323216,
          text: '😎 You can have tasks with multiple tags!',
          order: {
            '1640388007034': 1,
            '1640902406334': 1,
          },
          createdAt: 1640999323216,
          completedAt: false,
        },
        {
          id: 1640999330468,
          text: '👆 Tap on "Shopping" to focus on just those tasks',
          order: {
            '1640902409128': 0,
          },
          createdAt: 1640999330468,
          completedAt: false,
        },
        {
          id: 1640999597592,
          text: '🔎 (Tap "Unfocus" to see them all again)',
          order: {
            '1640902409128': 1,
          },
          createdAt: 1640999597592,
          completedAt: false,
        },
        {
          id: 1640999337699,
          text: '👋  Drag items within a tag to reorder them!',
          order: {
            '1640902409128': 2,
          },
          createdAt: 1640999337699,
          completedAt: false,
        },
        {
          id: 1640999347435,
          text: "🤔 I don't have a tag, but that's cool, any tasks without tags will show up here",
          order: {
            '1': 0,
          },
          createdAt: 1640999347435,
          completedAt: false,
        },
        {
          id: 1640999355408,
          text: '👇 Click the settings link in the footer to add, edit, delete, and rearrange tags!',
          order: {
            '1': 1,
          },
          createdAt: 1640999355408,
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
    updateTag,
    focusTag,
    setFocusTag,
  }
  return (
    <TasksContext.Provider value={contextValue}>
      {children}
    </TasksContext.Provider>
  )
}

export default TasksContext
