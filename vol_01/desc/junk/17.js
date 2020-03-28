window.onload = function(){
    var n = document.getElementsByClassName('jsanim-17')
    var current = 0
    var frameTime = 2000;    
    hideAll()
    anim17()
    console.warn('this is happening')

    function hideAll(){
        for(var i = 0; i<n.length; i++){
            var e = n[i];
            e.style.display = 'none';            
        }        
    } 

    function anim17(){                
        if (current%n.length === 0){
            current = 0            
            hideAll()            
        }
        n[current%n.length].style.display = 'block'
        current++;
        setTimeout(anim17, frameTime)    
    }
}
