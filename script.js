var uid = new ShortUniqueId();
const addBtn=document.querySelector(".add-btn");
const modal=document.querySelector(".modal");
let modalFlag=true;
let removeBtn=document.querySelector(".remove-btn");
let removeBtnActive=false;
const allPriorityColors=document.querySelectorAll(".pcolor");
let colors=['lightpink','lightgreen','lightblue','black'];
let modalPColor=colors[colors.length-1];
let textAreaCont=document.querySelector(".textarea-cont");
const mainCont=document.querySelector(".main-cont");
ticketsArr=[];
let toolBoxColors=document.querySelectorAll(".color");
let lockClass="fa-lock";
let unlockClass="fa-lock-open";

// + start or stop

/* let modalFlag=true; top d */
addBtn.addEventListener('click',function(){
    if(modalFlag)
    modal.style.display="flex";
    else
    modal.style.display="none";

    modalFlag=!modalFlag;
    
})

// active class working logic

/* const allPriorityColors=document.querySelectorAll(".pcolor"); top d */
allPriorityColors.forEach(function(colorElement){
 
    colorElement.addEventListener('click',function(){
        allPriorityColors.forEach(function(priorityColorElement){
            priorityColorElement.classList.remove("active");
        });
        colorElement.classList.add("active");
        modalPColor=colorElement.classList[0];
    });

});


// modal div se data lena(ticketColor,data)

/*
let colors=['lightpink','lightgreen','lightblue','black']; top d
let modalPColor=colors[colors.length-1];  top d 
let textAreaCont=document.querySelector(".textarea-cont"); top d
*/

// // through shift button
// modal.addEventListener("keydown",function(e){
      
//       let key=e.key;
//       if(key=="Shift"){
//         createTicket(modalPColor,textAreaCont.value);
//         modal.style.display= "none";
//         modalFlag=true;
//         textAreaCont.value="";
//       }

// });


 // through save button
 let saveBtn=document.querySelector(".save-content");
 saveBtn.addEventListener("click",function(){
    createTicket(modalPColor,textAreaCont.value);
    modal.style.display= "none";
    modalFlag=true;
    textAreaCont.value="";

 });



//  unpkg for unique id
/* html
<!-- Add source (minified 7.2K) -->
<script src="https://cdn.jsdelivr.net/npm/short-unique-id@latest/dist/short-unique-id.min.js"></script>

<!-- Usage -->
<script>
  // Instantiate
  var uid = new ShortUniqueId();

  // Random UUID
  document.write(uid());

  // Sequential UUID
  document.write(uid.seq());
</script>
*/


// const mainCont=document.querySelector(".main-cont"); top d
// ticketsArr=[]; top

function createTicket(ticketColor, data, ticketId){
      
    let id=ticketId || uid();

    // <div class="ticket-cont"></div>
  let ticketCont=document.createElement("div");
  ticketCont.setAttribute("class","ticket-cont");
  ticketCont.innerHTML=`
      <div class="ticket-color ${ticketColor}"></div>
      <div class="ticket-id">${id}</div>
      <div class="task-area">${data}</div>
      <div class="ticket-lock"> <i class="fa-solid fa-lock"></i> </div>
  `;

  mainCont.appendChild(ticketCont);
  handleRemoval(ticketCont,id);
  handleColor(ticketCont,id);
  handleLock(ticketCont,id);

if(!ticketId){
    ticketsArr.push({ticketColor,data,ticketId:id});
    localStorage.setItem("tickets",JSON.stringify(ticketsArr));
}
// console.log(ticketId); bhaher use nhi kryy sktey
}


//get all tickets from local Storage
if(localStorage.getItem("tickets")){
  ticketsArr=JSON.parse(localStorage.getItem("tickets"));
  ticketsArr.forEach(function(ticketobj){
    createTicket(ticketobj.ticketColor,ticketobj.data,ticketobj.ticketId);
  })
}

// filter tickets on the basic of ticketColor
//let toolBoxColors=document.querySelectorAll(".color");
for(let i=0;i<toolBoxColors.length;i++){

    toolBoxColors[i].addEventListener("click",function(){
        let currToolBoxColor=toolBoxColors[i].classList[0];

        let filteredTickets=ticketsArr.filter(function(ticketobj){
            return currToolBoxColor==ticketobj.ticketColor;
        });

       // remove all the tickets
       let allTickets=document.querySelectorAll(".ticket-cont");
       for(let i=0;i<allTickets.length;i++){
        allTickets[i].remove();
       }

       //display filteredTickets
       filteredTickets.forEach(function(ticketobj){
        createTicket(ticketobj.ticketColor,ticketobj.data,ticketobj.ticketId);
       });

    })

    // for double click to any color
    // toolBoxColors[i].addEventListener("dblclick",function(){
        
    //     // remove all the tickets
    //     let allTickets=document.querySelectorAll(".ticket-cont");
    //     for(let i=0;i<allTickets.length;i++){
    //      allTickets[i].remove();
    //     }

    //      //display all Tickets
    //    ticketsArr.forEach(function(ticketobj){
    //     createTicket(ticketobj.ticketColor,ticketobj.data,ticketobj.ticketId);
    //    });

    // });
}

