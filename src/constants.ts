import { Module, Division, Hospital } from './types';

export const RESPONSIBLE_PARTY_OPTIONS = [
  "HCA Unit Manager",
  "HCA Division Leader",
  "ITRAK Team"
] as const;

export const ROLLOUT_STEPS = [
  "Initial meeting with division and unit leader",
  "IT approval",
  "Unit leader communicates with their hospital leadership",
  "Unit director sends the excel document with room locations and set up information",
  "ITRAK account is set up",
  "QR codes are ordered",
  "QR codes are received",
  "QR codes are installed",
  "Formal training for all managers in the unit level on system usage",
  "Dashboard for division and unit reviewed",
  "Go Live set up",
  "Revisit of the unit to ensure system is being used"
];

export const MODULES: Module[] = [
  {
    id: "qr-care-exp",
    name: "QR Code Care Experience",
    description: "Direct communication channel between patients/staff and housekeeping via strategically placed QR codes.",
    benefits: [
      "Direct communication to housekeeping department",
      "Timely request management and delegation",
      "Improved patient room experience via tent cards",
      "Enhanced public area maintenance (ED, bathrooms, etc.)",
      "Real-time analytics for unit leaders"
    ],
    steps: ROLLOUT_STEPS
  },
  {
    id: "asset-tracking",
    name: "Asset ITRAK",
    description: "Real-time location and status tracking for critical hospital equipment.",
    benefits: [
      "Reduce equipment search time",
      "Optimize asset utilization",
      "Automated inventory management"
    ],
    steps: ["Initial Discovery", "Hardware Install", "Software Config", "Go Live"]
  }
];

export const DIVISIONS: Division[] = [
  { id: "div-capital", name: "Capital Division" },
  { id: "div-cwt", name: "Central & West Texas Division" },
  { id: "div-cont", name: "Continental Division" },
  { id: "div-east-fl", name: "East Florida Division" },
  { id: "div-far-west", name: "Far West Division" },
  { id: "div-gulf-coast", name: "Gulf Coast Division" },
  { id: "div-mid-america", name: "MidAmerica Division" },
  { id: "div-mountain", name: "Mountain Division" },
  { id: "div-north-carolina", name: "North Carolina Division" },
  { id: "div-north-fl", name: "North Florida Division" },
  { id: "div-north-tx", name: "North Texas Division" },
  { id: "div-san-antonio", name: "San Antonio Division" },
  { id: "div-south-atl", name: "South Atlantic Division" },
  { id: "div-tristar", name: "TriStar Division" },
  { id: "div-west-fl", name: "West Florida Division" }
];

