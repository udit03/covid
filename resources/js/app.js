const country_name_element = document.querySelector('.country .name');
const total_cases_element = document.querySelector('.total-cases .value');
const new_cases_element = document.querySelector('.total-cases .new-value');
const recovered_element = document.querySelector('.recovered .value');
const new_recovered_element = document.querySelector('.recovered .new-value');
const deaths_element = document.querySelector('.deaths .value');
const new_deaths_element = document.querySelector('.deaths .new-value');

const ctx = document.getElementById('axes_linear_chart').getContext('2d');

// APP VARIABLES
let app_data = [],
  cases_list = [],
  recovered_list = [],
  deaths_list = [],
  deaths = [],
  formatedDates = [];

// GET USERS COUNTRY CODE
fetch(
  'https://api.ipgeolocation.io/ipgeo?apiKey=14c7928d2aef416287e034ee91cd360d'
)
  .then(res => {
    return res.json();
  })
  .then(data => {
    let country_code = data.country_code2;
    let user_country;
    country_list.forEach(country => {
      if (country.code == country_code) {
        user_country = country.name;
      }
    });
    fetchData(user_country);
  });

/* ---------------------------------------------- */
/*                     FETCH API                  */
/* ---------------------------------------------- */
function fetchData(country) {
  user_country = country;
  country_name_element.innerHTML = 'Loading...';

  (cases_list = []),
    (recovered_list = []),
    (deaths_list = []),
    (dates = []),
    (formatedDates = []);

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  const api_fetch = async country => {
    // ------------------------------------------------------------------
    //   await fetch(
    //     `https://corona.lmao.ninja/v2/countries/${country}`,
    //     requestOptions
    //   )
    //     .then(res => {
    //       return res.json();
    //     })
    //     .then(data => {
    //       data.forEach(entry => {
    //         dates.push(entry.Date);
    //         cases_list.push(entry.Cases);
    //       });
    //     });
    // ------------------------------------------------------------------
    await fetch(
      'https://api.covid19api.com/total/country/' +
        country +
        '/status/confirmed',
      requestOptions
    )
      .then(res => {
        return res.json();

        // console.log(res.json);
      })
      .then(data => {
        data.forEach(entry => {
          dates.push(entry.Date);
          cases_list.push(entry.Cases);
        });
      });

    // await fetch(
    //   'https://api.covid19api.com/total/country/' +
    //     country +
    //     '/status/recovered',
    //   requestOptions
    // )
    await fetch(
      `https://corona.lmao.ninja/v2/countries/${country}`,
      requestOptions
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        recovered_list.push(data.recovered);
        // data.forEach(entry => {
        //   recovered_list.push(entry.Cases);
        // });
      });

    await fetch(
      'https://api.covid19api.com/total/country/' + country + '/status/deaths',
      requestOptions
    )
      .then(res => {
        return res.json();
      })
      .then(data => {
        data.forEach(entry => {
          deaths_list.push(entry.Cases);
        });
      });

    updateUI();
  };

  api_fetch(country);
}

// UPDATE UI FUNCTION
function updateUI() {
  updateStats();
  axesLinearChart();
}

function updateStats() {
  const total_cases = cases_list[cases_list.length - 1];
  const new_confirmed_cases = total_cases - cases_list[cases_list.length - 2];

  const total_recovered = recovered_list[recovered_list.length - 1];
  const new_recovered_cases =
    total_recovered - recovered_list[recovered_list.length - 2];

  const total_deaths = deaths_list[deaths_list.length - 1];
  const new_deaths_cases = total_deaths - deaths_list[deaths_list.length - 2];

  country_name_element.innerHTML = user_country;
  total_cases_element.innerHTML = total_cases;
  new_cases_element.innerHTML = `+${new_confirmed_cases}`;
  recovered_element.innerHTML = total_recovered;
  new_recovered_element.innerHTML = `+${new_recovered_cases}`;
  deaths_element.innerHTML = total_deaths;
  new_deaths_element.innerHTML = `+${new_deaths_cases}`;

  // format dates
  dates.forEach(date => {
    formatedDates.push(formatDate(date));
  });
}

// const arr = [
//   2000, 325, 3452, 2345, 2345, 324, 235, 234, 3, 45, 43, 345, 345, 34, 534, 53,
//   434543, 545, 34, 53, 45, 345, 34, 53, 45, 43, 5, 34, 53, 454, 5, 345, 34, 3,
//   45, 34, 5, 45, 34, 534, 5, 34, 534, 5, 34, 534, 5, 2345, 23452, 123342,
//   123423, 23423, 23423423, 234, 234, 234, 234, 2342, 34, 23, 423, 42, 42, 4, 23,
//   4, 2, 3, 234, 2347, 234, 2345, 3, 5423, 3245,
// ];

// UPDATE CHART
let my_chart;
function axesLinearChart() {
  if (my_chart) {
    my_chart.destroy();
  }

  my_chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Cases',
          data: cases_list,
          fill: false,
          borderColor: '#FFF',
          backgroundColor: '#FFF',
          borderWidth: 1,
        },
        // {
        //   label: 'Recovered',
        //   data: recovered_list,
        //   fill: false,
        //   borderColor: '#009688',
        //   backgroundColor: '#009688',
        //   borderWidth: 1,
        // },
        {
          label: 'Deaths',
          data: deaths_list,
          fill: false,
          borderColor: '#f44336',
          backgroundColor: '#f44336',
          borderWidth: 1,
        },
      ],
      labels: formatedDates,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// FORMAT DATES
const monthsNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDate(dateString) {
  let date = new Date(dateString);

  return `${date.getDate()} ${monthsNames[date.getMonth()]}`;
}
