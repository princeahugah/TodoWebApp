<template>
    <v-dialog v-model="addDialog"
              max-width="700px">
        <v-card>
            <v-card-title small>
                <span class="title">{{ dialogHeaderTitle }}</span>
            </v-card-title>
            <v-divider />
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="inputModel"
                                          autocomplete="off"
                                          dense
                                          @keyup.enter="save"
                                          ref="inputField"
                                          hide-details
                                          :label="inputLabel" />
                        </v-col>
                        <v-col cols="12"
                               v-if="hasState">
                            <div class="state-field">
                                <v-select attach=".state-field"
                                          :items="items"
                                          v-model="selectedState"
                                          label="State"
                                          outlined
                                          dense
                                          class="mt-0 pt-0"
                                          hide-details />
                            </div>
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
                       @click="close">
                    Cancel
                </v-btn>
                <v-btn color="success darken-1"
                       @click="save">
                    Save
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from 'vue-property-decorator';

  @Component
  export default class AddItemDialog extends Vue {
    @Prop({ default: '' }) dialogHeaderTitle: string;
    @Prop({ default: false }) hasState: boolean;
    @Prop() value: boolean;
    @Prop() inputLabel: string;
    @Prop() editedItem: { name?: string; description?: string; state?: string };
    @Prop() close: () => void;
    @Prop() save: () => void;
    items: string[] = ['to do', 'done'];

    get addDialog() {
      return this.value;
    }

    set addDialog(value: boolean) {
      this.$emit('input', value);
    }

    get inputModel() {
      if (this.editedItem.name) {
        return this.editedItem.name;
      }
      if (this.editedItem.description) {
        return this.editedItem.description;
      }
      return '';
    }

    set inputModel(value: string) {
      this.$emit('inputValue', value);
    }

    get selectedState() {
      if (this.hasState && this.editedItem.state) return this.editedItem.state;
      return '';
    }

    set selectedState(value: string) {
      this.$emit('inputState', value);
    }

    updated() {
      this.$nextTick(() => {
        const inputField = this.$refs.inputField as HTMLElement;
        inputField && inputField.focus();
      });
    }
  }
</script>

<style lang="scss" scoped>
  .state-field {
    position: relative;
  }
</style>