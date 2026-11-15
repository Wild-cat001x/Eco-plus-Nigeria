const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara"
];

const DEVELOPER_INFO = {
  name: "Abdulsalam",
  school: "Government Secondary School",
  studentClass: "SS3",
  challenge: "2027 National Geographic Slingshot Challenge (Plant-for-the-Planet Foundation)",
  bio: "Abdulsalam is an SS3 student at Government Secondary School who created EcoPulse Nigeria in response to the 2027 National Geographic Slingshot Challenge (Plant-for-the-Planet Foundation). After seeing everyday environmental challenges across his community—such as plastic waste clogging drainages, litter buildup, and the need to protect and grow local trees—he built this platform to empower young people and residents across all 36 states and FCT Abuja to report waste hotspots, track recycling, and care for trees together while earning real rewards."
};

const SAMPLE_POSTS = [
  {
    id: 1,
    user: "Abdulsalam (SS3)",
    state: "FCT Abuja",
    type: "Report Blocked Drain",
    points: 10,
    location: "Wuse Zone 4 Drainage Channel, Abuja",
    notes: "Plastic bottles blocking storm water flow before rain.",
    mediaType: "image",
    mediaUrl: "https://unsplash.com",
    likes: 18,
    time: "2h ago"
  },
  {
    id: 2,
    user: "Amina Yusuf",
    state: "Kano",
    type: "Recycle Plastics",
    points: 20,
    location: "Sabon Gari Drop-Off Hub, Kano",
    notes: "Collected 45 PET bottles from school compound for recycling.",
    mediaType: "image",
    mediaUrl: "https://unsplash.com",
    likes: 24,
    time: "5h ago"
  },
  {
    id: 3,
    user: "Chinedu Okafor",
    state: "Lagos",
    type: "Restore & Tree Care",
    points: 15,
    location: "Yaba Secondary School Field, Lagos",
    notes: "Watered 6 newly planted neem saplings and added mulch.",
    mediaType: "image",
    mediaUrl: "https://unsplash.com",
    likes: 31,
    time: "1d ago"
  }
];

const SAMPLE_LEADERBOARD = [
  { name: "Chinedu Okafor", state: "Lagos", points: 145 },
  { name: "Amina Yusuf", state: "Kano", points: 120 },
  { name: "Abdulsalam", state: "FCT Abuja", points: 110 },
  { name: "Zainab Bello", state: "Kaduna", points: 85 },
  { name: "Emeka Nwosu", state: "Rivers", points: 70 }
];

const REWARDS_CATALOG = [
  { id: "r1", title: "Eco-Champion School Certificate", cost: 40, desc: "Official recognition at school assembly & digital badge." },
  { id: "r2", title: "Upcycled Exercise Book Pack (3x)", cost: 75, desc: "Notebooks made from clean single-sided recycled paper." },
  { id: "r3", title: "500MB Nigeria Mobile Data (MTN/Airtel/Glo/9mobile)", cost: 100, desc: "Funded by bulk PET plastic recycling revenue." },
  { id: "r4", title: "₦500 Airtime Voucher", cost: 120, desc: "Instant airtime PIN for any Nigerian network." }
];
