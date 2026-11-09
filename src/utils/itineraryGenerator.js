import { EXPLORE_DESTINATIONS } from '../data/destinations.js';

/**
 * Format numbers into Indian numbering format (e.g. 1,50,000)
 */
export function formatINR(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(num));
}

/**
 * Find destination by name or ID (case-insensitive)
 */
export function getDestinationDetails(destinationQuery) {
  if (!destinationQuery) return EXPLORE_DESTINATIONS[0];
  if (typeof destinationQuery === 'object' && destinationQuery.name) return destinationQuery;

  const query = String(destinationQuery).trim().toLowerCase();
  const found = EXPLORE_DESTINATIONS.find(
    (d) =>
      d.id.toLowerCase() === query ||
      d.name.toLowerCase() === query ||
      d.name.toLowerCase().includes(query) ||
      query.includes(d.name.toLowerCase())
  );
  return found || EXPLORE_DESTINATIONS[0];
}

/**
 * Calculate recommended budget in INR based on destination, travelers, duration & travel style
 */
export function getSuggestedBudget({ destination, travelers = 2, duration = 5, travelStyle = 'Balanced' }) {
  const dest = getDestinationDetails(destination);
  const baseDailyPerPerson = (dest.budgetINR || 22000) / 5;

  const styleMultipliers = {
    Relaxed: 1.18,
    Balanced: 1.0,
    Adventure: 0.92,
  };
  const styleMult = styleMultipliers[travelStyle] || 1.0;

  let groupEfficiency = 1.0;
  const numTravelers = Math.max(1, Number(travelers) || 1);
  if (numTravelers === 1) groupEfficiency = 1.32;
  else if (numTravelers === 2) groupEfficiency = 1.0;
  else if (numTravelers <= 4) groupEfficiency = 0.88;
  else groupEfficiency = 0.8;

  const numDays = Math.max(1, Math.min(30, Number(duration) || 5));
  const perPersonCost = Math.round(baseDailyPerPerson * numDays * styleMult * groupEfficiency);
  return perPersonCost * numTravelers;
}

/**
 * Calculate detailed realistic budget breakdown
 */
