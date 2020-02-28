//BUDGET CONTROLLER

var budgetController=(function(){
    
    var MonthlyExpenses=function(selector,description,val){
        this.selector=selector;
        this.description=description;
        this.val=val;
    }
    
    var MonthlyIncome=function(selector,description,val){
        this.selector=selector;
        this.description=description;
        this.val=val;
    }
    var data={
        allItems:{
        expense:[],
        income:[]
    },
    total:{
        expense:0,
        income:0
        }
};
    return{
        addItem:function(type,des,val){
    //1. creat item id
    var newItem, ID
    if(data.allItems[type].length===0)
        {
            ID=0;
        }else if(data.allItems[type].length>0)
            {
                 ID=data.allItems[type][data.allItems[type].length-1].id
                
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
        inputButton:'.add_btn'
    }
    return{
        getInputData:function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description:document.querySelector(DOMstrings.inputDesciption).value,
                val: document.querySelector(DOMstrings.inputValue).value
            }
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
    
   
    var controlAddItem=function(){
        var data,item
          // 1. Get the field input data
      
      data=UICntrl.getInputData();
        console.log(data);
       // 2. add the item to the budget controller
       item=budgetCntrl.addItem(data.type,data.description,data.val);
        
       
       //3. add the item to UI
       
       //4. calculate the budget
       
       //5. display the budget on the UI
        
    }
   return{
       init:function(){
           console.log("Application has started");
           setupEventListeners();
       }
   };
       
    
})(budgetController,UIController);


controller.init();