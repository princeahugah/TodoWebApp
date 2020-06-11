<template>
    <div>
        <v-row>
            <v-col cols="12">
                <todo-toolbar :toolbarActions="toolbarActions"
                              toolbarTitle="Todo Users" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <todo-user-content :dialog="dialog"
                                   :deleteDialog="deleteDialog"
                                   @deleteDialog="setDeleteDialog"
                                   :users="users"
                                   :loading="loading"
                                   :editUser="editUser"
                                   :editedUser="editedUser"
                                   :search="search"
                                   :selectedUser="selectedUser"
                                   @addInputDialog="setDialog($event)"
                                   @search="setSearch($event)"
                                   @selectedUser="setSelectedUser($event)"
                                   :deleteUser="deleteUser"
                                   :userToDelete="userToDelete"
                                   :close="close"
                                   :save="save"
                                   :closeDeleteDialog="closeDeleteDialog"
                                   :confirmDelete="confirmDelete" />
            </v-col>
        </v-row>
        <v-snackbar top
                    :timeout="5000"
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
  import TodoUserContent from './TodoUserContent.vue';
  import { IUser, IToolbarActions } from '../services/interfaces/todo.interface';
  import UsersApi from '../services/api/UsersApi';
  import { mdiAccountPlusOutline, mdiAccountRemoveOutline, mdiAccountEditOutline } from '@mdi/js';

  @Component({
    components: { TodoToolbar, TodoUserContent },
    metaInfo: {
      title: 'Todo Users'
    }
  })
  export default class TodoUsers extends Vue {
    dialog = false;
    deleteDialog = false;
    userToDelete: IUser | null = null;
    editedIndex = -1;
    loading = false;
    search = '';
    selectedUser: IUser[] = [];
    users: IUser[] = [];
    editedUser: IUser = {
      id: '',
      name: '',
      assignedTasks: 0
    };
    defaultUser: IUser = {
      id: '',
      name: '',
      assignedTasks: 0
    };
    enableSnackbar = false;
    snackbarColor = 'success';
    snackMessage = '';
    toolbarActions: IToolbarActions[] = [
      {
        id: 'add-user',
        icon: mdiAccountPlusOutline,
        title: 'Add User',
        handler: this.addUser,
        color: 'primary'
      },
      {
        id: 'edit-user',
        icon: mdiAccountEditOutline,
        title: 'Edit User',
        handler: this.editUser,
        color: 'secondary'
      },
      {
        id: 'delete-user',
        icon: mdiAccountRemoveOutline,
        title: 'Delete User',
        handler: this.deleteUser,
        color: 'error'
      }
    ];

    async created() {
      this.users = await UsersApi.getUsers();
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

    addUser() {
      this.dialog = true;
    }

    deleteUser() {
      if (!this.selectedUser[0]) {
        this.displaySnackbar("Please select a user by checking the box by the user's name to delete", 'warning');
        return;
      }
      this.userToDelete = this.selectedUser[0];
      this.deleteDialog = true;
    }

    editUser() {
      const user = this.selectedUser[0];
      if (!user) {
        this.displaySnackbar("Please select a user by checking the box by the user's name to update", 'warning');
        return;
      }
      this.editedIndex = this.users.indexOf(user);
      this.editedUser = Object.assign({}, user);
      this.dialog = true;
    }

    setSelectedUser(value: IUser[]) {
      this.selectedUser = value;
    }

    close() {
      this.dialog = false;
      this.selectedUser = [];
      this.editedUser = Object.assign({}, this.defaultUser);
      this.editedIndex = -1;
    }

    closeDeleteDialog() {
      this.deleteDialog = false;
      this.userToDelete = null;
      this.selectedUser = [];
      this.editedUser = Object.assign({}, this.defaultUser);
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
      if (this.userToDelete && this.userToDelete.id) {
        const userId: string = this.userToDelete.id;
        UsersApi.deleteUser(userId).then(() => {
          const index = this.users.findIndex(user => user.id === userId);
          const user = this.users.splice(index, 1);
          this.closeDeleteDialog();
          this.displaySnackbar(`"${user[0].name}" has been deleted successfully!`, 'success');
        });
      }
    }

    save() {
      let userToSave = this.editedUser;
      if (this.editedIndex > -1) {
        userToSave = Object.assign(this.users[this.editedIndex], this.editedUser);
      }
      if (userToSave.name === '') {
        this.displaySnackbar('A name is required to save a user', 'error');
        return;
      }
      UsersApi.saveUser(userToSave).then((updatedUser: IUser) => {
        let message = `"${updatedUser.name}" has been saved successfully!`;
        if (userToSave.id) {
          const user = this.users.find(user => user.id === userToSave.id);
          Object.assign(user, updatedUser);
          message = `"${updatedUser.name}" has been updated successfully!`;
        } else {
          updatedUser.assignedTasks = 0;
          this.users.push(updatedUser);
        }
        this.close();
        this.displaySnackbar(message, 'success');
      });
    }
  }
</script>