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
  <div id="entity-list">
    <div id="entity-list-actions">
      <button id="entity-list-refresh-button" type="button"
            class="btn btn-default" :aria-disabled="refreshing"
            @click="fetchData(false)">
            <span class="icon-refresh"></span>{{ $t('action.refresh') }}
            <spinner :state="refreshing"/>
          </button>
      <a id="entity-download-button" type="button" class="btn btn-primary" :href="href">
        <span class="icon-arrow-circle-down"></span>{{ downloadText }}
      </a>
    </div>
    <entity-table v-show="odataEntities.dataExists && odataEntities.value.length !== 0"
      ref="table" :properties="dataset.properties" @update="showUpdate"/>
    <p v-show="odataEntities.dataExists && odataEntities.value.length === 0"
      class="empty-table-message">
      {{ $t('noEntities') }}
    </p>
    <loading :state="odataEntities.initiallyLoading"/>

    <entity-update v-bind="update" @hide="hideUpdate" @success="afterUpdate"/>
  </div>
</template>

<script>
import Loading from '../loading.vue';
import Spinner from '../spinner.vue';
import EntityTable from './table.vue';
import EntityUpdate from './update.vue';

import modal from '../../mixins/modal';
import useEntities from '../../request-data/entities';
import { useRequestData } from '../../request-data';
import { apiPaths } from '../../util/request';
import { noop } from '../../util/util';

export default {
  name: 'EntityList',
  components: {
    Loading,
    Spinner,
    EntityTable,
    EntityUpdate
  },
  mixins: [modal()],
  inject: ['alert'],
  provide() {
    return { projectId: this.projectId, datasetName: this.datasetName };
  },
  props: {
    projectId: {
      type: String,
      required: true
    },
    datasetName: {
      type: String,
      required: true
    }
  },
  setup() {
    // The dataset request object is how we get access to the
    // dataset properties for the columns.
    const { dataset } = useRequestData();
    const odataEntities = useEntities();
    return { dataset, odataEntities };
  },
  data() {
    return {
      refreshing: false,
      // The index of the entity being updated
      updateIndex: null,
      // Data to pass to the update modal
      update: {
        state: false,
        entity: null
      }
    };
  },
  computed: {
    href() {
      return apiPaths.entities(this.projectId, this.datasetName);
    },
    downloadText() {
      return !this.odataEntities.dataExists
        ? this.$t('action.download')
        : this.$tcn('action.download.unfiltered', this.odataEntities.count);
    }
  },
  created() {
    this.fetchData(true);
  },
  methods: {
    fetchData(clear) {
      this.refreshing = !clear;
      this.odataEntities.request({
        url: apiPaths.odataEntities(
          this.projectId,
          this.datasetName,
          { $count: true }
        ),
        clear
      })
        .finally(() => { this.refreshing = false; })
        .catch(noop);
    },
    showUpdate(index) {
      if (this.refreshing) return;
      this.updateIndex = index;
      const odataEntity = this.odataEntities.value[index];
      const data = Object.create(null);
      for (const { name, odataName } of this.dataset.properties)
        data[name] = odataEntity[odataName];
      this.update.entity = {
        uuid: odataEntity.__id,
        currentVersion: { label: odataEntity.label, data }
      };
      this.showModal('update');
    },
    hideUpdate() {
      this.hideModal('update');
      this.update.entity = null;
      this.updateIndex = null;
    },
    afterUpdate(updatedEntity) {
      const index = this.updateIndex;
      this.hideUpdate();
      this.alert.success(this.$t('alert.updateEntity'));

      // Update the OData using the REST response.
      const oldOData = this.odataEntities.value[index];
      const newOData = Object.assign(Object.create(null), {
        __id: oldOData.__id,
        label: updatedEntity.currentVersion.label,
        __system: {
          ...oldOData.__system,
          updates: oldOData.__system.updates + 1,
          updatedAt: updatedEntity.updatedAt
        }
      });
      const { data: updatedData } = updatedEntity.currentVersion;
      for (const { name, odataName } of this.dataset.properties)
        newOData[odataName] = updatedData[name];
      this.odataEntities.value[index] = newOData;

      this.$refs.table.afterUpdate(index);
    }
  }
};
</script>

<style lang="scss">
@import '../../assets/scss/variables';

#entity-list {
  // Make sure that there is enough space for the DateRangePicker when it is
  // open.
  min-height: 375px;
}

#entity-list-actions {
  align-items: baseline;
  display: flex;
  flex-wrap: wrap-reverse;
}
#entity-list-refresh-button {
  margin-right: 5px;
}
#entity-download-button {
  // The bottom margin is for if the download button wraps above the other
  // actions.
  margin-bottom: 10px;
  margin-left: auto;
}
</style>

<i18n lang="json5">
  {
    "en": {
      "action": {
        "download": {
          // This is the text of a button shown when the count of Entities is known.
          "unfiltered": "Download {count} Entity | Download {count} Entities",
        }
      },
      // This text is shown when there are no Entities to show in a table.
      "noEntities": "There are no Entities to show."
    }
  }
</i18n>

<!-- Autogenerated by destructure.js -->
<i18n>
{
  "cs": {
    "noEntities": "Nejsou zde žádné subjekty, které by bylo možné zobrazit."
  },
  "de": {
    "action": {
      "download": {
        "unfiltered": "{count} Entität herunterladen | {count} Entitäten herunterladen"
      }
    },
    "noEntities": "Es gibt keine Entitäten zum Anzeigen."
  },
  "es": {
    "action": {
      "download": {
        "unfiltered": "Descargar {count} Entidad | Descargar {count} Entidades | Descargar {count} Entidades"
      }
    },
    "noEntities": "No hay Entidades para mostrar."
  },
  "fr": {
    "action": {
      "download": {
        "unfiltered": "Télécharger {count} entité | Télécharger {count} entités | Télécharger {count} entités"
      }
    },
    "noEntities": "Pas d'entités à montrer."
  },
  "it": {
    "action": {
      "download": {
        "unfiltered": "Scarica {count} entità | Scarica {count} entità | Scarica {count} entità"
      }
    },
    "noEntities": "Non ci sono entità da mostrare."
  },
  "sw": {
    "action": {
      "download": {
        "unfiltered": "Pakua shirika {count} | Pakua Mashirika {count}"
      }
    },
    "noEntities": "Hakuna Fomu za kuonyesha."
  }
}
</i18n>
