/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:22:43
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { deepClone } from '@/utils/common'

export function useForm(initFormData = {}) {
  const formRef = ref(null)
  const formModel = ref(deepClone(initFormData))
  const rules = {
    required: {
      required: true,
      message: '该项不能为空',
      trigger: ['blur', 'change']
    }
  }

  const validation = async () => {
    const errors = await formRef.value?.validate()
    if (errors) {
      throw errors
    }
    return true
  }

  return [formRef, formModel, validation, rules]
}
