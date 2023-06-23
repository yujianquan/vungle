import { AutoCalender } from "./auto-calender/index.js";

// 注册多个组件,在此项目中我们只有一个，所以暂时注册一个
const components = [ AutoCalender ]

const install = function(Vue){
    components.map(component => {
        Vue.use(component)
    })
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export {
    AutoCalender
}

export default {
    install
}