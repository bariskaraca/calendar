let languages = {
    en: {
        days: {
            full: {
                sun: "Sunday",
                mon: "Monday",
                tue: "Tuesday",
                wed: "Wednesday",
                thu: "Thursday",
                fri: "Friday",
                sat: "Saturday"
            },
            short: {
                sun: "Sun",
                mon: "Mon",
                tue: "Tue",
                wed: "Wed",
                thu: "Thu",
                fri: "Fri",
                sat: "Sat"
            }
        },
        months: {
            full: {
                jan: "January",
                feb: "February",
                mar: "March",
                apr: "April",
                may: "May",
                jun: "June",
                jul: "July",
                aug: "August",
                sep: "September",
                oct: "October",
                nov: "November",
                dec: "December"
            },
            short: {
                jan: "Jan",
                feb: "Feb",
                mar: "Mar",
                apr: "Apr",
                may: "May",
                jun: "Jun",
                jul: "Jul",
                aug: "Aug",
                sep: "Sep",
                oct: "Oct",
                nov: "Nov",
                dec: "Dec"
            }
        },
        buttons: {
            previous: "Previous",
            next: "Next"
        },
        hours:"Hour"
    },
    tr: {
        days: {
            full: {
                sun: "Pazar",
                mon: "Pazartesi",
                tue: "Salı",
                wed: "Çarşamba",
                thu: "Perşembe",
                fri: "Cuma",
                sat: "Cumartesi"
            },
            short: {
                sun: "Paz",
                mon: "Pzt",
                tue: "Sal",
                wed: "Çrş",
                thu: "Prş",
                fri: "Cum",
                sat: "Cts"
            }
        },
        months: {
            full: {
                jan: "Ocak",
                feb: "Şubat",
                mar: "Mart",
                apr: "Nisan",
                may: "Haziran",
                jun: "Haziran",
                jul: "Temmuz",
                aug: "Ağustos",
                sep: "Eylül",
                oct: "Ekim",
                nov: "Kasım",
                dec: "Aralık"
            },
            short: {
                jan: "Oca",
                feb: "Şbt",
                mar: "Mrt",
                apr: "Nis",
                may: "May",
                jun: "Haz",
                jul: "Tem",
                aug: "Ağu",
                sep: "Eyl",
                oct: "Eki",
                nov: "Kas",
                dec: "Ara"
            }
        },
        buttons: {
            previous: "Geri",
            next: "İleri"
        },
        hours:"Saat"
    }
};

/**  Calendar
 * todo: short || long names of days and months
 * methods:
     * createTable() // remove all calendar elements and create new one
     * show() // remove all days from calendar and create again
     * next() // set next month || week depend on current viewType
     * previous() // set previous month || week depend on current viewType
     * setDate({year:2018,month:12,day:19}) // month 1-12
     * addEvent({year:2018,month:11,day:19, hours: "10:00-12:00"},"diğer event 3", {color:"#eee"}) // hours optional
     * eventFilter()
     * showTooltip(cell, content) // cell as html element (td in table), content html element to show in tooltip
     * hideTooltip()
     * setView(viewType) // "weekly" || "monthly"
     * setLang(lang) // "tr" || "en"
     * selectDay(cell,deselectAll) // cell as html element (td in table), deselectAll bool
     * deselectAllDay()
     * deselectDay(cell) // cell as html element (td in table)
 * input
     * settings: (as object)
        *  viewType ("weekly" || "monthly" default: monthly)
        *  rowHeight (int) default: 50
        *  firstDayOfWeek ("sun", "mon", "tue", "wed", "thu", "fri", "sat" default: mon)
        *  lang ("tr" || "en" default: en)
        *  infoIcon ( html element)
     * targetDivSelector ***
 *
 * callbacks:
     * onMOver(e,cell,events,year,month,day,hours)
     * onMOut(e,cell,events,year,month,day,hours)
     * onMClick(e,cell,events,year,month,day,hours)
     * onMdblClick(e,cell,events,year,month,day,hours)
     * info(e,eventType)   // eventType: mouseover,mouseenter,mouseout,click,dblclick on info cirle. set false to remove info element
 **/

