export default class DateNode{
    constructor(options){
        this.week = options.week || 1
        this.hour = options.hour || 0
        this.minutes = options.minutes || 0
        this.key = options.key || ''
        // 构造一个链表结构的数据
        this.next = null

        // 有没有选中此时段
        this.isChecked = false

        this.isWorkGoldTime = false
        this.isWeekendGoldTime = false

        this.init()
    }

    init(){
        // 如果是周一到周五并且时间是早九点到晚九点，为周内黄金时段
        if(this.week <= 5){
            // 要重新计算黄金时段，因为是时段，所以前后不能封顶，会导致后续计算开始时间多加半个小时
            if(this.hour >= 10 && this.hour <=21){
                this.isWorkGoldTime = true
            }
            if(this.hour == 9 && this.minutes == 30){
                this.isWorkGoldTime = true
            }
            if(this.hour == 21 && this.minutes == 30){
                this.isWorkGoldTime = false
            }
        }
        // 如果是周六或者周天并且时间是早九点到晚九点，为休息日黄金时段
        if(this.week > 5){
            if(this.hour >= 10 && this.hour <=21){
                this.isWeekendGoldTime = true
            }
            if(this.hour == 9 && this.minutes == 30){
                this.isWeekendGoldTime = true
            }
            if(this.hour == 21 && this.minutes == 30){
                this.isWeekendGoldTime = false
            }
        }
    }

    setChecked(checked){
        this.isChecked = checked
    }
}