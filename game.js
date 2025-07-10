const qEl      = document.getElementById('question');
const ansEl    = document.getElementById('answers');
const startBtn = document.getElementById('startBtn');
const scoreEl  = document.getElementById('score');
const livesEl  = document.getElementById('lives');

let score=0, lives=3;
const questions = [
  {q:'Czy Ziemia krąży wokół Słońca?', correct:true},
  {q:'Czy 2+2=5?', correct:false},
  {q:'Czy Polska leży w Europie?', correct:true},
  {q:'Czy pingwiny latają?', correct:false},
  // możesz dodać więcej pytań!
];

function renderStatus(){
  scoreEl.textContent = `Punkty: ${score}`;
  livesEl.textContent = 'Życia: ' + '❤️'.repeat(lives);
}

function ask(){
  if(lives<=0){
    qEl.textContent = 'Koniec gry!';
    ansEl.innerHTML = '';
    return;
  }
  const idx = Math.floor(Math.random()*questions.length);
  const {q, correct} = questions[idx];
  qEl.textContent = q;
  ansEl.innerHTML = `
    <button class="btn" data-val="true">Prawda</button>
    <button class="btn" data-val="false">Fałsz</button>
  `;
  ansEl.querySelectorAll('button').forEach(b=>{
    b.onclick = ()=>{
      const val = b.dataset.val==='true';
      if(val===correct) score++;
      else { lives--; }
      renderStatus();
      ask();
    };
  });
}

startBtn.onclick = ()=>{
  score=0; lives=3;
  renderStatus();
  ask();
  startBtn.style.display='none';
};

renderStatus();
