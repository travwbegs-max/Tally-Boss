let charts =
  JSON.parse(localStorage.getItem('charts')) || [
    {
      name: 'My First Chart',
      people: []
    }
  ];

let currentChart = 0;

const WIN_SCORE = 20;

function saveData() {
  localStorage.setItem(
    'charts',
    JSON.stringify(charts)
  );
}

function renderTallies(points) {

  let groups = [];
  let current = '';

  for (let i = 1; i <= points; i++) {

    if (i % 5 === 0) {

      current += '/';
      groups.push(current);
      current = '';

    } else {

      current += '|';
    }
  }

  if (current !== '') {
    groups.push(current);
  }

  return groups.join('  ');
}

function render() {

  const chartTabs =
    document.getElementById('chartTabs');

  const peopleContainer =
    document.getElementById('peopleContainer');

  chartTabs.innerHTML = '';
  peopleContainer.innerHTML = '';

  charts.forEach((chart, index) => {

    const tab =
      document.createElement('div');

    tab.className =
      'chart-tab' +
      (index === currentChart
        ? ' active'
        : '');

    tab.innerText = chart.name;

    tab.onclick = () => {
      currentChart = index;
      render();
    };

    chartTabs.appendChild(tab);
  });

  charts[currentChart]
    .people
    .sort((a, b) => b.points - a.points);

  charts[currentChart]
    .people
    .forEach((person, index) => {

      const card =
        document.createElement('div');

      card.className = 'person-card';

      card.innerHTML = `

        <div class="person-header">

          <div class="person-name">
            ${
              index === 0 &&
              person.points > 0
                ? '👑 '
                : ''
            }

            ${person.emoji}
            ${person.name}
          </div>

          <button onclick="deletePerson(${index})">
            Delete
          </button>

        </div>

        <div class="tally-bubble">

          <div class="tally-text">
            ${renderTallies(person.points)}
          </div>

        </div>

        <div>
          ${person.points} Points
        </div>

        ${
          person.points >= WIN_SCORE
            ? '<div class="winner">🎉 WINNER 🎉</div>'
            : ''
        }

        <div class="button-row">

          <button
            class="minus-btn"
            onclick="removePoint(${index})">
            -1
          </button>

          <button
            class="plus-btn"
            onclick="addPoint(${index})">
            +1
          </button>

        </div>
      `;

      peopleContainer.appendChild(card);
    });

  saveData();
}

function createChart() {

  const input =
    document.getElementById('chartNameInput');

  if (!input.value.trim()) return;

  charts.push({
    name: input.value,
    people: []
  });

  currentChart = charts.length - 1;

  input.value = '';

  render();
}

function deleteChart() {

  if (charts.length === 1) {
    alert('You need at least one chart.');
    return;
  }

  charts.splice(currentChart, 1);

  currentChart = 0;

  render();
}

function addPerson() {

  const input =
    document.getElementById('personNameInput');

  if (!input.value.trim()) return;

  const emojis = [
    '😎',
    '🔥',
    '⚽',
    '🏆',
    '🚀',
    '🎯'
  ];

  const randomEmoji =
    emojis[
      Math.floor(
        Math.random() * emojis.length
      )
    ];

  charts[currentChart]
    .people
    .push({
      name: input.value,
      points: 0,
      emoji: randomEmoji
    });

  input.value = '';

  render();
}

function addPoint(index) {

  charts[currentChart]
    .people[index]
    .points++;

  render();
}

function removePoint(index) {

  if (
    charts[currentChart]
    .people[index]
    .points > 0
  ) {

    charts[currentChart]
      .people[index]
      .points--;
  }

  render();
}

function deletePerson(index) {

  charts[currentChart]
    .people.splice(index, 1);

  render();
}

document
  .getElementById('darkModeBtn')
  .onclick = () => {

    document.body.classList.toggle('dark');

    localStorage.setItem(
      'darkMode',
      document.body.classList.contains('dark')
    );
  };

if (
  localStorage.getItem('darkMode')
  === 'true'
) {

  document.body.classList.add('dark');
}

render();
