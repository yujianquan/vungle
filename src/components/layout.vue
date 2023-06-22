<template>
    <div class="layout-component" @mousedown="onMouseDown">
        <!-- 为了简便，就先用table实现效果 -->
        <table class="component-table">
            <tr>
                <td colspan="49">
                    <div class="flex header">
                        <div class="legend active">
                            <div class="grid"></div>
                            <div class="label font-primary">已选</div>
                        </div>
                        <div class="legend">
                            <div class="grid"></div>
                            <div class="label font-primary">可选</div>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td rowspan="2" class="font-primary bold tac"> 星期天/时间 </td>
                <td colspan="24" class="tac font-primary"> 00:00 - 12 : 00 </td>
                <td colspan="24" class="tac font-primary"> 00:00 - 12 : 00 </td>
            </tr>
            <tr> 
                <td v-for="i in 24" :key="'time_' + i" colspan="2" class="font-primary tac content-padding">{{i - 1}}</td>
            </tr>
            <tr v-for="(grid,index) in calender.week" :key="index">
                <td class="font-primary tac" width="75">
                    {{grid}}
                </td>
                <td 
                    v-for="time in calender.dateList.slice(index*48,index*48 + 48)" 
                    class="selectable-grid content-padding" 
                    :class="{'selected': time.isChecked}" 
                    :key="time.key"
                    :data-week='time.week'
                    :data-hour='time.hour'
                    :data-key='time.key'
                    :data-minutes='time.minutes'>
                </td>
            </tr>
            <tr>
                <td colspan="49" class="font-primary tac">
                    <div>选择结果展示</div>
                    {{hasChecked}}
                    <template v-for="w in 7">
                        <div class="week-line" :key="w" v-if="calender.checkedMapList[w].length">
                            <label>{{w}}</label>
                            <div class="cont">{{formatCheckedDate(calender.checkedMapList[w])}}</div>
                        </div>
                    </template>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
import Calender from '../service/calender'
import { deepCopy } from '../util/index'
export default {
    name:"LayoutComponent",
    data(){
        return {
            // 初始化calendar，只是提前放置一些key，后续会被new Calender覆盖
            calender:null
        }
    },
    computed:{
        // 计算是否有选中
        hasChecked(){
            // keys是周一周二周三周四等等
            const keys = Object.keys(this.calender.checkedMapList)
            let hasNodeChecked = false
            try {
                 keys.forEach(key => {
                    // 判断周一周二周三周四等等对应的已选项为不为空
                    if(this.calender.checkedMapList[key].length){
                        hasNodeChecked = true
                    }
                })
            } catch (error) {
                return false
            }

            return hasNodeChecked
        }
    },
    methods:{
        onMouseDown(e) {
            const target = e.target;
            if (!target.classList.contains('selectable-grid')) {
                this.calender.clearIndex();
                return;
            }
            this.calender.delayMouseDown(target.dataset)
            
            document.addEventListener('mousemove', this.onMouseMove);
        },
        onMouseUp(e) {
            const target = e.target;
            document.removeEventListener('mousemove', this.onMouseMove);
            
            this.calender.delayMouseUp(target.dataset)
          
        },
        onMouseMove(e) {
          const target = e.target;
          if (!target.classList.contains('selectable-grid')) {
            return;
          }
          this.calender.delayMouseMove(target.dataset)
        },
        /**
         * @param dateArray 是周一周二周三等返回的已选择的时间，需要格式化成[00:00 ~ 00:30]的格式,并且计算出连续时间段
         */
        formatCheckedDate(dateArray){
            console.log(dateArray);
            if(!dateArray || !dateArray.length) return
            let array = deepCopy(dateArray)
            const keys = array.reduce((k,a) => {
                k.push(a.key)
                return k
            },[])
            console.log(keys);
            let tempArray = []
            let index = 0
            // eslint-disable-next-line no-constant-condition
            while(true){
                if(!array.length) break
                let dateNode = array.shift()
                console.log(dateNode);
                if(!tempArray[index]) {
                    tempArray[index] = []
                }
                tempArray[index].push(dateNode)
                console.log(dateNode.next);
                if(keys.includes(dateNode.next)) {
                    console.log('here');
                    // eslint-disable-next-line no-constant-condition
                    while(true){
                        let nextNodeKey = dateNode.next
                        let nextIndex = array.findIndex(a => a.key === nextNodeKey)
                        if(!nextIndex) break
                        
                        tempArray[index].push(array[nextIndex])
                        dateNode = array[nextIndex]
                        array.splice(nextIndex,1)
                    }
                }else{
                    index ++
                }
            }
            console.log(tempArray);
            return tempArray
        }
    },

    created(){
        // 初始化组件
        this.calender = new Calender()
    },

    mounted() {
        document.addEventListener('mouseup', this.onMouseUp);
    },

    beforeDestroy() {
        document.removeEventListener('mouseup', this.onMouseMove);
    },
}
</script>
<style scoped>
/* 先不用scss，为了方便 */
.flex {
    display: flex;
}
.header{
    justify-content: end;
}
.component-table {
    /* width: 700px; */
    margin: 40px auto;
    border-collapse: collapse;
    user-select: none;
}
.font-primary {
    font-size: var(--font-size-primary);
    color: var(--font-color-primary);
    font-weight: normal;
}

.tac {
    text-align: center;
}

.bold {
    font-weight: bold;
}
tr,td {
    border: 1px solid var(--color-border);
}

td {
    padding: 5px 15px;
    width: 8px;
    position: relative;
    white-space: nowrap;
}

td.content-padding {
    padding: 20px 2px;
}

.legend {
    display: flex;
    align-items: center;
}

.legend+.legend {
    margin-left: 20px;
}

.legend>.label {
    margin-left: 5px;
}

.legend>.grid {
    width: 20px;
    height: 5px;
    box-sizing: border-box;
    border: 1px solid #ccc;
    background-color: #fff;
}

.legend.active>.grid {
    border-color: var(--color-primary);
    background-color: var(--color-primary);
}

.selectable-grid {
    width: 8px;
    position: relative;
}

.selectable-grid:hover:not(.selected):not(.in-drag) {
    background-color: var(--color-grid-hover);
}

.selectable-grid.selected {
    background-color: var(--color-grid-selected);
}

.selectable-grid.in-drag {
    background-color: var(--color-grid-selected);
}
</style>