<template>
  <div class="pointer-events-none fixed inset-0 z-50 overflow-hidden">
    <FileUploadModal
      v-if="isUploadMode"
      class="pointer-events-auto"
      title="Upload Media"
      @close="$emit('close')"
      @uploaded="onUploaded"
    />
    <div v-else class="pointer-events-auto fixed inset-y-0 right-0 flex max-w-full pl-10">
      <div class="w-screen max-w-md">
        <div
          class="flex h-full flex-col border-l border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900"
        >
          <!-- Header slot -->
          <slot
            name="header"
            :title="title"
            :loading="loading"
            :handlers="{ close: () => $emit('close') }"
          >
            <div
              class="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900"
            >
              <slot name="title" :title="title">
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {{ title }}
                </h3>
              </slot>
              <slot name="close-button" :handlers="{ close: () => $emit('close') }">
                <button
                  class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  @click="$emit('close')"
                >
                  ✕
                </button>
              </slot>
            </div>
          </slot>
          <!-- Content slot -->
          <slot
            name="content"
            :form-data="formData"
            :errors="errors"
            :resolved-form="resolvedForm"
            :loading="loading"
            :handlers="{ submit: handleSubmit, blur: onBlur, input: onInput }"
          >
            <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
              <form class="space-y-6 px-6 py-6" @submit.prevent="handleSubmit">
                <slot
                  name="form-fields"
                  :form-data="formData"
                  :errors="errors"
                  :resolved-form="resolvedForm"
                  :handlers="{ blur: onBlur, input: onInput }"
                >
                  <div class="space-y-4">
                    <div v-for="field in resolvedForm.fields" :key="field.key">
                      <!-- Text, Email, URL, Number, Date inputs -->
                      <FormInput
                        v-if="['text', 'email', 'url', 'number', 'date'].includes(field.type)"
                        v-model="formData[field.key] as string"
                        :type="getFormInputType(field)"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :validation-state="getValidationState(field)"
                        @blur="onBlur(field)"
                        @input="onInput(field)"
                      />

                      <!-- Select input -->
                      <SelectInput
                        v-else-if="field.type === 'select'"
                        v-model="formData[field.key] as string | number | boolean | undefined"
                        :options="field.options || []"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :validation-state="getValidationState(field)"
                        @blur="onBlur(field)"
                        @input="onInput(field)"
                      />

                      <!-- Textarea input -->
                      <Textarea
                        v-else-if="field.type === 'textarea'"
                        v-model="formData[field.key] as string"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :validation-state="getValidationState(field)"
                        @blur="onBlur(field)"
                        @input="onInput(field)"
                      />

                      <!-- File input -->
                      <FileInput
                        v-else-if="field.type === 'file'"
                        v-model="formData[field.key] as string"
                        :label="field.label"
                        :required="field.required"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :validation-state="getValidationState(field)"
                        :button-text="field.placeholder || 'Choose File'"
                        @blur="onBlur(field)"
                        @input="onInput(field)"
                      />

                      <!-- Checkbox input -->
                      <Checkbox
                        v-else-if="field.type === 'boolean'"
                        v-model="formData[field.key] as boolean"
                        :label="field.label"
                        :required="field.required"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :validation-state="getValidationState(field)"
                        @blur="onBlur(field)"
                        @input="onInput(field)"
                      />

                      <!-- Resource selector input -->
                      <ResourceSelector
                        v-else-if="field.type === 'resource'"
                        v-model="formData[field.key] as string | number | undefined"
                        :resource-type="field.resourceType || 'media'"
                        :display-field="field.displayField || 'name'"
                        :value-field="field.valueField || 'id'"
                        :subtitle-field="field.subtitleField"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :searchable="field.searchable !== false"
                        :search-placeholder="field.searchPlaceholder"
                        :query="field.query"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :validation-state="getValidationState(field)"
                        @blur="onBlur(field)"
                        @input="onInput(field)"
                      />

                      <!-- Array input -->
                      <ArrayInput
                        v-else-if="field.type === 'array'"
                        v-model="formData[field.key] as unknown[]"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :item-type="field.itemType || 'object'"
                        :fields="field.fields || []"
                        @blur="onBlur(field)"
                        @update:model-value="onInput(field)"
                      />

                      <!-- Object input -->
                      <ObjectInput
                        v-else-if="field.type === 'object'"
                        v-model="formData[field.key] as Record<string, unknown>"
                        :label="field.label"
                        :placeholder="field.placeholder"
                        :required="field.required"
                        :help-text="field.helpText"
                        :error="shouldShowError(field) ? errors[field.key] : undefined"
                        :fields="field.fields || []"
                        @blur="onBlur(field)"
                        @update:model-value="onInput(field)"
                      />
                    </div>
                  </div>
                </slot>
              </form>
            </div>
          </slot>

          <!-- Footer slot -->
          <slot
            name="footer"
            :loading="loading"
            :is-form-valid="isFormValid"
            :submit-text="submitText"
            :loading-text="loadingText"
            :handlers="{ submit: handleSubmit, close: () => $emit('close') }"
          >
            <div
              class="flex-shrink-0 border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-800"
            >
              <slot
                name="actions"
                :loading="loading"
                :is-form-valid="isFormValid"
                :submit-text="submitText"
                :loading-text="loadingText"
                :handlers="{ submit: handleSubmit, close: () => $emit('close') }"
              >
                <div class="flex justify-end space-x-3">
                  <slot name="cancel-button" :handlers="{ close: () => $emit('close') }">
                    <button
                      type="button"
                      class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      @click="$emit('close')"
                    >
                      Cancel
                    </button>
                  </slot>
                  <slot
                    name="submit-button"
                    :loading="loading"
                    :is-form-valid="isFormValid"
                    :submit-text="submitText"
                    :loading-text="loadingText"
                    :handlers="{ submit: handleSubmit }"
                  >
                    <Button
                      type="submit"
                      :disabled="loading || !isFormValid"
                      :loading="loading"
                      variant="danger"
                      size="sm"
                      @click="handleSubmit"
                    >
                      {{ submitText }}
                    </Button>
                  </slot>
                </div>
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { countries } from '@/utils/countries'
import FileUploadModal from '@/components/molecules/FileUploadModal.vue'
import FormInput from '@/components/atoms/FormInput.vue'
import SelectInput from '@/components/atoms/SelectInput.vue'
import Textarea from '@/components/atoms/Textarea.vue'
import FileInput from '@/components/atoms/FileInput.vue'
import Checkbox from '@/components/atoms/Checkbox.vue'
import ResourceSelector from '@/components/atoms/ResourceSelector.vue'
import ObjectInput from '@/components/atoms/ObjectInput.vue'
import ArrayInput from '@/components/atoms/ArrayInput.vue'
import Button from '@/components/atoms/Button.vue'

