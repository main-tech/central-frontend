<!--
Copyright 2022 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <table id="dataset-table" class="table">
    <thead>
      <tr>
        <th>{{ $t('header.name') }}</th>
        <th class="entities">{{ $t('header.entities') }}</th>
        <th>{{ $t('header.lastEntity') }}</th>
        <th>{{ $t('header.actions') }}</th>
      </tr>
    </thead>
    <tbody v-if="datasets.dataExists">
      <dataset-row v-for="dataset of datasets" :key="dataset.id"
        :dataset="dataset"/>
    </tbody>
  </table>
  <p v-if="datasets.dataExists && datasets.length === 0" class="empty-table-message">
    {{ $t('emptyTable') }}
  </p>
</template>

<script setup>
import DatasetRow from './row.vue';

import { useRequestData } from '../../request-data';

defineOptions({
  name: 'DatasetTable'
});

// The component does not assume that this data will exist when the component is
// created.
const { datasets } = useRequestData();
</script>

<style lang="scss">
#dataset-table {
  table-layout: fixed;

  .entities {
    text-align: right;
    padding-right: 10%;
  }

  &+ .empty-table-message {
    margin-bottom: 20px;
  }
}
</style>

<i18n lang="json5">
  {
    "en": {
      "emptyTable": "No Datasets have been created for this Project yet."
    }
  }
</i18n>
