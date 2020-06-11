<template>
    <v-container>
        <todo-users />
    </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import TodoUsers from '../components/TodoUsers.vue';

  @Component({
    components: {
      TodoUsers
    },
    metaInfo: {
      title: 'Todo Users'
    }
  })
  export default class Todo extends Vue {}
</script>
