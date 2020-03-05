//BUDGET CONTROLLER

var budgetController=(function(){
    
    var MonthlyExpenses=function(id,description,val){
        this.id=id;
        this.description=description;
        this.val=val;
    };
    
    var MonthlyIncome=function(id,description,val){
        this.id=id;
        this.description=description;
        this.val=val;
    };
    var calculateTotal=function(type){
        var sum=0;
        
        data.allItems[type].forEach(function(curr){
            sum += curr.val;
        });
        
        data.total[type]=sum;
        
    };
    var data={
        allItems:{
        expense:[],
        income:[]
    },
    total:{
        expense:0,
        income:0
    },
    budgetTotal:0
        
};
    return{
        addItem:function(type,des,val){
    //1. create item id
    var newItem, ID
    if(data.allItems[type].length===0)
        {
            ID=0;
        }
    else if(data.allItems[type].length>0)
        {
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
        }
   
    //2. add new item
    if(type==='expense'){
        newItem= new MonthlyExpenses(ID,des,val);
    }else if(type ==='income'){
        newItem= new MonthlyIncome(ID,des,val);
    }
    //3. return new item
     data.allItems[type].push(newItem);
    return newItem;
},
        
    calculateBudget:function(){
            //1. calculate the budget
            calculateTotal('expense');
            calculateTotal('income');
            
            //2. return the budget
            data.budgetTotal=data.total.income-data.total.expense;
            
            
        },
        deleteItem:function(type,ID){
            var ids,index;
            
            ids=data.allItems[type].map(function(current){
                return current.id;
            })
            index=ids.indexOf(ID);
            if(index!== -1){
                data.allItems[type].splice(index,1);
             }
            
        },
        
        getBudget:function()
        {
           return {
               totalBudget:data.budgetTotal,
               totalInc:data.total.income,
               totalExp:data.total.expense
           }
        },
        
    testing:function(){
        console.log(data);
    }
};
  
})();




//UI CONTROLLER 

var UIController=(function(){
    
    var DOMstrings={
        inputType:'.add_type',
        inputDesciption: '.add_description',
        inputValue:'.add_value',
        inputButton:'.add_btn',
        incomeContainer:'.income_list',
        expenseContainer:'.expense_list',
        budgetval:'.budget_value',
        budgetIncomeVal:'.budget__income--value',
        budgetExpenseVal:'.budget__expense--value',
        container:'.container'
    }
    var formatNumber=function(num,type){
            var num, numSplit, intPart,decPart
            //1. - and + before number
        
            //2. comma seprated thousands
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split('.');
            intPart=numSplit[0];
        console.log(intPart)
            decPart=numSplit[1];
        console.log(decPart)
        
            if(intPart.length>3){
                intPart=intPart.substring(0,intPart.length-3)+","+intPart.substr(intPart.length-3,3);
            }
            
            return(type==='expense'?'-':'+')+intPart+"."+decPart;
         }
    
    return{
        getInputData:function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDesciption).value,
                val:parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },
        addListItem:function(obj,type){
            
            var html,element,newHtml
            if(type==='income'){
                element=DOMstrings.incomeContainer
                    
                html='<div class="item clearfix" id="income-%i%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>'
            }else if(type==='expense'){
                element=DOMstrings.expenseContainer
                
                html='<div class="item clearfix" id="expense-%i%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-circle-outline"></ion-icon></button></div></div></div>'
                    
                }
            
            newHtml=html.replace('%i%', obj.id);
            newHtml=newHtml.replace('%description%', obj.description);
            newHtml=newHtml.replace('%val%', formatNumber(obj.val,type));
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
        },
        deleteListItem:function(selectorID){
            var element=document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },
        clearFields:function()
        {
            var itemFields,fieldsArr
            
            itemFields=document.querySelectorAll(DOMstrings.inputDesciption + ',' +DOMstrings.inputValue);
            
            fieldsArr=Array.prototype.slice.call(itemFields);
            fieldsArr.forEach(function(curr,index,arr){
                curr.value="";
            })
            
            fieldsArr[0].focus();
        },
        
        displayBudget:function(obj){
            var type;
            if(obj.totalBudget>=0? type='income': type='expense')
            document.querySelector(DOMstrings.budgetval).textContent=formatNumber(obj.totalBudget,type);
            document.querySelector(DOMstrings.budgetIncomeVal).textContent=formatNumber(obj.totalInc,type);
            document.querySelector(DOMstrings.budgetExpenseVal).textContent=formatNumber(obj.totalExp,type);
            
        },
       
        
        getDOMstrings:function(){
        return DOMstrings;
    }
    };
    
    
})();


// GLOBAL APP CONTROLLER
var controller=(function(budgetCntrl,UICntrl){
    
    var setupEventListeners=function(){
         var DOM=UICntrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click',controlAddItem);
        document.addEventListener('keypress',function(event){
            if(event.keyCode===13 || event.which===13){
              controlAddItem();
           }
        });
        document.querySelector(DOM.container).addEventListener('click',controlDeleteItem);
    }
    
   var updateBudget=function(){
       
       //1. Cacluate the budget
       budgetCntrl.calculateBudget();
       
       //2. return 
       var budget=budgetCntrl.getBudget();
       
       
       //3. update the UI
       UICntrl.displayBudget(budget);
       
       
       
       
   }
    var controlAddItem=function(){
        var data,item
          // 1. Get the field input data
      
      data=UICntrl.getInputData();
        
        if(data.description!="" && !isNaN(data.val) && data.val!=0)
        {
            // 2. add the item to the budget controller
       item=budgetCntrl.addItem(data.type,data.description,data.val);
        
       //3. add the item to UI
        UICntrl.addListItem(item,data.type);
        
        // 4. clear fields
        UICntrl.clearFields();
        
            //5. calculate the budget
        updateBudget();
        }
       
        
       
        //6. display the budget on the UI
        
    }
    var controlDeleteItem=function(event){
        var itemID, splitID, type, ID
        itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(itemID){
            splitID=itemID.split('-');
            type=splitID[0];
            ID=parseInt(splitID[1]);
            
            //1. delete the item from array
            budgetCntrl.deleteItem(type,ID);
        
            
            //2. delete item from UI
            UICntrl.deleteListItem(itemID);
            
            //3. update budget
            updateBudget();
            
        }
        
    }
   return{
       init:function(){
           console.log("Application has started");
           UICntrl.displayBudget({totalBudget:0,
               totalInc:0,
               totalExp:0});
           
           setupEventListeners();
       }
   };
       
    
})(budgetController,UIController);


controller.init();