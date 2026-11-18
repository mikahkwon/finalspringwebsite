var feelingText = document.getElementById('feelingText');
var touchArea = document.getElementById('touchArea');
var touchCircle = document.getElementById('touchCircle');

console.log('FEEL: A Study of Spring');

function chooseFeeling(feeling) {
  var message = '';
  if (feeling === 'WARM') message = 'SUNLIGHT ON YOUR SKIN.';
  if (feeling === 'BREEZE') message = 'COOL AIR MOVING PAST YOU.';
  if (feeling === 'RAIN') message = 'THE FIRST DROPS OF SPRING RAIN.';
  feelingText.textContent = message;
  console.log('Selected feeling: ' + feeling);
}

if (touchArea && touchCircle) {
  touchArea.addEventListener('pointermove', function(event) {
    var box = touchArea.getBoundingClientRect();
    touchCircle.style.left = (event.clientX - box.left) + 'px';
    touchCircle.style.top = (event.clientY - box.top) + 'px';
  });
}

function saveMemory() {
  var memory = document.getElementById('memoryInput').value;
  if (memory.trim() === '') {
    alert('Write a memory first.');
    return;
  }
  document.getElementById('memoryOutput').textContent = memory;
  document.getElementById('savedMessage').textContent = 'OBSERVATION RECORDED ON THIS PAGE.';
  console.log('Memory recorded: ' + memory);
}


// A foggy window that reveals the photograph underneath when touched.
(function () {
  var canvas = document.getElementById('fogCanvas');
  if (!canvas) return;
  var area = document.getElementById('touchArea');
  var ctx = canvas.getContext('2d');
  var drawing = false;
  var previous = null;
  function coatGlass() {
    var rect = area.getBoundingClientRect();
    var ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(223, 226, 220, 0.96)';
    ctx.fillRect(0, 0, rect.width, rect.height);
    // Soft uneven fog, like condensation on cold glass.
    var fog = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    fog.addColorStop(0, 'rgba(255,255,255,.25)');
    fog.addColorStop(.55, 'rgba(180,185,181,.13)');
    fog.addColorStop(1, 'rgba(255,255,255,.35)');
    ctx.fillStyle = fog;
    ctx.fillRect(0, 0, rect.width, rect.height);
    previous = null;
  }
  function clearAt(e) {
    var rect = canvas.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 92;
    if (previous) {
      ctx.beginPath(); ctx.moveTo(previous.x, previous.y); ctx.lineTo(x, y); ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(x, y, 46, 0, Math.PI * 2); ctx.fill();
    previous = {x:x,y:y};
  }
  canvas.addEventListener('pointerdown', function(e) { drawing = true; canvas.setPointerCapture(e.pointerId); clearAt(e); });
  canvas.addEventListener('pointermove', function(e) { if (e.pointerType === 'mouse' || drawing) clearAt(e); });
  canvas.addEventListener('pointerup', function() { drawing = false; previous = null; });
  canvas.addEventListener('pointercancel', function() { drawing = false; previous = null; });
  canvas.addEventListener('pointerleave', function() { previous = null; });
  document.getElementById('resetFog').addEventListener('click', coatGlass);
  window.addEventListener('resize', coatGlass);
  coatGlass();
})();

