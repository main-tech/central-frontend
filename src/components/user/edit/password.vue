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
  <div id="user-edit-password" class="panel panel-simple">
    <div class="panel-heading">
      <h1 class="panel-title">{{ $t('title') }}</h1>
    </div>
    <div class="panel-body">
      <form v-if="user.dataExists && user.id === currentUser.id"
        @submit.prevent="submit">
        <input :value="currentUser.email" autocomplete="username">
        <form-group id="user-edit-password-old-password" v-model="oldPassword"
          type="password" :placeholder="$t('field.oldPassword')" required
          autocomplete="current-password"/>
        <form-group id="user-edit-password-new-password" v-model="newPassword"
          type="password" :placeholder="$t('field.newPassword')" required
          :has-error="tooShort || mismatch" autocomplete="new-password"/>
        <form-group id="user-edit-password-confirm" v-model="confirm"
          type="password" :placeholder="$t('field.passwordConfirm')" required
          :has-error="mismatch" autocomplete="new-password"/>
        <button type="submit" class="btn btn-primary"
          :aria-disabled="awaitingResponse">
          {{ $t('action.change') }} <spinner :state="awaitingResponse"/>
        </button>
      </form>
      <template v-else>
        {{ $t('cannotChange') }}
      </template>
    </div>
  </div>
</template>

<script>
import FormGroup from '../../form-group.vue';
import Spinner from '../../spinner.vue';

import useRequest from '../../../composables/request';
import { apiPaths } from '../../../util/request';
import { noop } from '../../../util/util';
import { useRequestData } from '../../../request-data';

export default {
  name: 'UserEditPassword',
  components: { FormGroup, Spinner },
  inject: ['alert'],
  setup() {
    const { currentUser, user } = useRequestData();
    const { request, awaitingResponse } = useRequest();
    return { currentUser, user, request, awaitingResponse };
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      tooShort: false,
      confirm: '',
      mismatch: false
    };
  },
  methods: {
    validate() {
      this.tooShort = false;
      this.mismatch = false;

      if (this.newPassword.length < 10) {
        this.alert.danger(this.$t('alert.passwordTooShort'));
        this.tooShort = true;
        return false;
      }

      if (this.confirm !== this.newPassword) {
        this.alert.danger(this.$t('alert.mismatch'));
        this.mismatch = true;
        return false;
      }

      return true;
    },
    submit() {
      if (!this.validate()) return;
      const data = { old: this.oldPassword, new: this.newPassword };
      this.request({
        method: 'PUT',
        url: apiPaths.password(this.user.id),
        data
      })
        .then(() => {
          this.alert.success(this.$t('alert.success'));

          // The Chrome password manager does not realize that the form was
          // submitted. Should we navigate to a different page so that it does?
        })
        .catch(noop);
    }
  }
};
</script>

<style lang="scss">
#user-edit-password input[autocomplete="username"] { display: none; }
</style>

<i18n lang="json5">
{
  "en": {
    // This is a title shown above a section of the page.
    "title": "Change Password",
    "action": {
      "change": "Change password"
    },
    "cannotChange": "Only the owner of the account may directly set their own password.",
    "alert": {
      "mismatch": "Please check that your new passwords match.",
      "success": "Success! Your password has been updated."
    }
  }
}
</i18n>

<!-- Autogenerated by destructure.js -->
<i18n>
{
  "cs": {
    "title": "Změnit heslo",
    "action": {
      "change": "Změnit heslo"
    },
    "cannotChange": "Pouze majitel účtu si může přímo nastavit vlastní heslo.",
    "alert": {
      "mismatch": "Zkontrolujte, zda se vaše nová hesla shodují.",
      "success": "Úspěch! Vaše heslo bylo aktualizováno."
    }
  },
  "de": {
    "title": "Passwort ändern",
    "action": {
      "change": "Passwort ändern"
    },
    "cannotChange": "Nur der Besitzer des Kontos kann sein eigenes Passwort direkt setzen.",
    "alert": {
      "mismatch": "Bitte prüfen Sie, dass ihre neuen Passwörter übereinstimmen.",
      "success": "Ihr Passwort wurde erfolgreich aktualisiert."
    }
  },
  "es": {
    "title": "Cambiar contraseña",
    "action": {
      "change": "Cambiar contraseña"
    },
    "cannotChange": "Solo el propietario de la cuenta puede establecer directamente su contraseña.",
    "alert": {
      "mismatch": "Verifique que sus nuevas credenciales coincidan.",
      "success": "¡Éxito! Su contraseña ha sido actualizada."
    }
  },
  "fr": {
    "title": "Changer le mot de passe",
    "action": {
      "change": "Changer le mot de passe"
    },
    "cannotChange": "Seul le propriétaire du compte peut directement définir son propre mot de passe.",
    "alert": {
      "mismatch": "Veuillez vérifier que vos nouveaux mots de passe correspondent.",
      "success": "Succès ! Votre mot de passe a été mis à jour."
    }
  },
  "id": {
    "title": "Ubah Kata Sandi",
    "action": {
      "change": "Ubah Kata Sandi"
    },
    "cannotChange": "Hanya pemilik akun yang bisa mengatur kata sandi.",
    "alert": {
      "mismatch": "Harap periksa kesamaan kata sandi baru Anda.",
      "success": "Berhasil! Kata sandi telah diperbarui."
    }
  },
  "it": {
    "title": "Cambiare la password",
    "action": {
      "change": "Cambiare la password"
    },
    "cannotChange": "Solo il titolare dell'account può impostare direttamente la propria password.",
    "alert": {
      "mismatch": "Per favore verifica che le tue nuove password corrispondano.",
      "success": "L'operazione è riuscita con successo! La tua password è stata aggiornata."
    }
  },
  "ja": {
    "title": "パスワードの変更",
    "action": {
      "change": "パスワードの変更"
    },
    "cannotChange": "アカウントオーナーのみがパスワードを設定できます。",
    "alert": {
      "mismatch": "新しいパスワードが一致することを確認して下さい。",
      "success": "成功です！パスワードが更新されました。"
    }
  },
  "sw": {
    "title": "Badilisha neno la siri",
    "action": {
      "change": "Badilisha neno la siri"
    },
    "cannotChange": "Ni mmiliki wa akaunti pekee ndiye anayeweza kuweka nenosiri lake moja kwa moja.",
    "alert": {
      "mismatch": "Ni mmiliki wa akaunti pekee ndiye anayeweza kuweka nenosiri lake moja kwa moja.",
      "success": "Mafanikio! Nenosiri lako limesasishwa."
    }
  }
}
</i18n>
