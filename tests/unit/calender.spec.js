/* eslint-disable no-undef */
import { shallowMount } from '@vue/test-utils'
import Calender from '@/components/Calender'
import Vue from 'vue'

describe('test Calender unit', () => {
    it('测试是否日历数据初始化', () => {
        const wrapper = shallowMount(Calender)
        expect(wrapper.vm.calender.isDragging).toBe(false)
    })
})

describe('test Calender Date Click', () => {
    it('测试点击之后是否已选',async () => {
        const wrapper = shallowMount(Calender)
        const selectAllBtn = wrapper.findAll('.selectable-grid').at(3)
        selectAllBtn.trigger('click');
        console.log(selectAllBtn);
        await Vue.nextTick();
        console.log(wrapper.findAll('.selectable-grid').at(3));
        expect(wrapper.findAll('.selectable-grid').at(3).classes('selected')).toBe(true);
    })
})

describe('test Calender weekend button', () => {
    it('测试点击之后是否显示周末周日按钮',async () => {
        const wrapper = shallowMount(Calender)
        const selectAllBtn = wrapper.findAll('.selectable-grid').at(3)
        selectAllBtn.trigger('click');

        await Vue.nextTick();

        expect(wrapper.find('.weekday')).toBe(true);
    })
})

describe('test Calender clear ', () => {
    it('测试清空按钮有没有生效',async () => {
        const wrapper = shallowMount(Calender)
        const selectAllBtn = wrapper.findAll('.selectable-grid').at(10)
        selectAllBtn.trigger('click');

        await Vue.nextTick();

        const clearBtn = wrapper.find('clear')
        clearBtn.trigger('click');

        await Vue.nextTick();

        expect(wrapper.findAll('.selected').exists()).toBe(true)
    })
})