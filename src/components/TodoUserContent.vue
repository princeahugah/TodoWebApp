<template>
    <v-card elevation="2">
        <v-card-title>
            <v-text-field v-model="searchValue"
                          :append-icon="mdiMagnify"
                          autocomplete="off"
                          dense
                          ref="searchInput"
                          label="Search"
                          single-line />
        </v-card-title>
        <v-data-table item-key="id"
                      :loading="loading"
                      loading-text="loading users"
                      :headers="headers"
                      :items="tableItems"
                      :search="search"
                      @click:row="handleRowClick"
                      class="clickable"
                      show-select
                      single-select
                      v-model="selectedUserModel"
                      multi-sort>
            <template v-slot:top>
                <add-item-dialog v-model="addInputDialog"
                                 :dialogHeaderTitle="`${editedUser.id ? 'Updating User' : 'Adding User'}`"
                                 :editedItem="editedUser"
                                 inputLabel="User Name"
                                 @inputValue="setInputValue"
                                 :close="close"
                                 :save="save" />
                <delete-dialog v-model="deleteDialogModel"
                               dialogHeaderTitle="Deleting User"
                               :deleteMessage="`Are you sure you want to delete <strong>${userToDelete ? userToDelete.name : ''}</strong>?`"
                               :closeDeleteDialog="closeDeleteDialog"
                               :confirmDelete="confirmDelete" />
            </template>
            <template v-slot:item.nameId="{ item, value }">
                <span>
                    <router-link :to="`/todo/${value.id}`">
                        {{ value.name }}
                    </router-link>
                    <v-chip class="ml-2 px-1"
                            label
                            color="secondary"
                            text-color="primary">
                        see tasks
                    </v-chip>
                </span>
            </template>
        </v-data-table>
    </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { mdiMagnify, mdiPencil, mdiTrashCanOutline } from '@mdi/js';
  import { IUser } from '../services/interfaces/todo.interface';
  import DeleteDialog from './DeleteDialog.vue';
  import AddItemDialog from './AddItemDialog.vue';

  @Component({
    components: { DeleteDialog, AddItemDialog },
  })
  export default class TodoUserContent extends Vue {
    @Prop({ default: false }) dialog: boolean;
    @Prop({ default: false }) deleteDialog: boolean;
    @Prop({ default: false }) loading: boolean;
    @Prop({}) search: string;
    @Prop({}) users: IUser[];
    @Prop() editedUser: IUser;
    @Prop() userToDelete: IUser;
    @Prop() selectedUser: IUser[];
    @Prop() editUser: (user: IUser) => void;
    @Prop() deleteUser: (user: IUser) => void;
    @Prop() closeDeleteDialog: () => void;
    @Prop() confirmDelete: () => void;
    @Prop() close: () => void;
    @Prop() save: () => void;
    mdiMagnify = mdiMagnify;
    mdiPencil = mdiPencil;
    mdiTrashCanOutline = mdiTrashCanOutline;
    headers = [
      { text: 'Name', value: 'nameId', width: '40%' },
      { text: 'Number of Assigned Tasks', value: 'assignedTasks' },
      { text: 'Created On', value: 'createdAt' },
      { text: 'Last Modified Date', value: 'updatedAt' },
    ];

    get tableItems() {
      return this.users.map((item) => {
        return {
          ...item,
          nameId: {
            name: item.name,
            id: item.id,
          },
        };
      });
    }

    get addInputDialog() {
      return this.dialog;
    }

    set addInputDialog(value: boolean) {
      this.$emit('addInputDialog', value);
    }

    get deleteDialogModel() {
      return this.deleteDialog;
    }

    set deleteDialogModel(value: boolean) {
      this.$emit('deleteDialog', value);
    }

    setInputValue(value: string) {
      this.editedUser.name = value;
    }

    get searchValue() {
      return this.search;
    }

    set searchValue(value: string) {
      this.$emit('search', value);
    }

    get selectedUserModel() {
      return this.selectedUser;
    }

    set selectedUserModel(value: IUser[]) {
      this.$emit('selectedUser', value);
    }

    mounted() {
      const searchInput = this.$refs.searchInput as HTMLElement;
      searchInput.focus();
    }

    handleRowClick(item: IUser) {
      this.$router.push(`/todo/${item.id}`);
    }
  }
</script>