Date.prototype.getMonthNameShort = function(month) {
    return ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][month||this.getMonth()];
};
Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};
Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
};
function getFirstDayOfWeek(date, day) {
    let day_no= ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(day) > -1 ?
        ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(day): 0;
    if(date.getDay() !== 1){
        let today = date.getDay(),
            diff = date.getDate() - today + (today === day_no ? -6:1);
        let newDate = new Date(date);
        return new Date(newDate.setDate(diff));
    }
    return date
}
function updateTooltip(tooltip, elm) {
    let elm_edges ={left: elm.offsetLeft, top: elm.offsetTop, width: elm.offsetWidth, height: elm.offsetHeight};
    const elm_top = elm_edges.top + elm_edges.height + 30;
    const centered = (elm_edges.left + (elm_edges.width / 2)) - (tooltip.offsetWidth / 2);
    tooltip.style.left = centered + 'px';
    tooltip.style.top = elm_top + 'px';
}
const _createElement = Symbol('createElement');
let UID = {
    _current: 0,
    getNew: function(){
        this._current++;
        return this._current;
    }
};
HTMLElement.prototype.pseudoStyle = function(element,prop,value){ //todo jquery
    var _this = this;
    var _sheetId = "pseudoStyles";
    var _head = document.head || document.getElementsByTagName('head')[0];
    var _sheet = document.getElementById(_sheetId) || document.createElement('style');
    _sheet.id = _sheetId;
    var className = "pseudoStyle" + UID.getNew();

    _this.className +=  " "+className;

    _sheet.innerHTML += " ."+className+":"+element+"{"+prop+":"+value+"}";
    _head.appendChild(_sheet);
    return this;
};

