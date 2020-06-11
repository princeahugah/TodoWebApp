<template>
    <v-container>
        <todo-tasks />
    </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import TodoTasks from '../components/TodoTasks.vue';

  @Component({
    components: {
      TodoTasks
    },
    metaInfo: {
      title: 'Todo Tasks'
    }
  })
  export default class Todo extends Vue {}
</script>
