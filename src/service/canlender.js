import DateNode from "./dateNode"

export default class Calender{
    constructor(){
        this.week = ['一', '二', '三', '四', '五', '六', '日']
        // 保存拖拽区域数据(不需要了，datenode的check事件代替了)
        // this.dragArea = new Set()

        // 点击起点
        this.startIndex = null
        // 点击终点
        this.endIndex = null
        // 是否正在拖拽
        this.isDragging = false
        // 保存每隔半小时的时间数据
        this.dateList = []
        // 计算已选择的数据
        this.checkedList = []

        this.init()
    }

    init(){
        let week = 1
        let hour = 0
        let minutes = 0
        // 初始化日历的时间
        // eslint-disable-next-line no-constant-condition
        while(true){
            // 生成唯一id
            let key = new Date().getTime() + Math.random().toString(36).substring(2)
            minutes += 30
            if(week >= 8) break
            if(minutes == 0){
                minutes += 30
            }
            if(minutes == 60){
                hour ++;
                minutes = 0
            }
            if(hour == 24 && minutes == 30){
                hour = 0
                week ++
            }
            this.dateList.push(new DateNode({week,hour,minutes,key}))
        }
    }
    /**
     * 处理鼠标down事件
     * @param {number} week 周几
     * @param {number} hour 小时
     * @param {number} minutes 分钟
     * @param {*} key 唯一id
     */
    delayMouseDown({ week, hour, minutes,key }){
        this.startIndex = {
            week: +week,
            hour: +hour,
            minutes: +minutes,
            key
        }
    }
    /**
     * 处理鼠标move事件
     * @param {number} week 周几
     * @param {number} hour 小时
     * @param {number} minutes 分钟
     * @param {*} key 唯一id
     */
    delayMouseMove({ week, hour, minutes,key }){
        this.isDragging = true;
        this.endIndex = {
            week: +week,
            hour: +hour,
            minutes: +minutes,
            key
        }

        this.calcDragArea()
    }
    delayMouseUp({ key }){
        // 如果当前没有在拖动，就处理单点击事件
        if(!this.isDragging){
            this.dateList.forEach(date => {
                if(date.key === key){
                    date.setChecked(!date.isChecked)
                }
            })
        }else{
            // 如果是在拖动，就批量处理
            if (this.pointsIsEqual(this.startIndex, this.endIndex)) {
                this.clearIndex();
                return;
            }
            this.calcDragArea()
        }

        this.isDragging = false;
        this.startIndex = null;
        this.endIndex = null;
    }
    // 判断两个点是否全等
    pointsIsEqual(p1,p2){
        return p1 && p2 && p1.week === p2.week && p1.hour === p2.hour && p1.minutes === p2.minutes
    }
    // 计算拖拽的区域，计算谁该高亮
    calcDragArea(){
        if (!this.startIndex || !this.endIndex) {
            return
        }
        // 用week，hour，minetes三者的关系来计算精确数据（也不用了，生成了唯一key就可以代替了）
        const {key:startKey} = this.startIndex
        const {key:endKey} = this.endIndex
        // 根据dateNode的唯一key，算出应该checked哪部分数据
        const dateStartIndex = this.dateList.findIndex((date) => date.key === startKey)
        const dateEndIndex = this.dateList.findIndex((date) =>  date.key === endKey)
        this.dateList.forEach((date,index) => {
            if(index >= dateStartIndex && index <= dateEndIndex){
                date.setChecked(true)
            }
        })
    }
    // 计算已选择时段
    calcCheckedTimePeriod(){
        
    }
    // 清除选中
    clearIndex() {
        this.startIndex = null;
        this.endIndex = null;
    }
}