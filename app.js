//BUDGET CONTROLLER

var budgetController=(function(){
    
    var MonthlyExpenses=function(selector,description,val){
        this.selector=selector;
        this.description=description;
        this.val=val;
    };
    
    var MonthlyIncome=function(selector,description,val){
        this.selector=selector;
        this.description=description;
        this.val=val;
    };
    var calculateTotal=function(type){
        var sum=0;
        
        data.allItems[type].forEach(function(curr){
            sum += curr.val;
        });
        console.log(sum);
        
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
    //1. creat item id
    var newItem, ID
    if(data.allItems[type].length===0)
        {
            ID=0
        }else if(data.allItems[type].length>0)
        {
            ID=data.allItems[type][data.allItems[type].length-1].selector
        }
   
    //2. add new item
    if(type==='expense'){
        newItem=new MonthlyExpenses(type,des,val);
    }else if(type==='income'){
        newItem=new MonthlyIncome(type,des,val);
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
        expenseContainer:'.expense_list'
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
                    
                html='<div class="item clearfix" id="income-%selector%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }else if(type==='expense'){
                element=DOMstrings.expenseContainer
                
                html='<div class="item clearfix" id="expense-%selector%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%val%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                    
                }
            
            newHtml=html.replace('%selector',obj.selector);
            newHtml=newHtml.replace('%description%',obj.description);
            newHtml=newHtml.replace('%val%',obj.val);
            
            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            
            
            
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
        })
    }
    
   var updateBudget=function(){
       
       //1. Cacluate the budget
       budgetCntrl.calculateBudget();
       
       //2. return 
       var budget=budgetCntrl.getBudget();
       
       console.log(budget);
       
       //3. update the UI
       
       
   }
    var controlAddItem=function(){
        var data,item
          // 1. Get the field input data
      
      data=UICntrl.getInputData();
        console.log(data.type);
        
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
   return{
       init:function(){
           console.log("Application has started");
           setupEventListeners();
       }
   };
       
    
})(budgetController,UIController);


controller.init();