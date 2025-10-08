import { IToastMessage, ToastTheme } from '@/types/toast'
import { ref, Ref } from 'vue'

/** Reactive array of toast messages */
const messages: Ref<IToastMessage[]> = ref([])

/** Current toast theme */
export const theme: ToastTheme = 'light'

export const useToast = () => {
  const push = (message: IToastMessage) => {
    messages.value.push(message)
  }

  /**
   * Remove a specific toast message by ID
   * @param id - Unique identifier of the toast message to remove
   *
   * @example
   * ```typescript
   * toast.remove('my-toast-id');
   * ```
   */
  const remove = (id: string) => {
    messages.value = messages.value.filter(msg => msg.id !== id)
  }

  /**
   * Clear all toast messages
   *
   * @example
   * ```typescript
   * toast.clear();
   * ```
   */
  const clear = () => {
    messages.value = []
  }

  return {
    /** Clear all toast messages */
    clear,
    /** Add a new toast message */
    push,
    /** Remove a specific toast message by ID */
    remove,
    /** Reactive array of all toast messages */
    messages,
  }
}
