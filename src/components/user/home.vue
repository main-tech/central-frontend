<!--
Copyright 2017 ODK Central Developers
See the NOTICE file at the top-level directory of this distribution and at
https://github.com/getodk/central-frontend/blob/master/NOTICE.

This file is part of ODK Central. It is subject to the license terms in
the LICENSE file found in the top-level directory of this distribution and at
https://www.apache.org/licenses/LICENSE-2.0. No part of ODK Central,
including this file, may be copied, modified, propagated, or distributed
except according to the terms contained in the LICENSE file.
-->
<template>
  <div id="user-home">
    <page-head>
      <template #title>{{ $t('title') }}</template>
      <template #tabs>
        <li :class="tabClass('')" role="presentation">
          <router-link :to="tabPath('')">{{ $t('resource.webUsers') }}</router-link>
        </li>
      </template>
    </page-head>
    <page-body>
      <router-view/>
    </page-body>
  </div>
</template>

<script setup>
import PageBody from '../page/body.vue';
import PageHead from '../page/head.vue';

import useTabs from '../../composables/tabs';

defineOptions({
  name: 'UserHome'
});

const { tabPath, tabClass } = useTabs('/users');
</script>

<style lang="scss">
#user-home {
  #page-head-tabs li { display: block; }
}
</style>

<i18n lang="json5">
{
  "en": {
    // This is shown as the title at the top of the page.
    "title": "User Settings"
  }
}
</i18n>

<!-- Autogenerated by destructure.js -->
<i18n>
{
  "cs": {
    "title": "Uživatelské nastavení",
    "tab": {
      "users": "Uživatelé webu",
      "roles": "Nastavení role"
    },
    "comingSoon": "(již brzy)"
  },
  "de": {
    "title": "Benutzer-Einstellungen",
    "tab": {
      "users": "Web-Benutzer",
      "roles": "Rollen-Einstellungen"
    },
    "comingSoon": "(bald verfügbar)"
  },
  "es": {
    "title": "Configuraciones del usuario",
    "tab": {
      "users": "Usuarios Web",
      "roles": "Administración de Roles"
    },
    "comingSoon": "(próximamente)"
  },
  "fr": {
    "title": "Paramètres d'utilisateur",
    "tab": {
      "users": "Utilisateur web",
      "roles": "Paramètres de rôle"
    },
    "comingSoon": "(bientôt disponible)"
  },
  "id": {
    "title": "Pengaturan Pengguna",
    "tab": {
      "users": "Pengguna Web",
      "roles": "Pengaturan Peran"
    },
    "comingSoon": "(akan datang)"
  },
  "it": {
    "title": "Impostazioni dell'utente",
    "tab": {
      "users": "Utenti web",
      "roles": "Impostazioni del Ruolo"
    },
    "comingSoon": "(prossimamente)"
  },
  "ja": {
    "title": "ユーザー管理",
    "tab": {
      "users": "Webユーザー",
      "roles": "役割設定"
    },
    "comingSoon": "（近日公開）"
  },
  "sw": {
    "title": "Mipangilio ya Mtumiaji",
    "tab": {
      "users": "Watumiaji wa Mtandao",
      "roles": "Mipangilio ya Wajibu"
    },
    "comingSoon": "(inakuja hivi karibuni)"
  }
}
</i18n>
