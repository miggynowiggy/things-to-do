<script setup lang="ts">
  import { Icon } from "@iconify/vue"
  import type Task from "./models/task";
  import { TaskClass } from "./models/task";
  import { useToast } from "maz-ui";
  import { useTaskService } from "./services/tasks";

  interface TaskWithOptions extends Task {
    isSelected: boolean;
  }

  class TaskClassWithOptions extends TaskClass {
    isSelected = false
  }

  const toast = useToast()
  const TaskService = useTaskService()
  const loading = ref({
    list: false,
    add: false,
    save: false,
    batchDelete: false,
    batchMark: false
  })
  const tasks = ref<TaskWithOptions[]>([])
  const selectedTask = ref<TaskWithOptions>(new TaskClassWithOptions());
  const selectedTasks = computed(() => tasks.value.filter(t => t.isSelected))

  async function performToTask(action: string, id: string) {
    const taskLocation = tasks.value.findIndex(t => t.id === id)
    if (taskLocation === -1) return

    const task = { ...tasks.value[taskLocation] }
    
    switch(action) {
      case 'TOGGLE_SELECT': {
        task.isSelected = !task.isSelected
        tasks.value[taskLocation] = { ...task }
        break
      }
      case 'TOGGLE_EDIT': {
        if (task.isDone) break
        selectedTask.value = { ...task }
        break
      }
      default: {
        console.warn("UNRECOGNIZE TASK ACTION")
      }
    }
  }

  async function getAll() {
    loading.value.list = true
    const plainTasks = await TaskService.getAll()
    tasks.value = plainTasks.map(p => ({ ...p, isSelected: false }))
    loading.value.list = false
  }

  async function addTask() {
    if (!selectedTask.value.content) return

    loading.value.add = true
    const newTask = await TaskService.create({
      content: selectedTask.value.content,
      isDone: false
    })

    if (!newTask) {
      toast.error('Task cannot be created due to error');
      return
    }

    updateLocalList('ADD', newTask as Task)
    clearSelectedTask()
    toast.success('Task created!')
    loading.value.add = false
  }

  function updateLocalList(action: 'ADD' | 'EDIT' | 'REMOVE', task: Task) {
    switch (action) {
      case 'ADD': {
        tasks.value.unshift({ ...task, isSelected: false })
        break;
      }
      case 'EDIT': {
        const taskLocation = tasks.value.findIndex(t => t.id === task.id)
        if (taskLocation !== -1) {
          tasks.value[taskLocation] = { ...task, isSelected: false }
        }
        break;
      }
      case 'REMOVE': {
        const taskLocation = tasks.value.findIndex(t => t.id === task.id)
        if (taskLocation !== -1) {
          tasks.value.splice(taskLocation, 1)
        }
        break;
      }
      default: {
        console.warn("UNHANDLE UPDATE LOCAL LIST ACTION")
      }
    }
  }

  async function markDone(id: string) {
    const task = tasks.value.find(t => t.id === id);
    if (!task) {
      toast.error("Cannot mark task as done due to error");
      return
    }

    const updatedTask = await TaskService.update(id, { content: task.content, isDone: !task.isDone })
    if (!updatedTask) {
      toast.error("Cannot mark task as done due to error");
      return
    }
    updateLocalList('EDIT', updatedTask as Task)
    toast.success("Task mark done!");
  }

  async function saveChanges() {
    if (!selectedTask.value.id) return
    loading.value.save = true
  
    const { id } = selectedTask.value
    const updatedTask = await TaskService.update(id, { content: selectedTask.value.content })
    if (!updatedTask) {
      toast.error("Cannot mark task as done due to error");
      return
    }
    updateLocalList('ADD', updatedTask as Task)
    clearSelectedTask()
    toast.success("Task updated!");
    loading.value.save = false
  }

  async function removeTask(id: string) {
    const deletedTask = await TaskService.remove(id);
    if (!deletedTask) {
      toast.error("Cannot delete task due to an error");
      return
    }
    toast.success("Task deleted!");
    updateLocalList('REMOVE', deletedTask as Task);
  }

  async function batchDelete() {
    loading.value.batchDelete = true
    for (const selectedTask of selectedTasks.value) {
      await removeTask(selectedTask.id)
    }
    loading.value.batchDelete = false
  }

  async function batchMarkDone() {
    loading.value.batchMark = true
    for (const selectedTask of selectedTasks.value) {
      await markDone(selectedTask.id)
    }
    loading.value.batchMark = false
  }

  function clearSelectedTask() {
    selectedTask.value = new TaskClassWithOptions()
  }

  function clearSelectedTasks() {
    for (const selectedTask of selectedTasks.value) {
      selectedTask.isSelected = false
    }
  }

  onMounted(async () => await getAll())