export function calculateBudgetBreakdown({
  destination,
  travelers = 2,
  duration = 5,
  budgetINR = 50000,
  travelStyle = 'Balanced',
}) {
  const dest = getDestinationDetails(destination);
  const numTravelers = Math.max(1, Number(travelers) || 1);
  const numDays = Math.max(1, Math.min(30, Number(duration) || 5));
  const userBudget = Math.max(0, Number(budgetINR) || 0);

  const baseDailyPerPerson = (dest.budgetINR || 22000) / 5;
  const styleMultipliers = {
    Relaxed: 1.18,
    Balanced: 1.0,
    Adventure: 0.92,
  };
  const styleMult = styleMultipliers[travelStyle] || 1.0;

  let groupEfficiency = 1.0;
  if (numTravelers === 1) groupEfficiency = 1.32;
  else if (numTravelers === 2) groupEfficiency = 1.0;
  else if (numTravelers <= 4) groupEfficiency = 0.88;
  else groupEfficiency = 0.8;

  const estimatedCostPerPerson = Math.round(baseDailyPerPerson * numDays * styleMult * groupEfficiency);
  const totalEstimatedCost = estimatedCostPerPerson * numTravelers;

  // Percentage breakdown:
  // Accommodation: 38%
  // Food & Dining: 22%
  // Local Transportation: 18%
  // Activities & Permits: 14%
  // Miscellaneous & Contingency: 8%
  const accommodation = Math.round(totalEstimatedCost * 0.38);
  const food = Math.round(totalEstimatedCost * 0.22);
  const transport = Math.round(totalEstimatedCost * 0.18);
  const activities = Math.round(totalEstimatedCost * 0.14);
  const misc = totalEstimatedCost - (accommodation + food + transport + activities);

  const difference = userBudget - totalEstimatedCost;
  const isWithinBudget = difference >= 0;

  const categories = [
    {
      key: 'accommodation',
      label: 'Accommodation & Stays',
      amount: accommodation,
      percentage: 38,
      note:
        numTravelers === 1
          ? 'Single occupancy boutique hotel / private cottage room'
          : `${Math.ceil(numTravelers / 2)} double room(s) in curated regional stays & heritage properties`,
    },
    {
      key: 'food',
      label: 'Food & Regional Dining',
      amount: food,
      percentage: 22,
      note: 'Fresh regional breakfasts, local thalis, authentic cafes, and evening refreshments',
    },
    {
      key: 'transport',
      label: 'Local Transportation',
      amount: transport,
      percentage: 18,
      note:
        numTravelers <= 4
          ? 'Dedicated private vehicle with local driver, fuel, state tolls & parking'
          : 'Dedicated private Tempo Traveller / MPV with driver for group sightseeing',
    },
    {
      key: 'activities',
      label: 'Activities, Permits & Guides',
      amount: activities,
      percentage: 14,
      note: 'Protected area permits, monument entrance tickets, boat rides & verified local guided tours',
    },
    {
      key: 'misc',
      label: 'Contingency & Miscellaneous',
      amount: misc,
      percentage: 8,
      note: 'Driver daily allowances, local porterage, tipping, and emergency reserve',
    },
  ];

  let statusMessage = '';
  if (userBudget === 0) {
    statusMessage = `Estimated total investment is ₹${formatINR(totalEstimatedCost)} (approx. ₹${formatINR(
      estimatedCostPerPerson
    )} per person) based on ${travelStyle.toLowerCase()} travel standards in ${dest.name}.`;
  } else if (isWithinBudget) {
    const bufferPerPerson = Math.round(difference / numTravelers);
    statusMessage = `Within Target Budget — You have an estimated buffer of ₹${formatINR(
      difference
    )} (approx. ₹${formatINR(bufferPerPerson)} per person) for personal shopping, premium upgrades, or bespoke experiences.`;
  } else {
    const shortfall = Math.abs(difference);
    statusMessage = `Budget Advisory — Your target budget is ₹${formatINR(
      shortfall
    )} below the estimated realistic baseline of ₹${formatINR(totalEstimatedCost)} for ${numTravelers} traveler${
      numTravelers > 1 ? 's' : ''
    } on a ${travelStyle.toLowerCase()} ${numDays}-day circuit in ${
      dest.name
    }. Consider selecting homestay accommodations or shortening the duration by 1–2 days.`;
  }

  return {
    totalEstimatedCost,
    estimatedCostPerPerson,
    userBudget,
    userBudgetPerPerson: Math.round(userBudget / numTravelers),
    difference,
    isWithinBudget,
    statusMessage,
    categories,
    disclaimer: `All figures are realistic local estimates in INR for ${dest.name}. Inter-state flights or long-distance trains to reach ${dest.name} are excluded.`,
  };
}

/**
 * Authentic Activity Pool by Destination
 */
