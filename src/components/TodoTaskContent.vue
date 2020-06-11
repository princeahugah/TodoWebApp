<template>
    <v-card elevation="2">
        <v-card-title>
            <v-text-field v-model="searchValue"
                          :append-icon="mdiMagnify"
                          ref="searchInput"
                          label="Search"
                          single-line
                          hide-details />
        </v-card-title>
        <v-data-table item-key="id"
                      :loading="loading"
                      loading-text="loading tasks"
                      :headers="headers"
                      :items="tasks"
                      :search="search"
                      show-select
                      single-select
                      v-model="selectedTaskModel"
                      multi-sort>
            <template v-slot:top>
                <add-item-dialog :hasState="true"
                                 v-model="addInputDialog"
                                 :dialogHeaderTitle="`${editedTask.id ? 'Updating Task' : 'Adding Task'}`"
                                 :editedItem="editedTask"
                                 @inputValue="setInputValue"
                                 @inputState="setInputState"
                                 inputLabel="Task Description"
                                 :close="close"
                                 :save="save" />
                <delete-dialog v-model="deleteDialogModel"
                               dialogHeaderTitle="Deleting Task"
                               :deleteMessage="`Are you sure you want to delete <strong>${taskToDelete ? taskToDelete.description : ''}</strong>?`"
                               :closeDeleteDialog="closeDeleteDialog"
                               :confirmDelete="confirmDelete" />
            </template>
            <template v-slot:item.state="{ item, value }">
                <v-chip class="px-3 py-1"
                        style="font-size: 0.8rem;"
                        label
                        large
                        :color="value === 'done' ? 'success' : 'error'"
                        text-color="white">
                    {{ value.toUpperCase() }}
                </v-chip>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { mdiMagnify, mdiPencil, mdiTrashCanOutline } from '@mdi/js';
  import { ITask } from '../services/interfaces/todo.interface';
  import DeleteDialog from './DeleteDialog.vue';
  import AddItemDialog from './AddItemDialog.vue';

  @Component({
    components: { DeleteDialog, AddItemDialog }
  })
  export default class TodoTaskContent extends Vue {
    @Prop({ default: false }) dialog: boolean;
    @Prop({ default: false }) deleteDialog: boolean;
    @Prop({ default: false }) loading: boolean;
    @Prop({}) search: string;
    @Prop({}) tasks: ITask[];
    @Prop() editedTask: ITask;
    @Prop() taskToDelete: ITask;
    @Prop() selectedTask: ITask[];
    @Prop() editTask: (task: ITask) => void;
    @Prop() deleteTask: (task: ITask) => void;
    @Prop() closeDeleteDialog: () => void;
    @Prop() confirmDelete: () => void;
    @Prop() close: () => void;
    @Prop() save: () => void;
    mdiMagnify = mdiMagnify;
    mdiPencil = mdiPencil;
    mdiTrashCanOutline = mdiTrashCanOutline;
    headers = [
      { text: 'Task Description', value: 'description', width: '40%' },
      { text: 'State', value: 'state' },
      { text: 'Created On', value: 'createdAt' },
      { text: 'Last Modified Date', value: 'updatedAt' }
    ];

    setInputValue(value: string) {
      this.editedTask.description = value;
    }

    setInputState(value: string) {
      this.editedTask.state = value;
    }

    get deleteDialogModel() {
      return this.deleteDialog;
    }

    set deleteDialogModel(value: boolean) {
      this.$emit('deleteDialog', value);
    }

    get addInputDialog() {
      return this.dialog;
    }

    set addInputDialog(value: boolean) {
      this.$emit('addInputDialog', value);
    }

    get searchValue() {
      return this.search;
    }

    set searchValue(value: string) {
      this.$emit('search', value);
    }

    get selectedTaskModel() {
      return this.selectedTask;
    }

    set selectedTaskModel(value: ITask[]) {
      this.$emit('selectedTask', value);
    }

    mounted() {
      const searchInput = this.$refs.searchInput as HTMLElement;
      searchInput.focus();
    }
  }
</script>