</script>

<template>
  <main>
    <div class="container flex flex-col items-center justify-start mx-auto my-2 gap-10">
      <!-- App Header -->
      <div class="my-2 font-bold text-center text-lime-500 xs:text-3xl sm:text-5xl md:text-7xl">Things To-Do</div>

      <!-- Add and edit task entry -->
      <div class="flex flex-col gap-5 xs:w-full sm:w-full md:w-1/2 outline outline-offset-2 outline-sky-700 rounded-lg shadow-xl sm:mx-2">
        <MazCard footer-align="right">
          <template #content>
            <p :class="['text-2xl', 'font-bold', selectedTask.id ? 'text-lime-600' : 'text-sky-600']">
              {{ selectedTask.id ? 'Edit To-Do' : 'Add To-Do' }}
            </p>
            <div class="p-3">
              <MazTextarea placeholder="write your to-do..." v-model="selectedTask.content" />
            </div>
          </template>
          <template #footer>
            <div class="flex flex-row items-center justify-end gap-2">
              <MazBtn outline color="black" @click="clearSelectedTask">Cancel</MazBtn>
              <MazBtn color="success" v-if="selectedTask.id" @click="saveChanges" :loading="loading.save">Save Changes</MazBtn>
              <MazBtn color="primary" v-else @click="addTask" :loading="loading.add">Add To-Do</MazBtn>
            </div>
          </template>
        </MazCard>
      </div>

      <!-- Task List -->
      <div class="flex flex-col gap-5 xs:w-full sm:w-full md:w-1/2 outline outline-offset-2 outline-sky-700 rounded-lg shadow-xl sm:mx-2">
        <div class="flex flex-col items-center justify-start gap-5 p-5 max-h-[400px] overflow-y-scroll">
          <div v-if="!tasks.length" class="w-full">
            <p class="text-2xl font-bold text-amber-600 text-center">No tasks yet...</p>
          </div>
          <div v-for="task in tasks" :key="task.id" class="w-full">
              <MazCard elevation radius orientation="row" footer-align="right" class="outline outline-offset-1 outline-gray-300 hover:outline-gray-500 w-full">
                <template #content>
                  <div class="flex flex-row items-center justify-between gap-2">
                    <MazCheckbox 
                      type="text"
                      :modelValue="task.isSelected" 
                      @change="performToTask('TOGGLE_SELECT', task.id)" 
                    />
                    <div @click="performToTask('TOGGLE_EDIT', task.id)" class="w-full h-full">
                      <p
                        :class="[
                          'xs:text-xl sm:text-xl md:text-2xl font-semibold grow', 
                          task.isDone ? 'line-through' : ''
                        ]"
                      >
                        {{ task.content }}
                      </p>
                    </div>
                    <div class="flex items-start justify-end gap-3">
                      <MazBtn 
                        fab 
                        size="xs" 
                        color="danger"
                        @click="removeTask(task.id)"
                      >
                        <Icon icon="heroicons:archive-box-x-mark" class="text-white text-[16px]" />
                      </MazBtn>
                      <MazBtn 
                        fab 
                        size="xs" 
                        color="success" 
                        v-if="!task.isDone" 
                        @click="markDone(task.id)"
                      >
                        <Icon icon="heroicons:check-circle" class="text-white text-[20px]" />
                      </MazBtn>
                    </div>
                  </div>
                </template>
              </MazCard>
            </div>
        </div>
        <div v-if="selectedTasks.length" class="flex flex-col items-start justify-center gap-5 h-full pb-5 px-10" >
          <p class="text-lg text-center w-full">{{ selectedTasks.length }} to-dos selected</p>
          <MazBtn size="sm" color="black" outline block @click="clearSelectedTasks">Clear Selection</MazBtn>
          <MazBtn size="sm" color="danger" block @click="batchDelete" :loading="loading.batchDelete">Delete Task/s</MazBtn>
          <MazBtn size="sm" color="success" block @click="batchMarkDone" :loading="loading.batchMark">Mark Task/s as Done</MazBtn>
        </div>
      </div>
    </div>
  </main>
</template>
