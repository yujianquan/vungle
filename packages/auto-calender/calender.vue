
<script>
import CalenderComp from '@/components/Calender.vue'
export default {
    name:"AutoCalender",
    components:{
        CalenderComp
    },
    render(){
        return (
            <calender-comp />
        )
    }
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