const DESTINATION_ACTIVITIES = {
  ladakh: [
    {
      title: 'Acclimatization, Leh Old Town & Sunset Shanti Stupa',
      morning: {
        Relaxed: {
          time: '09:30 AM',
          title: 'Unhurried Breakfast & High-Altitude Acclimatization',
          desc: 'Enjoy butter tea and Ladakhi khambir bread overlooking the snowcapped Stok Kangri range. Take gentle hydration walks through Leh Main Bazaar.',
        },
        Balanced: {
          time: '08:30 AM',
          title: 'Leh Heritage Walk & Central Asian Museum',
          desc: 'Explore the mud-brick alleyways of Old Town Leh, visiting the 17th-century Leh Palace and the four-story Central Asian Museum.',
        },
        Adventure: {
          time: '07:00 AM',
          title: 'Early Ridge Hike to Tsemo Gompa & Leh Viewpoint',
          desc: 'Climb the steep rocky crag above Leh Palace to Namgyal Tsemo Fort for an expansive morning panorama across the Indus Valley.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '01:30 PM',
          title: 'Artisan Handicrafts & Rooftop Garden Lunch',
          desc: 'Dine on apricot salad, momos, and hot thukpa at a serene courtyard cafe. Browse traditional Pashmina weaving stalls and Ladakhi brass crafts.',
        },
        Balanced: {
          time: '01:00 PM',
          title: 'Sindhu Ghat & Shey Royal Palace Complex',
          desc: 'Drive along the sacred Indus River to Sindhu Ghat, then explore the ancient summer capital of Shey featuring a giant copper-gilt Buddha.',
        },
        Adventure: {
          time: '12:30 PM',
          title: 'Mountain Biking or Scramble around Spituk Ridge',
          desc: 'Ride through Spituk Monastery ridge overlooking the military airstrip and dramatic dry riverbanks of the upper Indus.',
        },
      },
      evening: {
        Relaxed: {
          time: '05:45 PM',
          title: 'Sunset Meditation at White Shanti Stupa',
          desc: 'Ascend to the illuminated Japanese Peace Pagoda as golden hour illuminates the barren peaks and Leh valley settles into silence.',
        },
        Balanced: {
          time: '05:30 PM',
          title: 'Shanti Stupa Panoramic Sunset & Prayer Flags',
          desc: 'Walk the ceremonial circumambulation path around Shanti Stupa, watching twilight envelop the Zanskar mountain range.',
        },
        Adventure: {
          time: '06:00 PM',
          title: 'Sunset Ridge Run & Twilight Stargazing Setup',
          desc: 'Position yourself on the northern hilltops as the first constellations emerge against zero-light-pollution Himalayan skies.',
        },
      },
      tip: 'Stay thoroughly hydrated with garlic soup and water on your first two days to assist acclimatization at 11,500 ft.',
    },
    {
      title: 'Indus Valley Monasteries & River Confluence',
      morning: {
        Relaxed: {
          time: '09:00 AM',
          title: 'Thiksey Monastery Morning Prayer Chants',
          desc: 'Witness the morning puja chant and blowing of copper conch horns at Thiksey, known as the mini-Potala of Ladakh.',
        },
        Balanced: {
          time: '08:00 AM',
          title: 'Thiksey Maitreya Buddha & Hemis Monastery',
          desc: 'Marvel at the 49-foot two-story Maitreya Buddha inside Thiksey, then drive to the secluded gorge housing ancient Hemis Gompa.',
        },
        Adventure: {
          time: '07:30 AM',
          title: 'Stok Valley Trail & Hemis Gorge Hike',
          desc: 'Trek through the narrow red-rock canyon leading to Hemis Monastery, home to centuries of sacred Buddhist relics and thangkas.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '01:30 PM',
          title: 'Riverside Garden Lunch at Nimmu',
          desc: 'Savor organic Ladakhi buckwheat noodles and fresh apple juice in an orchard garden nestled in Nimmu village.',
        },
        Balanced: {
          time: '01:00 PM',
          title: 'Sangam: Confluence of Indus and Zanskar Rivers',
          desc: 'Stand high above the vantage point where the emerald waters of the Indus merge dramatically with the muddy brown Zanskar river.',
        },
        Adventure: {
          time: '12:45 PM',
          title: 'Zanskar River Rapid Rafting or Magnetic Hill Drive',
          desc: 'Experience Class III rapids along the scenic Zanskar gorge, followed by testing the gravity-defying optical illusion at Magnetic Hill.',
        },
      },
      evening: {
        Relaxed: {
          time: '06:00 PM',
          title: 'Gurudwara Pathar Sahib & Sunset Drive',
          desc: 'Visit the historic Sikh shrine carved into boulder rock and enjoy evening tea served by community volunteers before returning to Leh.',
        },
        Balanced: {
          time: '05:45 PM',
          title: 'Hall of Fame & Evening Stroll through Changspa',
          desc: 'Pay respects at the Himalayan defense memorial, then stroll through the tree-lined cafe lanes of Changspa for woodfired pizza and momos.',
        },
        Adventure: {
          time: '06:30 PM',
          title: 'Off-Road Twilight Drive across Chilling Canyon',
          desc: 'Navigate the rugged canyon roads flanking frozen winter Chadar routes, capturing dramatic long-exposure twilight landscape photos.',
        },
      },
      tip: 'Monastery visits require covered shoulders and knees. Keep quiet during prayer ceremonies.',
    },
    {
      title: 'Crossing Khardung La into Nubra Sand Dunes',
      morning: {
        Relaxed: {
          time: '08:30 AM',
          title: 'Scenic Mountain Drive to Khardung La Pass (17,582 ft)',
          desc: 'Traverse world-famous zig-zag switchbacks to one of the highest motorable mountain passes on earth, framed by fluttering prayer flags.',
        },
        Balanced: {
          time: '07:30 AM',
          title: 'Khardung La Summit & Descent into Nubra Valley',
          desc: 'Stop at the snowy pass for photo opportunities and steaming tea, then wind down into the dramatic Y-shaped desert valley of Nubra.',
        },
        Adventure: {
          time: '06:30 AM',
          title: 'Dawn Expedition over Khardung La to North Pullu',
          desc: 'Early morning high-pass crossing followed by an optional downhill mountain bike descent along winding paved mountain curves.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '02:00 PM',
          title: 'Diskit Monastery & Giant Coloured Maitreya',
          desc: 'Gaze up at the 106-foot vibrant statue of Maitreya Buddha overlooking the sprawling Shyok river basin and dry mountain plains.',
        },
        Balanced: {
          time: '01:30 PM',
          title: 'Diskit Gompa & Hunder Oasis Check-in',
          desc: 'Tour the 14th-century Diskit monastery chapels and settle into heated luxury tents or eco-chalets surrounded by sea buckthorn bushes.',
        },
        Adventure: {
          time: '01:00 PM',
          title: 'Riverbed Navigation to Turtuk Border Village',
          desc: 'Journey further along the Shyok river towards the Balti border village of Turtuk, exploring walnut groves and stone water mills.',
        },
      },
      evening: {
        Relaxed: {
          time: '05:30 PM',
          title: 'Double-Humped Bactrian Camel Ride at Hunder Dunes',
          desc: 'Glide gently on ancient Silk Road Bactrian camels as twilight settles over the cold white desert sand dunes of Hunder.',
        },
        Balanced: {
          time: '05:15 PM',
          title: 'Sunset over Hunder White Sand Dunes',
          desc: 'Walk barefoot across cold Himalayan sand ripples with snowcapped mountain peaks towering in the background.',
        },
        Adventure: {
          time: '06:00 PM',
          title: 'Dune Scramble & Starlit Campfire Expedition',
          desc: 'Scale high sand ridges for sunset photography, then gather around an open desert bonfire beneath brilliant Milky Way skies.',
        },
      },
      tip: 'Nubra Valley is at a lower altitude (10,000 ft) than Leh, making sleeping conditions very comfortable.',
    },
    {
      title: 'Shyok River Route to Cobalt Pangong Tso',
      morning: {
        Relaxed: {
          time: '08:30 AM',
          title: 'Morning Drive along the Turquoise Shyok River',
          desc: 'Travel along the carved cliffside roads following the Shyok river gorge through dramatic arid mountain terrains.',
        },
        Balanced: {
          time: '07:45 AM',
          title: 'Overland Route via Agham & Durbuk Villages',
          desc: 'Drive past remote Ladakhi agricultural settlements, high pastures with grazing yaks, and dramatic mountain scree slopes.',
        },
        Adventure: {
          time: '06:45 AM',
          title: 'Rugged Off-Road River Crossings to Tangtse',
          desc: 'Navigate seasonal stream beds and boulder fields, stopping at remote highland nomadic settlements for salted butter tea.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '01:30 PM',
          title: 'First Breathtaking Glimpse of Pangong Tso',
          desc: 'Arrive at the 134-km-long endorheic lake at 14,270 ft as the vibrant water shifts from aquamarine to deep royal cobalt.',
        },
        Balanced: {
          time: '01:00 PM',
          title: 'Lakeside Check-in & Tibetan Dumpling Lunch',
          desc: 'Check into eco-dome cabins along the shore at Spangmik, tasting piping hot momos and noodle broth by the tranquil water.',
        },
        Adventure: {
          time: '12:30 PM',
          title: 'Coastal Trail Hike to Merak & Man Villages',
          desc: 'Trek along the untouched gravel shoreline towards remote border hamlets with crystal-clear reflections of the Changchenmo range.',
        },
      },
      evening: {
        Relaxed: {
          time: '05:45 PM',
          title: 'Colour-Changing Sunset Shoreline Walk',
          desc: 'Watch the lake waters transform through seven shades of blue, turquoise, and violet as twilight settles over the mountains.',
        },
        Balanced: {
          time: '05:30 PM',
          title: 'Lakeside Sunset Photography & Hot Tea',
          desc: 'Set up tripods along the pristine gravel beaches, capturing dramatic reflections of red rock cliffs in the mirror-flat lake.',
        },
        Adventure: {
          time: '06:30 PM',
          title: 'Dark Sky Celestial Photography Expedition',
          desc: 'Bundle up in thermal parkas to witness the unhindered core of the Milky Way arching across Pangong’s pitch-black horizon.',
        },
      },
      tip: 'Night temperatures at Pangong drop significantly even in peak summer. Heavy woolens are essential.',
    },
    {
      title: 'Chang La Pass Return & Farewell Leh Evening',
      morning: {
        Relaxed: {
          time: '08:45 AM',
          title: 'Golden Sunrise Reflections on Pangong Tso',
          desc: 'Sip morning tea as the sun crests the eastern peaks, illuminating migratory bar-headed geese gliding on the lake.',
        },
        Balanced: {
          time: '07:30 AM',
          title: 'Sunrise at Pangong & Departure over Chang La',
          desc: 'Ascend Chang La pass (17,688 ft), the third-highest motorable mountain pass, stopping at the Changla Baba temple.',
        },
        Adventure: {
          time: '06:30 AM',
          title: 'Dawn Ascent of Chang La Pass & Glacial Trail',
          desc: 'Early morning crossing before ice melts, capturing frozen mountain streams and marmots emerging from highland burrows.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '02:00 PM',
          title: 'Peaceful Return to Leh & Organic Cafe Lunch',
          desc: 'Settle back into your Leh boutique hotel. Unwind at an organic garden cafe with fresh apricot cake and herbal tea.',
        },
        Balanced: {
          time: '01:30 PM',
          title: 'Stok Palace Museum & Royal Collection',
          desc: 'Visit Stok Palace, current home of the Ladakhi royal family, showcasing royal crowns, centuries-old thangkas, and jewelry.',
        },
        Adventure: {
          time: '01:00 PM',
          title: 'Trail Run or Bouldering in Choglamsar Valley',
          desc: 'Explore the granite boulder fields along the Indus riverbanks, testing high-altitude endurance and footwork.',
        },
      },
      evening: {
        Relaxed: {
          time: '06:00 PM',
          title: 'Tibetan Handicrafts & Farewell Dinner',
          desc: 'Shop for prayer wheels, turquoise jewelry, and dried apricots in the Tibetan Market, followed by a candlelit dinner.',
        },
        Balanced: {
          time: '05:30 PM',
          title: 'Souvenir Hunting & Traditional Ladakhi Feast',
          desc: 'Pick up hand-spun Pashmina shawls with certification, then enjoy a traditional multicourse dinner with local guides.',
        },
        Adventure: {
          time: '06:30 PM',
          title: 'Rooftop Retrospective & Twilight Toast',
          desc: 'Gather with fellow travelers on a panoramic rooftop to review trip photos and celebrate conquering the Himalayan passes.',
        },
      },
      tip: 'Keep original purchase certificates for any high-value certified Pashmina or antique brass pieces.',
    },
  ],

  manali: [
    {
      title: 'Arrival in Manali, Cedar Forests & Old Manali Cafes',
      morning: {
        Relaxed: {
          time: '09:30 AM',
          title: 'Leisurely Breakfast amid Apple Orchards',
          desc: 'Sip fresh Himachal apple juice and breakfast on the balcony overlooking snow-crested mountain peaks.',
        },
        Balanced: {
          time: '08:30 AM',
          title: 'Hadimba Temple & Dhungri Pine Forest Walk',
          desc: 'Walk through towering 400-year-old deodar trees to the 16th-century four-tiered pagoda-style Hadimba Temple.',
        },
        Adventure: {
          time: '07:00 AM',
          title: 'Pine Forest Trail Run to Vashisht Hot Springs',
          desc: 'Hike across the Beas river footbridge and up the cliff trail to the sulfur mineral springs of ancient Vashisht village.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '01:30 PM',
          title: 'Old Manali Bohemian Cafes & Artisan Bakeries',
          desc: 'Explore the cobblestone streets of Old Manali, enjoying trout delicacies, sourdough breads, and Himalayan herbal teas.',
        },
        Balanced: {
          time: '01:00 PM',
          title: 'Jogini Waterfalls Hike from Vashisht',
          desc: 'Take an easy 4-km trek through apple orchards and pine groves to the cascading multi-tiered Jogini Falls.',
        },
        Adventure: {
          time: '12:30 PM',
          title: 'Climbing & Bouldering near Manu Temple Crag',
          desc: 'Test your grip on granite boulders flanking the upper village trail with sweeping views of the Manalsu torrent.',
        },
      },
      evening: {
        Relaxed: {
          time: '05:45 PM',
          title: 'Beas Riverbank Walk & Sunset Stroll',
          desc: 'Listen to the rushing alpine waters of the Beas River, stopping for hot masala chai at a riverside wooden bench.',
        },
        Balanced: {
          time: '05:30 PM',
          title: 'Mall Road Exploration & Tibetan Monastery',
          desc: 'Browse hand-woven Kullu shawls and wooden handicrafts, followed by a serene walk around the Gadhan Thekkchokling Gompa.',
        },
        Adventure: {
          time: '06:00 PM',
          title: 'Sunset Ridge Trek overlooking the Solang Valley Rim',
          desc: 'Hike up to a high vantage point to watch pink alpine glow blanket the Hanuman Tibba and Friendship peaks.',
        },
      },
      tip: 'Old Manali has vibrant music and cafe culture. Walking shoes with good traction are best for cobblestones.',
    },
    {
      title: 'High Passes of Rohtang or Atal Tunnel to Sissu',
      morning: {
        Relaxed: {
          time: '09:00 AM',
          title: 'Scenic Drive through the Engineering Marvel: Atal Tunnel',
          desc: 'Travel through the 9.02-km Atal Tunnel beneath the Rohtang Pass, transitioning instantly into the barren Lahaul Valley.',
        },
        Balanced: {
          time: '08:00 AM',
          title: 'Atal Tunnel Crossing to Sissu Waterfall & Lake',
          desc: 'Marvel at the dramatic trans-Himalayan scenery on the other side of the tunnel, stopping by the thundering Sissu cascade.',
        },
        Adventure: {
          time: '06:30 AM',
          title: 'Dawn Ascent to Rohtang Pass (13,058 ft)',
          desc: 'Drive up the winding Pir Panjal switchbacks to Rohtang Pass, stepping out onto glaciers and snow fields with 360-degree views.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '01:30 PM',
          title: 'Lahauli Organic Lunch by Sissu Willow Groves',
          desc: 'Enjoy piping hot siddu (Himachal steamed wheat bread stuffed with poppy seeds) and mountain dal by the river.',
        },
        Balanced: {
          time: '01:00 PM',
          title: 'Gondhla Fort & Keylong Valley Exploration',
          desc: 'Explore the 300-year-old seven-story timber-and-stone Gondhla Fort overlooking the Chandra River valley.',
        },
        Adventure: {
          time: '12:30 PM',
          title: 'Sissu Zipline & Glacier Stream Bouldering',
          desc: 'Zipline over the rushing glacial river facing Sissu waterfall, followed by a rugged scramble up the lower moraine.',
        },
      },
      evening: {
        Relaxed: {
          time: '05:45 PM',
          title: 'Scenic Return & Evening Fireplace Relaxation',
          desc: 'Return to your Manali mountain lodge to unwind by a crackling stone fireplace with warm apple cider.',
        },
        Balanced: {
          time: '05:30 PM',
          title: 'Solang Valley Twilight & Paragliding Viewpoint',
          desc: 'Watch paragliders land against the twilight sky before returning to Manali for an authentic Himachali Dham dinner.',
        },
        Adventure: {
          time: '06:15 PM',
          title: 'Night Trail Walk in Dhungri Deodars',
          desc: 'Equip headlamps for a night forest walk through the fragrant deodar canopy under crisp starry mountain skies.',
        },
      },
      tip: 'Rohtang Pass permits must be booked in advance and vehicles must adhere to green zone regulations.',
    },
    {
      title: 'Naggar Heritage Castle & Art Route',
      morning: {
        Relaxed: {
          time: '09:30 AM',
          title: 'Scenic Countryside Drive to Historic Naggar',
          desc: 'Drive along the quiet left bank of the Beas River through terraced orchards and traditional wooden kath-kuni hamlets.',
        },
        Balanced: {
          time: '08:30 AM',
          title: 'Naggar Castle & Himalayan Wood Architecture',
          desc: 'Tour the 15th-century castle built of alternating stone and timber, offering panoramic views over the Kullu Valley.',
        },
        Adventure: {
          time: '07:30 AM',
          title: 'Trek from Rumsu Village to Pulag Deodar Ridges',
          desc: 'Hike through untouched village trails where locals weave traditional pattu wool and herd mountain sheep.',
        },
      },
      afternoon: {
        Relaxed: {
          time: '01:30 PM',
          title: 'Nicholas Roerich Art Gallery & Estate Gardens',
          desc: 'Stroll through the Russian painter’s peaceful Himalayan estate, admiring vibrant canvases capturing the sacred peaks of Asia.',
        },
        Balanced: {
          time: '01:00 PM',
          title: 'Tripura Sundari Temple & Local Trout Lunch',
          desc: 'Visit the pagoda temple carved with guardian spirits, followed by fresh river trout prepared with mountain herbs.',
        },
        Adventure: {
          time: '12:30 PM',
          title: 'Jana Waterfall Trail & Village Gastronomy',
          desc: 'Hike up to Jana Falls and savor an authentic village platter of red rice, lingad (fern), and walnut chutney.',
        },
      },
      evening: {
        Relaxed: {
          time: '05:30 PM',
          title: 'German Bakery Coffee & Castle Balcony Sunset',
          desc: 'Sip espresso and apple strudel while watching twilight paint the high peaks across the valley in amber hues.',
        },
        Balanced: {
          time: '05:00 PM',
          title: 'Handloom Shawl Weavers of Kullu Valley',
          desc: 'Visit an authentic artisan cooperative where local weavers craft certified pure Pashmina and Angora woolens.',
        },
        Adventure: {
          time: '06:00 PM',
          title: 'Downhill Mountain Bike Descent back to Manali',
          desc: 'Cycle the winding country roads from Naggar back to Manali along the quiet rural bank of the Beas River.',
        },
      },
      tip: 'Naggar is significantly quieter and more heritage-rich than central Manali, making it ideal for photography.',
    },
  ],

  // Generic generator for other destinations
};

