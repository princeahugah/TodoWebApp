<template>
    <v-dialog v-model="deleteDialogModel"
              :retain-focus="false"
              max-width="500px">
        <v-card>
            <v-card-title small>
                <span class="title">
                    {{ dialogHeaderTitle }}
                </span>
            </v-card-title>
            <v-divider />
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col>
                            <div class="delete-item"
                                 v-html="deleteMessage" />
                        </v-col>
                    </v-row>
                </v-container>
            </v-card-text>
            <v-divider />
            <v-card-actions>
                <v-spacer />
                <v-btn color="error darken-1"
                       text
                       small
                       @click="closeDeleteDialog">
                    Cancel
                </v-btn>
                <v-btn color="success darken-1"
                       @click="confirmDelete">
                    Delete
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class DeleteDialog extends Vue {
    @Prop({ default: '' }) dialogHeaderTitle: string;
    @Prop() deleteMessage: string;
    @Prop() value: boolean;
    @Prop() closeDeleteDialog: () => void;
    @Prop() confirmDelete: () => void;

    get deleteDialogModel() {
      return this.value;
    }

    set deleteDialogModel(value: boolean) {
      this.$emit('input', value);
    }
  }
</script>