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
            <tr v-for="(grid,index) in canlender.week" :key="index">
                <td class="font-primary tac" width="75">
                    {{grid}}
                </td>
                <td 
                    v-for="time in canlender.dateList.slice(index*48,index*48 + 48)" 
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
                </td>
            </tr>
        </table>
    </div>
</template>
<script>
import Canlender from '../service/canlender'
export default {
    name:"LayoutComponent",
    data(){
        return {
            canlender:null
        }
    },
    methods:{
        onMouseDown(e) {
            const target = e.target;
            if (!target.classList.contains('selectable-grid')) {
                this.canlender.clearIndex();
                return;
            }
            this.canlender.delayMouseDown(target.dataset)
            
            document.addEventListener('mousemove', this.onMouseMove);
        },
        onMouseUp(e) {
            const target = e.target;
            document.removeEventListener('mousemove', this.onMouseMove);
            
            this.canlender.delayMouseUp(target.dataset)
          
        },
        onMouseMove(e) {
          const target = e.target;
          if (!target.classList.contains('selectable-grid')) {
            return;
          }
          this.canlender.delayMouseMove(target.dataset)
        },
    },

    created(){
        this.canlender = new Canlender()
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