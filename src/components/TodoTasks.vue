<template>
    <div>
        <v-row>
            <v-col cols="12">
                <todo-toolbar :toolbarActions="toolbarActions"
                              :toolbarTitle="`${userName}'s Tasks`" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <todo-task-content :dialog="dialog"
                                   :deleteDialog="deleteDialog"
                                   @deleteDialog="setDeleteDialog"
                                   :tasks="tasks"
                                   :loading="loading"
                                   :editTask="editTask"
                                   :editedTask="editedTask"
                                   :search="search"
                                   :selectedTask="selectedTask"
                                   @search="setSearch($event)"
                                   @addInputDialog="setDialog($event)"
                                   @selectedTask="setSelectedTask($event)"
                                   :deleteTask="deleteTask"
                                   :taskToDelete="taskToDelete"
                                   :close="close"
                                   :save="save"
                                   :closeDeleteDialog="closeDeleteDialog"
                                   :confirmDelete="confirmDelete" />
            </v-col>
        </v-row>
        <v-snackbar top
                    :timeout="3000"
                    :color="snackbarColor"
                    v-model="enableSnackbar">
            {{ snackMessage }}
            <v-btn color="white"
                   text
                   small
                   @click="enableSnackbar = false">
                close
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import TodoToolbar from './TodoToolbar.vue';
  import TodoTaskContent from './TodoTaskContent.vue';
  import { IToolbarActions, ITask } from '../services/interfaces/todo.interface';
  import TasksApi from '../services/api/TasksApi';
  import { mdiPlaylistPlus, mdiPlaylistEdit, mdiPlaylistRemove, mdiArrowLeft } from '@mdi/js';
  import UsersApi from '../services/api/UsersApi';

  @Component({
    components: { TodoToolbar, TodoTaskContent },
    metaInfo: {
      title: 'Todo Tasks'
    }
  })
  export default class TodoTasks extends Vue {
    userName = '';
    dialog = false;
    deleteDialog = false;
    taskToDelete: ITask | null = null;
    editedIndex = -1;
    loading = false;
    search = '';
    selectedTask: ITask[] = [];
    tasks: ITask[] = [];
    editedTask: ITask = {
      id: '',
      description: '',
      state: 'to do',
      userId: '',
      createdAt: ''
    };
    defaultTask: ITask = {
      id: '',
      description: '',
      state: 'to do',
      userId: '',
      createdAt: ''
    };
    enableSnackbar = false;
    snackbarColor = 'success';
    snackMessage = '';
    toolbarActions: IToolbarActions[] = [
      {
        id: 'back-to-users',
        icon: mdiArrowLeft,
        title: 'Back to users',
        handler: this.backToUser,
        color: 'normal'
      },
      {
        id: 'add-task',
        icon: mdiPlaylistPlus,
        title: 'Add Task',
        handler: this.addTask,
        color: 'primary'
      },
      {
        id: 'edit-task',
        icon: mdiPlaylistEdit,
        title: 'Edit Task',
        handler: this.editTask,
        color: 'secondary'
      },
      {
        id: 'delete-task',
        icon: mdiPlaylistRemove,
        title: 'Delete Task',
        handler: this.deleteTask,
        color: 'error'
      }
    ];

    async created() {
      const user = await UsersApi.getUser(this.$route.params.userId);
      if (!user) {
        this.$router.push('/todo');
      }
      this.userName = user.name;
      this.tasks = await TasksApi.getTasks(this.$route.params.userId);
    }

    setSearch(value: string) {
      this.search = value;
    }

    setDialog(value: boolean) {
      this.dialog = value;
    }

    setDeleteDialog(value: boolean) {
      this.deleteDialog = value;
    }

    backToUser() {
      this.$router.push('/todo');
    }

    addTask() {
      this.editedTask.userId = this.$route.params.userId;
      this.dialog = true;
    }

    deleteTask() {
      if (!this.selectedTask[0]) {
        this.displaySnackbar("Please select a task by checking the box by the task's name to delete", 'warning');
        return;
      }
      this.taskToDelete = this.selectedTask[0];
      this.deleteDialog = true;
    }

    editTask() {
      const task = this.selectedTask[0];
      if (!task) {
        this.displaySnackbar("Please select a task by checking the box by the task's name to update", 'warning');
        return;
      }
      this.editedIndex = this.tasks.indexOf(task);
      this.editedTask = Object.assign({}, task);
      this.dialog = true;
    }

    setSelectedTask(value: ITask[]) {
      this.selectedTask = value;
    }

    close() {
      this.dialog = false;
      this.selectedTask = [];
      this.editedTask = Object.assign({}, this.defaultTask);
      this.editedIndex = -1;
    }

    closeDeleteDialog() {
      this.deleteDialog = false;
      this.taskToDelete = null;
      this.selectedTask = [];
      this.editedTask = Object.assign({}, this.defaultTask);
      this.editedIndex = -1;
    }

    displaySnackbar(message = '', color = 'success') {
      this.$nextTick(() => {
        this.snackMessage = message;
        this.enableSnackbar = true;
        this.snackbarColor = color;
      });
    }

    confirmDelete() {
      if (this.taskToDelete && this.taskToDelete.id) {
        const taskId: string = this.taskToDelete.id;
        TasksApi.deleteTask(taskId).then(() => {
          const index = this.tasks.findIndex(task => task.id === taskId);
          const task = this.tasks.splice(index, 1);
          this.closeDeleteDialog();
          this.displaySnackbar(`"${task[0].description}" has been deleted successfully!`, 'success');
        });
      }
    }

    save() {
      let taskToSave = this.editedTask;
      if (this.editedIndex > -1) {
        taskToSave = Object.assign(this.tasks[this.editedIndex], this.editedTask);
      }
      if (taskToSave.description === '') {
        this.displaySnackbar('A description is required to create a task', 'error');
        return;
      }
      TasksApi.saveTask(taskToSave).then((updatedTask: ITask) => {
        let message = `"${updatedTask.description}" has been saved successfully!`;
        if (taskToSave.id) {
          const task = this.tasks.find(task => task.id === taskToSave.id);
          Object.assign(task, updatedTask);
          message = `"${updatedTask.description}" has been updated successfully!`;
        } else {
          this.tasks.push(updatedTask);
        }
        this.close();
        this.displaySnackbar(message, 'success');
      });
    }
  }
</script>