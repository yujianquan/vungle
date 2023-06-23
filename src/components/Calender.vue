<template>
    <div class="layout-component" @mousedown="onMouseDown">
        <!-- 为了简便，就先用table快速实现效果，后续需要将table改为div -->
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
                    :class="{'selected': time.isChecked,'in-drag':calender.dragArea.includes(time.key)}" 
                    :key="time.key"
                    :data-week='time.week'
                    :data-hour='time.hour'
                    :data-key='time.key'
                    :data-minutes='time.minutes'>
                </td>
            </tr>
            <tr>
                <td colspan="49" class="font-primary tac">
                    <div v-if="!hasChecked">可拖动鼠标进行排序</div>
                    <template v-else>
                        <div class="checked-time-head">
                            <span>已选择时间段</span>
                            <div id="clear" class="clear" @click="clear">清空</div>
                        </div>
                        <template v-for="w in 7">
                            <div class="week-line" :key="w" v-if="calender.checkedMapList[w].length">
                                <label class="week-line-label">{{calender.week[w - 1]}}</label>
                                <div class="count">{{formatCheckedDatePeriod(calender.checkedMapList[w])}}</div>
                            </div>
                        </template>
                        <div class="op-content">
                            <div class="weekday gold-button" @click="checkDefaultTimeByType('work')">选中周内黄金时段</div>
                            <div class="sunday gold-button" @click="checkDefaultTimeByType('sunday')">选中周末黄金时段</div>
                        </div>
                    </template>
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
import DateManager from '../service/DateManager'
import { deepCopy,completeDateString } from '../util/index'
export default {
    name:"CalenderComp",
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
        // 所有操作反馈给Calender，让calender来做数据处理
        onMouseDown(e) {
            const target = e.target;
            if (!target.classList.contains('selectable-grid')) {
                this.calender.clearIndex();
                return;
            }
            this.calender.delayDateNodeLick(target.dataset)
            
            document.addEventListener('mousemove', this.onMouseMove);
        },
        onMouseUp(e) {
            const target = e.target;
            document.removeEventListener('mousemove', this.onMouseMove);
            
            this.calender.comfirmChoose(target.dataset)
          
        },
        onMouseMove(e) {
          const target = e.target;
          if (!target.classList.contains('selectable-grid')) {
            return;
          }
          this.calender.delayBatchChoose(target.dataset)
        },
        clear(){
            this.calender.clearSelect()
        },
        checkDefaultTimeByType(type){
            this.calender.selectGoldPeriodByType(type)
        },
        /**
         * @param dateArray 是周一周二周三等返回的已选择的时间，并且计算出连续时间段
         */
        formatCheckedDatePeriod(dateArray){
            if(!dateArray || !dateArray.length) return
            let array = deepCopy(dateArray)
            const keys = array.reduce((k,a) => {
                k.push(a.key)
                return k
            },[])
            let tempArray = []
            let index = 0
            // eslint-disable-next-line no-constant-condition
            while(true){
                if(!array.length) break
                let dateNode = array.shift()
                if(!tempArray[index]) {
                    tempArray[index] = []
                }
                tempArray[index].push(dateNode)
                if(keys.includes(dateNode.next)) {
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
            return this.formatCheckedDateString(tempArray)
        },
        /**
         * 将一段一段的时间数据，格式化成00:30~01:30这种格式
         */
        formatCheckedDateString(dateTwoDimensionArray){
            let stringArray = []
            // 传入的是一个二维数组[[date],[date,date,date]]的形式，要把这种形式再转换成string
            dateTwoDimensionArray.forEach(dateArray => {
                if(!dateArray.length) return ''
                // 计算出起始时间，要比点击的第一个点的时间段少30分钟，比如勾选的是00:30,那么起始时间就为00:00
                let startNode = dateArray[0]
                let endNode = dateArray[dateArray.length -1]
                let startTime = {
                    hour:'',
                    minutes:''
                }
                if(startNode.minutes == 30){
                    startTime.hour = startNode.hour
                    startTime.minutes = 0
                }else{
                    startTime.hour = startNode.hour-1
                    startTime.minutes = 30
                }
                // 如果分片数据为1，则表示只勾选了一格时间，左右不连片
                if(dateArray.length === 1){
                    stringArray.push(`${completeDateString(startTime.hour)}:${completeDateString(startTime.minutes)} ~ ${completeDateString(startNode.hour)}:${completeDateString(startNode.minutes)}`)
                } else {
                    stringArray.push(`${completeDateString(startTime.hour)}:${completeDateString(startTime.minutes)} ~ ${completeDateString(endNode.hour)}:${completeDateString(endNode.minutes)}`)
                }
            })
            return stringArray.toString()
            
        },

        
    },

    created(){
        // 初始化组件
        this.calender = new DateManager()
    },

    mounted() {
        document.addEventListener('mouseup', this.onMouseUp);
    },

    beforeDestroy() {
        document.removeEventListener('mouseup', this.onMouseUp);
    },
}
</script>
<style>
/* 不能放在App.vue里，因为三方引用会找不到资源 */
:root {
    /* --color-primary: rgb(42, 170, 233); */
    --color-primary: #4f86f8;
    /* --font-size-primary: 16px; */
    --font-color-primary: #333;
    --font-size-primary: 12px;
    --color-border: #ccc;
    --color-grid-hover: #eee;
    --color-grid-selected: var(--color-primary);
}
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

.week-line{
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 8px;
}
.week-line-label{
    width: 80px;
    white-space: nowrap;
}
.count{
    flex: 1;
    text-align: left;
    max-width: 600px;
    white-space: normal;
}
.checked-time-head{
    position: relative;
}
.clear{
    color: var(--color-primary);
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
}
.op-content{
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.gold-button{
    /* width: 150px; */
    border: 1px solid var(--color-border);
    padding: 4px 8px;
    color: var(--color-primary);
    margin: 0 8px;
    cursor: pointer;
}
</style>