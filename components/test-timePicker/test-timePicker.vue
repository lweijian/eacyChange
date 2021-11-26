<template>
   <div class="calendar">
       <div class="calendar-box">
           <span class="title-span">预约日期：</span>
           <div class="calendar-body">
               <div class="calendar-body-text">
                   <div style="cursor: pointer" @click="month--">《 </div>
                   <div class="text-title">{{timeValue}}</div>
                   <div style="cursor: pointer" @click="month++"> 》</div>
               </div>
               <table>
                   <thead>
                       <tr>
                           <th v-for="(h, i) in teheadList" :key="i">{{h}}</th>
                       </tr>
                   </thead>
                   <tbody>
                       <tr v-for="(b, i) in tbodyList" :key="i">
                           <td v-for="(o, index) in b" :key="index" :class="currentDay == (o.month + '-' + o.name) ? 'activeDay' : ''">
                               <span :class="o.class" v-if="o.name == 'default'">{{o.name}}</span>
                               <span :class="o.class + (day == o.name ? ' currentMonth' : '')" @click="currentDay = o.month + '-' + o.name; " v-else>{{o.name}}</span>
                           </td>
                       </tr>
                   </tbody>
               </table>
           </div>
       </div>
   </div>
</template>

<script>
export default {
    data: () => {
        return {
            timeValue: '',
            teheadList: ['日', '一', '二', '三', '四', '五', '六'],

            year: '',
            month: 0,
            day: '',
            tbodyList: [],
            currentDay: ''
        }
    },
    mounted() {
        this.getInitTime()
    },
    watch: {
        month() {
            if(this.month < 1) {
                this.month = 12;
                this.year --;
            }else if(this.month > 12){
                this.month = 1;
                this.year ++;
            }
            this.tbodyList = []
            this.timeValue = this.year + '年' + this.month + '月'
            this.handleAetCalendar()
        }
    },
    methods: {
        getInitTime() {
            let date = new Date();
            this.year = date.getFullYear();  // 获取当年
            this.month = date.getMonth()+1;  // 获取本月
            this.day = date.getDate();       // 获取当天
            this.timeValue = date.getFullYear() + '年' + (date.getMonth()+1) + '月'
            
            this.handleAetCalendar()
        },
        // 生成档期数据
        handleAetCalendar() {
            this.tbodyList = [];
            let days = new Date(this.year, this.month, 0).getDate()  // 当月总天数
            let week = new Date(this.year, this.month-1, 1).getDay() // 当月有几周
            let last_month = new Date(this.year, this.month + 1, 0).getDate()  // 当月的上一个月的最后一天
            this.tbodyList[0] = [];
            for(let i = 0; i < Math.ceil((days + week) / 7) *7; i++) {
                let nub = Math.floor(i / 7);
                if(i<week) {
                    this.tbodyList[nub].push({
                        class: 'default', 
                        name: last_month+i-week+1,
                        month: this.month == 0 ? 12 : this.month -1
                    })
                }else {
                    if(!this.tbodyList[nub]) {
                        this.tbodyList[nub] = [];
                    }
                    let day = i - week +1;
                    let calssName = 'actives'
                    let month = this.month;
                    if(day > days) {
                        day -= days;
                        calssName = 'default';
                        month = this.month +1 > 12 ? 1 : this.month+1
                    }
                    this.tbodyList[nub].push({
                        class: calssName, 
                        name: day,
                        month: month
                    })
                }
            }
            let arr = this.tbodyList[Math.floor( (week + days) /7)];
            if( arr && arr.length !== 7 ){
                this.tbodyList[Math.floor( (week+days) / 7)] = arr.concat(new Array(7 - arr.length).fill(""))
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    .calendar {
        width: 600px;
        height: 400px;
        background: #DCDCDC;
        padding: 15px;
        margin: 50px auto;
        .calendar-box {
            width: 100%;
            background: #FFF;
            height: 100%;
            position: relative;
            .title-span {
                position: absolute;
                left: 5%;
                top: 4%;
            }

            .calendar-body {
                width: 80%;
                margin: 0 auto;
                padding: 15px;
                .calendar-body-text {
                    width: 100%;
                    height: 30px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    .text-title {
                        margin: 0 20px;
                    }
                }
            }
            table tr th{
                color: #ccc;
            }
            table tr th, table tr td {
                width: 66px;
                height: 50px;
            }
            table td {
                &.activeDay {
                    border-bottom: 1px solid red;
                    span {
                        color: #fe5578;
                    }
                }
                .currentMonth {
                    color: #00BFFF
                }
            }
            table td span{
                color: #333;
                cursor: pointer;
            }
            table td span.default{
                color: #e9e9e9;
            }
        }
    }
    
</style>