export const HOSPITALS: Hospital[] = [
  // Capital
  { id: "hosp-cmc", name: "CATHOLIC MEDICAL CENTER", divisionId: "div-capital" },
  { id: "hosp-cjw-chip", name: "CJW - CHIPPENHAM MEDICAL CENTER", divisionId: "div-capital" },
  { id: "hosp-cjw-jw", name: "CJW - JOHNSTON WILLIS HOSPITAL", divisionId: "div-capital" },
  { id: "hosp-dom", name: "DOMINION HOSPITAL", divisionId: "div-capital" },
  { id: "hosp-fris", name: "FRISBIE MEMORIAL HOSPITAL", divisionId: "div-capital" },
  { id: "hosp-hen-for", name: "HENRICO DOCTORS HOSPITAL - FOREST", divisionId: "div-capital" },
  { id: "hosp-hen-par", name: "HENRICO DOCTORS HOSPITAL - PARHAM", divisionId: "div-capital" },
  { id: "hosp-hen-ret", name: "HENRICO DOCTORS HOSPITAL - RETREAT", divisionId: "div-capital" },
  { id: "hosp-lg-all", name: "LEWIS-GALE HOSPITAL - ALLEGHANY", divisionId: "div-capital" },
  { id: "hosp-lg-mon", name: "LEWIS-GALE HOSPITAL - MONTGOMERY", divisionId: "div-capital" },
  { id: "hosp-lg-pul", name: "LEWIS-GALE HOSPITAL - PULASKI", divisionId: "div-capital" },
  { id: "hosp-lg-med", name: "LEWIS-GALE MEDICAL CENTER", divisionId: "div-capital" },
  { id: "hosp-park", name: "PARKLAND MEDICAL CENTER", divisionId: "div-capital" },
  { id: "hosp-port", name: "PORTSMOUTH REGIONAL HOSPITAL", divisionId: "div-capital" },
  { id: "hosp-rest", name: "RESTON HOSPITAL CENTER", divisionId: "div-capital" },
  { id: "hosp-spot", name: "SPOTSYLVANIA REGIONAL HOSPITAL", divisionId: "div-capital" },
  { id: "hosp-stone", name: "STONE SPRINGS HOSPITAL", divisionId: "div-capital" },
  { id: "hosp-terre", name: "TERRE HAUTE REGIONAL HOSPITAL", divisionId: "div-capital" },
  { id: "hosp-tri", name: "TRICITIES HOSPITAL", divisionId: "div-capital" },

  // Central & West Texas
  { id: "hosp-del-sol", name: "DEL SOL MEDICAL CENTER", divisionId: "div-cwt" },
  { id: "hosp-heart-aus", name: "HEART HOSP OF AUSTIN", divisionId: "div-cwt" },
  { id: "hosp-las-pal", name: "LAS PALMAS MEDICAL CTR", divisionId: "div-cwt" },
  { id: "hosp-st-dav-geo", name: "ST. DAVID'S GEORGETOWN HOSPITAL", divisionId: "div-cwt" },
  { id: "hosp-st-dav-med", name: "ST. DAVID'S MEDICAL CENTER", divisionId: "div-cwt" },
  { id: "hosp-st-dav-north", name: "ST. DAVID'S NORTH AUSTIN MED CTR", divisionId: "div-cwt" },
  { id: "hosp-st-dav-round", name: "ST. DAVID'S ROUND ROCK MC", divisionId: "div-cwt" },
  { id: "hosp-st-dav-south", name: "ST. DAVID'S SOUTH AUSTIN MED CTR", divisionId: "div-cwt" },
  { id: "hosp-st-dav-surg", name: "ST. DAVID'S SURGICAL HOSPITAL", divisionId: "div-cwt" },

  // Continental
  { id: "hosp-med-aur", name: "MEDICAL CENTER OF AURORA", divisionId: "div-cont" },
  { id: "hosp-mtn-ridge", name: "MOUNTAIN RIDGE (NORTH SUBURBAN)", divisionId: "div-cont" },
  { id: "hosp-pres-sl", name: "PRESBYTERIAN/ST LUKE'S MEDICAL CENTER", divisionId: "div-cont" },
  { id: "hosp-rose", name: "ROSE MEDICAL CENTER", divisionId: "div-cont" },
  { id: "hosp-sky-ridge", name: "SKY RIDGE MEDICAL CENTER", divisionId: "div-cont" },
  { id: "hosp-spald", name: "SPALDING REHABILITATION HOSPITAL", divisionId: "div-cont" },
  { id: "hosp-swed", name: "SWEDISH MEDICAL CENTER", divisionId: "div-cont" },
  { id: "hosp-wes-med", name: "WESLEY MEDICAL CENTER", divisionId: "div-cont" },
  { id: "hosp-wes-wood", name: "WESLEY WOODLAWN HOSPITAL AND ER", divisionId: "div-cont" },

  // East Florida
  { id: "hosp-ave", name: "HCA FLORIDA AVENTURA HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-high", name: "HCA FLORIDA HIGHLANDS HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-jfk", name: "HCA FLORIDA JFK HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-jfk-north", name: "HCA FLORIDA JFK NORTH HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-ken", name: "HCA FLORIDA KENDALL HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-lawn", name: "HCA FLORIDA LAWNWOOD HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-mercy", name: "HCA FLORIDA MERCY HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-northw", name: "HCA FLORIDA NORTHWEST HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-palms", name: "HCA FLORIDA PALMS WEST HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-raul", name: "HCA FLORIDA RAULERSON HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-st-lucie", name: "HCA FLORIDA ST. LUCIE HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-univ", name: "HCA FLORIDA UNIVERSITY HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-wests", name: "HCA FLORIDA WESTSIDE HOSPITAL", divisionId: "div-east-fl" },
  { id: "hosp-wood", name: "HCA FLORIDA WOODMONT HOSPITAL", divisionId: "div-east-fl" },

  // Far West
  { id: "hosp-good-sam", name: "GOOD SAMARITAN HOSP", divisionId: "div-far-west" },
  { id: "hosp-los-rob", name: "LOS ROBLES HOSP AND MC", divisionId: "div-far-west" },
  { id: "hosp-mtn-view", name: "MOUNTAINVIEW HOSPITAL", divisionId: "div-far-west" },
  { id: "hosp-riv-comm", name: "RIVERSIDE COMMUNITY", divisionId: "div-far-west" },
  { id: "hosp-south-hills", name: "SOUTHERN HILLS HOSP", divisionId: "div-far-west" },
  { id: "hosp-sunrise", name: "SUNRISE HOSPITAL AND MEDICAL CENTER", divisionId: "div-far-west" },

  // Gulf Coast
  { id: "hosp-cc-med", name: "CORPUS CHRISTI MEDICAL CENTER", divisionId: "div-gulf-coast" },
  { id: "hosp-doc-reg", name: "DOCTORS REGIONAL MEDICAL CENTER", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-clear", name: "HCA HOUSTON HEALTHCARE CLEARLAKE", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-conroe", name: "HCA HOUSTON HEALTHCARE CONROE", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-king", name: "HCA HOUSTON HEALTHCARE KINGWOOD", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-main", name: "HCA HOUSTON HEALTHCARE MAINLAND", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-med", name: "HCA HOUSTON HEALTHCARE MEDICAL CENTER", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-northw", name: "HCA HOUSTON HEALTHCARE NORTHWEST", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-pear", name: "HCA HOUSTON HEALTHCARE PEARLAND", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-south", name: "HCA HOUSTON HEALTHCARE SOUTHEAST", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-tom", name: "HCA HOUSTON HEALTHCARE TOMBALL", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-west", name: "HCA HOUSTON HEALTHCARE WEST", divisionId: "div-gulf-coast" },
  { id: "hosp-hou-n-cy", name: "HCA HOUSTON N CYPRESS", divisionId: "div-gulf-coast" },
  { id: "hosp-rio-gran", name: "RIO GRANDE MEDICAL CENTER", divisionId: "div-gulf-coast" },
  { id: "hosp-tex-orth", name: "TEXAS ORTHOPEDIC HOSPITAL", divisionId: "div-gulf-coast" },
  { id: "hosp-val-reg", name: "VALLEY REGIONAL MEDICAL CENTER", divisionId: "div-gulf-coast" },
  { id: "hosp-woman-tex", name: "WOMAN'S HOSPITAL OF TEXAS", divisionId: "div-gulf-coast" },

  // MidAmerica
  { id: "hosp-bel-reg", name: "BELTON REGIONAL MC", divisionId: "div-mid-america" },
  { id: "hosp-cen-med", name: "CENTERPOINT MED CENTER", divisionId: "div-mid-america" },
  { id: "hosp-laf-reg", name: "LAFAYETTE REGIONAL HEALTH CENTER", divisionId: "div-mid-america" },
  { id: "hosp-lee-sum", name: "LEE'S SUMMIT MED CTR", divisionId: "div-mid-america" },
  { id: "hosp-men-med", name: "MENORAH MEDICAL CENTER", divisionId: "div-mid-america" },
  { id: "hosp-op-reg", name: "OVERLAND PARK REGIONAL", divisionId: "div-mid-america" },
  { id: "hosp-res-med", name: "RESEARCH MEDICAL CTR", divisionId: "div-mid-america" },

  // Mountain
  { id: "hosp-ala-reg", name: "ALASKA REGIONAL HOSP", divisionId: "div-mountain" },
  { id: "hosp-bri-city", name: "BRIGHAM CITY COMMUNITY", divisionId: "div-mountain" },
  { id: "hosp-cache-val", name: "CACHE VALLEY HOSPITAL", divisionId: "div-mountain" },
  { id: "hosp-east-id", name: "EASTERN IDAHO REG MC", divisionId: "div-mountain" },
  { id: "hosp-lakev", name: "LAKEVIEW HOSPITAL", divisionId: "div-mountain" },
  { id: "hosp-lone-peak", name: "LONE PEAK HOSPITAL", divisionId: "div-mountain" },
  { id: "hosp-mtn-view-ut", name: "MOUNTAIN VIEW HOSPITAL (UT)", divisionId: "div-mountain" },
  { id: "hosp-ogden", name: "OGDEN REGIONAL MED CTR", divisionId: "div-mountain" },
  { id: "hosp-st-mark", name: "ST MARK'S HOSPITAL", divisionId: "div-mountain" },
  { id: "hosp-timp", name: "TIMPANOGOS REGIONAL HOSP", divisionId: "div-mountain" },
  { id: "hosp-west-val", name: "WEST VALLEY MC", divisionId: "div-mountain" },

  // North Carolina
  { id: "hosp-angel", name: "ANGEL MEDICAL CENTER", divisionId: "div-north-carolina" },
  { id: "hosp-blue-ridge", name: "BLUE RIDGE REGIONAL HOSPITAL", divisionId: "div-north-carolina" },
  { id: "hosp-care-part", name: "CARE PARTNERS REHAB HOSPITAL", divisionId: "div-north-carolina" },
  { id: "hosp-high-cash", name: "HIGHLAND CASHIERS HOSPITAL", divisionId: "div-north-carolina" },
  { id: "hosp-miss-mcd", name: "MISSION HOSPITAL MCDOWELL", divisionId: "div-north-carolina" },
  { id: "hosp-miss-mem", name: "MISSION MEMORIAL HOSPITAL", divisionId: "div-north-carolina" },
  { id: "hosp-trans", name: "TRANSYLVANIA REGIONAL HOSPITAL", divisionId: "div-north-carolina" },

  // North Florida
  { id: "hosp-cap-fl", name: "HCA FLORIDA CAPITAL HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-fwd", name: "HCA FLORIDA FORT WALTON-DESTIN HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-gc", name: "HCA FLORIDA GULF COAST HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-lc", name: "HCA FLORIDA LAKE CITY HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-lm", name: "HCA FLORIDA LAKE MONROE HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-nf", name: "HCA FLORIDA NORTH FLORIDA HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-oc", name: "HCA FLORIDA OCALA HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-os", name: "HCA FLORIDA OSCEOLA HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-po", name: "HCA FLORIDA POINCIANA HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-pu", name: "HCA FLORIDA PUTNAM HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-tc", name: "HCA FLORIDA TWIN CITIES HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-we", name: "HCA FLORIDA WEST HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-wm", name: "HCA FLORIDA WEST MARION HOSPITAL", divisionId: "div-north-fl" },
  { id: "hosp-ov", name: "OVIEDO MEDICAL CENTER", divisionId: "div-north-fl" },
  { id: "hosp-ln", name: "UCF LAKE NONA HOSPITAL", divisionId: "div-north-fl" },

  // North Texas
  { id: "hosp-mc-all", name: "MEDICAL CITY ALLIANCE", divisionId: "div-north-tx" },
  { id: "hosp-mc-all-mh", name: "MEDICAL CITY ALLIANCE MENTAL HEALTH", divisionId: "div-north-tx" },
  { id: "hosp-mc-arg", name: "MEDICAL CITY ARGYLE", divisionId: "div-north-tx" },
  { id: "hosp-mc-arl", name: "MEDICAL CITY ARLINGTON", divisionId: "div-north-tx" },
  { id: "hosp-mc-dal", name: "MEDICAL CITY DALLAS", divisionId: "div-north-tx" },
  { id: "hosp-mc-dec", name: "MEDICAL CITY DECATUR", divisionId: "div-north-tx" },
  { id: "hosp-mc-den", name: "MEDICAL CITY DENTON", divisionId: "div-north-tx" },
  { id: "hosp-mc-fw", name: "MEDICAL CITY FORT WORTH", divisionId: "div-north-tx" },
  { id: "hosp-mc-fri", name: "MEDICAL CITY FRISCO", divisionId: "div-north-tx" },
  { id: "hosp-mc-go", name: "MEDICAL CITY GREEN OAKS HOSPITAL DALLAS", divisionId: "div-north-tx" },
  { id: "hosp-mc-hs", name: "MEDICAL CITY HEART & SPINE", divisionId: "div-north-tx" },
  { id: "hosp-mc-lc", name: "MEDICAL CITY LAS COLINAS", divisionId: "div-north-tx" },
  { id: "hosp-mc-lew", name: "MEDICAL CITY LEWISVILLE", divisionId: "div-north-tx" },
  { id: "hosp-mc-mck", name: "MEDICAL CITY MCKINNEY", divisionId: "div-north-tx" },
  { id: "hosp-mc-nh", name: "MEDICAL CITY NORTH HILLS", divisionId: "div-north-tx" },
  { id: "hosp-mc-pla", name: "MEDICAL CITY PLANO", divisionId: "div-north-tx" },
  { id: "hosp-mc-sha", name: "MEDICAL CITY SURGICAL HOSPITAL ALLIANCE", divisionId: "div-north-tx" },
  { id: "hosp-mc-wea", name: "MEDICAL CITY WEATHERFORD", divisionId: "div-north-tx" },
  { id: "hosp-rap", name: "RAPIDES REGIONAL MEDICAL CENTER", divisionId: "div-north-tx" },

  // San Antonio
  { id: "hosp-meth-ata", name: "METHODIST HOSPITAL | ATASCOSA", divisionId: "div-san-antonio" },
  { id: "hosp-meth-hc", name: "METHODIST HOSPITAL | HILL COUNTRY", divisionId: "div-san-antonio" },
  { id: "hosp-meth-land", name: "METHODIST HOSPITAL | LANDMARK", divisionId: "div-san-antonio" },
  { id: "hosp-meth-met", name: "METHODIST HOSPITAL | METROPOLITAN", divisionId: "div-san-antonio" },
  { id: "hosp-meth-ne", name: "METHODIST HOSPITAL | NORTHEAST", divisionId: "div-san-antonio" },
  { id: "hosp-meth-st", name: "METHODIST HOSPITAL | SPECIALTY AND TRANSPLANT", divisionId: "div-san-antonio" },
  { id: "hosp-meth-so", name: "METHODIST HOSPITAL | STONE OAK", divisionId: "div-san-antonio" },
  { id: "hosp-meth-sor", name: "METHODIST HOSPITAL | STONE OAK REHABILITATION", divisionId: "div-san-antonio" },
  { id: "hosp-meth-tex", name: "METHODIST HOSPITAL | TEXSAN", divisionId: "div-san-antonio" },
  { id: "hosp-meth-wh", name: "METHODIST HOSPITAL | WESTOVER HILLS", divisionId: "div-san-antonio" },
  { id: "hosp-meth-child", name: "METHODIST HOSPITAL/METHODIST CHILDREN'S HOSPITAL", divisionId: "div-san-antonio" },

  // South Atlantic
  { id: "hosp-coll", name: "COLLETON MEDICAL CENTER", divisionId: "div-south-atl" },
  { id: "hosp-doc-aug", name: "DOCTORS OF AUGUSTA HOSPITAL", divisionId: "div-south-atl" },
  { id: "hosp-fair", name: "FAIRVIEW PARK HOSPITAL", divisionId: "div-south-atl" },
  { id: "hosp-grand", name: "GRAND STRAND MEDICAL CENTER", divisionId: "div-south-atl" },
  { id: "hosp-mem-jax", name: "HCA FLORIDA MEMORIAL HOSPITAL", divisionId: "div-south-atl" },
  { id: "hosp-live-oak", name: "LIVE OAK BEHAVIORAL", divisionId: "div-south-atl" },
  { id: "hosp-mem-mead", name: "MEMORIAL HEALTH MEADOWS", divisionId: "div-south-atl" },
  { id: "hosp-mem-univ", name: "MEMORIAL HEALTH UNIV. MEDICAL CENTER", divisionId: "div-south-atl" },
  { id: "hosp-mem-sat", name: "MEMORIAL SATILLA HEALTH", divisionId: "div-south-atl" },
  { id: "hosp-orange", name: "ORANGE PARK MEDICAL CENTER", divisionId: "div-south-atl" },
  { id: "hosp-summ", name: "SUMMERVILLE MEDICAL CENTER", divisionId: "div-south-atl" },
  { id: "hosp-trid", name: "TRIDENT MEDICAL CENTER", divisionId: "div-south-atl" },

  // TriStar
  { id: "hosp-cent-ash", name: "CENTENNIAL MC - ASHLAND CITY", divisionId: "div-tristar" },
  { id: "hosp-frank", name: "FRANKFORT REGIONAL MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-hend", name: "HENDERSONVILLE MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-park-med", name: "PARKRIDGE MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-park-child", name: "PARKRIDGE VALLEY CHILD AND ADOLESCENT CAMPUS", divisionId: "div-tristar" },
  { id: "hosp-park-west", name: "PARKRIDGE WEST HOSPITAL", divisionId: "div-tristar" },
  { id: "hosp-pine", name: "PINEWOOD SPRINGS", divisionId: "div-tristar" },
  { id: "hosp-sky-mad", name: "SKYLINE MADISON", divisionId: "div-tristar" },
  { id: "hosp-south-nash", name: "SOUTHERN HILLS MEDICAL CENTER NASHVILLE", divisionId: "div-tristar" },
  { id: "hosp-tri-cent", name: "TRISTAR CENTENNIAL MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-tri-green", name: "TRISTAR GREENVIEW REGIONAL", divisionId: "div-tristar" },
  { id: "hosp-tri-hor", name: "TRISTAR HORIZON MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-tri-north", name: "TRISTAR NORTHCREST MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-tri-east", name: "TRISTAR PARKRIDGE EAST HOSPITAL", divisionId: "div-tristar" },
  { id: "hosp-tri-sky", name: "TRISTAR SKYLINE MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-tri-stone", name: "TRISTAR STONECREST MEDICAL CENTER", divisionId: "div-tristar" },
  { id: "hosp-tri-sum", name: "TRISTAR SUMMIT MEDICAL", divisionId: "div-tristar" },

  // West Florida
  { id: "hosp-bay", name: "HCA FLORIDA BAYONET POINT HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-blake", name: "HCA FLORIDA BLAKE HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-bran", name: "HCA FLORIDA BRANDON HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-citrus", name: "HCA FLORIDA CITRUS HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-eng", name: "HCA FLORIDA ENGLEWOOD HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-faw", name: "HCA FLORIDA FAWCETT HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-largo", name: "HCA FLORIDA LARGO HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-largo-w", name: "HCA FLORIDA LARGO WEST HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-leh", name: "HCA FLORIDA LEHIGH HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-norths", name: "HCA FLORIDA NORTHSIDE HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-oak", name: "HCA FLORIDA OAK HILL HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-pas", name: "HCA FLORIDA PASADENA HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-sara", name: "HCA FLORIDA SARASOTA DOCTORS HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-s-shore", name: "HCA FLORIDA SOUTH SHORE HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-s-tam", name: "HCA FLORIDA SOUTH TAMPA HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-st-pet", name: "HCA FLORIDA ST. PETERSBURG HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-trin", name: "HCA FLORIDA TRINITY HOSPITAL", divisionId: "div-west-fl" },
  { id: "hosp-w-tam", name: "HCA FLORIDA WEST TAMPA HOSPITAL", divisionId: "div-west-fl" }
];
