"use strict";

var parameter = function(name) {
    return(decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null);
};

(function() {

    var level = (parameter('level') || 1)|0;
    var counter;
    
    var time = function() {
        return 20;
    };

    var countDown = function() {
        $("#skip").show();
        var t = time();
        $("#counter").html(t);
        counter = setInterval(function() {
            $("#counter").html(t);
            t -= 1;
            if (t == 0) {
                blankWords();
            }
                
        }, 1000);
    };

    var check = function() {
        var success = true;
        $("#submit").attr("disabled", "true");
        for (var i = 0; i < words.length; i++) {
            var $inp = $("#i" + i);
            console.log(words[i]);
            console.log($inp.val());
            if (words[i].toLowerCase() !== $inp.val().toLowerCase()) {
                success = false;
                $inp.addClass("wrong");
            } else {
                $inp.addClass("right");
            }
            $inp.val(words[i]);
        }

        if (success) {
            $("#success").show();
            $("#success").addClass("uk-animation-slide-top");
        } else {
            $("#failure").show();
            $("#failure").addClass("uk-animation-slide-top");            
        }
        
    };

    
    var blankWords = function() {
        clearInterval(counter);
        
        for (var i = 0; i < words.length; i++) {
            $("#w" + i).html("<input id='i" + i + "' size=" + words[i].length + ">");
        }
        
        $("#counter").hide();
        $("#skip").hide();
        $("#submit").show();
    };

    var words = [];
    
    var setup = function() {
        $("#play").text("Loading...");
        $("#play").attr("disabled", "true");
        $("#counter").show();
        words = [];
        $.get("get.php?a=" + Math.random(), function(data) {
            $("#play").hide();

            data = JSON.parse(data);

            data.paras = data.paras.replace(/(\[\d+\])/g, '');
            var p = data.paras.split(/\s+/);
            window.paras = JSON.parse(JSON.stringify(p));
            if (p.length > 50) {
                var p2 = p.slice(0, 50);
                var i = 50;
                while (true) {
                    p2.push(p[i]);
                    if (p[i].indexOf('.') != -1)
                        break;
                    i++;
                }
                p = p2;
            }
            while (words.length < level) {
                var n = (Math.random() * p.length)|0;
                if (! p[n].match(/^[a-zA-Z]+$/) || p[n].length < 4)
                    continue;
                
                words.push(p[n]);
                p[n] = "<span id='w" + (words.length-1) + "'>" + p[n] + "</span>";
            }
            
            $("#wiki-title").html(data.title);
            $("#wiki-content").html(p.join(' '));

            countDown();
            
        });
        
    };
    
    $(window).ready(function() {
        $("#submit").hide();
        $("#counter").hide();
        $("#skip").hide();
        $("#level").text(level);
        $("#skip").on("click", blankWords);
        $("#success").hide();
        $("#failure").hide();
        $("#play").on("click", setup);
        $("#submit").on("click", check);
        $("#next").on("click", function() {
            location.href = "index.html?level=" + (level + 1);
        });
        $("button").addClass("uk-animation-hover uk-animation-scale");
    });
})();
    
