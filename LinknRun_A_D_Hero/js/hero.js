const hero=document.querySelector(".hero");
const communityPhoto=document.querySelector(".photo-community");
const gymPhoto=document.querySelector(".photo-gym");
const runnerPhoto=document.querySelector(".photo-runner");
const runnersCard=document.querySelector(".runners-card");
const streakCard=document.querySelector(".streak-card");
const linkCard=document.querySelector(".link-card");

if(hero&&window.innerWidth>800){
  hero.addEventListener("mousemove",e=>{
    const r=hero.getBoundingClientRect();
    const y=(e.clientY-r.top)/r.height-.5;
    communityPhoto.style.setProperty("--community-y",`${y*15}px`);
    gymPhoto.style.setProperty("--gym-y",`${y*-25}px`);
    runnerPhoto.style.setProperty("--runner-y",`${y*20}px`);
    runnersCard.style.setProperty("--runners-y",`${y*-30}px`);
    streakCard.style.setProperty("--streak-y",`${y*25}px`);
    linkCard.style.setProperty("--link-y",`${y*-20}px`);
  });
  hero.addEventListener("mouseleave",()=>{
    communityPhoto.style.setProperty("--community-y","0px");
    gymPhoto.style.setProperty("--gym-y","0px");
    runnerPhoto.style.setProperty("--runner-y","0px");
    runnersCard.style.setProperty("--runners-y","0px");
    streakCard.style.setProperty("--streak-y","0px");
    linkCard.style.setProperty("--link-y","0px");
  });
}

window.addEventListener("scroll",()=>{
  if(window.innerWidth<=800)return;
  const amount=Math.min(Math.max(0,-hero.getBoundingClientRect().top),250);
  communityPhoto.style.transform=`rotate(-7deg) translateY(${amount*-.05}px)`;
  gymPhoto.style.transform=`rotate(7deg) translateY(${amount*.08}px)`;
  runnerPhoto.style.transform=`rotate(6deg) translateY(${amount*-.1}px)`;
  const phone=document.querySelector(".phone");
  if(phone)phone.style.transform=`translate(-50%,calc(-50% + ${amount*-.04}px)) rotate(${2+amount*.002}deg)`;
});

document.querySelectorAll(".store-button").forEach(button=>{
  button.addEventListener("click",e=>{
    if(button.getAttribute("href")==="#"){
      e.preventDefault();
      console.log("App download link will be added later.");
    }
  });
});
