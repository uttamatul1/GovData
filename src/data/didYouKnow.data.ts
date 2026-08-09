import type { Sector } from '../types';

export interface DidYouKnowFact {
  id: number;
  fact: string;
  sector: Sector;
  source: string;
  year: number;
  highlight: string;
  emoji: string;
}

export const didYouKnowFacts: DidYouKnowFact[] = [
  // ── Population ──
  { id: 1, fact: 'India surpassed China as the world\'s most populous nation in April 2023, with an estimated 1.428 billion people.', sector: 'population', source: 'UN DESA', year: 2023, highlight: '1.428B', emoji: '🌍' },
  { id: 2, fact: 'Uttar Pradesh alone has a larger population than Brazil — over 230 million people live in a single Indian state.', sector: 'population', source: 'Census Projection', year: 2024, highlight: '230M+', emoji: '🏙️' },
  { id: 3, fact: 'India\'s median age is just 28.4 years, making it one of the youngest major economies in the world.', sector: 'population', source: 'UN DESA', year: 2023, highlight: '28.4 yrs', emoji: '👶' },
  { id: 4, fact: 'The sex ratio at birth improved from 914 females per 1000 males (2004) to 929 per 1000 (2022).', sector: 'population', source: 'SRS', year: 2022, highlight: '929/1000', emoji: '⚖️' },
  { id: 5, fact: 'Kerala has the best sex ratio in India at 1,084 females per 1,000 males.', sector: 'population', source: 'Census 2011', year: 2011, highlight: '1,084', emoji: '💪' },
  { id: 6, fact: 'India adds roughly 1 crore (10 million) people to its population every year — equivalent to the population of Portugal.', sector: 'population', source: 'Registrar General', year: 2023, highlight: '10M/year', emoji: '📈' },
  { id: 7, fact: 'India\'s Total Fertility Rate dropped below replacement level to 2.0 in 2020 — a historic milestone.', sector: 'population', source: 'NFHS-5', year: 2020, highlight: 'TFR 2.0', emoji: '📉' },
  { id: 8, fact: 'Lakshadweep is India\'s least populated territory with just 64,473 people — fewer than a single Delhi locality.', sector: 'population', source: 'Census 2011', year: 2011, highlight: '64,473', emoji: '🏝️' },
  { id: 9, fact: 'India\'s urban population is expected to reach 600 million by 2031, nearly doubling from 2001.', sector: 'population', source: 'MoHUA', year: 2024, highlight: '600M', emoji: '🌆' },

  // ── Health ──
  { id: 10, fact: 'India\'s Infant Mortality Rate fell from 57 per 1,000 live births in 2006 to 27 in 2022 — a 53% drop.', sector: 'health', source: 'SRS 2022', year: 2022, highlight: '53% drop', emoji: '👶' },
  { id: 11, fact: 'Kerala\'s IMR of 6 per 1,000 is better than Thailand and comparable to the United States.', sector: 'health', source: 'SRS 2022', year: 2022, highlight: 'IMR 6', emoji: '🏥' },
  { id: 12, fact: 'India eliminated polio in 2014 — a monumental achievement for a country that once had 150,000 cases per year.', sector: 'health', source: 'WHO', year: 2014, highlight: '0 cases', emoji: '💉' },
  { id: 13, fact: 'Ayushman Bharat (PM-JAY) is the world\'s largest government health insurance scheme, covering 50 crore (500 million) citizens.', sector: 'health', source: 'MoHFW', year: 2024, highlight: '500M covered', emoji: '🛡️' },
  { id: 14, fact: 'India\'s Maternal Mortality Ratio decreased from 254 in 2005 to 97 in 2020 — a 62% improvement.', sector: 'health', source: 'SRS Special Bulletin', year: 2020, highlight: '62% better', emoji: '🤰' },
  { id: 15, fact: 'India has only 1 government doctor for every 1,000 people — WHO recommends at least 1 per 1,000.', sector: 'health', source: 'NHP 2022', year: 2022, highlight: '1:1,000', emoji: '👨‍⚕️' },
  { id: 16, fact: 'Full immunization coverage in India jumped from 62% (NFHS-4) to 76.4% (NFHS-5) — one of the fastest rises globally.', sector: 'health', source: 'NFHS-5', year: 2021, highlight: '76.4%', emoji: '💉' },
  { id: 17, fact: 'India\'s life expectancy at birth increased from 62.5 years in 2000 to 70.8 years in 2022.', sector: 'health', source: 'WHO', year: 2022, highlight: '70.8 years', emoji: '⏳' },
  { id: 18, fact: 'Swachh Bharat Mission built over 11 crore (110 million) household toilets, achieving near-universal sanitation access.', sector: 'health', source: 'MoDWS', year: 2024, highlight: '110M toilets', emoji: '🚽' },

  // ── Education ──
  { id: 19, fact: 'India\'s literacy rate jumped from 18.3% at independence (1947) to 77.7% in 2024.', sector: 'education', source: 'Census / UNESCO', year: 2024, highlight: '77.7%', emoji: '📚' },
  { id: 20, fact: 'Kerala has the highest literacy rate in India at 96.2% — higher than many European nations.', sector: 'education', source: 'Census 2011', year: 2011, highlight: '96.2%', emoji: '🎓' },
  { id: 21, fact: 'India produces over 1.5 million engineering graduates every year — more than the US and China combined.', sector: 'education', source: 'AICTE', year: 2023, highlight: '1.5M/year', emoji: '⚙️' },
  { id: 22, fact: 'The Gross Enrolment Ratio in higher education crossed 28.4% in 2022, up from just 20.4% in 2013.', sector: 'education', source: 'AISHE', year: 2022, highlight: '28.4%', emoji: '🏛️' },
  { id: 23, fact: 'Bihar\'s literacy rate of 63.8% is the lowest among states — 32 percentage points below Kerala.', sector: 'education', source: 'Census 2011', year: 2011, highlight: '63.8%', emoji: '📖' },
  { id: 24, fact: 'India\'s PM POSHAN (Mid-Day Meal) scheme feeds over 12 crore (120 million) school children daily.', sector: 'education', source: 'MoE', year: 2024, highlight: '120M children', emoji: '🍽️' },
  { id: 25, fact: 'The pupil-teacher ratio in primary schools improved from 42:1 in 2004 to 26:1 in 2022.', sector: 'education', source: 'UDISE+', year: 2022, highlight: '26:1', emoji: '👩‍🏫' },
  { id: 26, fact: 'India has over 1,000 universities and 42,000 colleges — one of the largest higher education systems globally.', sector: 'education', source: 'UGC', year: 2023, highlight: '42,000+', emoji: '🏫' },
  { id: 27, fact: 'Female literacy rate doubled from 39.3% in 2001 to an estimated 72% in 2024.', sector: 'education', source: 'Census / NSSO', year: 2024, highlight: '72%', emoji: '👩‍🎓' },

  // ── Economy ──
  { id: 28, fact: 'India became a $3.5 trillion economy in 2023 — up from just $0.47 trillion in 2000.', sector: 'economy', source: 'IMF', year: 2023, highlight: '$3.5T', emoji: '💰' },
  { id: 29, fact: 'UPI processed 13.4 billion transactions worth ₹20.6 lakh crore in a single month (Dec 2023) — the world\'s largest digital payments system.', sector: 'economy', source: 'NPCI', year: 2023, highlight: '13.4B txns', emoji: '📱' },
  { id: 30, fact: 'India\'s GDP grew at 8.2% in FY24 — the fastest among all major economies worldwide.', sector: 'economy', source: 'MoSPI', year: 2024, highlight: '8.2%', emoji: '🚀' },
  { id: 31, fact: 'GST collection crossed ₹2 lakh crore in a single month for the first time in April 2024.', sector: 'economy', source: 'CBIC', year: 2024, highlight: '₹2L Cr', emoji: '💸' },
  { id: 32, fact: 'India\'s foreign exchange reserves crossed $700 billion in 2024 — the 4th largest globally.', sector: 'economy', source: 'RBI', year: 2024, highlight: '$700B+', emoji: '🏦' },
  { id: 33, fact: 'The manufacturing sector\'s share in GDP rose from 15.3% in 2020 to 17.4% in 2024, driven by the Make in India initiative.', sector: 'economy', source: 'MoSPI', year: 2024, highlight: '17.4%', emoji: '🏭' },
  { id: 34, fact: 'India hosts the world\'s 3rd largest startup ecosystem with over 1.14 lakh registered startups and 112 unicorns.', sector: 'economy', source: 'DPIIT', year: 2024, highlight: '112 unicorns', emoji: '🦄' },
  { id: 35, fact: 'Per capita income in India tripled from ₹46,492 in 2010 to ₹1,72,000 in 2024.', sector: 'economy', source: 'MoSPI', year: 2024, highlight: '₹1.72L', emoji: '💵' },
  { id: 36, fact: 'India is now the world\'s 5th largest economy, overtaking the UK in 2022.', sector: 'economy', source: 'IMF', year: 2022, highlight: '#5 globally', emoji: '🌐' },

  // ── Labour ──
  { id: 37, fact: 'India\'s unemployment rate fell from 6.1% in 2018 to 3.2% in 2023 — a multi-year low.', sector: 'labour', source: 'PLFS', year: 2023, highlight: '3.2%', emoji: '👷' },
  { id: 38, fact: 'Female labour force participation rate rose from 23.3% in 2018 to 37% in 2023 — the biggest jump in decades.', sector: 'labour', source: 'PLFS', year: 2023, highlight: '37%', emoji: '👩‍💼' },
  { id: 39, fact: 'The IT services sector alone employs over 5.4 million people in India — making it the world\'s largest IT workforce.', sector: 'labour', source: 'NASSCOM', year: 2024, highlight: '5.4M', emoji: '💻' },
  { id: 40, fact: 'India\'s gig economy workforce is estimated at 7.7 million, expected to reach 23.5 million by 2030.', sector: 'labour', source: 'NITI Aayog', year: 2024, highlight: '23.5M by 2030', emoji: '🛵' },
  { id: 41, fact: 'MGNREGA provided over 289 crore person-days of employment in FY23 — the world\'s largest employment guarantee.', sector: 'labour', source: 'MoRD', year: 2023, highlight: '2.89B days', emoji: '🔨' },
  { id: 42, fact: 'Youth unemployment (15-29 years) dropped from 17.8% in 2018 to 10% in 2023.', sector: 'labour', source: 'PLFS', year: 2023, highlight: '10%', emoji: '🧑‍💼' },

  // ── Agriculture ──
  { id: 43, fact: 'India is the world\'s largest producer of milk, producing 231 million tonnes annually — more than the entire EU combined.', sector: 'agriculture', source: 'DAHD', year: 2023, highlight: '231 MT', emoji: '🥛' },
  { id: 44, fact: 'India\'s foodgrain production hit a record 330 million tonnes in 2023 — up from 252 MT in 2015.', sector: 'agriculture', source: 'MoA&FW', year: 2023, highlight: '330 MT', emoji: '🌾' },
  { id: 45, fact: 'India is the world\'s largest exporter of rice, accounting for 40% of global rice exports.', sector: 'agriculture', source: 'APEDA', year: 2023, highlight: '40% share', emoji: '🍚' },
  { id: 46, fact: 'PM-KISAN has directly transferred ₹2.81 lakh crore to 11 crore farmer families since 2019.', sector: 'agriculture', source: 'MoA&FW', year: 2024, highlight: '₹2.81L Cr', emoji: '👨‍🌾' },
  { id: 47, fact: 'India\'s horticulture production (fruits & vegetables) surpassed foodgrain production for the first time in 2019 at 320 MT.', sector: 'agriculture', source: 'NHB', year: 2019, highlight: '320 MT', emoji: '🍎' },
  { id: 48, fact: 'Micro-irrigation coverage expanded from 6.2 million hectares in 2015 to 14.8 million hectares in 2024.', sector: 'agriculture', source: 'MoA&FW', year: 2024, highlight: '14.8M ha', emoji: '💧' },
  { id: 49, fact: 'India produces 25% of the world\'s pulses but imports 15% of its needs — closing this gap is a national priority.', sector: 'agriculture', source: 'FAO', year: 2023, highlight: '25% of world', emoji: '🫘' },
  { id: 50, fact: 'The agriculture sector contributes 18% to GDP but employs 42% of the workforce — a structural challenge India is addressing.', sector: 'agriculture', source: 'MoSPI', year: 2024, highlight: '18% GDP', emoji: '📊' },
  { id: 51, fact: 'India\'s fisheries sector grew at 10.87% CAGR to produce 17.5 million tonnes in 2023 — making India the 3rd largest fish producer.', sector: 'agriculture', source: 'DoF', year: 2023, highlight: '17.5 MT', emoji: '🐟' },

  // ── Social ──
  { id: 52, fact: 'India lifted 13.5 crore (135 million) people out of multidimensional poverty between 2015 and 2021 — the fastest reduction ever.', sector: 'social', source: 'UNDP MPI', year: 2023, highlight: '135M lifted', emoji: '🏠' },
  { id: 53, fact: 'Kerala\'s poverty headcount ratio is just 0.55% — virtually eliminating extreme poverty.', sector: 'social', source: 'NITI Aayog MPI', year: 2022, highlight: '0.55%', emoji: '✨' },
  { id: 54, fact: 'Bihar\'s poverty rate dropped from 54.4% in 2004 to 26.6% in 2022 — halving in under 20 years.', sector: 'social', source: 'NITI Aayog MPI', year: 2022, highlight: '54→26%', emoji: '📉' },
  { id: 55, fact: 'India\'s Human Development Index improved from 0.493 in 2000 to 0.644 in 2024 — a 30% increase.', sector: 'social', source: 'UNDP HDR', year: 2024, highlight: '0.644', emoji: '📈' },
  { id: 56, fact: 'Jan Dhan Yojana opened 52 crore (520 million) bank accounts — the world\'s largest financial inclusion drive.', sector: 'social', source: 'MoF', year: 2024, highlight: '520M accounts', emoji: '🏦' },
  { id: 57, fact: 'Ujjwala Yojana provided free LPG connections to 10.3 crore women, replacing toxic biomass cooking.', sector: 'social', source: 'MoPNG', year: 2024, highlight: '103M women', emoji: '🔥' },
  { id: 58, fact: 'India\'s Gini coefficient (income inequality) improved from 0.38 in 2011 to 0.35 in 2022.', sector: 'social', source: 'World Bank', year: 2022, highlight: '0.35', emoji: '⚖️' },
  { id: 59, fact: 'The PM Garib Kalyan Anna Yojana provided free ration to 80 crore people during COVID — the world\'s largest food distribution program.', sector: 'social', source: 'MoCA', year: 2020, highlight: '800M fed', emoji: '🍞' },
  { id: 60, fact: 'Odisha\'s poverty rate dropped from 57.2% to 20.4% between 2004-2022 — one of the steepest declines globally.', sector: 'social', source: 'NITI Aayog MPI', year: 2022, highlight: '57→20%', emoji: '🌟' },

  // ── Safety & Justice ──
  { id: 61, fact: 'Kerala has the highest crime reporting rate (537/lakh) — not because it\'s unsafe, but because people trust the police to register cases.', sector: 'safety', source: 'NCRB 2022', year: 2022, highlight: '537/lakh', emoji: '📋' },
  { id: 62, fact: 'India\'s murder rate declined from 2.6 per lakh in 2014 to 2.1 in 2022 — a 19% improvement.', sector: 'safety', source: 'NCRB', year: 2022, highlight: '19% drop', emoji: '📉' },
  { id: 63, fact: 'Cyber crimes in India surged from 12,300 cases in 2016 to 65,900 in 2022 — a 5x increase in 6 years.', sector: 'safety', source: 'NCRB', year: 2022, highlight: '5× increase', emoji: '🖥️' },
  { id: 64, fact: 'Delhi has the highest rate of crimes against women at 144.7 per lakh female population — nearly double the national average.', sector: 'safety', source: 'NCRB 2022', year: 2022, highlight: '144.7/lakh', emoji: '⚠️' },
  { id: 65, fact: 'Nagaland has one of the lowest crime rates in India at 112 per lakh, owing to strong community-based justice systems.', sector: 'safety', source: 'NCRB 2022', year: 2022, highlight: '112/lakh', emoji: '🕊️' },
  { id: 66, fact: 'India\'s conviction rate in IPC crimes is only 50.4% — meaning nearly half of all trials don\'t result in conviction.', sector: 'safety', source: 'NCRB 2022', year: 2022, highlight: '50.4%', emoji: '⚖️' },
  { id: 67, fact: 'Karnataka alone accounted for 12,600 cybercrime cases in 2022 — 19% of the national total.', sector: 'safety', source: 'NCRB', year: 2022, highlight: '19%', emoji: '💻' },
  { id: 68, fact: 'India has 1 police officer for every 530 citizens — the UN recommends 1 per 450.', sector: 'safety', source: 'BPR&D', year: 2023, highlight: '1:530', emoji: '👮' },
  { id: 69, fact: 'Sikkim has one of the lowest murder rates in India at 0.9 per lakh — safer than many European countries.', sector: 'safety', source: 'NCRB 2022', year: 2022, highlight: '0.9/lakh', emoji: '🏔️' },
  { id: 70, fact: 'Assam\'s crimes against women rate of 128.7/lakh is the highest among all states.', sector: 'safety', source: 'NCRB 2022', year: 2022, highlight: '128.7/lakh', emoji: '🚨' },

  // ── Cross-sector highlights ──
  { id: 71, fact: 'India launched the world\'s cheapest Mars mission (Mangalyaan) at $74 million — less than the budget of the movie "Gravity".', sector: 'economy', source: 'ISRO', year: 2014, highlight: '$74M', emoji: '🚀' },
  { id: 72, fact: 'The Jal Jeevan Mission connected 14.3 crore rural households with piped tap water in just 5 years.', sector: 'health', source: 'MoDWS', year: 2024, highlight: '143M homes', emoji: '🚰' },
  { id: 73, fact: 'India\'s renewable energy capacity reached 190 GW in 2024 — the 4th largest globally, targeting 500 GW by 2030.', sector: 'economy', source: 'MNRE', year: 2024, highlight: '190 GW', emoji: '☀️' },
  { id: 74, fact: 'The national highway network expanded from 91,287 km in 2014 to 1,45,240 km in 2024 — a 59% increase.', sector: 'economy', source: 'MoRTH', year: 2024, highlight: '1.45L km', emoji: '🛣️' },
  { id: 75, fact: 'India\'s Chandrayaan-3 made India only the 4th country to soft-land on the Moon — and the 1st to land near the South Pole.', sector: 'economy', source: 'ISRO', year: 2023, highlight: '4th country', emoji: '🌙' },
  { id: 76, fact: 'Bihar and Jharkhand together have more people in poverty (55 million) than the entire population of South Korea.', sector: 'social', source: 'NITI Aayog MPI', year: 2022, highlight: '55M', emoji: '🗺️' },
  { id: 77, fact: 'India\'s direct benefit transfer (DBT) platform saved ₹2.73 lakh crore by eliminating middlemen and duplicate beneficiaries.', sector: 'social', source: 'DBT Mission', year: 2024, highlight: '₹2.73L Cr saved', emoji: '✅' },
  { id: 78, fact: 'India vaccinated over 220 crore (2.2 billion) COVID doses — the world\'s largest vaccination drive.', sector: 'health', source: 'CoWIN', year: 2023, highlight: '2.2B doses', emoji: '💉' },
  { id: 79, fact: 'India\'s rural road network under PMGSY covers 7.25 lakh km, connecting 1.78 lakh habitations.', sector: 'economy', source: 'PMGSY', year: 2024, highlight: '7.25L km', emoji: '🛤️' },
  { id: 80, fact: 'Women\'s participation in STEM higher education in India (43%) is higher than in the US (34%) and UK (38%).', sector: 'education', source: 'AISHE', year: 2022, highlight: '43%', emoji: '🔬' },
];
