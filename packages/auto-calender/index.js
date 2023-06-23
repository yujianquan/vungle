import AutoCalender from './calender.vue'

AutoCalender.install = function(Vue){
    Vue.component(AutoCalender.name, AutoCalender)
}

export {
    AutoCalender
}