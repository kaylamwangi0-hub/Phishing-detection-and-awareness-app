function show(id){

  document.querySelectorAll("section").forEach(s=>s.classList.remove("active"));

  document.getElementById(id).classList.add("active");

}

/* LOGIN */

function login(){

  let name=document.getElementById("username").value;

  if(!name)return alert("Enter your name");

  localStorage.setItem("user",name);

  if(!localStorage.getItem("data")){

    localStorage.setItem("data",JSON.stringify({

      level:1,xp:0,history:[]

    }));

  }

  loadDashboard();

  show("dashboard");

}

function logout(){

  localStorage.clear();

  show("login");

}

/* DASHBOARD */

function loadDashboard(){

  let user=localStorage.getItem("user");

  let data=JSON.parse(localStorage.getItem("data"));

  document.getElementById("welcome").innerText="Welcome "+user;

  document.getElementById("levelInfo").innerText=

  "Level "+data.level+" | XP "+data.xp+"/100";

  document.getElementById("xpBar").style.width=data.xp+"%";

}

/* SCANNER */

function scanMessage(){

  let text=document.getElementById("messageInput").value.toLowerCase();

  let risk=0;

  let tips=[];

  const patterns=[

    {word:"urgent",tip:"Urgency is used to pressure victims."},

    {word:"verify",tip:"Never verify through unknown links."},

    {word:"password",tip:"No company asks for passwords via message."},

    {word:".xyz",tip:"Suspicious domain extension detected."},

    {word:"bank",tip:"Contact bank using official channel."}

  ];

  patterns.forEach(p=>{

    if(text.includes(p.word)){

      risk++;

      tips.push(p.tip);

    }

  });

  let result;

  if(risk>=3){

    result="Severe Phishing Probability";

  }else if(risk==2){

    result="Elevated Risk – Review Carefully";

  }else{

    result="Low Risk – Continue Verification";

  }

  document.getElementById("result").innerHTML=

  "<b>"+result+"</b><br><br>"+tips.join("<br>");

  saveHistory(text,result);

}

function saveHistory(m,r){

  let data=JSON.parse(localStorage.getItem("data"));

  data.history.unshift({m,r});

  localStorage.setItem("data",JSON.stringify(data));

}

function showHistory(){

  let data=JSON.parse(localStorage.getItem("data"));

  let list=document.getElementById("historyList");

  list.innerHTML="";

  data.history.forEach(i=>{

    let li=document.createElement("li");

    li.innerText=i.m+" → "+i.r;

    list.appendChild(li);

  });

  show("history");

}

/* GAME */

const questions=[

  {q:"Bank says click immediately",o:["Click","Ignore","Call bank","Send password"],a:2},

  {q:"Unknown asks for OTP",o:["Share","Delete","Verify","Post online"],a:2},

  {q:"Fake domain .xyz",o:["Safe","Suspicious","Official","Trusted"],a:1},

  {q:"Spelling mistakes email",o:["Trust","Check official site","Send money","Reply fast"],a:1},

  {q:"Prize you never entered",o:["Claim","Ignore","Send ID","Send bank"],a:1},

  {q:"Strange attachment",o:["Open","Scan first","Forward","Trust"],a:1},

  {q:"Password via SMS",o:["Give","Report","Click","Share"],a:1},

  {q:"Pop-up virus payment",o:["Pay","Close & scan","Enter card","Click"],a:1},

  {q:"Friend asks money strangely",o:["Send","Call friend","Ignore","Post"],a:1},

  {q:"URL slightly changed",o:["Safe","Fake lookalike","Official","Verified"],a:1}

];

let current=0;

let score=0;

function startGame(){

  current=0;

  score=0;

  show("game");

  loadQuestion();

}

function loadQuestion(){

  if(current>=questions.length){

    document.getElementById("question").innerText="Game Completed!";

    document.getElementById("options").innerHTML="";

    document.getElementById("feedback").innerText="Final Score: "+score+"/10";

    rewardXP();

    return;

  }

  let q=questions[current];

  document.getElementById("question").innerText=q.q;

  let html="";

  q.o.forEach((opt,i)=>{

    html+=`<button onclick="checkAnswer(${i})">${opt}</button><br>`;

  });

  document.getElementById("options").innerHTML=html;

  document.getElementById("score").innerText="Question "+(current+1)+" of 10";

}

function checkAnswer(choice){

  if(choice===questions[current].a){

    score++;

    document.getElementById("feedback").innerText="Correct – Smart choice!";

  }else{

    document.getElementById("feedback").innerText="Incorrect – Think verification!";

  }

  current++;

  setTimeout(loadQuestion,1000);

}

function rewardXP(){

  let data=JSON.parse(localStorage.getItem("data"));

  data.xp+=score*5;

  if(data.xp>=100){

    data.level++;

    data.xp=0;

  }

  localStorage.setItem("data",JSON.stringify(data));

  loadDashboard();

}

/* AUTO LOGIN */

window.onload=function(){

  if(localStorage.getItem("user")){

    loadDashboard();

    show("dashboard");

  }

};