/**
 * Build rich day-by-day itineraries tailored to destination, style, duration & variation
 */
export function generateItinerary({
  destination,
  travelers = 2,
  duration = 5,
  budgetINR = 50000,
  travelStyle = 'Balanced',
  seed = 0,
}) {
  const dest = getDestinationDetails(destination);
  const numTravelers = Math.max(1, Number(travelers) || 1);
  const numDays = Math.max(1, Math.min(30, Number(duration) || 5));
  const style = travelStyle || 'Balanced';

  // Budget calculations
  const budget = calculateBudgetBreakdown({
    destination: dest,
    travelers: numTravelers,
    duration: numDays,
    budgetINR,
    travelStyle: style,
  });

  // Pull authentic curated activities if available, or generate from destination metadata
  const curatedDays = DESTINATION_ACTIVITIES[dest.id] || [];
  const days = [];

  const highlights = dest.highlights && dest.highlights.length > 0 ? dest.highlights : ['Iconic Landmark', 'Cultural Center', 'Nature Trail', 'Heritage Bazaar'];

  for (let i = 1; i <= numDays; i++) {
    // If we have specific curated templates for this day index
    const templateIndex = (i - 1 + seed) % (curatedDays.length || 1);
    const curatedDay = curatedDays.length > 0 ? curatedDays[templateIndex] : null;

    if (curatedDay && i <= curatedDays.length) {
      days.push({
        dayNumber: i,
        title: curatedDay.title,
        morning: curatedDay.morning[style] || curatedDay.morning.Balanced,
        afternoon: curatedDay.afternoon[style] || curatedDay.afternoon.Balanced,
        evening: curatedDay.evening[style] || curatedDay.evening.Balanced,
        tip: curatedDay.tip,
        pacingBadge:
          style === 'Relaxed'
            ? 'Gentle Leisure Pace'
            : style === 'Adventure'
            ? 'Active Trail Expedition'
            : 'Balanced Exploration',
      });
    } else {
      // Intelligently construct destination-specific authentic day from metadata
      const highlightA = highlights[(i - 1) % highlights.length];
      const highlightB = highlights[i % highlights.length];
      const highlightC = highlights[(i + 1) % highlights.length];

      let dayTitle = `Exploring ${highlightA} & Surroundings`;
      if (i === 1) {
        dayTitle = `Arrival, Orientation & ${highlightA}`;
      } else if (i === numDays) {
        dayTitle = `Farewell ${dest.name}, Artisan Markets & Departure`;
      } else if (i % 2 === 0) {
        dayTitle = `Signature Expedition: ${highlightA} & ${highlightB}`;
      } else {
        dayTitle = `Heritage & Wilderness Circuit: ${highlightB}`;
      }

      // Morning Activity
      let morning = {
        time: style === 'Adventure' ? '06:45 AM' : style === 'Relaxed' ? '09:30 AM' : '08:30 AM',
        title:
          i === 1
            ? `Arrival, Welcome Refreshments & Check-in`
            : style === 'Adventure'
            ? `Dawn Trek & Sunrise Viewpoint at ${highlightA}`
            : style === 'Relaxed'
            ? `Unhurried Breakfast & Scenic Exploration of ${highlightA}`
            : `Morning Guided Walk around ${highlightA}`,
        desc:
          i === 1
            ? `Arrive in ${dest.name}, receive a warm regional welcome at your boutique accommodation, and spend unhurried time settling in.`
            : `Experience ${highlightA} during the tranquil early hours when morning light illuminates the landscape and crowds are minimal.`,
      };

      // Afternoon Activity
      let afternoon = {
        time: '01:00 PM',
        title:
          style === 'Adventure'
            ? `Outdoor Excursion & Trail Discovery at ${highlightB}`
            : style === 'Relaxed'
            ? `Artisanal Lunch & Cultural Leisure at ${highlightB}`
            : `Deep Cultural Immersion & Highlights of ${highlightB}`,
        desc: `Savor authentic regional dishes prepared with local ingredients, followed by a dedicated tour of ${highlightB} in the heart of ${dest.state}.`,
      };

      // Evening Activity
      let evening = {
        time: style === 'Relaxed' ? '05:45 PM' : '06:00 PM',
        title:
          i === numDays
            ? `Celebratory Farewell Dinner & Local Craft Souvenirs`
            : style === 'Adventure'
            ? `Sunset Ridge Scramble & Stargazing near ${highlightC}`
            : style === 'Relaxed'
            ? `Sunset Panorama & Candlelit Dinner at ${highlightC}`
            : `Evening Atmospheric Walk & Local Street Gastronomy`,
        desc:
          i === numDays
            ? `Pick up certified local handicrafts, handloom weaves, and regional spices before your departure transfer.`
            : `Witness golden hour transitions over the ${dest.state} skyline, accompanied by freshly brewed regional tea and traditional savories.`,
      };

      days.push({
        dayNumber: i,
        title: dayTitle,
        morning,
        afternoon,
        evening,
        tip: `Local advice for ${dest.name}: Keep small cash denominations handy for local artisan stalls and regional entry fees.`,
        pacingBadge:
          style === 'Relaxed'
            ? 'Gentle Leisure Pace'
            : style === 'Adventure'
            ? 'Active Trail Expedition'
            : 'Balanced Exploration',
      });
    }
  }

  return {
    destination: dest,
    travelers: numTravelers,
    duration: numDays,
    travelStyle: style,
    budget,
    days,
    summary: {
      highlightsCovered: highlights.slice(0, Math.min(highlights.length, numDays + 1)),
      idealPacing: `${numDays} Days / ${numDays - 1} Nights`,
      styleDescription:
        style === 'Relaxed'
          ? 'Curated for peaceful retreats, unhurried heritage, and restorative wellness.'
          : style === 'Adventure'
          ? 'Designed for outdoor enthusiasts, dawn expeditions, and rugged discovery.'
          : 'Carefully harmonized with iconic sights, local flavors, and personal discovery.',
    },
  };
}
