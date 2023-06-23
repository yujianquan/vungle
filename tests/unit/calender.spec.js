/* eslint-disable no-undef */
import { shallowMount } from '@vue/test-utils'
import Calender from '@/components/Calender'

describe('test Calender', () => {
    it('测试是否日历数据初始化', () => {
        const wrapper = shallowMount(Calender)
        expect(wrapper.vm.calender.isDragging).toBe(false)
    })
})