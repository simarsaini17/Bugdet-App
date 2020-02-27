//BUDGET CONTROLLER

var budgetController=(function(){
  
    
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
          // 1. Get the field input data
      
       var data=UICntrl.getInputData();
        console.log(data);
       // 2. add the item to the budget controller
       
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