function Calendar(targetDiv, options) {
    this[_createElement]= function createElement(type, options){
        let el=document.createElement(type);
        for(let option in options){
            if(option==="text") {
                let span=this[_createElement]("span");
                span.textContent=options[option];
                el.appendChild(span);
            }
            else if(option==="bgcolor")
                el.style.backgroundColor=options[option];
            else if(option==="color")
                el.style.color=options[option];
            else if(option==="data") {
                Object.keys(options[option]).map(function(key, index) {
                    el.setAttribute("data-"+key,options[option][key]);
                });
            }
            else
                el.setAttribute(option,options[option]);
        }
        return el
    };
    this.date = new Date();
    this.currentDate = this.date;
    this.options = options;
    this.events=[];
    this.parent=document.querySelector(targetDiv);
    this.lang = options["lang"] || "en";
    this.viewType = options["viewType"] || "monthly";
    this.firstDayOfWeek = options["firstDayOfWeek"] || "mon";
    this.rowHeight = options["rowHeight"] || 50;
    this.onMOver = options.onMOver;
    this.onMOut = options.onMOut;
    this.onMClick = options.onMClick;
    this.onMdblClick = options.onMdblClick;
    this.info = options.info;
    this.infoIcon = options.infoIcon;
    this.createTable();
    this.show();
}
Calendar.prototype={
    createTable: function(){
        const that=this;
        this.parent.innerHTML="";
        this.parent.appendChild(this[_createElement]("div", {class: "calendar-card"}));
        this.parent.querySelector(".calendar-card").appendChild(this[_createElement]("div", {class: "calendar_tooltip tooltip-container tooltip-center hide"}));
        this.parent.querySelector(".calendar-card").appendChild(this[_createElement]("div", {class: "calendar-cardHeader"}));
        this.parent.querySelector(".calendar-cardHeader").style.width = this.parent.style.width;
        this.table = this[_createElement]("table", {class: "calendar-table", cellpadding: "0", cellspacing: "0"});
        this.parent.querySelector(".calendar-card").appendChild(this.table);
        this.table.appendChild(this[_createElement]("thead"));
        this.parent.querySelector("thead").appendChild(this[_createElement]("tr"));
        this.days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        if (this.viewType === "weekly")
            this.parent.querySelector("tr").appendChild(this[_createElement]("th", {text: languages[this.lang].hours, class: "no_selection"}));
        for (let i = 0; i < 7; i++) {
            if (i >= this.days.indexOf(this.firstDayOfWeek))
                this.parent.querySelector("tr").appendChild(this[_createElement]("th", {text: languages[this.lang].days.short[this.days[i]], class: "no_selection"}));
        }
        for (let i = 0; i < this.days.indexOf(this.firstDayOfWeek); i++)
            this.parent.querySelector("tr").appendChild(this[_createElement]("th", {text: languages[this.lang].days.short[this.days[i]], class: "no_selection"}));
        let headerInfo = this[_createElement]("div", {class: "calendar-headerInfo"});
        headerInfo.appendChild(this[_createElement]("h3", {class: "calendar-info"}));
        if (this.info) {
            let info = this[_createElement]("div", {class: "calendar-datetime"});
            this.parent.querySelector(".calendar-cardHeader").appendChild(info);
            if(that.infoIcon){
                info.innerHTML = '<img style="width: 25px; height: 25px;" src="'+that.infoIcon+'"/>';
            }
            else {
                info.innerHTML = '<svg class="svg" width=25 height=25 fill="white" stroke="black" cursor="pointer">\n' +
                    '    <circle cx=9 cy=9 r=7>\n' +
                    '    </circle>    \n' +
                    '<text x="7.5" y="13" font-size="14" fill="red">i</text>' +
                    '</svg>';
            }
            info.addEventListener("mouseenter",(e)=>that.info(e, 'mouseenter'));
            info.addEventListener("mouseover",(e)=>that.info(e, 'mouseover'));
            info.addEventListener("mouseout",(e)=>that.info(e, 'mouseout'));
            info.addEventListener("click",(e)=>that.info(e, 'click'));
            info.addEventListener("dblclick",(e)=>that.info(e, 'dblclick'));

        }
        let pre = this[_createElement]("div", {class: "calendar-previous"});
        pre.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,50 75,0 75,100"></polyline></svg>';
        headerInfo.appendChild(pre);
        let fwd = this[_createElement]("div", {class: "calendar-forward"});
        if(!that.options.disabled){
            fwd.addEventListener('click', function (e) {
                e.preventDefault();
                that.next()
            });
            pre.addEventListener('click', function (e) {
                e.preventDefault();
                that.previous()
            });
        }
        fwd.innerHTML = '<svg height="15" width="15" viewBox="0 0 75 100" fill="rgba(0,0,0,0.5)"><polyline points="0,0 75,50 0,100"></polyline></svg>';
        headerInfo.appendChild(fwd);
        let today = this[_createElement]("div", {class: "todayInfo no_selection"});
        headerInfo.appendChild(today);
        this.parent.querySelector(".calendar-cardHeader").appendChild(headerInfo);
        this.table.appendChild(this[_createElement]("tbody"));
    },
    show: function(){
        const that=this;
        let tbl = this.parent.querySelector("tbody");
        tbl.innerHTML = "";
        this.parent.querySelector(".todayInfo").innerHTML =
            languages[this.lang].months.full[this.currentDate.getMonthNameShort()] + " " + this.currentDate.getFullYear()
            + (this.viewType === "weekly" ? ", " +this.currentDate.getWeek() : "");
        let addedDay=0, days=0, allDaysAdded=false,
            currentDay=getFirstDayOfWeek(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1),this.firstDayOfWeek),row;
        if(this.viewType==="weekly"){
            currentDay = getFirstDayOfWeek(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate()),this.firstDayOfWeek);
        }
        while(!allDaysAdded){
            if(addedDay === 0) {
                if(row) {
                    tbl.appendChild(row);
                }
                if((this.viewType==="monthly"&&currentDay.getMonth()>this.currentDate.getMonth()&&days > 25)||(this.viewType==="weekly"&&row))
                    break;
                if(this.viewType==="monthly"&&this.currentDate.getMonth() ===11&&currentDay.getMonth()===0)
                    break;
                row = this[_createElement]("tr");
                if (this.viewType === "weekly")
                    row.appendChild(this[_createElement]("td", {
                        class: "empty",
                        text: ""
                    }));
            }
            let cell;
            if (currentDay.getMonth()<this.currentDate.getMonth())
                cell=this[_createElement]("td", {
                    class: "calendar-pastmonthday no_selection",
                    text: currentDay.getDate()
                });
            else if (currentDay.getMonth()>this.currentDate.getMonth())
                cell=this[_createElement]("td", {
                    class: "calendar-nextmonthday no_selection",
                    text: currentDay.getDate()
                });
            else {
                cell = this[_createElement]("td", {text: currentDay.getDate(),id:currentDay.getTime().toString()});
                if (currentDay.getTime()===this.date.withoutTime().getTime()) {
                    cell.classList.add("calendar-today");
                    cell.classList.add("selected-day");
                }
                else if (currentDay.getTime()<this.date.withoutTime().getTime())
                    cell.classList.add("calendar-pastday");
                cell.classList.add("no_selection");
                cell.classList.add("cell");
                cell.classList.add("calendar-day");
                row.appendChild(cell);
            }
            if (this.viewType === "monthly"){
                if(this.eventFilter(currentDay).length) {
                    cell.appendChild(this[_createElement]("div", {class: "circle_event"}));
                }
                if(!that.options.disabled) {
                    if(that.onMOver)
                        cell.addEventListener("mouseover",function (e){
                            let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),parseInt(cell.querySelector("span").textContent)));
                            that.onMOver(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,parseInt(cell.querySelector("span").textContent))
                        });
                    if(that.onMOut)
                        cell.addEventListener("mouseout",function (e){
                            let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),parseInt(cell.querySelector("span").textContent)));
                                that.onMOut(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,parseInt(cell.querySelector("span").textContent))
                        });
                    if(that.onMClick)
                        cell.addEventListener("click",function (e){
                            let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),parseInt(cell.querySelector("span").textContent)));
                            that.onMClick(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,parseInt(cell.querySelector("span").textContent))
                        });
                    if(that.onMdblClick)
                        cell.addEventListener("dblclick",function (e){
                            let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),parseInt(cell.querySelector("span").textContent)));
                            that.onMdblClick(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,parseInt(cell.querySelector("span").textContent))
                        });
                }
                for (let i = 0; i < cell.querySelectorAll("*").length; i++)
                    cell.querySelectorAll("*")[i].onmouseout = function (e) {
                        e.stopPropagation();
                    };
            }
            row.appendChild(cell);
            addedDay=++addedDay%7;
            days++;
            currentDay.setDate(currentDay.getDate()+1);
        }
        if (this.viewType === "weekly")
            for (let i = 0; i < 24; i++) {
                let row = this[_createElement]("tr");
                row.appendChild(this[_createElement]("td", {
                    class: "hour",
                    text: i + ":00"
                }));
                for (let j = 0; j < 7; j++) {
                    row.appendChild(this[_createElement]("td", {
                        class: "empty cell",
                        text: ""
                    }));
                }
                this.parent.querySelector("tbody").appendChild(row);
            }
        let rows=this.table.querySelectorAll("tr");
        for (let k = 1; k < rows.length; k++) {
            rows[k].style.height = that.rowHeight+"px";
            let cells=rows[k].querySelectorAll("td");
            for (let l = 1; l < cells.length; l++)
                cells[l].style.width = that.parent.style.width/cells.length;
        }
        if (this.viewType === "weekly"){
            this.events.forEach(function (v) {
                if(v.date.month === that.currentDate.getMonth()+1 && v.date.year === that.currentDate.getFullYear()) {
                    let hours = v.date.hours.split("-").length > 1 ? v.date.hours : "0:00-23:00";
                    let rows = that.table.querySelectorAll("tr"), found = false, day = false,
                        startHour = hours.split("-")[0].split(":")[0],
                        endHour = hours.split("-")[1].split(":")[0];
                    for (let i = 1; i < 8; i++) {
                        if (rows[1].querySelectorAll("td")[i].textContent === v.date.day.toString())
                            day = i;
                    }
                    if (day !== false) {
                        for (let i = 2; i < rows.length; i++) {
                            if (rows[i].querySelector("td").textContent.split(":")[0] === startHour)
                                found = true;
                            if (found) {
                                rows[i].querySelectorAll("td")[day].classList.remove("empty");
                                rows[i].querySelectorAll("td")[day].classList.add("event");
                                rows[i].querySelectorAll("td")[day].style.backgroundColor = v.style.color;
                            }
                            if (rows[i].querySelector("td").textContent.split(":")[0] === endHour) {
                                found = false;
                                break;
                            }
                        }
                    }
                }
            });
            for(let cell of that.table.querySelectorAll(".cell")){
                if(that.onMOver)
                    cell.addEventListener("mouseover", function (e) {
                        const allTrs = that.table.querySelectorAll('tr');
                        const dateTr = Array.from(allTrs).find(tr => tr.isSameNode(cell.parentNode));
                        const childIndex = Array.from(dateTr.parentNode.children).indexOf(dateTr);
                        let hour = childIndex-1;
                        const dayIndex = Array.from(dateTr.querySelectorAll("td")).indexOf(cell);
                        let day = getFirstDayOfWeek(that.currentDate,that.firstDayOfWeek).getDate()+dayIndex-1;

                        let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),day),hour);
                        that.onMOver(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,day, hour);
                    });
                if(that.onMClick)
                    cell.addEventListener("click", function (e) {
                        const allTrs = that.table.querySelectorAll('tr');
                        const dateTr = Array.from(allTrs).find(tr => tr.isSameNode(cell.parentNode));
                        const childIndex = Array.from(dateTr.parentNode.children).indexOf(dateTr);
                        let hour = childIndex-1;
                        const dayIndex = Array.from(dateTr.querySelectorAll("td")).indexOf(cell);
                        let day = getFirstDayOfWeek(that.currentDate,that.firstDayOfWeek).getDate()+dayIndex-1;

                        let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),day),hour);
                        that.onMClick(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,day, hour);
                    });
                if(that.onMdblClick)
                    cell.addEventListener("dblclick", function (e) {
                        const allTrs = that.table.querySelectorAll('tr');
                        const dateTr = Array.from(allTrs).find(tr => tr.isSameNode(cell.parentNode));
                        const childIndex = Array.from(dateTr.parentNode.children).indexOf(dateTr);
                        let hour = childIndex-1;
                        const dayIndex = Array.from(dateTr.querySelectorAll("td")).indexOf(cell);
                        let day = getFirstDayOfWeek(that.currentDate,that.firstDayOfWeek).getDate()+dayIndex-1;

                        let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),day),hour);
                        that.onMdblClick(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,day, hour);
                    });
                if(that.onMOut)
                    cell.addEventListener("mouseout", function (e) {
                        const allTrs = that.table.querySelectorAll('tr');
                        const dateTr = Array.from(allTrs).find(tr => tr.isSameNode(cell.parentNode));
                        const childIndex = Array.from(dateTr.parentNode.children).indexOf(dateTr);
                        let hour = childIndex-1;
                        const dayIndex = Array.from(dateTr.querySelectorAll("td")).indexOf(cell);
                        let day = getFirstDayOfWeek(that.currentDate,that.firstDayOfWeek).getDate()+dayIndex-1;

                        let events = that.eventFilter(new Date(that.currentDate.getFullYear(),that.currentDate.getMonth(),day),hour);
                        that.onMOut(e,cell,events,that.currentDate.getFullYear(),that.currentDate.getMonth()+1,day, hour);
                    });
            }
        }
    },
    next: function () {
        let month=0,day=0;
        if(this.viewType==="weekly")
            day+=7;
        else if(this.viewType==="monthly")
            month++;
        else if(this.viewType==="daily")
            day++;
        this.currentDate= new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()+month, this.currentDate.getDate()+day);
        this.show();
    },
    previous: function () {
        let month=0,day=0;
        if(this.viewType==="weekly")
            day-=7;
        else if(this.viewType==="monthly")
            month--;
        else if(this.viewType==="daily")
            day--;
        this.currentDate= new Date(this.currentDate.getFullYear(), this.currentDate.getMonth()+month, this.currentDate.getDate()+day);
        this.show();

    },
    setDate: function (date) {
        this.currentDate= new Date(date.year, date.month-1, date.day);
        this.show();

    },
    addEvent: function (date,event,options) { // month: 1-12, hours: "1:00-2:00", year: 2018
        const that = this;
        date.hours = date.hours || "";
        options = options || {};
        options.color = options.color || "blue";
        this.events.push({event: event, date: date, style: options});
        if (this.viewType === "weekly") {
            if (date.month === that.currentDate.getMonth() + 1 && date.year === that.currentDate.getFullYear()) {
                let hours = date.hours.split("-").length > 1 ? date.hours : "0:00-23:00";
                let rows = that.table.querySelectorAll("tr"), found = false, day = false,
                    startHour = hours.split("-")[0].split(":")[0],
                    endHour = hours.split("-")[1].split(":")[0];
                for (let i = 1; i < 8; i++) {
                    if (rows[1].querySelectorAll("td")[i].textContent === date.day.toString())
                        day = i;
                }
                if (day !== false) {
                    for (let i = 2; i < rows.length; i++) {
                        if (rows[i].querySelector("td").textContent.split(":")[0] === startHour)
                            found = true;
                        if (found && !rows[i].querySelectorAll("td")[day].classList.contains("event")) {
                            rows[i].querySelectorAll("td")[day].classList.remove("empty");
                            rows[i].querySelectorAll("td")[day].classList.add("event");
                            rows[i].querySelectorAll("td")[day].style.backgroundColor = options.color;
                        }
                        if (rows[i].querySelector("td").textContent.split(":")[0] === endHour) {
                            found = false;
                            break;
                        }
                    }
                }
            }
        }
        if (this.viewType === "monthly") {
            if (date.month === that.currentDate.getMonth() + 1 && date.year === that.currentDate.getFullYear()) {
                for(let cell of that.table.querySelectorAll("td")){
                    let day = parseInt(cell.querySelector("span").textContent);
                    if(day === date.day){
                        if(!cell.querySelector(".circle_event"))
                            cell.appendChild(this[_createElement]("div", {class: "circle_event"}));
                        break;
                    }
                }

            }
        }
        // this.show();
    },
    eventFilter:function(date, hour){
        return this.events.filter(function (v) {
            let hours = v.date.hours.split("-").length > 1 ? v.date.hours : "0:00-23:00";
            hours=hours.split("-");
            let startHour = parseInt(hours[0].split(":"));
            let endHour = parseInt(hours[1].split(":"));
            return v.date.year === date.getFullYear() && v.date.month === date.getMonth()+1 && v.date.day === date.getDate() &&
                ((hour>=startHour && hour<=endHour) || !hour)
        })
    },
    showTooltip:function(cell, content){
        const that=this;
        that.parent.querySelector(".calendar_tooltip").innerHTML = "";
        that.parent.querySelector(".calendar_tooltip").classList.remove("hide");
        that.parent.querySelector(".calendar_tooltip").appendChild(content);
        updateTooltip(that.parent.querySelector(".calendar_tooltip"), cell);
    },
    hideTooltip:function(){
        const that=this;
        if (!that.parent.querySelector(".calendar_tooltip").classList.contains("hide")) {
            that.parent.querySelector(".calendar_tooltip").classList.add("hide");
        }
    },
    setView: function (viewType) {
        this.viewType=viewType;
        this.createTable();
        this.show();
    },
    setLang: function (lang) {
        this.lang=lang;
        this.createTable();
        this.show();
    },
    selectDay: function (cell,deselectAll) {
        if(deselectAll)
            this.deselectAllDay();
        cell.classList.add("selected-day");
    },
    deselectAllDay: function () {
        for(let cell of this.table.querySelectorAll("td"))
            cell.classList.remove("selected-day");
    },
    deselectDay: function (cell) {
        cell.classList.remove("selected-day");
    }

};


/**
 * [
 *      {
 *          startDate: "",
 *          endDate: "",
 *          type: "1",
 *          events: "",
 *          working: "1",
 *      }
 * ]
 * **/