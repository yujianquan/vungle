export default class DateNode{
    constructor(options){
        this.week = options.week || 1
        this.hour = options.hour || 0
        this.minutes = options.minutes || 0
        this.key = options.key || ''

        // 有没有选中此时段
        this.isChecked = false

        this.isWorkGoldTime = false
        this.isWeekendGoldTime = false

        this.init()
    }

    init(){
        // 如果是周一到周五并且时间是早九点到晚九点，为周内黄金时段
        if(this.week <= 5 && this.hour >= 9 && this.hour <= 21){
            this.isWorkGoldTime = true
        }
        // 如果是周六或者周天并且时间是早九点到晚九点，为休息日黄金时段
        if(this.week > 5 && this.hour >= 9 && this.hour <= 21){
            this.isWeekendGoldTime = true
        }
    }

    setChecked(checked){
        this.isChecked = checked
    }
}