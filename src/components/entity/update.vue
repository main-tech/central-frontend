<!--
Copyright 2023 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <modal id="entity-update" :state="state" :hideable="!awaitingResponse" large
    backdrop @shown="afterShown" @hide="$emit('hide')">
    <template #title>{{ $t('title', currentVersion) }}</template>
    <template #body>
      <form @submit.prevent="submit">
        <div class="table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th ref="labelCellHeader" class="label-cell">
                  <span class="sr-only">{{ $t('resource.property') }}</span>
                </th>
                <th ref="oldValueHeader" class="old-value">
                  {{ $t('header.currentValue') }}
                </th>
                <th class="new-value">{{ $t('header.updatedValue') }}</th>
              </tr>
            </thead>
            <tbody>
              <entity-update-row ref="labelRow" v-model="label"
                :old-value="currentVersion.label"
                :label="$t('entity.entityLabel')" required/>
              <template v-if="dataset.dataExists">
                <entity-update-row v-for="{ name } of dataset.properties"
                  :key="name" ref="propertyRows" v-model="data[name]"
                  :old-value="currentVersion.data[name]" :label="name"/>
              </template>
            </tbody>
          </table>
        </div>
        <div class="modal-actions">
          <button type="submit" class="btn btn-primary"
            :aria-disabled="awaitingResponse">
            {{ $t('action.update') }} <spinner :state="awaitingResponse"/>
          </button>
          <button type="button" class="btn btn-link"
            :aria-disabled="awaitingResponse" @click="$emit('hide')">
            {{ $t('action.neverMind') }}
          </button>
        </div>
      </form>
    </template>
  </modal>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

import EntityUpdateRow from './update/row.vue';
import Modal from '../modal.vue';
import Spinner from '../spinner.vue';

import useColumnGrow from '../../composables/column-grow';
import useRequest from '../../composables/request';
import { apiPaths } from '../../util/request';
import { noop } from '../../util/util';
import { px, styleBox } from '../../util/dom';
import { useRequestData } from '../../request-data';

defineOptions({
  name: 'EntityUpdate'
});
const props = defineProps({
  state: Boolean,
  entity: Object
});

const emit = defineEmits(['hide', 'success']);

const { dataset } = useRequestData();

const label = ref(undefined);
const data = ref(Object.create(null));
watch(() => props.state, (state) => {
  if (!state) {
    label.value = undefined;
    data.value = Object.create(null);
  }
});

const { request, awaitingResponse } = useRequest();
const submit = () => {
  const { entity } = props;
  const url = apiPaths.entity(dataset.projectId, dataset.name, entity.uuid, {
    force: true
  });
  request.patch(url, { label: label.value, data: data.value })
    .then(response => {
      // It is the responsibility of the parent component to patch the entity.
      emit('success', response.data);
    })
    .catch(noop);
};

const labelCellHeader = ref(null);
const { resize: resizeLabelCells } = useColumnGrow(labelCellHeader, 1.5);
const oldValueHeader = ref(null);
const labelRow = ref(null);
// Resizes th.old-value so that the width of the old value and the width of the
// textarea value are the same. Before this resizing, th.old-value and
// th.new-value have the same width. We need to decrease the width of
// th.old-value to account for the padding and borders of the textarea.
const resizeOldValue = () => {
  // Remove any width that the function previously set.
  oldValueHeader.value.style.width = '';
  const { width } = oldValueHeader.value.getBoundingClientRect();
  const textarea = styleBox(getComputedStyle(labelRow.value.textarea.el));
  const paddingAndBorders = textarea.paddingLeft + textarea.paddingRight +
    textarea.borderLeft + textarea.borderRight;
  oldValueHeader.value.style.width = px(width - (paddingAndBorders / 2));
};
const propertyRows = ref([]);
const afterShown = () => {
  labelRow.value.textarea.focus();

  // Resize elements. We wait a tick in case props.entity was changed at the
  // same time as props.state. If a change to props.entity results in changes to
  // the DOM, we need those changes to the DOM to be made before resizing
  // elements based on content in the DOM.
  nextTick(() => {
    resizeLabelCells();
    resizeOldValue();

    labelRow.value.textarea.resize();
    for (const row of propertyRows.value) row.textarea.resize();
  });
};

const noEntity = {
  currentVersion: { label: '', data: {} }
};
const currentVersion = computed(() =>
  (props.entity ?? noEntity).currentVersion);
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#entity-update {
  .modal-dialog { margin-top: 15vh; }
  .table-scroll {
    max-height: calc(70vh -
      #{/* .modal-header */ 46px + /* .modal-actions */ 50px});
    overflow-y: auto;
  }

  .modal-body {
    padding-left: 0;
    padding-right: 0;
    padding-top: 0;
  }
  table { margin-bottom: 0; }
  .modal-actions {
    margin-left: 0;
    margin-right: 0;
    margin-top: 0;
  }

  table { table-layout: fixed; }
  thead {
    .label-cell { width: 16.66666667%; }
  }

  tr:nth-child(2) td { border-top-color: #bbb; }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is the title at the top of a pop-up. {label} is the label of an
    // Entity.
    "title": "Update {label}",
    // This is the text of a table column header. "Value" refers to the value of
    // an Entity property.
    "header": {
      "currentValue": "Current Value",
      "updatedValue": "Updated Value"
    }
  }
}
</i18n>

<!-- Autogenerated by destructure.js -->
<i18n>
{
  "it": {
    "title": "Aggiorna {label}",
    "header": {
      "currentValue": "Valore corrente",
      "updatedValue": "Valore aggiornato"
    }
  }
}
</i18n>
