$(document).ready(function() {
    var quiz_data = [
        {'type': 'single', 'prompt': 'Where would you find the Empire State building?', 'choices': [{'name': 'New York', 'valid': true}, {'name': 'Los Angeles', 'valid': false}, {'name': 'San Fransico', 'valid': false}, {'name': 'New Orleans', 'valid': false}], 'instructions': ''},
        {'type': 'multi', 'prompt': 'Identify the components of a PC', 'choices':  [{'name': 'Processor', 'valid': true}, {'name': 'Memory', 'valid': true}, {'name': 'Hard Disk', 'valid': true}, {'name': 'CD-ROM Drive', 'valid': true}, {'name': 'Printer', 'valid': false}], 'instructions': ''},
        {'type': 'fill_in_the_blank', 'prompt': 'is a character in the film \"The Matrix\".', 'choices':  [{'name': 'R2D2', 'valid': false}, {'name': 'Neo', 'valid': true}, {'name': 'Ripley', 'valid': false}], 'instructions': ''},
    ]
    var user_score = 0;
    var quiz_progress = 0;


    //console.log(quiz_data);
    function load_question() {
        console.log('loading question...', quiz_progress);
        $(".item").remove();
        var current_question = quiz_data[quiz_progress];
        if(current_question.type == 'single'){
            current_question.choices.forEach((choice, choice_index) => {
                //console.log(choice);
                let clean_name = choice.name.split(' ').join('_');
                let raw_name = choice.name;
                $("#question-form").append('<div class="item"><input type="radio" name='+current_question.type+' id='+clean_name+' /><label for='+clean_name+'>'+raw_name+'</label></div>');
            });
        }else if(current_question.type == 'multi'){
            current_question.choices.forEach((choice, choice_index) => {
                //console.log(choice);
                let clean_name = choice.name.split(' ').join('_');
                let raw_name = choice.name;
                $("#question-form").append('<div class="item"><input type="checkbox" name='+current_question.type+' id='+clean_name+' /><label for='+clean_name+'>'+raw_name+'</label></div>');
            });
        }else{
            current_question.choices.forEach((choice, choice_index) => {
                //console.log(choice);
                let clean_name = choice.name.split(' ').join('_');
                let raw_name = choice.name;
                $("#question-form").append('<div class="draggable ui-widget-content"><p id='+clean_name+'>'+raw_name+'</p></div>');
            });
            checkDragAndDrop();
        }
        $("#question-form").append('<button class="item">OK</button>'); // always need a submit button
    }

  
    load_question(); // load initial question

    $("#question-form").submit(function(e) {
        e.preventDefault();
        if(submitted_choice_type == null){
            
        }else{
            var submitted_choice = document.querySelector('input:checked').id;
            var submitted_choice_type = document.querySelector('input:checked').name;
            var raw_name = submitted_choice.split('_').join(' ');
        }
        if(submitted_choice_type == 'multi'){
            // there are mutliple correct answers, need to check all
            var multi_selections = $("input:checked").map(function() {
                return this.id.split('_').join(' ');
            })
            multi_selections = Object.values(multi_selections);
        }
        switch (submitted_choice_type) {
            case 'single':
                var choices_to_check = quiz_data[0].choices;
                choices_to_check.forEach((ch, idx) => {
                    //console.log(ch);
                    if(ch.name == raw_name){
                        // this is the choice the user selected
                        // but is it the right one?
                        if(ch.valid){
                            // it is!
                            console.log('correct!');
                            user_score++;
                            return;
                        }else{
                            console.log('wrong!');
                            return;
                        }
                    }
                })
                break;
            case 'multi':
                var choices_to_check = quiz_data[1].choices;
                var is_partly_correct = false;
                var multi_point_scores = 0;
                choices_to_check.forEach((ch, idx) => {
                    console.log(ch.name);
                    console.log(multi_selections.includes(ch.name));
                    if(multi_selections.includes(ch.name)){
                        // this is the choice the user selected
                        // but is it the right one?
                        if(ch.valid){
                            // it is!
                            console.log('correct!');
                            //user_score++;
                            multi_point_scores++; // got at least one right
                        }else{
                            console.log('wrong!');
                            if(multi_point_scores > 0){
                                is_partly_correct = true; // missed at least one as well, partly correct here
                            }
                        }
                    }
                })
                if(is_partly_correct){
                    user_score += .5; // user gets half a point of they were at least partially correct
                }
                break;
            case 'fill_in_the_blank':
                var choices_to_check = quiz_data[2].choices;
                break;
            default:
                break;
        }
        //console.log(choices_to_check);
        
        quiz_progress++;
        // load next question
        if(quiz_progress < quiz_data.length){
            console.log('next question', quiz_progress);
            // if there are more questions ...onward!
            load_question();

        }else{
            // end of questions, show score screen
            console.log('end of questions - show scores!');

        }
    });

    function checkDragAndDrop(){
        if (jQuery.ui) {
            // UI loaded
            $( function() {
                $( ".draggable" ).draggable();
                $( "#droppable" ).droppable({
                  drop: function( event, ui ) {
                    $( this )
                      .addClass( "ui-state-highlight" )
                      .find( "p" )
                        .html( "Dropped!" );
                  }
                });
              } );
              $("#question-form").append('<div id="droppable" class="ui-widget-header"><p>Drag answer here</p></div>');
          }
    }
    
    
});