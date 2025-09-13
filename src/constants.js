const BASE_URL = `${import.meta.env.VITE_DEV_URL}`;

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Bottom Nav Bar                                                          │
  └─────────────────────────────────────────────────────────────────────────┘
*/
const PATHS_TO_NOT_SHOW_BOTTOM_NAV_BAR = [];

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Tournament                                                              │
  └─────────────────────────────────────────────────────────────────────────┘
*/
const TOURNAMENT_LISTING_ENDPOINT = `${BASE_URL}/api/public/tournaments`;
const TOURNAMENT_DETAILS_ENDPOINT = `${BASE_URL}/api/public/tournaments`;
const ANIMATE_CATEGORY_INIT = { height: 0, opacity: 0 };

const SPOTLIGHT_TOURNAMENTS_TAG = "featured";

const ANIMATE_CATEGORY = {
  height: "auto",
  opacity: 1,
  transition: {
    height: {
      duration: 0.3,
      ease: "easeOut",
    },
    opacity: {
      duration: 0.2,
      delay: 0.1,
    },
  },
};

const ANIMATE_CATEGORY_EXIT = {
  height: 0,
  opacity: 0,
  transition: {
    height: {
      duration: 0.2,
      ease: "easeIn",
    },
    opacity: {
      duration: 0.1,
    },
  },
};

const CATEGORY_NAMES = {
  SE: "Single Elimination",
  DE: "Double Elimination",
  RR: "Round Robin",
  MS: "Men's Singles",
  MD: "Men's Doubles",
  WS: "Women's Singles",
  WD: "Women's Doubles",
  MIS: "Mixed Singles",
  MID: "Mixed Doubles",
  HYBRID: "Hybrid",
  LEAGUE: "League",
};

const TournamentLiveTabs = ["Schedule", "Results", "Standings"];
const TournamentFixtureFormats = { SE: "Single Elimination", DE: "Double Elimination", RR: "Round Robin" };

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Home Page                                                               │
  └─────────────────────────────────────────────────────────────────────────┘
*/

const GET_GAMES_ENDPOINT = `${BASE_URL}/api/public/games`;
const TOURISM_ENDPOINT = `${BASE_URL}/api/public/tourism`;

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Login                                                                   │
  └─────────────────────────────────────────────────────────────────────────┘
