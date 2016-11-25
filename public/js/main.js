'use strict';

const trippin = function(){
    this.planTypes = ['hotel', 'restaurant', 'activity'];
    this.elem = {        
        getActiveTabValue: function() {
            let value;
            $('.tab-link').each(function() {
                if ($(this).hasClass('active')) {
                    value = $(this).data('value');
                }
            })
            return value;
        },
        selectList: function(planType) {
            return $(`#${planType}-list`);
        },
        addPlanButton: function(planType) {
            return $(`#${planType}-btn`);
        },
        removePlanButton: function(planType) {
            return $(`.clear-${planType}`);
        },
        dayPlanListItems:function(day, planType) {
            return $(`#day${day}>#${planType}-plan`).find('.list-item');
        }
    }
    this.templates = {        
        getTemplate: function(templateName, obj) {
            console.log('this', this)
            return this[templateName](obj);
        },
        planListItem: function(obj){
            console.log('Generate plan list item template', obj)
            return $('' +
                `<div class="list-item row" data-id="${obj.id}">` +
                    `<div class="col s10">${obj.name}</div>` +
                    '<div class="col s2">' +
                        `<a class="clear-hotel" data-value="${obj.id}">` +
                        '<i class="material-icons">clear</i>' +
                        '</a>' +
                    '</div>' +
                '</div>');
        }

    }    
}

/*
 This function initialize all events and assign them to DOM element
 */
trippin.prototype.init = function() {    
    let _this = this,
        element = this.elem,
        events = this.events,
        PlanTypes = this.planTypes;

    
    $(document).ready(function() {
        
        PlanTypes.forEach(function(planType) {
            /*
                add plan event
             */
            let $addPlanButton = element.addPlanButton(planType);
            if (planType === 'hotel') $addPlanButton.on('click', () => (_this.addPlan(planType, { allowMultiple: false })))
            else $addPlanButton.on('click', () => (_this.addPlan(planType, { allowMultiple: true })))

            /*
                remove plan button event
             */
            let $removePlanButton = element.removePlanButton(planType);
            element.removePlanButton(planType).on('click', function() {
                console.log('this', this)
                _this.removePlan(planType, this)
            })
        })
    });
};


trippin.prototype.getTemplate = function(templateName, obj) {
    return this.templates[templateName](obj);
}
trippin.prototype.addPlan = function(planType, options) {
    
    /* 
        This function takes following tow arguments
  
        1. placeType[String]
  
        takes string as first argument and use the string
        when selecting DOM element(s) with jQuery.

        2. options[Object]

        takes object as second argument. we can create many options
        and set it to trigger certain behavior.
  
        -- option list --
  

        options: {
          allowMultiple: Boolean
          ## This option allows to add multiple plans 
        }
    */
    console.log(`add ${planType}button is clicked.`);

    let _this = this,
        activeTab = this.elem.getActiveTabValue(),
        //$listItems = this.elem.dayPlanListItems(activeTab, planType),
        dataId = this.elem.selectList(planType).val(),

        isDuplicate = function() {
            // console.log('Is Duplicate?', $listItems)
            let result = false,
                $listItems = _this.elem.dayPlanListItems(activeTab, planType);
        
            $listItems.each(function(){
                //console.log('id', parseInt(dataId))
                //console.log('data-id', parseInt($(this).data('id')))
                if($(this).data('id') === parseInt(dataId)) result = true;
            })
            return result;
        },

        isEmpty = function(){
            let $listItems = _this.elem.dayPlanListItems(activeTab, planType);
            console.log('$listItems.length', $listItems.length)
            if(options && options.allowMultiple) return true;
            return !$listItems || $listItems.length === 0 ? true : false;
        };
        

    $.when(isDuplicate())
        .then((duplicate)=>{            
            if(duplicate) throw new Error(`${planType} id(${dataId}) already exist.`);            
            return isEmpty()
        }).then((empty)=>{            
            if(!empty) throw new Error(`${planType} already exist.`);
            return empty
        }).then(function(){
            let data = { day: activeTab };
            data[planType + 'Id'] = dataId;

            $.ajax({
                method: 'POST',
                url: window.location.href + '/' + planType,
                data: data
            }).done(function(result) {
                $(`#${planType}-plan>.plan-list`).append(_this.getTemplate('planListItem', result));
                
                /*
                remove plan button event
                 */
                $(`#day${activeTab}>#${planType}-plan`).find('.list-item').last().get(0).addEventListener('click', function() {
                    console.log('this', this)
                    return _this.removePlan(planType, this);
                });

            });
        },function(err){
            alert(err);
            return false;
        })
};

trippin.prototype.removePlan = function(planType, self){
    console.log(`remove ${planType}button is clicked.`);    
    $(self).closest('.list-item').empty();
}

trippin.prototype.addDay = function(){

}

trippin.prototype.removeDay = function(){

}

trippin.prototype.selectPlace = function(planType){

}


const Trippin = new trippin();
Trippin.init();
