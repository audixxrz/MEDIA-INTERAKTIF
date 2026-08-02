const slidesEl = document.getElementById('slides')
const slideEls = Array.from(document.querySelectorAll('.slide'))
const prevSlideBtn = document.getElementById('prevSlide')
const nextSlideBtn = document.getElementById('nextSlide')
const gotoQuizBtn = document.getElementById('gotoQuiz')
const quizSection = document.getElementById('quiz')
const questionArea = document.getElementById('questionArea')
const prevQ = document.getElementById('prevQ')
const nextQ = document.getElementById('nextQ')
const submitQuiz = document.getElementById('submitQuiz')
const quizResult = document.getElementById('quizResult')

const btnListenIntro = document.getElementById('btnListenIntro')
const btnStartSlides = document.getElementById('btnStartSlides')
const introTextEl = document.getElementById('introText')

let currentSlide = 0
function showSlide(i){
  currentSlide = Math.max(0, Math.min(i, slideEls.length-1))
  slideEls.forEach((s,idx)=>{
    s.style.display = idx===currentSlide ? 'block' : 'none'
    if(idx===currentSlide){
      s.classList.remove('fade-in')
      void s.offsetWidth
      s.classList.add('fade-in')
    }
  })
  // update progress bar
  const bar = document.querySelector('.slide-progress-bar')
  if(bar){
    const pct = Math.round(((currentSlide+1)/slideEls.length)*100)
    bar.style.width = pct + '%'
    bar.setAttribute('aria-valuenow', pct)
    bar.setAttribute('aria-label', `Slide ${currentSlide+1} dari ${slideEls.length}`)
  }
}
prevSlideBtn.addEventListener('click', ()=> showSlide(currentSlide-1))
nextSlideBtn.addEventListener('click', ()=> showSlide(currentSlide+1))
showSlide(0)

// --- Quiz data (dalam bahasa Indonesia) ---
const questions = [
  {q:'Apa hasil utama fotosintesis pada tumbuhan?', options:['Oksigen dan glukosa','Karbon dioksida dan air','Nitrogen dan oksigen','Air dan mineral'], a:0},
  {q:'Organisme mana yang berperan sebagai produsen dalam rantai makanan?', options:['Tumbuhan','Hewan pemangsa','Jamur','Virus'], a:0},
  {q:'Di mana pertukaran gas (oksigen dan karbon dioksida) terjadi di paru-paru?', options:['Alveoli','Trakea','Hidung','Bronkus'], a:0},
  {q:'Perubahan wujud dari cair menjadi gas disebut...', options:['Penguapan','Pembekuan','Kondensasi','Sublimasi'], a:0},
  {q:'Fungsi klorofil pada tumbuhan adalah untuk...', options:['Menangkap energi cahaya','Mengangkut air','Mencerna makanan','Menghasilkan akar'], a:0},
  {q:'Contoh hubungan antar makhluk hidup di ekosistem adalah...', options:['Rantai makanan','Fotosintesis','Evaporasi','Pelapukan'], a:0},
  {q:'Gas yang dilepaskan tumbuhan saat fotosintesis adalah...', options:['Oksigen','Karbon monoksida','Nitrogen','Hidrogen'], a:0},
  {q:'Bagian tumbuhan yang biasanya melakukan fotosintesis adalah...', options:['Daun','Akar','Batang','Biji'], a:0},
  {q:'Alat pernapasan utama pada manusia adalah...', options:['Paru-paru','Hidung','Trakea','Alveoli'], a:0},
  {q:'Kecepatan gerak partikel paling tinggi pada wujud...', options:['Padat','Cair','Gas','Plasma'], a:2},
  {q:'Proses pengembunan uap air menjadi tetesan disebut...', options:['Penguapan','Sublimasi','Kondensasi','Deposisi'], a:2},
  {q:'Konsumen primer biasanya memakan...', options:['Produsen','Konsumen sekunder','Dekomposer','Virus'], a:0},
  {q:'Trakea berfungsi sebagai...', options:['Saluran udara ke paru-paru','Tempat pertukaran gas','Alat pencernaan','Penghasil getah'], a:0},
  {q:'Mengapa suhu memengaruhi perubahan wujud materi?', options:['Mengubah energi kinetik partikel','Mengubah massa partikel','Mengubah jenis atom','Mengubah warna benda'], a:0},
  {q:'Salah satu hasil respirasi sel adalah...', options:['Karbon dioksida dan energi','Oksigen dan glukosa','Nitrogen dan urea','Air dan garam'], a:0}
]