const props = withDefaults(
  defineProps<{
    title: string
    formConfig?: FormViewConfig
    initialData?: Record<string, unknown>
    loading?: boolean
    submitText?: string
    loadingText?: string
  }>(),
  { loading: false, submitText: 'Submit', loadingText: 'Submitting...' },
)
const emit = defineEmits<{
  close: []
  submit: [data: Record<string, unknown>]
}>()

const isUploadMode = computed(() => props.formConfig?.mode === 'upload')
function onUploaded() {
  emit('submit', {} as Record<string, unknown>)
}

const formData = reactive<Record<string, unknown>>({
  ...(props.initialData || {}),
})
const errors = reactive<Record<string, string | undefined>>({})

const resolvedForm = computed<FormViewConfig>(() => {
  const base: FormViewConfig = props.formConfig
    ? { ...props.formConfig, fields: [...(props.formConfig.fields || [])] }
    : { fields: [] }
  base.fields = base.fields.map((f: FormField) => {
    if (f.type === 'select' && f.key === 'country' && (!f.options || f.options.length === 0)) {
      return {
        ...f,
        options: countries.map((c) => ({ value: c.code, label: c.name })),
        placeholder: f.placeholder || 'Select country',
      }
    }
    return f
  })
  return base
})

const touched = reactive<Record<string, boolean>>({})
const submitted = ref(false)
const shouldShowError = (field: FormField) =>
  (touched[field.key] || submitted.value) && !!errors[field.key]

const getValidationState = (field: FormField): 'default' | 'success' | 'error' | 'warning' => {
  if (shouldShowError(field)) return 'error'
  return 'default'
}

const getFormInputType = (
  field: FormField,
):
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'date'
  | 'datetime-local'
  | 'time'
  | 'tel'
  | 'url'
  | 'search' => {
  if (field.type === 'text' && field.key === 'email') return 'email'
  if (field.type === 'number') return 'number'
  if (field.type === 'date') return 'date'
  if (field.type === 'url') return 'url'
  return 'text'
}

const validators = {
  required: (v: unknown) => !(v === undefined || v === null || v === ''),
  email: (v: unknown) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)),
  url: (v: unknown) =>
    !v || /^(https?:\/\/)?[\w.-]+(\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=.]+$/.test(String(v)),
  number: (v: unknown) => v === undefined || v === null || v === '' || !isNaN(Number(v)),
  date: (v: unknown) => !v || !isNaN(new Date(v as string).getTime()),
}

function validateField(field: FormField): string | undefined {
  const v = formData[field.key]
  if (field.required && !validators.required(v)) return 'This field is required.'
  if ((field.type === 'email' || field.key === 'email') && !validators.email(v))
    return 'Enter a valid email address.'
  if (field.type === 'url' && !validators.url(v)) return 'Enter a valid URL.'
  if (field.type === 'number' && !validators.number(v)) return 'Enter a valid number.'
  if (field.type === 'date' && !validators.date(v)) return 'Enter a valid date.'
  return undefined
}

function validateAll(): boolean {
  let ok = true
  errorsKeys().forEach((k) => delete errors[k])
  for (const f of resolvedForm.value.fields) {
    const msg = validateField(f)
    if (msg) {
      errors[f.key] = msg
      ok = false
    }
  }
  return ok
}

const errorsKeys = () => Object.keys(errors)

function setFieldError(field: FormField) {
  const msg = validateField(field)
  if (msg) errors[field.key] = msg
  else delete errors[field.key]
}

function onBlur(field: FormField) {
  touched[field.key] = true
  setFieldError(field)
}

function onInput(field: FormField) {
  if (touched[field.key] || submitted.value) setFieldError(field)
}

const isFormValid = computed(() =>
  resolvedForm.value.fields.every((f) => validateField(f) === undefined),
)

const handleSubmit = () => {
  submitted.value = true
  if (!validateAll()) return
  emit('submit', { ...formData })
}

import { FormField, FormViewConfig } from '@/types/ui-config'
</script>
