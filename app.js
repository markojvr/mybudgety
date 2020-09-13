var budgetcontroller = (function(){
    //set al die budget variables
    var Expences = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1
    }
    Expences.prototype.calcPercentage = function(totalIncome) {
        if(totalIncome>0){
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }else{
            this.percentage = -1
        }
    }

    Expences.prototype.getPercentage = function() {
        return this.percentage;
    }

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    var calculatetotal = function(type){
        var sum = 0;
        data.allitems[type].forEach(function(cur){
            sum += cur.value;
        })
        data.totals[type] = sum;
    }

    var data ={
        allitems:{
            exp :[],
            inc :[]
        },
        totals:{
            exp : 0,
            inc : 0
        },
        budget: 0,
        percentage: -1
    }
   
    //werk al die somme uit met die input values


    return{
        ////
        //sit n nuwe item by
        ////
        additem: function(type,des,val){
            var newItem,id,vindID,expInc;
            //kyk of dit n income of expence is
            if (type === 'exp'){
                expInc = data.allitems.exp
            }
            else{
                expInc = data.allitems.inc }

            //Elke item moet sy eie unieke ID hê en van hierdie id's gaan geDelete raak so  ons kan nie length  +1 doen nie
            if(expInc.length>0){
                vindID = (expInc.length-1);
                id = (expInc[vindID].id)+1;
            }
            else{ id = 0}

            //maak ń income of expence item
            if(type === 'inc'){
                newItem = new Income(id,des,val);
            }
            else if(type === 'exp'){
                newItem = new Expences(id,des,val);
            }
            //Push die item in die datastructure in
            expInc.push(newItem);
            //return die nuwe item
            return newItem
        },
        deleteItem:function(type,id){
            var ids,index; 
            ids = data.allitems[type].map(function(current){
                return current.id
            })
            index = ids.indexOf(id);
            if(index !==-1){
                data.allitems[type].splice(index,1)
            }
        },
        calculateBudget: function(){
            // werk die totale incomes en expenses uit
            calculatetotal('exp');
            calculatetotal('inc');
            
            // werk die budget uit
            data.budget = data.totals.inc - data.totals.exp; 

            //werk die persentasie wat ons gespandeer het uit
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            }else{data.percentage = -1}
        },
        calculatePercentage:function () {
            data.allitems.exp.forEach(function (cur) {
                cur.calcPercentage(data.totals.inc);
            })
        },

        calcTenth: function(){
            var value, description,id, tenth,alExp; 
            value = data.totals.inc/10;
            description = 'Tiende'
            alExp = data.allitems.exp

            if(alExp.length>0){
                vindID = (alExp.length-1);
                id = (alExp[vindID].id)+1;
            }
            else{ id = 0}

            tenth = new Expences(id,description,value)
            tenth.percentage = 10
            return tenth
        },

        getPercentages:function () {
            var allPerc = data.allitems.exp.map(function(cur){
                return cur.getPercentage();
            }) 
            return allPerc
        },

        getbudget: function(){
            return{
                budget: data.budget,
                percentage: data.percentage,
                totalExp: data.totals.exp,
                totalInc: data.totals.inc
            }
        },
        testing:function(){
            console.log(data)
        },
        skoonmaak:function(){
            //reset die expences en kry hul IDs
            var expIDs;
            expIDs = data.allitems.exp.map(function(current) {
                return ('exp' + '-' +current.id.toString());
            });
            data.allitems.exp = []
            //reset die incomes en kry hul IDs
            var incIDs;
            incIDs = data.allitems.inc.map(function(current) {
                return ('inc' + '-' +current.id.toString());
            });
            data.allitems.inc = [];
            return {
                expIDs: expIDs,
                incIDs: incIDs
            }
        }

    }
})();

var UIcontroller = (function(){
    var DOMstrings = {
        inputType: '.add__type',
        inputdescription: '.add__description',
        inputvalue: '.add__value',
        inputbtn: '.add__btn',
        incomeContainer: '.income__list',
        expencesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month',
        clearbtn: '.add__10th',
        tiendebtn: '.add__tiende'
    };

    var formatNumbers = function(num,type){
        var numsplit, int,dec,result,sign
        num = Math.abs(num)
        num = num.toFixed(2);

        numsplit = num.split('.')
        int = numsplit[0]
        dec = numsplit[1]
        if(int.length>3){
            int = int.substr(0,int.length - 3) + ',' + int.substr(length - 3,3)
        }
        type === 'exp' ? sign = '-': sign = '+'

        result = sign + ' ' + int + '.' + dec
        return result
    }

    var nodelistsforeach = function(list,callback){
        for (var i = 0; i < list.length; i++) {
            callback(list[i],i)
        }
    }
    
    return{
        addlistitem: function(obj,type){
            var html,newhtml,element;
            //sit n nuwe item by
            if(type==='inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if(type==='exp'){
                element = DOMstrings.expencesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            newhtml = html.replace('%id%',obj.id);
            newhtml = newhtml.replace('%description%',obj.description);
            newhtml = newhtml.replace('%value%',formatNumbers(obj.value,type));
            document.querySelector(element).insertAdjacentHTML('beforeend',newhtml); 
        },
        deletelistitem:function(selectorID){
            //delete n item van die UI
            var el = document.getElementById(selectorID)
            el.parentNode.removeChild(el);
        },
        changefields: function(){
            var type, fields,input,btn;
            input = UIcontroller.getinput()
            type = input.type
            btn = document.querySelector(DOMstrings.inputbtn)
            fields = document.querySelectorAll(DOMstrings.inputType + ',' + DOMstrings.inputdescription + ',' + DOMstrings.inputvalue)
            if(type==='exp'){
                nodelistsforeach(fields,function(current){
                    current.classList.add('red-focus');
                });
                btn.classList.add('red')
            }
            else {
                nodelistsforeach(fields,function(current){
                    current.classList.remove('red-focus');
                });
                btn.classList.remove('red')
            }


        },

        //maak input fields skoon
        clearfields:function() {
            var fields,fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputdescription + ',' + DOMstrings.inputvalue);
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current){
                current.value = "";
            }); 
            fieldsArr[0].focus();
        },
        //display al die inligting op die UI
        displayBudget: function(obj){
            //werk uit of daar n + of n - vir formatnumbers gegee moet word
            var type
            obj.budget > 0 ? type = 'inc':type = 'exp'
            //display budget
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumbers(obj.budget,type);
            //display inkomste
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumbers( obj.totalInc,'inc');
            //display uitgawes
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumbers( obj.totalExp,'exp');
            //display persentasie
            if (obj.percentage>0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            }else{document.querySelector(DOMstrings.percentageLabel).textContent = '---'}
        },
        
        displaypercentages: function(percentages){
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            nodelistsforeach(fields,function (current,index) {
                if(percentages[index]>0){
                    current.textContent = percentages[index] + '%'
                }else{
                    current.textContent = '---' 
                }
            })
        },
        displayDate: function(){
            var now,year,month,months,date;
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['Januarie','Februarie','Maart','April','Mei','Junie','Julie','Augustus','September','Oktober','November','Desember'];
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year
        },

        getinput: function(){
            ////
            //kry input values
            ////
            return{
                type : document.querySelector(DOMstrings.inputType).value, //exp of inc
                description : document.querySelector(DOMstrings.inputdescription).value,//naam
                value : parseFloat( document.querySelector(DOMstrings.inputvalue).value),//hoeveelheid geld
            }
        },

        getDomstrings:function(){
                return DOMstrings;
        }
    }
})();

