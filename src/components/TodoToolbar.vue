<template>
    <div class="toolbar">
        <h1 class="todo-title">{{ toolbarTitle }}</h1>
        <div class="toolbar-action">
            <v-tooltip bottom
                       v-for="action in toolbarActions"
                       :key="action.id">
                <template v-slot:activator="{ on }">
                    <div class="toolbar-icon"
                         v-on="on"
                         @click.stop="action.handler">
                        <v-btn class="mx-2"
                               fab
                               dark
                               large
                               :color="action.color">
                            <v-icon light
                                    size="34">
                                {{ action.icon }}
                            </v-icon>
                        </v-btn>
                    </div>
                </template>
                <span>{{ action.title }}</span>
            </v-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';
  import { IToolbarActions } from '../services/interfaces/todo.interface';

  @Component
  export default class TodoToolbar extends Vue {
    @Prop() toolbarActions: IToolbarActions[];
    @Prop() toolbarTitle: string;
  }
</script>

<style lang="scss" scoped>
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .toolbar-action {
      display: flex;
      .toolbar-icon {
        margin-left: 20px;
      }
    }
  }
</style>