let currentQ = 0
let answers = new Array(questions.length).fill(null)

function renderQuestion(i){
  const q = questions[i]
  questionArea.innerHTML = ''
  const wrapper = document.createElement('div')
  wrapper.className = 'question'
  const title = document.createElement('h3')
  title.textContent = `Pertanyaan ${i+1}: ${q.q}`
  wrapper.appendChild(title)

  const opts = document.createElement('div')
  opts.className = 'options'
  q.options.forEach((opt, idx)=>{
    const label = document.createElement('label')
    const input = document.createElement('input')
    input.type = 'radio'
    input.name = 'opt'
    input.value = idx
    if(answers[i]===idx) input.checked = true
    input.addEventListener('change', ()=> answers[i]=idx)
    label.appendChild(input)
    label.append(` ${opt}`)
    opts.appendChild(label)
  })
  wrapper.appendChild(opts)
  questionArea.appendChild(wrapper)
  // update quiz progress text
  const qp = document.getElementById('quizProgress')
  if(qp) qp.textContent = `Soal ${i+1} / ${questions.length}`
}

prevQ.addEventListener('click', ()=>{
  currentQ = Math.max(0, currentQ-1); renderQuestion(currentQ)
})
nextQ.addEventListener('click', ()=>{
  currentQ = Math.min(questions.length-1, currentQ+1); renderQuestion(currentQ)
})

submitQuiz.addEventListener('click', ()=>{
  // check all answered
  const unanswered = answers.some(a=> a===null)
  if(unanswered){
    if(!confirm('Beberapa pertanyaan belum dijawab. Kirim tetap?')) return
  }
  let score = 0
  const details = []
  questions.forEach((q,idx)=>{ 
    const user = answers[idx]
    const correct = q.a
    const ok = user === correct
    if(ok) score++
    details.push({q:q.q, user: user, userText: user==null? 'Belum menjawab' : q.options[user], correct: correct, correctText: q.options[correct], ok})
  })

  // render result with per-question feedback
  quizResult.classList.remove('hidden')
  quizResult.innerHTML = `<strong>Skor Anda: ${score} / ${questions.length}</strong>`
  const list = document.createElement('div')
  details.forEach((d, i)=>{
    const item = document.createElement('div')
    item.className = 'result-item'
    const qh = document.createElement('div')
    qh.innerHTML = `<strong>Pertanyaan ${i+1}:</strong> ${d.q}`
    const userEl = document.createElement('div')
    userEl.innerHTML = `<strong>Jawaban Anda:</strong> ${d.userText}`
    const corrEl = document.createElement('div')
    corrEl.innerHTML = `<strong>Jawaban Benar:</strong> ${d.correctText}`
    if(d.ok){
      userEl.className = 'option-correct'
    } else {
      userEl.className = 'option-wrong'
    }
    item.appendChild(qh)
    item.appendChild(userEl)
    item.appendChild(corrEl)
    list.appendChild(item)
  })
  quizResult.appendChild(list)
})

// show quiz
gotoQuizBtn.addEventListener('click', ()=>{
  document.getElementById('slides').classList.add('hidden')
  document.querySelector('.controls').classList.add('hidden')
  quizSection.classList.remove('hidden')
  renderQuestion(0)
})

// initial quiz state hidden; allow direct access via URL hash
if(location.hash === '#quiz'){
  gotoQuizBtn.click()
}

// --- Speech (Web Speech API) ---
function speak(text){
  if(!('speechSynthesis' in window)) return alert('SpeechSynthesis tidak didukung di peramban ini.')
  const s = new SpeechSynthesisUtterance(text)
  s.lang = 'id-ID'
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(s)
}

if(btnListenIntro){
  btnListenIntro.addEventListener('click', ()=> speak(introTextEl.textContent))
}

if(btnStartSlides){
  btnStartSlides.addEventListener('click', ()=>{
    document.querySelector('.cover').classList.add('hidden')
    window.scrollTo({top:0,behavior:'smooth'})
  })
}

// --- Theme toggle (light/dark) ---
const themeToggle = document.getElementById('themeToggle')
function applyTheme(theme){
  document.body.classList.remove('theme-light','theme-dark')
  document.body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light')
  if(themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙'
}
const savedTheme = localStorage.getItem('kuis_theme') || 'light'
applyTheme(savedTheme)
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const now = document.body.classList.contains('theme-dark') ? 'dark' : 'light'
    const next = now === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    localStorage.setItem('kuis_theme', next)
  })
}