*/
const PLAYER_ENDPOINT = `${BASE_URL}/api/players`;
const RESEND_OTP_ENDPOINT = `${BASE_URL}/api/players/auth/resend-otp`;
const LOGIN_ENDPOINT = `${BASE_URL}/api/players/auth/verify-otp`;
const SEND_OTP_ENDPOINT = `${BASE_URL}/api/players/auth/send-otp`;
const LOGOUT_ENDPOINT = `${BASE_URL}/api/players/auth/logout`;
const OTP_VALIDITY = 1; // Minutes
const DEFAULT_COUNTRY_CODE = { code: "+91", country: "India" };
const COUNTRIES = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];
const COUNTRY_CODES = [
  {
    country: "Afghanistan",
    code: "+93",
  },
  {
    country: "Aland Islands",
    code: "+358",
  },
  {
    country: "Albania",
    code: "+355",
  },
  {
    country: "Algeria",
    code: "+213",
  },
  {
    country: "AmericanSamoa",
    code: "+1684",
  },
  {
    country: "Andorra",
    code: "+376",
  },
  {
    country: "Angola",
    code: "+244",
  },
  {
    country: "Anguilla",
    code: "+1264",
  },
  {
    country: "Antarctica",
    code: "+672",
  },
  {
    country: "Antigua and Barbuda",
    code: "+1268",
  },
  {
    country: "Argentina",
    code: "+54",
  },
  {
    country: "Armenia",
    code: "+374",
  },
  {
    country: "Aruba",
    code: "+297",
  },
  {
    country: "Australia",
    code: "+61",
  },
  {
    country: "Austria",
    code: "+43",
  },
  {
    country: "Azerbaijan",
    code: "+994",
  },
  {
    country: "Bahamas",
    code: "+1242",
  },
  {
    country: "Bahrain",
    code: "+973",
  },
  {
    country: "Bangladesh",
    code: "+880",
  },
  {
    country: "Barbados",
    code: "+1246",
  },
  {
    country: "Belarus",
    code: "+375",
  },
  {
    country: "Belgium",
    code: "+32",
  },
  {
    country: "Belize",
    code: "+501",
  },
  {
    country: "Benin",
    code: "+229",
  },
  {
    country: "Bermuda",
    code: "+1441",
  },
  {
    country: "Bhutan",
    code: "+975",
  },
  {
    country: "Bolivia, Plurinational State of",
    code: "+591",
  },
  {
    country: "Bosnia and Herzegovina",
    code: "+387",
  },
  {
    country: "Botswana",
    code: "+267",
  },
  {
    country: "Brazil",
    code: "+55",
  },
  {
    country: "British Indian Ocean Territory",
    code: "+246",
  },
  {
    country: "Brunei Darussalam",
    code: "+673",
  },
  {
    country: "Bulgaria",
    code: "+359",
  },
  {
    country: "Burkina Faso",
    code: "+226",
  },
  {
    country: "Burundi",
    code: "+257",
  },
  {
    country: "Cambodia",
    code: "+855",
  },
  {
    country: "Cameroon",
    code: "+237",
  },
  {
    country: "Canada",
    code: "+1",
  },
  {
    country: "Cape Verde",
    code: "+238",
  },
  {
    country: "Cayman Islands",
    code: "+ 345",
  },
  {
    country: "Central African Republic",
    code: "+236",
  },
  {
    country: "Chad",
    code: "+235",
  },
  {
    country: "Chile",
    code: "+56",
  },
  {
    country: "China",
    code: "+86",
  },
  {
    country: "Christmas Island",
    code: "+61",
  },
  {
    country: "Cocos (Keeling) Islands",
    code: "+61",
  },
  {
    country: "Colombia",
    code: "+57",
  },
  {
    country: "Comoros",
    code: "+269",
  },
  {
    country: "Congo",
    code: "+242",
  },
  {
    country: "Congo, The Democratic Republic of the Congo",
    code: "+243",
  },
  {
    country: "Cook Islands",
    code: "+682",
  },
  {
    country: "Costa Rica",
    code: "+506",
  },
  {
    country: "Cote d'Ivoire",
    code: "+225",
  },
  {
    country: "Croatia",
    code: "+385",
  },
  {
    country: "Cuba",
    code: "+53",
  },
  {
    country: "Cyprus",
    code: "+357",
  },
  {
    country: "Czech Republic",
    code: "+420",
  },
  {
    country: "Denmark",
    code: "+45",
  },
  {
    country: "Djibouti",
    code: "+253",
  },
  {
    country: "Dominica",
    code: "+1767",
  },
  {
    country: "Dominican Republic",
    code: "+1849",
  },
  {
    country: "Ecuador",
    code: "+593",
  },
  {
    country: "Egypt",
    code: "+20",
  },
  {
    country: "El Salvador",
    code: "+503",
  },
  {
    country: "Equatorial Guinea",
    code: "+240",
  },
  {
    country: "Eritrea",
    code: "+291",
  },
  {
    country: "Estonia",
    code: "+372",
  },
  {
    country: "Ethiopia",
    code: "+251",
  },
  {
    country: "Falkland Islands (Malvinas)",
    code: "+500",
  },
  {
    country: "Faroe Islands",
    code: "+298",
  },
  {
    country: "Fiji",
    code: "+679",
  },
  {
    country: "Finland",
    code: "+358",
  },
  {
    country: "France",
    code: "+33",
  },
  {
    country: "French Guiana",
    code: "+594",
  },
  {
    country: "French Polynesia",
    code: "+689",
  },
  {
    country: "Gabon",
    code: "+241",
  },
  {
    country: "Gambia",
    code: "+220",
  },
  {
    country: "Georgia",
    code: "+995",
  },
  {
    country: "Germany",
    code: "+49",
  },
  {
    country: "Ghana",
    code: "+233",
  },
  {
    country: "Gibraltar",
    code: "+350",
  },
  {
    country: "Greece",
    code: "+30",
  },
  {
    country: "Greenland",
    code: "+299",
  },
  {
    country: "Grenada",
    code: "+1473",
  },
  {
    country: "Guadeloupe",
    code: "+590",
  },
  {
    country: "Guam",
    code: "+1671",
  },
  {
    country: "Guatemala",
    code: "+502",
  },
  {
    country: "Guernsey",
    code: "+44",
  },
  {
    country: "Guinea",
    code: "+224",
  },
  {
    country: "Guinea-Bissau",
    code: "+245",
  },
  {
    country: "Guyana",
    code: "+595",
  },
  {
    country: "Haiti",
    code: "+509",
  },
  {
    country: "Holy See (Vatican City State)",
    code: "+379",
  },
  {
    country: "Honduras",
    code: "+504",
  },
  {
    country: "Hong Kong",
    code: "+852",
  },
  {
    country: "Hungary",
    code: "+36",
  },
  {
    country: "Iceland",
    code: "+354",
  },
  {
    country: "India",
    code: "+91",
  },
  {
    country: "Indonesia",
    code: "+62",
  },
  {
    country: "Iran, Islamic Republic of Persian Gulf",
    code: "+98",
  },
  {
    country: "Iraq",
    code: "+964",
  },
  {
    country: "Ireland",
    code: "+353",
  },
  {
    country: "Isle of Man",
    code: "+44",
  },
  {
    country: "Israel",
    code: "+972",
  },
  {
    country: "Italy",
    code: "+39",
  },
  {
    country: "Jamaica",
    code: "+1876",
  },
  {
    country: "Japan",
    code: "+81",
  },
  {
    country: "Jersey",
    code: "+44",
  },
  {
    country: "Jordan",
    code: "+962",
  },
  {
    country: "Kazakhstan",
    code: "+77",
  },
  {
    country: "Kenya",
    code: "+254",
  },
  {
    country: "Kiribati",
    code: "+686",
  },
  {
    country: "Korea, Democratic People's Republic of Korea",
    code: "+850",
  },
  {
    country: "Korea, Republic of South Korea",
    code: "+82",
  },
  {
    country: "Kuwait",
    code: "+965",
  },
  {
    country: "Kyrgyzstan",
    code: "+996",
  },
  {
    country: "Laos",
    code: "+856",
  },
  {
    country: "Latvia",
    code: "+371",
  },
  {
    country: "Lebanon",
    code: "+961",
  },
  {
    country: "Lesotho",
    code: "+266",
  },
  {
    country: "Liberia",
    code: "+231",
  },
  {
    country: "Libyan Arab Jamahiriya",
    code: "+218",
  },
  {
    country: "Liechtenstein",
    code: "+423",
  },
  {
    country: "Lithuania",
    code: "+370",
  },
  {
    country: "Luxembourg",
    code: "+352",
  },
  {
    country: "Macao",
    code: "+853",
  },
  {
    country: "Macedonia",
    code: "+389",
  },
  {
    country: "Madagascar",
    code: "+261",
  },
  {
    country: "Malawi",
    code: "+265",
  },
  {
    country: "Malaysia",
    code: "+60",
  },
  {
    country: "Maldives",
    code: "+960",
  },
  {
    country: "Mali",
    code: "+223",
  },
  {
    country: "Malta",
    code: "+356",
  },
  {
    country: "Marshall Islands",
    code: "+692",
  },
  {
    country: "Martinique",
    code: "+596",
  },
  {
    country: "Mauritania",
    code: "+222",
  },
  {
    country: "Mauritius",
    code: "+230",
  },
  {
    country: "Mayotte",
    code: "+262",
  },
  {
    country: "Mexico",
    code: "+52",
  },
  {
    country: "Micronesia, Federated States of Micronesia",
    code: "+691",
  },
  {
    country: "Moldova",
    code: "+373",
  },
  {
    country: "Monaco",
    code: "+377",
  },
  {
    country: "Mongolia",
    code: "+976",
  },
  {
    country: "Montenegro",
    code: "+382",
  },
  {
    country: "Montserrat",
    code: "+1664",
  },
  {
    country: "Morocco",
    code: "+212",
  },
  {
    country: "Mozambique",
    code: "+258",
  },
  {
    country: "Myanmar",
    code: "+95",
  },
  {
    country: "Namibia",
    code: "+264",
  },
  {
    country: "Nauru",
    code: "+674",
  },
  {
    country: "Nepal",
    code: "+977",
  },
  {
    country: "Netherlands",
    code: "+31",
  },
  {
    country: "Netherlands Antilles",
    code: "+599",
  },
  {
    country: "New Caledonia",
    code: "+687",
  },
  {
    country: "New Zealand",
    code: "+64",
  },
  {
    country: "Nicaragua",
    code: "+505",
  },
  {
    country: "Niger",
    code: "+227",
  },
  {
    country: "Nigeria",
    code: "+234",
  },
  {
    country: "Niue",
    code: "+683",
  },
  {
    country: "Norfolk Island",
    code: "+672",
  },
  {
    country: "Northern Mariana Islands",
    code: "+1670",
  },
  {
    country: "Norway",
    code: "+47",
  },
  {
    country: "Oman",
    code: "+968",
  },
  {
    country: "Pakistan",
    code: "+92",
  },
  {
    country: "Palau",
    code: "+680",
  },
  {
    country: "Palestinian Territory, Occupied",
    code: "+970",
  },
  {
    country: "Panama",
    code: "+507",
  },
  {
    country: "Papua New Guinea",
    code: "+675",
  },
  {
    country: "Paraguay",
    code: "+595",
  },
  {
    country: "Peru",
    code: "+51",
  },
  {
    country: "Philippines",
    code: "+63",
  },
  {
    country: "Pitcairn",
    code: "+872",
  },
  {
    country: "Poland",
    code: "+48",
  },
  {
    country: "Portugal",
    code: "+351",
  },
  {
    country: "Puerto Rico",
    code: "+1939",
  },
  {
    country: "Qatar",
    code: "+974",
  },
  {
    country: "Romania",
    code: "+40",
  },
  {
    country: "Russia",
    code: "+7",
  },
  {
    country: "Rwanda",
    code: "+250",
  },
  {
    country: "Reunion",
    code: "+262",
  },
  {
    country: "Saint Barthelemy",
    code: "+590",
  },
  {
    country: "Saint Helena, Ascension and Tristan Da Cunha",
    code: "+290",
  },
  {
    country: "Saint Kitts and Nevis",
    code: "+1869",
  },
  {
    country: "Saint Lucia",
    code: "+1758",
  },
  {
    country: "Saint Martin",
    code: "+590",
  },
  {
    country: "Saint Pierre and Miquelon",
    code: "+508",
  },
  {
    country: "Saint Vincent and the Grenadines",
    code: "+1784",
  },
  {
    country: "Samoa",
    code: "+685",
  },
  {
    country: "San Marino",
    code: "+378",
  },
  {
    country: "Sao Tome and Principe",
    code: "+239",
  },
  {
    country: "Saudi Arabia",
    code: "+966",
  },
  {
    country: "Senegal",
    code: "+221",
  },
  {
    country: "Serbia",
    code: "+381",
  },
  {
    country: "Seychelles",
    code: "+248",
  },
  {
    country: "Sierra Leone",
    code: "+232",
  },
  {
    country: "Singapore",
    code: "+65",
  },
  {
    country: "Slovakia",
    code: "+421",
  },
  {
    country: "Slovenia",
    code: "+386",
  },
  {
    country: "Solomon Islands",
    code: "+677",
  },
  {
    country: "Somalia",
    code: "+252",
  },
  {
    country: "South Africa",
    code: "+27",
  },
  {
    country: "South Sudan",
    code: "+211",
  },
  {
    country: "South Georgia and the South Sandwich Islands",
    code: "+500",
  },
  {
    country: "Spain",
    code: "+34",
  },
  {
    country: "Sri Lanka",
    code: "+94",
  },
  {
    country: "Sudan",
    code: "+249",
  },
  {
    country: "Suriname",
    code: "+597",
  },
  {
    country: "Svalbard and Jan Mayen",
    code: "+47",
  },
  {
    country: "Swaziland",
    code: "+268",
  },
  {
    country: "Sweden",
    code: "+46",
  },
  {
    country: "Switzerland",
    code: "+41",
  },
  {
    country: "Syrian Arab Republic",
    code: "+963",
  },
  {
    country: "Taiwan",
    code: "+886",
  },
  {
    country: "Tajikistan",
    code: "+992",
  },
  {
    country: "Tanzania, United Republic of Tanzania",
    code: "+255",
  },
  {
    country: "Thailand",
    code: "+66",
  },
  {
    country: "Timor-Leste",
    code: "+670",
  },
  {
    country: "Togo",
    code: "+228",
  },
  {
    country: "Tokelau",
    code: "+690",
  },
  {
    country: "Tonga",
    code: "+676",
  },
  {
    country: "Trinidad and Tobago",
    code: "+1868",
  },
  {
    country: "Tunisia",
    code: "+216",
  },
  {
    country: "Turkey",
    code: "+90",
  },
  {
    country: "Turkmenistan",
    code: "+993",
  },
  {
    country: "Turks and Caicos Islands",
    code: "+1649",
  },
  {
    country: "Tuvalu",
    code: "+688",
  },
  {
    country: "Uganda",
    code: "+256",
  },
  {
    country: "Ukraine",
    code: "+380",
  },
  {
    country: "United Arab Emirates",
    code: "+971",
  },
  {
    country: "United Kingdom",
    code: "+44",
  },
  {
    country: "United States",
    code: "+1",
  },
  {
    country: "Uruguay",
    code: "+598",
  },
  {
    country: "Uzbekistan",
    code: "+998",
  },
  {
    country: "Vanuatu",
    code: "+678",
  },
  {
    country: "Venezuela, Bolivarian Republic of Venezuela",
    code: "+58",
  },
  {
    country: "Vietnam",
    code: "+84",
  },
  {
    country: "Virgin Islands, British",
    code: "+1284",
  },
  {
    country: "Virgin Islands, U.S.",
    code: "+1340",
  },
  {
    country: "Wallis and Futuna",
    code: "+681",
  },
  {
    country: "Yemen",
    code: "+967",
  },
  {
    country: "Zambia",
    code: "+260",
  },
  {
    country: "Zimbabwe",
    code: "+263",
  },
];