// By All button 
let AllColor=document.querySelector(".all-color");
  AllColor.addEventListener("click",function(){
        
        // remove all the tickets
        let allTickets=document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTickets.length;i++){
         allTickets[i].remove();
        }

         //display all Tickets
       ticketsArr.forEach(function(ticketobj){
        createTicket(ticketobj.ticketColor,ticketobj.data,ticketobj.ticketId);
       });

    });


// on clicking removeBtn, make color red and make coor white in clicking again
// let removeBtn=document.querySelector(".remove-btn");
// let removeBtnActive=false;
removeBtn.addEventListener("click",function(){
    if(removeBtnActive){
      removeBtn.style.color="white";
    }else{
      removeBtn.style.color="red";
    }
    removeBtnActive=!removeBtnActive;
});

function handleRemoval(ticket,id){
  ticket.addEventListener("click",function(){
        if(!removeBtnActive) return;
       //local Storage remove
       // get idx of the ticket to be deleted
       let idx=getTicketIdx(id);
       ticketsArr.splice(idx,1);

       // removed from browser storage and set updated arr
       localStorage.setItem("tickets",JSON.stringify(ticketsArr));

       //frontend remove
       ticket.remove();

  });
}

function getTicketIdx(id){
  let ticketIdx=ticketsArr.findIndex(function(ticketobj){
               return ticketobj.ticketId==id;
     });
  return ticketIdx;
}


//change priority color of the tickets
function handleColor(ticket, id) {
  let ticketColorStrip = ticket.querySelector(".ticket-color"); 

  ticketColorStrip.addEventListener("click", function () {
      let currTicketColor = ticketColorStrip.classList[1]; //lightpink
      //let colors=['lightpink','lightgreen','lightblue','black'];
      let currTicketColorIdx = colors.indexOf(currTicketColor); //0

      let newTicketColorIdx = currTicketColorIdx + 1; //1

      newTicketColorIdx = newTicketColorIdx % colors.length; //1
      let newTicketColor = colors[newTicketColorIdx]; //lightgreen

      ticketColorStrip.classList.remove(currTicketColor); //lightpink [ticket-color, lightpink]-> [ticket-color]
      ticketColorStrip.classList.add(newTicketColor);

      //local storage update 
      let ticketIdx = getTicketIdx(id);
      ticketsArr[ticketIdx].ticketColor = newTicketColor;
      localStorage.setItem("tickets", JSON.stringify(ticketsArr));

  });
}


// handleLock
// let lockClass="fa-lock";
// let unlockClass="fa-lock-open";

//lock and unlock to make content editable-> true or false 
function handleLock(ticket, id) {
// //icons ko append in ticket

let ticketLockEle = ticket.querySelector(".ticket-lock");
let ticketLock = ticketLockEle.children[0];
let ticketTaskArea = ticket.querySelector(".task-area");
// console.log(ticketLock);


//toggle of icons and contenteditable property
ticketLock.addEventListener("click", function () {
  let ticketIdx = getTicketIdx(id);
  if (ticketLock.classList.contains(lockClass)) {
    ticketLock.classList.remove(lockClass);
    ticketLock.classList.add(unlockClass);
    ticketTaskArea.setAttribute("contenteditable", "true");


    // Limt in contenteditable
    let textAreaContent=ticketsArr[ticketIdx].data;
    let count=textAreaContent.length;
    ticketTaskArea.addEventListener("keydown",function(e){
              count=count+1;
              if(count>=120){

                alert("Sorry, Its limt is only 120 characters");
                ticketTaskArea.setAttribute("contenteditable", "false");
              ;
              }
    });
    

  }
  else { //if lock is open
    ticketLock.classList.remove(unlockClass);
    ticketLock.classList.add(lockClass);
    ticketTaskArea.setAttribute("contenteditable", "false");
  }

  ticketsArr[ticketIdx].data = ticketTaskArea.innerText;
  localStorage.setItem("tickets", JSON.stringify(ticketsArr));
});
}