var controller = (function(budgetCtrl,UIctrl){
    
    //wat ons in hierdie module gaan doen :

    //Call all die functions van die ander modules
    //control die ander goed bv. eventlistenerS

    var updatepercentages = function() {
        //calculate die percentages in die budgetcontroller
        budgetCtrl.calculatePercentage();
        //kry die percentages van die budgetcontroller af
        var percentages = budgetCtrl.getPercentages()
        //update die UI in die UIcontroller
        UIctrl.displaypercentages(percentages);
    }

    var updateBudget = function(){
        //werk al die somme uit
        budgetCtrl.calculateBudget();
        var budget = budgetCtrl.getbudget();
        //Beeld die totale bedrag uit
        UIctrl.displayBudget(budget)

    }
    var ctrlAddItem = function(){
        ////////////
        //wat om te doen as iemand values input
        ///////////
        var input,newItem;
        //1 kry input values
        input = UIctrl.getinput();
        if(input.description!=='' && !isNaN(input.value) && input.value > 0){
            //2 set al die budget variables met die input values
            newItem = budgetCtrl.additem(input.type,input.description,input.value);
            //3 verander die UI met die input
            UIctrl.addlistitem(newItem,input.type)
            //4 maak input fields skoon
            UIctrl.clearfields()
            //5 update die budget
            updateBudget()
            //6 update die persentasies
            updatepercentages()
        }
    };
    var ctrlAddtenth = function(){
        //werk 10% van die totaal uit
        var tienperc = budgetCtrl.calcTenth();
        //maak 'n item met die tien persent in die data structure
        budgetCtrl.additem('exp',tienperc.description,tienperc.value);
        //maak dit in die UI
        UIctrl.addlistitem(tienperc,'exp');
        //update die budget
        updateBudget()
        //update die persentasies
        updatepercentages()
    }

    var ctrlDeleteItem = function (event){
        ////
        //wat om te doen waneer iemand die delete knoppie druk
        ////
        //kry die ID
        var itemid,splitid,type,id;
        itemid = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemid){
            splitid = itemid.split('-');
            type = splitid[0];
            id = parseInt(splitid[1])
            //1 delete dit van die data structure
            budgetCtrl.deleteItem(type,id)
            //2 delete dit van die UI
            UIctrl.deletelistitem(itemid)
            //3 Update die buget
            updateBudget();
            //4 update die persentasie       
            updatepercentages()
        }
    }
    var ctrlDeleteAllItems = function() {
        //delete all die items van die data structure
        var IDs = budgetCtrl.skoonmaak()
        expIDs = IDs.expIDs
        incIDs = IDs.incIDs
        //Delete dit van die UI
        for (var i = 0; i < incIDs.length; i++) {
            UIctrl.deletelistitem(incIDs[i])
        }
        for (var i = 0; i < expIDs.length; i++) {
            UIctrl.deletelistitem(expIDs[i])
        }
        //Update die budget en persentages
        updatepercentages()
        updateBudget()
    }

    var setUp = function(){
        ////
        //stel aplikasie op
        ////
        UIctrl.displayBudget({
            budget: 0,
            percentage: -1,
            totalExp: 0,
            totalInc: 0
        });
        UIctrl.displayDate()

        var DOMstrings = UIctrl.getDomstrings()

        document.querySelector(DOMstrings.inputbtn).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress',function(event){
            if(event.keyCode===13){
                ctrlAddItem();
            };
            document.querySelector(DOMstrings.container).addEventListener('click',ctrlDeleteItem);
        });
        document.querySelector(DOMstrings.container).addEventListener('click',ctrlDeleteItem);
        document.querySelector(DOMstrings.inputType).addEventListener('change',UIctrl.changefields)
        document.querySelector(DOMstrings.clearbtn).addEventListener('click',ctrlDeleteAllItems)
        document.querySelector(DOMstrings.tiendebtn).addEventListener('click',ctrlAddtenth)
    };

    return  setUp()
})(budgetcontroller,UIcontroller);
controller