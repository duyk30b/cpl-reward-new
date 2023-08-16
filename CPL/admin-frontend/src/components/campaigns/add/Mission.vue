<template>
  <!--begin::Card-->
  <div
    class="card card-flush mb-5 mb-lg-10 accordion"
    :class="{ 'modified-border': mission.isModified }"
    :id="'kt_mission_' + missionIndex"
  >
    <!--begin::Card header-->
    <div class="d-block m-0 p-0">
      <!--begin::Card title-->
      <div class="accordion-header" :id="'kt_mission_header_' + missionIndex">
        <button
          class="accordion-button fs-4 fw-bold px-10 bg-white"
          type="button"
          data-bs-toggle="collapse"
          :data-bs-target="'#kt_mission_body_' + missionIndex"
          aria-expanded="true"
          :aria-controls="'kt_mission_body_' + missionIndex"
        >
          {{
            campaign?.type === CAMPAIGN_TYPE.ORDER
              ? `Day ${missionIndex + 1} - `
              : ''
          }}
          {{ mission.fullTitle ?? $t('untitled') }}
          <div
            class="badge mx-4"
            v-if="mission.id"
            :class="{
              'badge-success': mission.status === MissionStatus.RUNNING,
              'badge-warning': mission.status === MissionStatus.OUT_OF_BUDGET,
              'badge-danger': mission.status === MissionStatus.ENDED,
              'badge-primary': mission.status === MissionStatus.COMING_SOON,
            }"
          >
            {{ $t(`missionStatus.${mission.status}`) }}
          </div>
        </button>
      </div>
      <!--begin::Card title-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div
      class="card-body accordion-collapse collapse show"
      :id="'kt_mission_body_' + missionIndex"
      :aria-labelledby="'kt_mission_header_' + missionIndex"
      :data-bs-parent="'#kt_mission_' + missionIndex"
    >
      <form @submit="confirmSaveMission" ref="missionForm">
        <!--begin::Input mission-->
        <div :class="{ 'overlay overlay-block': !mission.isActive }">
          <div
            v-if="!mission.isActive"
            class="overlay-layer bg-dark bg-opacity-5"
          />
          <!--begin::Custom fields-->
          <mission-basic-info
            v-model:opening-date="mission.openingDate"
            v-model:closing-date="mission.closingDate"
            v-model:title="mission.title"
            v-model:detailExplain="mission.detailExplain"
            v-model:titleJa="mission.titleJa"
            v-model:detailExplainJa="mission.detailExplainJa"
            v-model:priority="mission.priority"
            v-model:guideLink="mission.guideLink"
            v-model:guideLinkJa="mission.guideLinkJa"
            v-model:limitReceivedReward="mission.limitReceivedReward"
            :campaign="campaign"
          />
          <!--end::Custom fields-->

          <!--begin::Mission conditions-->
          <div class="z-mission-conditions mt-10">
            <h3 class="fw-bolder">{{ $t('eventCondition') }}</h3>
            <div
              class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3"
            >
              <div class="form-group row mb-2">
                <label for="eventSelect" class="col-sm-2 col-form-label">{{
                  $t('event')
                }}</label>
                <div class="col-sm-10">
                  <select
                    required
                    class="form-control form-control-sm"
                    id="eventSelect"
                    v-model="selectedEventName"
                    @change="changeMissionJudgmentTarget()"
                  >
                    <option value="" disabled>
                      --{{ $t('selectEvent') }}--
                    </option>
                    <option
                      v-for="(event, index) in kafkaEvents"
                      :key="index"
                      :value="event.eventName"
                    >
                      {{ event.eventName }} ({{ event.properties?.length }}
                      properties)
                    </option>
                  </select>
                </div>
              </div>

              <div class="table-responsive" v-if="selectedEventName">
                <table class="table table-borderless">
                  <thead>
                    <tr class="fw-bolder text-muted bg-light">
                      <th class="ps-4 w-50">{{ $t('property') }}</th>
                      <th class="w-10">{{ $t('operator') }}</th>
                      <th class="w-10">{{ $t('value') }}</th>
                      <th class="text-end pe-4 w-25">{{ $t('action') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(
                        judgmentCondition, i
                      ) in mission.judgmentConditions"
                      :key="i"
                    >
                      <tr>
                        <td>
                          <select
                            required
                            class="form-control form-control-sm"
                            v-model="mission.judgmentConditions[i].property"
                          >
                            <option
                              v-for="p in selectedEventProperties"
                              :key="p.key"
                              :value="p.key"
                            >
                              {{ p.key }} ({{
                                p.display ? p.display : p.type
                              }}
                              - {{ p.description }})
                            </option>
                          </select>
                        </td>
                        <td>
                          <select
                            required
                            class="form-control form-control-sm"
                            v-model="mission.judgmentConditions[i].operator"
                          >
                            <option
                              v-for="rule in getConditionRuleOperator(
                                mission.judgmentConditions[i].property,
                              ).operator"
                              :value="rule.key"
                              :key="rule.key"
                            >
                              {{ rule.value }}
                            </option>
                          </select>
                        </td>
                        <td class="w-25">
                          <input
                            v-if="
                              getConditionRuleOperator(
                                mission.judgmentConditions[i].property,
                              ).type === 'string'
                            "
                            required
                            class="form-control form-control-sm w-100"
                            v-model="mission.judgmentConditions[i].value"
                            maxlength="255"
                          />
                          <select
                            required
                            v-if="
                              getConditionRuleOperator(
                                mission.judgmentConditions[i].property,
                              ).type === 'boolean'
                            "
                            class="form-control form-control-sm"
                            v-model="mission.judgmentConditions[i].value"
                          >
                            <option value="true">true</option>
                            <option value="false">false</option>
                          </select>
                          <select
                            required
                            v-if="
                              getConditionRuleOperator(
                                mission.judgmentConditions[i].property,
                              ).type === 'enum'
                            "
                            class="form-control form-control-sm"
                            v-model="mission.judgmentConditions[i].value"
                          >
                            <option
                              v-for="(
                                optionValue, optionKey
                              ) in getConditionRuleOperator(
                                mission.judgmentConditions[i].property,
                              ).options"
                              :value="optionValue"
                              :key="optionKey"
                            >
                              {{ optionKey }}
                            </option>
                          </select>
                          <input
                            required
                            class="form-control form-control-sm"
                            v-if="
                              getConditionRuleOperator(
                                mission.judgmentConditions[i].property,
                              ).type === 'number'
                            "
                            v-model="mission.judgmentConditions[i].value"
                            @updated="
                              mission.judgmentConditions[i].value =
                                $event.target.value
                            "
                            v-number
                          />
                          <input
                            type="number"
                            required
                            v-if="
                              getConditionRuleOperator(
                                mission.judgmentConditions[i].property,
                              ).type === 'unix_timestamp'
                            "
                            v-model="mission.judgmentConditions[i].value"
                            step="1"
                            min="1000000000000"
                            max="9999999999999"
                            class="form-control form-control-sm"
                          />
                        </td>
                        <td class="text-end">
                          <div
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
                            @click="duplicateEventCondition(judgmentCondition)"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen054.svg"
                              />
                            </span>
                          </div>
                          <div
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                            @click="deleteEventCondition(i)"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen027.svg"
                              />
                            </span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!--end::Mission conditions-->

          <!--begin::Display conditions-->
          <div class="mt-10">
            <h3 class="fw-bolder">{{ $t('displayCondition') }}</h3>
            <div
              class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3"
            >
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr class="fw-bolder text-muted bg-light">
                      <th class="ps-4 w-50">{{ $t('eventName') }}</th>
                      <th class="w-10">{{ $t('operator') }}</th>
                      <th class="w-10">{{ $t('value') }}</th>
                      <th class="text-end pe-4 w-25">{{ $t('action') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(
                        displayConditionItem, u
                      ) in mission.displayConditions"
                      :key="u"
                    >
                      <tr>
                        <td>
                          <select
                            required
                            class="form-control form-control-sm"
                            v-model="mission.displayConditions[u].property"
                          >
                            <option
                              v-for="(value, key) in displayConditions"
                              :key="key"
                              :value="key"
                            >
                              {{ key }}
                              {{ value?.label ? ` (${value.label})` : '' }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <select
                            required
                            class="form-control form-control-sm"
                            v-model="mission.displayConditions[u].operator"
                          >
                            <option value="==">=</option>
                            <option value="!=">&ne;</option>
                            <option value=">">&gt;</option>
                            <option value=">=">&ge;</option>
                            <option value="<=">&le;</option>
                            <option value="<">&lt;</option>
                          </select>
                        </td>
                        <td class="w-25">
                          <input
                            required
                            v-if="
                              !displayConditions[
                                mission.displayConditions[u].property
                              ]?.display ||
                              displayConditions[
                                mission.displayConditions[u].property
                              ]?.display === 'string'
                            "
                            class="form-control form-control-sm w-100"
                            v-model="mission.displayConditions[u].value"
                            maxlength="255"
                          />
                          <currency-input
                            required
                            class="form-control form-control-sm"
                            v-if="
                              displayConditions[
                                mission.displayConditions[u].property
                              ]?.display === 'number'
                            "
                            :options="{
                              locale: 'en',
                              currency: 'USD',
                              precision: 0,
                              valueRange: {
                                min: 0,
                              },
                              allowNegative: false,
                              currencyDisplay: 'hidden',
                            }"
                            v-model="mission.displayConditions[u].value"
                          />
                          <select
                            required
                            v-if="
                              displayConditions[
                                mission.displayConditions[u].property
                              ]?.display === 'enum'
                            "
                            class="form-control form-control-sm w-100"
                            v-model="mission.displayConditions[u].value"
                          >
                            <option
                              v-for="(value, key) in displayConditions[
                                mission.displayConditions[u].property
                              ]?.options"
                              :value="value"
                              :key="key"
                            >
                              {{ key }}
                            </option>
                          </select>
                          <select
                            required
                            v-if="
                              displayConditions[
                                mission.displayConditions[u].property
                              ]?.display === 'select'
                            "
                            class="form-control form-control-sm w-100"
                            v-model="mission.displayConditions[u].value"
                          >
                            <option
                              v-for="option in conditionSelectOptions[
                                mission.displayConditions[u].property
                              ]"
                              :value="option.id"
                              :key="option.id"
                            >
                              {{ option.name }}
                            </option>
                          </select>
                        </td>
                        <td class="text-end">
                          <div
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
                            @click="
                              duplicateDisplayCondition(displayConditionItem)
                            "
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen054.svg"
                              />
                            </span>
                          </div>
                          <div
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                            @click="deleteDisplayCondition(u)"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen027.svg"
                              />
                            </span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!--end::Display conditions-->

          <!--begin::User conditions-->
          <div class="z-user-conditions mt-10">
            <h3 class="fw-bolder">{{ $t('userCondition') }}</h3>
            <div
              class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3"
            >
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr class="fw-bolder text-muted bg-light">
                      <th class="ps-4 w-50">{{ $t('eventName') }}</th>
                      <th class="w-10">{{ $t('operator') }}</th>
                      <th class="w-10">{{ $t('value') }}</th>
                      <th class="text-end pe-4 w-25">{{ $t('action') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(userConditionItem, u) in mission.userConditions"
                      :key="u"
                    >
                      <tr>
                        <td>
                          <select
                            required
                            class="form-control form-control-sm"
                            v-model="mission.userConditions[u].property"
                          >
                            <option
                              v-for="(value, key) in userConditions"
                              :key="key"
                              :value="key"
                            >
                              {{ key }}
                              {{ value?.label ? ` (${value.label})` : '' }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <select
                            required
                            class="form-control form-control-sm"
                            v-model="mission.userConditions[u].operator"
                          >
                            <option value="==">=</option>
                            <option value="!=">&ne;</option>
                            <option value=">">&gt;</option>
                            <option value=">=">&ge;</option>
                            <option value="<=">&le;</option>
                            <option value="<">&lt;</option>
                          </select>
                        </td>
                        <td class="w-25">
                          <input
                            required
                            v-if="
                              !userConditions[
                                mission.userConditions[u].property
                              ]?.display ||
                              userConditions[mission.userConditions[u].property]
                                ?.display === 'string'
                            "
                            class="form-control form-control-sm w-100"
                            v-model="mission.userConditions[u].value"
                            maxlength="255"
                          />
                          <currency-input
                            required
                            class="form-control form-control-sm"
                            v-if="
                              userConditions[mission.userConditions[u].property]
                                ?.display === 'number'
                            "
                            :options="{
                              locale: 'en',
                              currency: 'USD',
                              precision: 0,
                              valueRange: {
                                min: 0,
                              },
                              allowNegative: false,
                              currencyDisplay: 'hidden',
                            }"
                            v-model="mission.userConditions[u].value"
                          />
                          <select
                            required
                            v-if="
                              userConditions[mission.userConditions[u].property]
                                ?.display === 'enum'
                            "
                            class="form-control form-control-sm w-100"
                            v-model="mission.userConditions[u].value"
                          >
                            <option
                              v-for="(value, key) in userConditions[
                                mission.userConditions[u].property
                              ]?.options"
                              :value="value"
                              :key="key"
                            >
                              {{ key }}
                            </option>
                          </select>
                          <select
                            required
                            v-if="
                              displayConditions[
                                mission.userConditions[u].property
                              ]?.display === 'select'
                            "
                            class="form-control form-control-sm w-100"
                            v-model="mission.userConditions[u].value"
                          >
                            <option
                              v-for="option in conditionSelectOptions[
                                mission.userConditions[u].property
                              ]"
                              :value="option.id"
                              :key="option.id"
                            >
                              {{ option.name }}
                            </option>
                          </select>
                        </td>
                        <td class="text-end">
                          <div
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-2"
                            @click="duplicateUserCondition(userConditionItem)"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen054.svg"
                              />
                            </span>
                          </div>
                          <div
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                            @click="deleteUserCondition(u)"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen027.svg"
                              />
                            </span>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <!--end::User conditions-->

          <!--begin::Reward recipients-->
          <div class="z-user-conditions mt-10">
            <h3 class="fw-bolder">{{ $t('rewardRecipient') }}</h3>
            <div
              class="d-flex flex-column fv-row rounded-3 p-7 border border-dashed border-gray-300 mb-3"
            >
              <div class="table-responsive">
                <table class="table table-borderless">
                  <thead>
                    <tr class="fw-bolder text-muted bg-light">
                      <th class="ps-4 w-auto">{{ $t('userLabel') }}</th>
                      <th class="w-auto" v-show="isDisplayGrantMethod">
                        {{ $t('grantMethod') }}
                      </th>
                      <th class="w-auto">
                        {{ $t('amount') }}
                      </th>
                      <th class="w-auto" v-show="isDisplayGrantMethod">
                        {{ $t('propertyToCalculateAmount') }}
                      </th>
                      <th class="w-auto pe-4">{{ $t('wallet') }}</th>
                      <th class="w-auto">{{ $t('currency') }}</th>
                      <th class="w-auto pe-4">{{ $t('action') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template
                      v-for="(item, index) in mission.grantTarget"
                      :key="index"
                    >
                      <tr>
                        <td>
                          <select
                            v-if="index === 0"
                            required
                            :disabled="mission.id"
                            class="form-control form-control-sm"
                            v-model="mission.grantTarget[index].user"
                            @change="onChangeTargetUser"
                          >
                            <option
                              v-for="target in targetUsers"
                              :value="target.key"
                              :key="target.key"
                            >
                              {{ target.value }}
                            </option>
                          </select>
                          <input
                            v-if="index === 1"
                            required
                            disabled
                            class="form-control form-control-sm"
                            :value="
                              getTargetUserValueByKey(
                                mission.grantTarget[index].user,
                              )
                            "
                          />
                        </td>
                        <td v-show="isDisplayGrantMethod">
                          <select
                            :disabled="mission.id"
                            class="form-control form-control-sm"
                            v-model="mission.grantTarget[index].grantMethod"
                            @change="
                              onChangeGrantMethod(
                                mission.grantTarget[index].grantMethod,
                                index,
                              )
                            "
                          >
                            <option
                              v-for="method in grantMethods"
                              :value="method.key"
                              :key="method.key"
                              :disabled="
                                isDisabledGrantMethod(index, method.key)
                              "
                            >
                              {{ method.value }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <input
                            required
                            class="form-control form-control-sm"
                            v-model="mission.grantTarget[index].amount"
                            @updated="
                              mission.grantTarget[index].amount =
                                $event.target.value
                            "
                            v-number
                          />
                        </td>
                        <td v-show="isDisplayGrantMethod">
                          <select
                            required
                            :disabled="
                              isDisabledPropertyToCalculateAmount(index)
                            "
                            class="form-control form-control-sm"
                            v-model="
                              mission.grantTarget[index]
                                .propertyToCalculateAmount
                            "
                          >
                            <option
                              v-for="property in propertiesToCalculateAmount"
                              :value="property.key"
                              :key="property.key"
                            >
                              {{ property.value }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <select
                            required
                            class="form-control form-control-sm"
                            v-model="mission.grantTarget[index].wallet"
                            :disabled="index <= this.createdGrantTargetMaxIndex"
                            @change="changeGrantTargetWallet(index)"
                          >
                            <option
                              v-for="target in targetWallets"
                              :value="target.key"
                              :key="target.key"
                            >
                              {{ target.value }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <select
                            v-if="isSelectCurrencyOnlyUsdt(index)"
                            required
                            class="form-control form-control-sm"
                            v-model="mission.grantTarget[index].currency"
                            :disabled="isDisabledCurrencyRewardRule(index)"
                            @change="changeGrantTargetCurrency(index)"
                          >
                            <option
                              v-for="currency in cashbackCurrencies"
                              :value="currency"
                              :key="currency"
                            >
                              {{ currency }}
                            </option>
                          </select>
                          <select
                            v-else
                            required
                            class="form-control form-control-sm"
                            v-model="mission.grantTarget[index].currency"
                            :disabled="isDisabledCurrencyRewardRule(index)"
                            @change="changeGrantTargetCurrency(index)"
                          >
                            <option
                              v-for="currency in balanceCurrencies"
                              :value="currency"
                              :key="currency"
                            >
                              {{ currency }}
                            </option>
                            <option
                              v-if="
                                mission.grantTarget[index].currency &&
                                !balanceCurrencies.includes(
                                  mission.grantTarget[index].currency,
                                )
                              "
                              :value="mission.grantTarget[index].currency"
                              disabled
                            >
                              {{ mission.grantTarget[index].currency }}
                            </option>
                          </select>
                        </td>
                        <td>
                          <div
                            v-if="mission.grantTarget.length === 1"
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm float-end"
                            @click="addGrantTarget"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen041.svg"
                              />
                            </span>
                          </div>
                          <div
                            v-if="
                              index === 1 && index > createdGrantTargetMaxIndex
                            "
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm float-end"
                            @click="deleteGrantTarget"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="media/icons/duotune/general/gen027.svg"
                              />
                            </span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="5">
                          <div class="d-flex justify-content-between">
                            <div class="w-50 pe-3">
                              <div>{{ $t('createNewTag') }} :</div>
                              <div class="d-flex justify-content-between gap-2">
                                <input
                                  class="form-control form-control-sm"
                                  type="text"
                                  v-model="newTags[index]"
                                  @input="newTagNotices[index] = ''"
                                />
                                <button
                                  type="button"
                                  class="btn btn-success btn-sm text-nowrap"
                                  :disabled="
                                    createTagLoading || !newTags[index]
                                  "
                                  @click="(e) => createNewTag(e, index)"
                                >
                                  {{ $t('create') }}
                                </button>
                              </div>
                              <small>{{ newTagNotices[index] }}</small>
                            </div>
                            <div class="w-50 ps-3">
                              <span>{{ $t('autoTagging') }}: </span>
                              <multiselect
                                ref="tagsSelector"
                                v-model="mission.grantTarget[index].tagIds"
                                mode="tags"
                                :placeholder="$t('searchTags')"
                                :close-on-select="false"
                                :filter-results="false"
                                :min-chars="1"
                                :delay="300"
                                label="label"
                                track-by="label"
                                :searchable="true"
                                :options="(text) => searchTags(text, index)"
                                :key="tagForceRender"
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </template>
                  </tbody>
                </table>
                <!--start::Reward limmit-->
                <h2 class="fw-bolder mt-2">{{ $t('budgetLimit') }}</h2>
                <div
                  class="mt-5"
                  v-for="(rule, index) in mission.rewardRules"
                  :key="rule.key"
                >
                  <label class="col-lg-12 fw-bold text-muted" :for="rule.key">
                    {{ uppercaseFirst(rule.key.replace('_', ' ')) }} budget
                  </label>
                  <div class="d-flex justify-content-between mt-2">
                    <div class="w-75 pe-4">
                      <input
                        class="form-control form-control-sm"
                        :required="!rewardLimitMinimum[index].disabled"
                        :disabled="rewardLimitMinimum[index].disabled"
                        v-model="rule.limitValue"
                        @updated="rule.limitValue = $event.target.value"
                        v-number="{
                          min: rewardLimitMinimum[index].min,
                          max: rewardLimitMinimum[index].disabled
                            ? 0
                            : undefined,
                        }"
                      />
                    </div>
                    <div class="w-25">
                      <input
                        class="form-control form-control-sm w-100"
                        v-model="rule.currency"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <!--end::Reward limit-->
                <!--start::Released reward-->
                <h2 class="fw-bolder mt-5">{{ $t('statsReleasedMoney') }}</h2>
                <div
                  class="mt-5"
                  v-for="rule in mission.rewardRules"
                  :key="rule.key"
                >
                  <label class="col-lg-12 fw-bold text-muted" :for="rule.key">
                    Released {{ rule.key.replace('_', ' ') }}
                  </label>
                  <div class="d-flex justify-content-between">
                    <div class="w-75 pe-4 mt-2">
                      <input
                        class="form-control form-control-sm"
                        :value="rule.releaseValue"
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <!--end::Released reward-->
              </div>
            </div>
          </div>
          <!--end::Reward recipients-->
        </div>
        <!--end::Input misison-->

        <div class="d-flex justify-content-end mt-8">
          <button
            v-if="!mission.id"
            type="button"
            class="me-2 btn btn-sm btn-flex btn-light-danger"
            @click="deleteMission()"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen027.svg" />
            </span>
            {{ $t('deleteMission') }}
          </button>
          <button
            v-if="mission.id && mission.isActive"
            type="button"
            class="me-2 btn btn-sm btn-flex btn-light-warning"
            @click="toggleActiveMission()"
            :data-kt-indicator="loadingActive ? 'on' : ''"
            :disabled="loadingSave || loadingActive"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen040.svg" />
            </span>
            {{ $t('deactivateMission') }}
            <span class="indicator-progress">
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
          <button
            v-if="mission.id && !mission.isActive"
            type="button"
            class="me-2 btn btn-sm btn-flex btn-light-primary"
            @click="toggleActiveMission()"
            :data-kt-indicator="loadingActive ? 'on' : ''"
            :disabled="loadingSave || loadingActive"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen043.svg" />
            </span>
            {{ $t('activateMission') }}
            <span class="indicator-progress">
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
          <button
            v-if="mission.isActive"
            type="submit"
            class="btn btn-sm btn-flex btn-success"
            :data-kt-indicator="loadingSave ? 'on' : ''"
            :disabled="loadingSave || loadingActive"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="media/icons/duotune/general/gen037.svg" />
            </span>
            {{ $t('saveMission') }}
            <span class="indicator-progress">
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </div>
      </form>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import MissionBasicInfo from '@/components/campaigns/add/MissionBasicInfo.vue'
import {
  JudgmentConditionEntity,
  ConditionRules,
} from '@/core/data/campaign/judgment-condition'
import {
  GRANT_METHOD,
  GrantTargetEntity,
} from '@/core/data/campaign/grant-target'
import MissionEntity, {
  MissionActive,
  MissionStatus,
} from '@/core/data/campaign/mission'
import { useStore } from 'vuex'
import { plainToClass, instanceToPlain } from 'class-transformer'
import { MissionService } from '@/services/MissionService'
import {
  MISSION_CURRENCY_CASHBACK_LIST,
  DEFAULT_CURRENCY,
} from '@/core/data/currencies'
import CurrencyInput from '@/components/form/CurrencyInput.vue'
import { capitalizeFirstLetter } from '@/core/helpers/util'
import Campaign, {
  CAMPAIGN_TYPE,
  CampaignHidden,
} from '@/core/data/campaign/campaign'
import Swal from 'sweetalert2'
import {
  getAllCountries,
  trimEndSmallDecimal,
} from '@/core/helpers/common.helper'
import { HttpStatus } from '@/core/variables/common.enum'
import { FixedNumber } from 'ethers'
import { DisplayConditionEntity } from '@/core/data/campaign/display-condition'
import Multiselect from '@vueform/multiselect'
import { UserTagService } from '@/services/UserTagService'

export default defineComponent({
  name: 'kt-mission',
  components: { MissionBasicInfo, CurrencyInput, Multiselect },
  props: {
    missionIndex: Number,
    propMission: {
      type: Object,
      default: new MissionEntity(),
    },
    campaign: Campaign,
  },
  data() {
    let selectedEventName = ''
    if (
      this.propMission.judgmentConditions &&
      this.propMission.judgmentConditions.length
    ) {
      selectedEventName = this.propMission.judgmentConditions[0].eventName
    }

    return {
      tagForceRender: 0,
      mission: this.propMission,
      selectedEventName: selectedEventName,
      balanceCurrencies: this.listCoin,
      cashbackCurrencies: MISSION_CURRENCY_CASHBACK_LIST,
      loadingSave: false,
      loadingActive: false,
      createTagLoading: false,
      originalMissionData: JSON.stringify(instanceToPlain(this.propMission)),
      MissionStatus,
      CAMPAIGN_TYPE,
      newTags: ['', ''],
      newTagNotices: ['', ''],
      conditionSelectOptions: {
        'user_info.nationality_id': getAllCountries()
          .sort((a, b) => a.id - b.id)
          .map((e) => ({
            id: e.id,
            name: `${e.name} (${e.id})`,
          })),
      },
    }
  },
  watch: {
    mission: {
      handler: function (newVal) {
        for (let index = 0; index < newVal.rewardRules.length; index++) {
          const grantWallets = newVal.grantTarget.filter((target) =>
            String(target.wallet)
              .toLowerCase()
              .includes(newVal.rewardRules[index].key.toLowerCase()),
          )

          if (grantWallets.length > 0) {
            newVal.rewardRules[index].currency =
              grantWallets[0]?.currency || DEFAULT_CURRENCY
          } else {
            if (!newVal.rewardRules[index]?.currency) {
              newVal.rewardRules[index].currency = DEFAULT_CURRENCY
            }
          }
        }

        if (!this.mission.id) {
          newVal.isModified = true
          this.$emit('updated', newVal)
          return
        }

        newVal.isModified =
          JSON.stringify(instanceToPlain(this.mission)) !==
          this.originalMissionData

        this.$emit('updated', newVal)
      },
      deep: true,
    },
    campaign: {
      handler(updatedCampaign, oldValue) {
        if (updatedCampaign.type === CAMPAIGN_TYPE.ORDER) {
          const lastMissionData = JSON.parse(this.originalMissionData)
          lastMissionData.opening_date = updatedCampaign.startDate
          lastMissionData.closing_date = updatedCampaign.endDate
          // lastMissionData.display_conditions = []
          // this.mission.displayConditions = []
          this.originalMissionData = JSON.stringify(lastMissionData)
        }

        // if (
        //   updatedCampaign.type !== CAMPAIGN_TYPE.ORDER &&
        //   oldValue.type === CAMPAIGN_TYPE.ORDER
        // ) {
        //   this.mission.displayConditions = [new DisplayConditionEntity()]
        // }
      },
    },
  },
  computed: {
    selectedEventProperties() {
      const result = this.kafkaEvents.find(
        (e) => e.eventName === this.selectedEventName,
      )
      if (!result) {
        return []
      }

      return result.properties
    },
    isDisplayGrantMethod() {
      return (
        this.selectedEventName.includes('high_low') &&
        this.campaign &&
        this.campaign.isHidden === CampaignHidden.HIDDEN
      )
    },
    rewardLimitMinimum() {
      return this.mission.rewardRules.map((rule) => {
        const status = {
          disabled: false,
          min: '0',
        }

        const grantWallets = this.mission.grantTarget.filter((target) =>
          String(target.wallet).toLowerCase().includes(rule.key.toLowerCase()),
        )

        if (grantWallets.length === 0) {
          status.disabled = true
          return status
        }

        const minCalc = grantWallets.reduce(
          (prev, current) =>
            prev.addUnsafe(
              FixedNumber.from(current.amount || 0, 'fixed256x26'),
            ),
          FixedNumber.from('0', 'fixed256x26'),
        )

        status.min = trimEndSmallDecimal(String(minCalc._value))
        return status
      })
    },
    createdGrantTargetMaxIndex() {
      if (!this.mission.id) {
        return -1
      }

      if (!JSON.parse(this.originalMissionData).grant_target) {
        return -1
      }

      return JSON.parse(this.originalMissionData).grant_target.length - 1
    },
  },
  methods: {
    duplicateEventCondition(eventCondition) {
      this.mission.judgmentConditions = this.mission.judgmentConditions || []
      this.mission.judgmentConditions.push({ ...eventCondition })
    },
    deleteEventCondition(i) {
      if (
        this.mission.judgmentConditions &&
        this.mission.judgmentConditions.length <= 1
      ) {
        return
      }

      this.mission.judgmentConditions.splice(i, 1)
    },
    duplicateUserCondition(userCondition) {
      this.mission.userConditions.push({ ...userCondition })
    },
    deleteUserCondition(i) {
      if (
        this.mission.userConditions &&
        this.mission.userConditions.length <= 1
      ) {
        return
      }
      this.mission.userConditions.splice(i, 1)
    },
    duplicateDisplayCondition(displayCondition) {
      this.mission.displayConditions.push({ ...displayCondition })
    },
    deleteDisplayCondition(i) {
      if (
        this.mission.displayConditions &&
        this.mission.displayConditions.length <= 1
      ) {
        return
      }
      this.mission.displayConditions.splice(i, 1)
    },
    deleteMission() {
      if (!this.mission.id) {
        this.$emit('deleteMission')
      }
    },
    async confirmSaveMission(e) {
      e.preventDefault()
      const { isConfirmed } = await Swal.fire({
        text: this.$t('confirmSaveMessage'),
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('save'),
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-secondary',
        },
      })

      if (isConfirmed) {
        await this.saveMission()
      }
    },
    async saveMission() {
      this.mission.displayConditions.forEach((i) => {
        i.type = this.displayConditions[i.property].type
      })
      this.mission.userConditions.forEach((i) => {
        i.type = this.userConditions[i.property].type
      })
      this.mission.judgmentConditions = this.mission.judgmentConditions || []
      this.mission.judgmentConditions.forEach((i) => {
        const event = this.kafkaEvents.find((j) => j.eventName === i.eventName)
        i.type = event.properties.find((k) => k.key === i.property).type
      })
      this.loadingSave = true
      if (!this.mission.id) {
        const res = await MissionService.createMission(
          instanceToPlain(this.mission),
        )

        this.loadingSave = false
        if (res.status === HttpStatus.OK) {
          const newMission = plainToClass(MissionEntity, res.data.data)
          if (!newMission.displayConditions) {
            newMission.displayConditions = []
          }

          this.mission = newMission
          this.originalMissionData = JSON.stringify(instanceToPlain(newMission))
          this.$toastr.success(this.$t('success'))
          this.tagForceRender++
          return
        }

        this.showErrorToast(res.data)
        return
      }

      const res = await MissionService.updateMission(
        instanceToPlain(this.mission),
      )
      this.loadingSave = false
      if (res.status === HttpStatus.OK) {
        const updatedMission = plainToClass(MissionEntity, res.data)
        if (!updatedMission.displayConditions) {
          updatedMission.displayConditions = []
        }

        this.mission = updatedMission
        this.originalMissionData = JSON.stringify(
          instanceToPlain(updatedMission),
        )
        this.$toastr.success(this.$t('success'))
        return
      }

      this.showErrorToast(res.data)
    },
    showErrorToast(data) {
      let toastrMsg = this.$t(data?.message)
      if (data.errors) {
        toastrMsg += ': ' + data.errors[0].msg
      }
      this.$toastr.error(toastrMsg)
    },
    changeMissionJudgmentTarget() {
      const judgmentCondition = new JudgmentConditionEntity()
      judgmentCondition.eventName = this.selectedEventName
      this.mission.judgmentConditions = [judgmentCondition]
      if (!this.isDisplayGrantMethod) {
        this.mission.grantTarget.forEach((target) => {
          target.grantMethod = GRANT_METHOD.FIXED
          target.propertyToCalculateAmount = ''
        })
      }
    },
    async toggleActiveMission() {
      if (!this.mission.id) {
        return
      }

      const missionParams = JSON.parse(this.originalMissionData)
      missionParams.is_active =
        missionParams.is_active === MissionActive.ACTIVE
          ? MissionActive.INACTIVE
          : MissionActive.ACTIVE

      this.loadingActive = true

      missionParams.display_conditions ||= []
      missionParams.judgment_conditions ||= []

      missionParams.display_conditions.forEach((i) => {
        i.type = this.displayConditions[i.property].type
      })
      missionParams.user_conditions.forEach((i) => {
        i.type = this.userConditions[i.property].type
      })
      missionParams.judgment_conditions.forEach((i) => {
        const event = this.kafkaEvents.find((j) => j.eventName === i.event_name)
        i.type = event.properties.find((k) => k.key === i.property).type
      })

      const res = await MissionService.updateMission(missionParams)
      this.loadingActive = false
      if (res.status === HttpStatus.OK) {
        const updatedMission = plainToClass(MissionEntity, res.data)
        if (!updatedMission.displayConditions) {
          updatedMission.displayConditions = []
        }

        this.mission = updatedMission
        this.originalMissionData = JSON.stringify(
          instanceToPlain(updatedMission),
        )
        this.$toastr.success(this.$t('success'))
        return
      }

      this.$toastr.error(this.$t(res.data?.message))
    },
    uppercaseFirst(str) {
      return capitalizeFirstLetter(str)
    },
    addGrantTarget() {
      if (this.mission.grantTarget.length >= 2) {
        return
      }

      const newTarget = new GrantTargetEntity()
      if (this.mission.grantTarget[0].user) {
        newTarget.user = this.targetUsers.find(
          (item) => item.key !== this.mission.grantTarget[0].user,
        )?.key
      }

      this.mission.grantTarget.push(newTarget)
    },
    deleteGrantTarget() {
      if (this.mission.grantTarget.length <= 1) {
        return
      }

      this.mission.grantTarget.pop()
    },
    getTargetUserValueByKey(key) {
      const target = this.targetUsers.find((item) => item.key === key)
      if (target) {
        return target.value
      }

      return ''
    },
    onChangeTargetUser(event) {
      if (this.mission.grantTarget.length <= 1) {
        return
      }

      this.mission.grantTarget[1].user = this.targetUsers.find(
        (item) => item.key !== event.target.value,
      )?.key
    },
    onChangeGrantMethod(value, index) {
      if (value && [GRANT_METHOD.FIXED].includes(value)) {
        this.mission.grantTarget[index].propertyToCalculateAmount = ''
      }
    },
    getConditionRuleOperator(key) {
      const selectedProperty = this.selectedEventProperties.find(
        (property) => key === property.key,
      )

      if (!selectedProperty) {
        return ConditionRules['string']
      }

      if (selectedProperty.display) {
        return {
          ...ConditionRules[selectedProperty.display],
          options: selectedProperty.options,
        }
      }

      return {
        ...ConditionRules[selectedProperty.type],
        options: selectedProperty.options,
      }
    },
    validateForm() {
      if (!this.mission.isModified) {
        return true
      }

      const missionForm = this.$refs.missionForm as HTMLFormElement
      return missionForm.reportValidity()
    },
    isDisabledCurrencyRewardRule(index) {
      if (index <= this.createdGrantTargetMaxIndex) {
        return true
      }

      if (
        !this.mission.grantTarget[index].wallet ||
        index < 1 ||
        this.mission.grantTarget[index].wallet !=
          this.mission.grantTarget[0].wallet
      ) {
        return false
      }

      return true
    },
    isDisabledGrantMethod(index, value) {
      // Option percent sẽ chỉ được phép chọn nếu ở Campaign đang ẩn và Event thuộc high_low
      if (value && [GRANT_METHOD.PERCENT].includes(value)) {
        if (
          this.mission.judgmentConditions &&
          this.mission.judgmentConditions.length == 0
        ) {
          return true
        } else {
          return !this.isDisplayGrantMethod
        }
      }

      return false
    },
    isDisabledPropertyToCalculateAmount(index) {
      return (
        this.mission.id ||
        ![GRANT_METHOD.PERCENT].includes(
          this.mission.grantTarget[index]?.grantMethod,
        )
      )
    },
    isSelectCurrencyOnlyUsdt(index) {
      // Các trường hợp sau sẽ chỉ cho chọn Currency USDT:
      // TH1: Wallet = CASHBACK
      // TH2: Đang chọn event high_low và trả thưởng theo %
      if (
        this.mission.grantTarget[index].wallet &&
        this.mission.grantTarget[index].wallet.includes('CASHBACK')
      ) {
        return true
      }

      if (
        this.mission.judgmentConditions?.[0]?.eventName?.includes('high_low') &&
        [GRANT_METHOD.PERCENT].includes(
          this.mission.grantTarget[index]?.grantMethod,
        )
      ) {
        return true
      }

      return false
    },
    changeGrantTargetWallet(index) {
      if (
        index > 0 &&
        this.mission.grantTarget[index].wallet ===
          this.mission.grantTarget[0].wallet
      ) {
        this.mission.grantTarget[index].currency =
          this.mission.grantTarget[0].currency
        return
      }

      if (
        index > 0 &&
        this.mission.grantTarget[index].wallet !==
          this.mission.grantTarget[0].wallet
      ) {
        this.mission.grantTarget[index].currency = null
        return
      }

      this.mission.grantTarget[0].currency = null
      if (
        this.mission.grantTarget[1] &&
        this.mission.grantTarget[0].wallet ===
          this.mission.grantTarget[1].wallet
      ) {
        this.mission.grantTarget[1].currency = null
      }
    },
    changeGrantTargetCurrency(index) {
      if (index > 0) {
        return
      }

      if (
        this.mission.grantTarget[1] &&
        this.mission.grantTarget[0].wallet ===
          this.mission.grantTarget[1].wallet
      ) {
        this.mission.grantTarget[1].currency =
          this.mission.grantTarget[0].currency
      }
    },
    async searchTags(text, index) {
      const defaultTags = this.mission.grantTarget[index]?.tagIds?.length
        ? this.mission.grantTarget[index].tagIds
        : []

      let existingTags = [] as any[]
      if (defaultTags.length > 0) {
        const existingTagsResponse = await UserTagService.getTagByIds(
          defaultTags,
        )
        if (existingTagsResponse.status === HttpStatus.OK) {
          existingTags = existingTagsResponse.data.data
        }
      }
      const response = await UserTagService.getListTags({
        search_field: 'name',
        search_text: text,
        sort: 'created_at',
        sort_type: 'DESC',
      })

      if (response.status !== HttpStatus.OK) {
        return defaultTags
      }

      const searchResult = response.data.data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        }
      })

      // Add existing tag
      existingTags.map((item) => {
        searchResult.push({
          value: item.id,
          label: item.name,
        })
      })

      defaultTags.forEach((tag) => {
        if (searchResult.find((item) => item.id === tag.id)) {
          return
        }

        searchResult.push({
          value: tag.id,
          label: tag.name,
        })
      })

      return searchResult
    },
    async createNewTag(e, index) {
      e.preventDefault()
      this.createTagLoading = true
      const response = await UserTagService.createOneTag(this.newTags[index])
      this.createTagLoading = false

      if (response.status !== HttpStatus.CREATED) {
        this.newTagNotices[index] = this.$t('failedAddedTagMsg')
        return
      }

      if (response.data.data.is_existed) {
        this.newTagNotices[index] = this.$t('failedCreateExistedTag')
        return
      }

      this.newTags[index] = ''
      this.newTagNotices[index] = this.$t('succeedAddedTagMsg')
      this.mission.grantTarget[index].tagIds.push(response.data.data.id)

      const multipleSelect = this.$refs.tagsSelector as any
      multipleSelect[index].select({
        label: response.data.data.name,
        value: response.data.data.id,
      })
    },
  },
  setup() {
    const store = useStore()
    // Get kafka event list
    const kafkaEvents = computed(() => {
      return store.getters.getKafkaEvents
    })

    const targetUsers = computed(() => {
      return store.getters.getTargetUsers
    })

    const targetWallets = computed(() => {
      return store.getters.getTargetWallets
    })

    const grantMethods = computed(() => {
      return store.getters.getGrantMethods
    })

    const propertiesToCalculateAmount = computed(() => {
      return store.getters.getPropertiesToCalculateAmount
    })

    const userConditions = computed(() => {
      return store.getters.getUserConditions
    })

    const displayConditions = computed(() => {
      return store.getters.getDisplayConditions
    })

    const listCoin = computed(() => {
      return store.getters.listCoin
    })

    return {
      kafkaEvents,
      targetUsers,
      targetWallets,
      grantMethods,
      propertiesToCalculateAmount,
      userConditions,
      displayConditions,
      listCoin,
    }
  },
})
</script>
<style>
.w-10 {
  width: 10%;
}
.w-15 {
  width: 15%;
}
.modified-border {
  border: 1px solid #ffc700;
  overflow: hidden;
}
.card {
  overflow: hidden;
}
.overlay-block {
  cursor: not-allowed !important;
}
.overlay-layer {
  margin: -13px;
  border-radius: 0.475rem;
}
.multiselect-placeholder {
  font-size: 13px !important;
}
</style>