/*
  ┌─────────────────────────────────────────────────────────────────────────┐
  │ Player                                                                  │
  └─────────────────────────────────────────────────────────────────────────┘
*/
const SEARCH_PLAYERS = `${BASE_URL}/api/search-players`;
const ABOUT_US_ENDDPOINT = `${BASE_URL}/api/public/about-us`;

export {
  ABOUT_US_ENDDPOINT,
  ANIMATE_CATEGORY,
  ANIMATE_CATEGORY_EXIT,
  ANIMATE_CATEGORY_INIT,
  BASE_URL,
  CATEGORY_NAMES,
  COUNTRY_CODES,
  DEFAULT_COUNTRY_CODE,
  GET_GAMES_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  OTP_VALIDITY,
  PATHS_TO_NOT_SHOW_BOTTOM_NAV_BAR,
  PLAYER_ENDPOINT,
  RESEND_OTP_ENDPOINT,
  SEARCH_PLAYERS,
  SEND_OTP_ENDPOINT,
  SPOTLIGHT_TOURNAMENTS_TAG,
  TOURNAMENT_DETAILS_ENDPOINT,
  TOURNAMENT_LISTING_ENDPOINT,
  TOURISM_ENDPOINT,
  COUNTRIES,
  TournamentLiveTabs,
  TournamentFixtureFormats,
};
