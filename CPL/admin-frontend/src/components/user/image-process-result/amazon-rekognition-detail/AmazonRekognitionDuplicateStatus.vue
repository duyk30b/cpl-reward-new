<template>
  <no-data
    v-if="
      !userKyc ||
      !rekognitionInfoHistory ||
      !rekognitionInfoHistoryDetail?.compareResponse
    "
  ></no-data>
  <template v-else>
    <div class="row text-center mb-3">
      <div class="col-xl-4 mb-3">
        <div class="border pb-3">
          <img-with-bounding-box
            :src="userKyc.faceFile.path"
            :boundingBoxs="rekognitionInfoHistoryDetail?.faceIndexBoundindBoxs"
          />
          <div class="fw-bold">
            {{ $t('kycDocumentMetadataValue.' + userKyc.faceFile.metadata) }}
          </div>
          <a
            v-if="rekognitionInfoHistory.faceId"
            href="javascript:void(0)"
            @click="showUsersOfFaceId(rekognitionInfoHistory.faceId)"
          >
            {{ $t('showOtherUsersWhoUsesThisImage') }}
          </a>
        </div>
      </div>
      <div class="col-xl-8 mb-3 related-faces">
        <div class="row mb-3 position-relative">
          <template v-if="!loading">
            <template v-if="relatedFaces.length">
              <div
                class="col-lg-6"
                v-for="face in relatedFaces"
                :key="face.faceId"
              >
                <div class="border pb-3 mb-3">
                  <img-with-bounding-box
                    :src="face.imageUrl"
                    :boundingBoxs="face?.boundingBoxs"
                  />
                  <b
                    class="mb-2"
                    :class="{
                      'text-danger': face.similarity >= 90,
                      'text-warning': face.similarity < 90,
                    }"
                  >
                    {{ $t('similarity') }}:
                    {{ $filters.fixedNumber(face.similarity, 2) }}%
                  </b>
                  <div>
                    {{ $t('detectedAt') }}:
                    {{
                      $filters.convertTimestampToDate(
                        face.detectedAt,
                        'YYYY-MM-DD HH:mm:ss',
                      )
                    }}
                  </div>
                  <a
                    href="javascript:void(0)"
                    @click="showUsersOfFaceId(face.faceId)"
                  >
                    {{ $t('showOtherUsersWhoUsesThisImage') }}
                  </a>
                </div>
              </div>
            </template>
            <div v-if="!relatedFaces.length" class="py-3">
              {{ $t('noData') }}
            </div>
          </template>
          <div v-if="loading" class="py-3 loading-area">
            <i class="fas fa-spinner fa-spin me-2"></i> {{ $t('loading') }}
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <el-pagination
            v-model:current-page="usersOfFaceId.pagination.page"
            @current-change="findRelatedFaces"
            :page-size="usersOfFaceId.pagination.size"
            layout="prev, pager, next"
            :total="usersOfFaceId.pagination.total"
            :hide-on-single-page="true"
            background
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </template>

  <base-modal
    title="users"
    dialogClass="modal-xl"
    :show="usersOfFaceId.showModal"
    @close="closeUsersOfFaceIdModal"
  >
    <template v-slot:body>
      <datatable
        :config="usersOfFaceIdTableConfig"
        :forceReloadKey="usersOfFaceId.tableReloadKey"
      >
        <template v-slot:cell-action="{ row: user }">
          <router-link
            target="_blank"
            class="btn btn-sm btn-primary"
            :to="{
              name: 'userKyc.reviewOcr',
              query: {
                user_id: user.user_id,
                kyc_history_id: user.user_kyc_history_id,
              },
            }"
          >
            {{ $t('detail') }}
          </router-link>
        </template>
      </datatable>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-secondary"
        type="button"
        @click="closeUsersOfFaceIdModal"
      >
        {{ $t('close') }}
      </button>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  RekognitionInfoHistory,
  RekognitionInfoHistoryDetail,
  RelatedFaceDto,
} from '@/models/user/UserKycScanData'
import {
  FindRelatedFaceDto,
  UserKyc,
  UserKycHistory,
} from '@/models/user/UserKyc'
import NoData from '@/components/common/NoData.vue'
import ImgWithBoundingBox from '../ImgWithBoundingBox.vue'
import { UserKycService } from '@/services/UserKycService'
import BaseModal from '@/components/modals/BaseModal.vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { convertTimestampToDate } from '@/core/helpers/common.helper'

export default defineComponent({
  name: 'amazon-rekognition-duplicate-status',
  components: { NoData, ImgWithBoundingBox, BaseModal, Datatable },
  props: {
    userKyc: Object as PropType<UserKyc | UserKycHistory>,
    rekognitionInfoHistory: {
      type: RekognitionInfoHistory,
    },
    rekognitionInfoHistoryDetail: {
      type: RekognitionInfoHistoryDetail,
    },
  },
  watch: {
    faceId: {
      handler() {
        this.findRelatedFaces()
      },
      immediate: true,
    },
  },
  computed: {
    faceId() {
      return this.rekognitionInfoHistory?.faceId
    },
    userId() {
      return this.rekognitionInfoHistory?.userId
    },
    usersOfFaceIdTableConfig() {
      return {
        dataSource: (params) =>
          UserKycService.findRekognitionInfoHistoryWithUserInfo({
            ...params,
            face_id: this.faceIdToFindUser,
            except_user_id: this.userId,
          }),
        columns: [
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'detected_at',
            title: 'detectedAt',
            sortable: true,
            class: 'td-w-250px',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            title: 'action',
            key: 'action',
            class: 'td-w-250px text-center',
          },
        ],
        searchColumns: [
          {
            key: 'email',
            title: 'email',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      } as ITableConfig
    },
  },
  data() {
    return {
      loading: false,
      relatedFaces: [] as Array<RelatedFaceDto>,
      faceIdToFindUser: null,
      usersOfFaceId: {
        showModal: false,
        tableReloadKey: 0,
        pagination: {
          size: 12,
          page: 1,
          total: 0,
        },
      },
    }
  },
  methods: {
    async findRelatedFaces(page = 1) {
      if (this.loading) return
      if (!this.faceId) {
        this.relatedFaces = []
      } else {
        const pagination = this.usersOfFaceId.pagination
        this.loading = true
        const filter = new FindRelatedFaceDto()
        filter.faceId = this.faceId
        filter.exceptUserId = this.userKyc?.userId
        filter.page = page
        filter.limit = pagination.size
        const response = await UserKycService.findRelatedFaces(filter)
        this.relatedFaces = response.data || []
        this.usersOfFaceId.pagination = response.pagination
        this.loading = false
      }
    },
    showUsersOfFaceId(faceId) {
      this.faceIdToFindUser = faceId
      this.usersOfFaceId.tableReloadKey++
      this.usersOfFaceId.showModal = true
    },
    closeUsersOfFaceIdModal() {
      this.usersOfFaceId.showModal = false
    },
  },
})
</script>

<style lang="scss" scoped>
.related-faces {
  max-height: 700px;
  overflow-y: auto;

  .loading-area {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    display: -webkit-flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }
}

@media screen and (min-width: 992px) {
  .related-faces {
    border: 0px solid #eff2f5;
    border-left-width: 1px;
  }
}
</style>
